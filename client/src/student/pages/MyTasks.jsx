

// import { useEffect, useState } from "react";

// import taskService from "../../services/taskService";
// import "./styles/MyTasks.css";

// const MyTasks = () => {
//   const [tasks, setTasks] = useState([]);
//   const [filter, setFilter] = useState("ALL");


//   useEffect(() => {
//     loadTasks();
//   }, []);

//   const loadTasks = () => {
//     taskService.getMyTasks().then((res) => setTasks(res.data));
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Delete this task?")) {
//       taskService.deleteTask(id).then(loadTasks);
//     }
//   };

//   // ❌ REMOVE COMPLETED TASKS
//   const activeTasks = tasks.filter((t) => t.progress !== 100);

//   const personalTasks = activeTasks.filter(
//     (t) => t.taskType === "PERSONAL" || !t.taskType
//   );

//   const adminTasks = activeTasks.filter((t) => t.taskType === "ADMIN");

//   return (
//     <div className="mytasks-container">
//       <h2>My Tasks</h2>


//       {/* FILTER TABS */}
//       <div className="task-filters">
//         {["ALL", "PERSONAL", "ADMIN"].map((type) => (
//           <button
//             key={type}
//             className={filter === type ? "active" : ""}
//             onClick={() => setFilter(type)}
//           >
//             {type}
//           </button>
//         ))}
//       </div>

//       {/* ALL */}
//       {filter === "ALL" && (
//         <div className="split-view">
//           <TaskSection
//             title="Personal Tasks"
//             tasks={personalTasks}
//             onDelete={handleDelete}
//             allowDelete
//           />

//           <TaskSection
//             title="Admin Assigned Tasks"
//             tasks={adminTasks}
//           />
//         </div>
//       )}

//       {filter === "PERSONAL" && (
//         <TaskSection
//           title="Personal Tasks"
//           tasks={personalTasks}
//           onDelete={handleDelete}
//           allowDelete
//           full
//         />
//       )}

//       {filter === "ADMIN" && (
//         <TaskSection
//           title="Admin Assigned Tasks"
//           tasks={adminTasks}
//           full
//         />
//       )}
//     </div>
//   );
// };

// const TaskSection = ({ title, tasks, onDelete, allowDelete, full }) => (
//   <div className={full ? "full-view" : ""}>
//     <h3>{title}</h3>
//     {tasks.length === 0 && <p>No tasks available</p>}
//     {tasks.map((task) => (
//       <TaskCard
//         key={task._id}
//         task={task}
//         onDelete={onDelete}
//         allowDelete={allowDelete}
//       />
//     ))}
//   </div>
// );

// const TaskCard = ({ task, onDelete, allowDelete }) => {
//   return (
//     <div className="task-card">
//       <div className="task-header">
//         <h4>{task.title}</h4>
//         <span className={task.taskType === "ADMIN" ? "admin" : "personal"}>
//           {task.taskType || "PERSONAL"}
//         </span>
//       </div>

//       <p>{task.description}</p>

//       <p className="due-date">Due: {task.endDate}</p>

//       <div className="progress-wrapper">
//         <label>Progress: {task.progress}%</label>
//         <input type="range" value={task.progress} disabled />
//       </div>

//       {allowDelete && (
//         <button className="delete-btn" onClick={() => onDelete(task._id)}>
//           Delete
//         </button>
//       )}
//     </div>
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import taskService from "../../services/taskService";
import StudentLayout from "../components/StudentLayout";
import { Plus, Calendar, Trash2 } from "lucide-react";
import "./styles/MyTasks.css";

const MyTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    taskService.getMyTasks().then((res) => setTasks(res.data));
  };

  const handleDelete = (id, e) => {
    e.stopPropagation(); // Prevent card click
    if (window.confirm("Delete this task?")) {
      taskService.deleteTask(id).then(loadTasks);
    }
  };

  // ❌ REMOVE COMPLETED TASKS & FILTER
  const activeTasks = tasks.filter((t) => t.progress !== 100);

  const personalTasks = activeTasks.filter(
    (t) => t.taskType === "PERSONAL" || !t.taskType
  );

  const adminTasks = activeTasks.filter((t) => t.taskType === "ADMIN");

  return (
    <StudentLayout>
      <div className="mytasks-container">

        {/* HEADER SECTION */}
        <div className="mytasks-page-header">
          <div className="mytasks-header-content">
            <h2>My Tasks</h2>
            <p className="subtitle">Manage and track your academic responsibilities</p>
          </div>

          <div className="task-filters">
            {["ALL", "PERSONAL", "ADMIN"].map((type) => (
              <button
                key={type}
                className={`filter-btn ${filter === type ? "active" : ""}`}
                onClick={() => setFilter(type)}
              >
                {type.charAt(0) + type.slice(1).toLowerCase()} {/* Capitalize */}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT SECTIONS */}
        <div className="tasks-content">

          {/* PERSONAL TASKS SECTION */}
          {(filter === "ALL" || filter === "PERSONAL") && (
            <div className="task-section">
              <div className="section-title">
                <span className="accent-bar personal-bar"></span>
                <h3>Personal Tasks</h3>
                <span className="count-badge">{personalTasks.length}</span>
              </div>

              <div className="task-grid">
                {personalTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDelete={handleDelete}
                  />
                ))}

                {/* GHOST CARD FOR ADD TASK */}
                <div className="add-task-ghost" onClick={() => navigate("/student/add-task")}>
                  <div className="ghost-content">
                    <Plus size={32} />
                    <span>Add Task</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN TASKS SECTION */}
          {(filter === "ALL" || filter === "ADMIN") && (
            <div className="task-section">
              <div className="section-title">
                <span className="accent-bar admin-bar"></span>
                <h3>Admin Assigned Tasks</h3>
                <span className="count-badge">{adminTasks.length}</span>
              </div>

              <div className="task-grid">
                {adminTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDelete={handleDelete}
                    isAdmin
                  />
                ))}
                {adminTasks.length === 0 && <p className="empty-msg">No admin tasks assigned.</p>}
              </div>
            </div>
          )}

        </div>
      </div>
    </StudentLayout>
  );
};

const TaskCard = ({ task, onDelete, isAdmin }) => {
  // Format Date (e.g., Feb 28, 2026)
  const formatDate = (dateString) => {
    if (!dateString) return "No Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="task-card-modern">
      <div className="card-top">
        <span className={`task-badge ${isAdmin ? "badge-admin" : "badge-personal"}`}>
          {isAdmin ? "ADMIN" : "PERSONAL"}
        </span>
        {/* Delete Icon (Optional, keeping it subtle) */}
        {!isAdmin && (
          <button className="icon-btn delete-icon" onClick={(e) => onDelete(task._id, e)}>
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <h4 className="task-title">{task.title}</h4>
      <p className="task-desc">{task.description || "No description provided."}</p>

      <div className="task-meta">
        <div className="date-row">
          <Calendar size={14} />
          <span>Due: {formatDate(task.endDate)}</span>
        </div>
      </div>

      <div className="task-progress-row">
        <div className="progress-label">
          <span>Progress</span>
          <span className="percent">{task.progress}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${task.progress}%`,
              backgroundColor: isAdmin ? "#6366f1" : "#10b981" // Blue for Admin, Green for Personal
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
