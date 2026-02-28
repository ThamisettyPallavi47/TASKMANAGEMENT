// import { useEffect, useState } from "react";
// import taskService from "../../services/taskService";
// import "./styles/CompletedTasks.css";

// const CompletedTasks = () => {
//   const [tasks, setTasks] = useState([]);
//   const [filter, setFilter] = useState("ALL");

//   useEffect(() => {
//     taskService.getMyTasks().then(res => {
//       const completed = res.data.filter(t => t.progress === 100);
//       setTasks(completed);
//     });
//   }, []);

//   const personalTasks = tasks.filter(
//     t => t.taskType === "PERSONAL" || !t.taskType
//   );
//   const adminTasks = tasks.filter(t => t.taskType === "ADMIN");

//   const getFilteredTasks = () => {
//     if (filter === "PERSONAL") return personalTasks;
//     if (filter === "ADMIN") return adminTasks;
//     return tasks;
//   };

//   return (
//     <div className="completed-tasks-container">
//       <h2>Completed Tasks</h2>

//       {/* FILTER */}
//       <div className="task-filters">
//         {["ALL", "PERSONAL", "ADMIN"].map(f => (
//           <button
//             key={f}
//             className={filter === f ? "active" : ""}
//             onClick={() => setFilter(f)}
//           >
//             {f}
//           </button>
//         ))}
//       </div>

//       {getFilteredTasks().length === 0 && (
//         <p>No completed tasks available</p>
//       )}

//       <div className="completed-grid">
//         {getFilteredTasks().map(task => (
//           <div key={task._id} className="completed-card">
//             <div className="completed-header">
//               <h4>{task.title}</h4>
//               <span className={task.taskType === "ADMIN" ? "admin" : "personal"}>
//                 {task.taskType || "PERSONAL"}
//               </span>
//             </div>

//             <p>{task.description}</p>
//             <p className="completed-date">
//               Completed on: {task.endDate}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CompletedTasks;

import { useEffect, useState } from "react";
import taskService from "../../services/taskService";
import StudentLayout from "../components/StudentLayout";
import "./styles/CompletedTasks.css";
import { CheckSquare } from "lucide-react";

const CompletedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    taskService.getMyTasks().then((res) => {
      const completed = res.data.filter((t) => t.progress === 100);
      setTasks(completed);
    });
  }, []);

  const personalTasks = tasks.filter(
    (t) => t.taskType === "PERSONAL" || !t.taskType
  );
  const adminTasks = tasks.filter((t) => t.taskType === "ADMIN");

  const getFilteredTasks = () => {
    if (filter === "PERSONAL") return personalTasks;
    if (filter === "ADMIN") return adminTasks;
    return tasks;
  };

  return (
    <StudentLayout>
      <div className="completed-tasks-container">
        <h2>Completed Tasks</h2>
        <p className="subtitle">View your accomplished work</p>

        {/* FILTER */}
        <div className="task-filters">
          {["ALL", "PERSONAL", "ADMIN"].map((f) => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {getFilteredTasks().length === 0 && (
          <p>No completed tasks available</p>
        )}

        <div className="completed-grid">
          {getFilteredTasks().map((task) => (
            <div key={task._id} className="completed-card">
              <div className="completed-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4>{task.title}</h4>
                  <CheckSquare size={18} color="#16a34a" />
                </div>
                <span
                  className={
                    task.taskType === "ADMIN" ? "admin" : "personal"
                  }
                >
                  {task.taskType || "PERSONAL"}
                </span>
              </div>

              <p>{task.description}</p>
              <p className="completed-date">
                Completed on: {task.endDate}
              </p>
            </div>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
};

export default CompletedTasks;
