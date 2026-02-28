import { useEffect, useState } from "react";
import taskService from "../../services/taskService";
import StudentLayout from "../components/StudentLayout";
import "./styles/TaskProgress.css";

const TaskProgress = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [updates, setUpdates] = useState({});

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    taskService.getMyTasks().then((res) => setTasks(res.data));
  };

  // ❌ REMOVE COMPLETED TASKS
  const activeTasks = tasks.filter((t) => t.progress !== 100);

  const personalTasks = activeTasks.filter(
    (t) => t.taskType === "PERSONAL" || !t.taskType
  );
  const adminTasks = activeTasks.filter((t) => t.taskType === "ADMIN");

  const handleSliderChange = (task, value) => {
    if (value < task.progress) return;

    setUpdates({
      ...updates,
      [task._id]: { progress: value },
    });
  };

  const handleUpdate = (task) => {
    const data = updates[task._id];
    if (!data) return;

    taskService
      .updateTaskProgress(task._id, data.progress)
      .then(loadTasks);
  };

  const renderGrid = (list) => (
    <div className="progress-grid">
      {list.map((task) => {
        const value = updates[task._id]?.progress ?? task.progress;

        return (
          <div key={task._id} className="progress-card">
            <div className="progress-header">
              <h4>{task.title}</h4>
              <span
                className={task.taskType === "ADMIN" ? "admin" : "personal"}
              >
                {task.taskType || "PERSONAL"}
              </span>
            </div>

            <div className="progress-bar-wrapper">
              <div
                className="progress-fill"
                style={{ width: `${value}%` }}
              >
                <span className="progress-text">{value}%</span>
              </div>

              <input
                type="range"
                min={task.progress}
                max="100"
                value={value}
                onChange={(e) =>
                  handleSliderChange(task, Number(e.target.value))
                }
              />
            </div>

            <button
              className="update-btn"
              disabled={value === task.progress}
              onClick={() => handleUpdate(task)}
            >
              Update Progress
            </button>
          </div>
        );
      })}
    </div>
  );

  return (
    <StudentLayout>
      <div className="task-progress-container">
        <div className="header-section">
          <h2>Task Progress</h2>
          <p className="subtitle">Track your daily educational journey.</p>
        </div>

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

        {filter === "ALL" && (
          <div className="all-tasks-view">
            <div className="task-section">
              <h3>Personal Tasks</h3>
              {renderGrid(personalTasks)}
            </div>
            <div className="task-section">
              <h3>Admin Assigned Tasks</h3>
              {renderGrid(adminTasks)}
            </div>
          </div>
        )}

        {filter === "PERSONAL" && (
          <div className="task-section">
            <h3>Personal Tasks</h3>
            {renderGrid(personalTasks)}
          </div>
        )}

        {filter === "ADMIN" && (
          <div className="task-section">
            <h3>Admin Assigned Tasks</h3>
            {renderGrid(adminTasks)}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default TaskProgress;
