const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Load the JSON data
const rawData = fs.readFileSync(path.join(__dirname, 'data.json'));
const db = JSON.parse(rawData);

// Endpoints
app.get('/api/developers', (req, res) => {
  res.json(db.Dim_Developers);
});

app.get('/api/metrics/:developerId', (req, res) => {
  const { developerId } = req.params;
  
  // Find developer
  const developer = db.Dim_Developers.find(d => d.developer_id === developerId);
  if (!developer) return res.status(404).json({ error: 'Developer not found' });

  // Get data for this developer
  const devDeployments = db.Fact_CI_Deployments.filter(d => d.developer_id === developerId && d.status === 'success');
  const devIssues = db.Fact_Jira_Issues.filter(i => i.developer_id === developerId && i.status === 'Done');
  const prs = db.Fact_Pull_Requests.filter(pr => pr.developer_id === developerId && pr.status === 'merged');
  const bugs = db.Fact_Bug_Reports.filter(b => b.developer_id === developerId && b.escaped_to_prod === 'Yes');

  // Calculate metrics
  const avgLeadTime = devDeployments.length > 0 
    ? devDeployments.reduce((acc, curr) => acc + curr.lead_time_days, 0) / devDeployments.length 
    : 0;
    
  const avgCycleTime = devIssues.length > 0 
    ? devIssues.reduce((acc, curr) => acc + curr.cycle_time_days, 0) / devIssues.length 
    : 0;

  const bugRate = devIssues.length > 0 ? (bugs.length / devIssues.length) * 100 : 0;

  res.json({
    developer,
    metrics: {
      leadTime: avgLeadTime.toFixed(1),
      cycleTime: avgCycleTime.toFixed(1),
      deploymentFreq: devDeployments.length,
      prThroughput: prs.length,
      bugRate: bugRate.toFixed(1)
    }
  });
});

app.get('/api/metrics/manager/:managerId', (req, res) => {
  const { managerId } = req.params;
  
  const mgrDevs = db.Dim_Developers.filter(d => d.manager_id === managerId).map(d => d.developer_id);
  
  if (mgrDevs.length === 0) return res.status(404).json({ error: 'Manager not found or has no team' });

  const mgrDeployments = db.Fact_CI_Deployments.filter(d => mgrDevs.includes(d.developer_id) && d.status === 'success');
  const mgrIssues = db.Fact_Jira_Issues.filter(i => mgrDevs.includes(i.developer_id) && i.status === 'Done');
  const prs = db.Fact_Pull_Requests.filter(pr => mgrDevs.includes(pr.developer_id) && pr.status === 'merged');
  const bugs = db.Fact_Bug_Reports.filter(b => mgrDevs.includes(b.developer_id) && b.escaped_to_prod === 'Yes');

  const avgLeadTime = mgrDeployments.length > 0 
    ? mgrDeployments.reduce((acc, curr) => acc + curr.lead_time_days, 0) / mgrDeployments.length 
    : 0;
    
  const avgCycleTime = mgrIssues.length > 0 
    ? mgrIssues.reduce((acc, curr) => acc + curr.cycle_time_days, 0) / mgrIssues.length 
    : 0;

  const bugRate = mgrIssues.length > 0 ? (bugs.length / mgrIssues.length) * 100 : 0;

  res.json({
    managerId,
    teamSize: mgrDevs.length,
    metrics: {
      leadTime: avgLeadTime.toFixed(1),
      cycleTime: avgCycleTime.toFixed(1),
      deploymentFreq: mgrDeployments.length,
      prThroughput: prs.length,
      bugRate: bugRate.toFixed(1)
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend API server running on port ${PORT}`);
});
