import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Clock, 
  GitPullRequest, 
  Rocket, 
  Bug,
  BrainCircuit,
  Lightbulb,
  Sparkles,
  Users,
  LayoutDashboard,
  User as UserIcon
} from 'lucide-react';
import './index.css';

function App() {
  const [view, setView] = useState('IC'); // 'IC' or 'Manager'
  const [developers, setDevelopers] = useState([]);
  const [selectedDevId, setSelectedDevId] = useState('DEV-001');
  const [loading, setLoading] = useState(true);
  
  const [icData, setIcData] = useState(null);
  const [managerData, setManagerData] = useState(null);

  // Fetch developer list on mount
  useEffect(() => {
    fetch('http://localhost:3001/api/developers')
      .then(res => res.json())
      .then(data => {
        setDevelopers(data);
      })
      .catch(err => {
        console.error("Error fetching developers:", err);
      });
  }, []);

  // Fetch metrics whenever selection/view changes
  useEffect(() => {
    setLoading(true);
    if (view === 'IC' && selectedDevId) {
      fetch(`http://localhost:3001/api/metrics/${selectedDevId}`)
        .then(res => res.json())
        .then(data => {
          setIcData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching IC metrics:", err);
          setLoading(false);
        });
    } else if (view === 'Manager') {
      fetch(`http://localhost:3001/api/metrics/manager/MGR-01`)
        .then(res => res.json())
        .then(data => {
          setManagerData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching Manager metrics:", err);
          setLoading(false);
        });
    }
  }, [view, selectedDevId]);

  const getICInsights = () => {
    if (!icData) return [];
    if (selectedDevId === 'DEV-001') {
      return [
        {
          title: "Healthy Delivery Pace",
          text: `Cycle time (${icData.metrics.cycleTime}d) and Lead time (${icData.metrics.leadTime}d) are closely aligned and relatively fast. This indicates PRs aren't stuck in code review or QA bottlenecks.`
        },
        {
          title: "High Quality Output",
          text: `With a ${icData.metrics.bugRate}% escaped bug rate on ${icData.metrics.prThroughput} completed features, the code quality is excellent. Testing practices here are working well.`
        }
      ];
    } else {
      return [
        {
          title: "Delivery Analysis",
          text: `Developer is averaging ${icData.metrics.cycleTime} days to complete issues, with ${icData.metrics.prThroughput} PRs merged this month.`
        }
      ];
    }
  };

  const getICActionSteps = () => {
    if (selectedDevId === 'DEV-001') {
      return [
        {
          title: "Share Knowledge",
          text: "Your code review and testing flow is highly effective. Consider presenting your local testing setup at the next guild meeting."
        },
        {
          title: "Tackle Architecture",
          text: "Since your delivery is stable and bug-free, this is a great time to pick up larger, more complex architectural stories."
        }
      ];
    }
    return [{ title: "Review Metrics", text: "Discuss these metrics in your next 1:1." }];
  };

  const getManagerInsights = () => {
    if (!managerData) return [];
    return [
      {
        title: "Team Velocity is Stable",
        text: `The team delivered ${managerData.metrics.prThroughput} PRs with an average cycle time of ${managerData.metrics.cycleTime} days. The workflow is healthy, though some PRs are experiencing higher wait times.`
      },
      {
        title: "Quality Attention Needed",
        text: `The team has an overall bug rate of ${managerData.metrics.bugRate}%. Some developers are shipping with 0 bugs, while others have a higher rate. Standardizing testing practices could help.`
      }
    ];
  };

  const getManagerActionSteps = () => {
    return [
      {
        title: "Pair Programming Initiatives",
        text: "Pair developers with 0% bug rates (like Ava) with those who had recent escaped bugs to share testing practices."
      },
      {
        title: "Review PR Bottlenecks",
        text: "Run a retro to discuss ways to reduce PR review wait times. Are reviews sitting too long before being picked up?"
      }
    ];
  };

  if (loading && !icData && !managerData) {
    return <div style={{color: 'white', padding: '2rem'}}>Loading dashboard data...</div>;
  }

  const activeMetrics = view === 'IC' ? icData?.metrics : managerData?.metrics;
  const developer = icData?.developer;

  if (!activeMetrics) return null;

  return (
    <div className="app-container">
      <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
        <button 
          onClick={() => setView('IC')}
          style={{
            padding: '0.5rem 1rem', 
            borderRadius: '8px', 
            background: view === 'IC' ? 'var(--accent-color)' : 'transparent',
            border: `1px solid ${view === 'IC' ? 'var(--accent-color)' : 'var(--panel-border)'}`,
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 500
          }}
        >
          <UserIcon size={18} /> Developer View
        </button>
        <button 
          onClick={() => setView('Manager')}
          style={{
            padding: '0.5rem 1rem', 
            borderRadius: '8px', 
            background: view === 'Manager' ? 'var(--accent-color)' : 'transparent',
            border: `1px solid ${view === 'Manager' ? 'var(--accent-color)' : 'var(--panel-border)'}`,
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 500
          }}
        >
          <LayoutDashboard size={18} /> Manager View
        </button>
      </div>

      <header className="header">
        <div>
          <h1 className="header-title">
            {view === 'IC' ? 'Developer Insights' : 'Team Performance Summary'}
          </h1>
          <p className="header-subtitle">
            {view === 'IC' ? 'Moving from metrics to meaningful action' : 'Aggregated health and actionable team insights'}
          </p>
        </div>
        
        {view === 'IC' && developer ? (
          <div className="user-profile">
            <div className="avatar">
              {developer.developer_name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="user-info">
              <h3>{developer.developer_name}</h3>
              <p>{developer.team_name} • {developer.level}</p>
            </div>
            <select 
              value={selectedDevId} 
              onChange={e => setSelectedDevId(e.target.value)}
              style={{marginLeft: '10px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', padding: '4px 8px'}}
            >
              {developers.map(d => (
                <option key={d.developer_id} value={d.developer_id} style={{color: 'black'}}>{d.developer_name}</option>
              ))}
            </select>
          </div>
        ) : view === 'Manager' && managerData ? (
          <div className="user-profile" style={{border: '1px solid var(--accent-color)'}}>
            <div className="avatar" style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)'}}>
              <Users size={20} />
            </div>
            <div className="user-info">
              <h3>Payments API Team</h3>
              <p>{managerData.teamSize} Developers</p>
            </div>
          </div>
        ) : null}
      </header>

      <main className="dashboard-grid">
        <div className="metrics-row">
          <div className="card metric-card">
            <div className="metric-header">
              <div className="metric-icon blue"><Clock size={18} /></div>
              Avg. Lead Time
            </div>
            <div className="metric-value">
              {activeMetrics.leadTime}
              <span style={{fontSize: '1rem', color: '#94a3b8', fontWeight: '400'}}>d</span>
            </div>
            <div className={`metric-trend ${view === 'IC' ? 'trend-up' : 'trend-neutral'}`}>
              {view === 'IC' ? 'Excellent' : 'Consistent'}
            </div>
          </div>

          <div className="card metric-card">
            <div className="metric-header">
              <div className="metric-icon purple"><Activity size={18} /></div>
              Avg. Cycle Time
            </div>
            <div className="metric-value">
              {activeMetrics.cycleTime}
              <span style={{fontSize: '1rem', color: '#94a3b8', fontWeight: '400'}}>d</span>
            </div>
            <div className={`metric-trend ${view === 'IC' ? 'trend-up' : 'trend-neutral'}`}>
              {view === 'IC' ? 'Healthy' : 'Baseline'}
            </div>
          </div>

          <div className="card metric-card">
            <div className="metric-header">
              <div className="metric-icon green"><Rocket size={18} /></div>
              Total Deployments
            </div>
            <div className="metric-value">
              {activeMetrics.deploymentFreq}
            </div>
            <div className="metric-trend trend-neutral">
              This Month
            </div>
          </div>

          <div className="card metric-card">
            <div className="metric-header">
              <div className="metric-icon orange"><GitPullRequest size={18} /></div>
              PRs Merged
            </div>
            <div className="metric-value">
              {activeMetrics.prThroughput}
            </div>
            <div className="metric-trend trend-neutral">
              Volume
            </div>
          </div>

          <div className="card metric-card">
            <div className="metric-header">
              <div className="metric-icon red"><Bug size={18} /></div>
              Bug Rate
            </div>
            <div className="metric-value">
              {activeMetrics.bugRate}%
            </div>
            <div className={`metric-trend ${parseFloat(activeMetrics.bugRate) > 5 ? 'trend-down' : 'trend-up'}`}>
              {parseFloat(activeMetrics.bugRate) > 5 ? 'Needs Attention' : 'Excellent Quality'}
            </div>
          </div>
        </div>

        <div className="card analysis-section">
          <h2 className="section-title">
            <BrainCircuit size={22} color="#3b82f6" /> 
            {view === 'IC' ? 'The Story Behind the Data' : 'Team Insights'}
          </h2>
          <div className="story-content">
            {(view === 'IC' ? getICInsights() : getManagerInsights()).map((insight, idx) => (
              <div key={idx} className="story-item">
                <strong>{insight.title}</strong>
                <p>{insight.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card action-section action-card">
          <h2 className="section-title">
            <Lightbulb size={22} color="#f59e0b" /> 
            Recommended Next Steps
          </h2>
          <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem'}}>
            Based on current velocity and quality metrics:
          </p>
          
          <div className="action-steps-list">
            {(view === 'IC' ? getICActionSteps() : getManagerActionSteps()).map((step, idx) => (
              <div key={idx} className="action-step">
                <div className="step-number">{idx + 1}</div>
                <div className="step-content">
                  <h4>{step.title}</h4>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button style={{
            marginTop: 'auto',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid var(--accent-color)',
            color: 'var(--accent-color)',
            padding: '0.75rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
          onClick={() => alert(`Action logged! In a full product, this would open the ${view === 'IC' ? 'Development Plan editor' : 'Meeting Scheduler'}.`)}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'var(--accent-color)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
            e.currentTarget.style.color = 'var(--accent-color)';
          }}
          >
            <Sparkles size={16} /> 
            {view === 'IC' ? 'Update Development Plan' : 'Schedule Team Retro'}
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
