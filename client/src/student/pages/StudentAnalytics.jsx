

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import analyticsService from "../../services/analyticsService";
// import { Doughnut, Pie, Line } from "react-chartjs-2";
// import "./styles/StudentAnalytics.css";

// const StudentAnalytics = () => {
//   const [data, setData] = useState(null);
//   const [filter, setFilter] = useState("ALL");
//   const navigate = useNavigate();

//   useEffect(() => {
//     analyticsService
//       .getStudentAnalytics(filter)
//       .then(res => setData(res.data))
//       .catch(err => console.error("Analytics error:", err));
//   }, [filter]);

//   if (!data) return <p>Loading analytics...</p>;
//   if (data.total === 0) return <p>No analytics available yet</p>;

//   /* ================= NAVIGATION HANDLER ================= */
//   const openTaskSummary = (status) => {
//     const params = new URLSearchParams();

//     if (status) params.set("status", status);
//     if (filter !== "ALL") params.set("type", filter);

//     navigate(`/student/task-summary?${params.toString()}`);
//   };

//   return (
//     <div className="analytics-container">
//       <h2>Student Analytics</h2>

//       {/* FILTER TABS */}
//       <div className="task-filters">
//         {["ALL", "PERSONAL", "ADMIN"].map(t => (
//           <button
//             key={t}
//             className={filter === t ? "active" : ""}
//             onClick={() => setFilter(t)}
//           >
//             {t}
//           </button>
//         ))}
//       </div>

//       {/* SUMMARY CARDS (CLICKABLE) */}
//       <div className="analytics-cards">
//         <div
//           className="card total clickable"
//           onClick={() => openTaskSummary(null)}
//         >
//           Total Tasks: {data.total}
//         </div>

//         <div
//           className="card completed clickable"
//           onClick={() => openTaskSummary("COMPLETED")}
//         >
//           Completed: {data.completed}
//         </div>

//         <div
//           className="card progress clickable"
//           onClick={() => openTaskSummary("IN_PROGRESS")}
//         >
//           In Progress: {data.inProgress}
//         </div>

//         <div
//           className="card pending clickable"
//           onClick={() => openTaskSummary("PENDING")}
//         >
//           Pending: {data.pending}
//         </div>
//       </div>

//       {/* CHARTS */}
//       <div className="analytics-charts">
//         <div className="chart-box">
//           <h4>Task Status</h4>
//           <Doughnut
//             data={{
//               labels: ["Completed", "In Progress", "Pending"],
//               datasets: [{
//                 data: [
//                   data.completed,
//                   data.inProgress,
//                   data.pending
//                 ],
//                 backgroundColor: ["#4caf50", "#2196f3", "#ff9800"]
//               }]
//             }}
//           />
//         </div>

//         <div className="chart-box">
//           <h4>Task Type</h4>
//           <Pie
//             data={{
//               labels: ["Personal", "Admin"],
//               datasets: [{
//                 data: [data.personal, data.admin],
//                 backgroundColor: ["#6c63ff", "#03a9f4"]
//               }]
//             }}
//           />
//         </div>
//       </div>

//       {/* PROGRESS TREND */}
//       <div className="chart-box full">
//         <h4>Progress Trend</h4>
//         <Line
//           data={{
//             labels: data.progressTrend.map(p => p.label),
//             datasets: [{
//               label: "Progress %",
//               data: data.progressTrend.map(p => p.progress),
//               borderColor: "#6c63ff",
//               tension: 0.4
//             }]
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default StudentAnalytics;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import analyticsService from "../../services/analyticsService";
import { Doughnut, Pie, Line } from "react-chartjs-2";
import StudentLayout from "../components/StudentLayout";
import "./styles/StudentAnalytics.css";

const StudentAnalytics = () => {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    analyticsService
      .getStudentAnalytics(filter)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Analytics error:", err));
  }, [filter]);

  if (!data) return <p>Loading analytics...</p>;
  if (data.total === 0) return <p>No analytics available yet</p>;

  /* ================= NAVIGATION HANDLER ================= */
  const openTaskSummary = (status) => {
    const params = new URLSearchParams();

    if (status) params.set("status", status);
    if (filter !== "ALL") params.set("type", filter);

    navigate(`/student/task-summary?${params.toString()}`);
  };

  return (
    <StudentLayout>
      <div className="analytics-container">
        {/* HEADER SECTION */}
        <div className="analytics-header">
          <h2>Student Analytics</h2>
          <p className="analytics-subtitle">Detailed insights into your academic performance and task management.</p>

          {/* FILTER TABS MOVED HERE IF NEEDED, OR KEEP SEPARATE */}
          <div className="task-filters">
            {["ALL", "PERSONAL", "ADMIN"].map((t) => (
              <button
                key={t}
                className={filter === t ? "active" : ""}
                onClick={() => setFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* SUMMARY CARDS (CLICKABLE) */}
        <div className="analytics-cards">
          <div
            className="card total clickable"
            onClick={() => openTaskSummary(null)}
          >
            <div className="card-content">
              <span className="card-label">Total Tasks</span>
              <strong className="card-value">{data.total}</strong>
              <div className="card-tag">+2 from last week</div>
            </div>
          </div>

          <div
            className="card completed clickable"
            onClick={() => openTaskSummary("COMPLETED")}
          >
            <div className="card-content">
              <span className="card-label">Completed</span>
              <strong className="card-value">{data.completed}</strong>
              <div className="card-tag">50% Success rate</div>
            </div>
          </div>

          <div
            className="card progress clickable"
            onClick={() => openTaskSummary("IN_PROGRESS")}
          >
            <div className="card-content">
              <span className="card-label">In Progress</span>
              <strong className="card-value">{data.inProgress}</strong>
              <div className="card-tag">Active currently</div>
            </div>
          </div>

          <div
            className="card pending clickable"
            onClick={() => openTaskSummary("PENDING")}
          >
            <div className="card-content">
              <span className="card-label">Pending</span>
              <strong className="card-value">{data.pending}</strong>
              <div className="card-tag">Require attention</div>
            </div>
          </div>
        </div>

        {/* CHARTS */}
        <div className="analytics-charts">
          <div className="chart-box">
            <h4>Task Status</h4>
            <Doughnut
              data={{
                labels: ["Completed", "In Progress", "Pending"],
                datasets: [
                  {
                    data: [
                      data.completed,
                      data.inProgress,
                      data.pending,
                    ],
                    backgroundColor: [
                      "#4caf50",
                      "#2196f3",
                      "#ff9800",
                    ],
                  },
                ],
              }}
            />
          </div>

          <div className="chart-box">
            <h4>Task Type</h4>
            <Pie
              data={{
                labels: ["Personal", "Admin"],
                datasets: [
                  {
                    data: [data.personal, data.admin],
                    backgroundColor: ["#6c63ff", "#03a9f4"],
                  },
                ],
              }}
            />
          </div>
        </div>

        {/* PROGRESS TREND */}
        <div className="chart-box full">
          <h4>Progress Trend</h4>
          <Line
            data={{
              labels: data.progressTrend.map((p) => p.label),
              datasets: [
                {
                  label: "Progress %",
                  data: data.progressTrend.map((p) => p.progress),
                  borderColor: "#6c63ff",
                  tension: 0.4,
                },
              ],
            }}
          />
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentAnalytics;
