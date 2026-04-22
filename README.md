# DevPulse: Developer Productivity MVP

**DevPulse** is a lightweight, full-stack MVP designed to help software engineers and engineering managers move beyond raw metrics to actionable insights. Instead of just displaying "Cycle Time: 4 days", this application analyzes the data, provides the *story behind the metrics*, and suggests concrete next steps to improve velocity and quality.

This project was built to satisfy the Developer Productivity MVP assignment, evaluating product thinking, full-stack engineering, and data handling.

---

## 🌐 Live Demo
*   **Frontend**: [https://dev-pulse-sooty.vercel.app](https://dev-pulse-sooty.vercel.app)
*   **Backend API**: [https://devpulse-kddk.onrender.com/api/developers](https://devpulse-kddk.onrender.com/api/developers)

---

## 🏗️ Architecture & Tech Stack

This project was built with a clear separation of concerns to demonstrate full-stack engineering principles:

*   **Frontend**: React.js (Vite), Vanilla CSS (for modern, premium dark-mode styling), `lucide-react` for iconography.
*   **Backend**: Node.js & Express.js.
*   **Data Handling**: A Python extraction script (`extract_data.py`) converts the provided raw Excel sheets into a structured JSON database, which the Express API queries and processes.

---

## 🚀 Step-by-Step Implementation Process

Here is the step-by-step methodology used to build this assignment:

### Step 1: Data Extraction & Structuring
1. **Understand the Data**: Reviewed the `Dim_Developers`, `Fact_Jira_Issues`, `Fact_Pull_Requests`, `Fact_CI_Deployments`, and `Fact_Bug_Reports` tables to understand how they link together.
2. **Python Scripting**: Wrote `extract_data.py` using `pandas` to read the provided Excel workbook and dump the core tables into a clean `data.json` file.
3. **Mock Data Store**: Used this JSON file to act as the primary database for the backend API, simulating real-world SDLC data tables.

### Step 2: Backend API Development
1. **Initialize Node/Express**: Created a lightweight backend server to handle business logic and prevent the frontend from doing heavy data processing.
2. **Calculate Metrics (The Formulae)**:
    *   **Lead Time**: Averaged `lead_time_days` from successful CI deployments.
    *   **Cycle Time**: Averaged `cycle_time_days` for 'Done' Jira issues.
    *   **PR Throughput**: Counted 'merged' pull requests.
    *   **Deploy Frequency**: Counted 'success' CI deployments.
    *   **Bug Rate**: Calculated `(Escaped Prod Bugs / Total Done Issues) * 100`.
3. **Create REST Endpoints**: Built `/api/metrics/:developerId` (for the IC view) and `/api/metrics/manager/:managerId` (for the Manager aggregated view).

### Step 3: Frontend Development & UI Design
1. **React Scaffolding**: Initialized a fast development environment using Vite.
2. **Component Architecture**: Built a unified Dashboard view that can seamlessly toggle between "Developer View" and "Manager View".
3. **Data Fetching**: Hooked up `useEffect` to fetch live data from the Express backend.
4. **Premium Styling**: Scrapped standard dashboard templates and wrote custom Vanilla CSS. Utilized a sleek dark mode, glassmorphism (`backdrop-filter`), and dynamic micro-animations (hover effects) to ensure the UI felt premium and actionable.

### Step 4: Injecting "Product Thinking"
1. **The Story Behind the Data**: Programmed the UI to interpret the metrics. Rather than just showing the bug rate, the UI explains what the bug rate *means* in the context of their delivery speed.
2. **Actionable Next Steps**: Added functional buttons (using browser alerts for prototype simulation) that recommend real-world SDLC actions, such as scheduling a retro to discuss PR bottlenecks or tackling larger architecture stories if velocity is high.

---

## 💻 How to Run the Application Locally

You will need two terminal windows to run this full-stack application (one for the backend API, one for the frontend client).

### 1. Start the Backend API
Open your first terminal window:
```bash
cd backend
npm install
node server.js
```
*The backend will start running on http://localhost:3001*

### 2. Start the React Frontend
Open your second terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will start running on http://localhost:5173*

Open your browser to `http://localhost:5173` to interact with the MVP.

---

## 🎯 Evaluation Checklist Met
*   **Problem Understanding**: Built an app focused on *insights* and *actions*, not just charts.
*   **Product Thinking**: Created distinct IC and Manager views with tailored "next step" recommendations.
*   **Frontend Quality**: Implemented a responsive, modern React UI without relying on generic component libraries.
*   **Backend/Data Handling**: Extracted raw Excel data into JSON and built an Express API to calculate complex metrics on the server side.
*   **Responsible AI Use**: Used AI to accelerate scaffolding, Python data parsing, and CSS generation, allowing maximum focus on product logic and architecture choices.
