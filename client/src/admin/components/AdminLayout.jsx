// import { useNavigate } from "react-router-dom";
// import "./AdminLayout.css";

// const AdminLayout = ({ children }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="dashboard-container">
//       {/* SIDEBAR */}
//       <aside className="sidebar">
//         <h2 className="logo">Admin</h2>

//         <ul className="menu">
//           <li className="active" onClick={() => navigate("/admin")}>
//             Dashboard
//           </li>
//           <li onClick={() => navigate("/admin/students")}>Students</li>
//           <li onClick={() => navigate("/admin/assign-task")}>Assign Task</li>
//           <li onClick={() => navigate("/admin/tasks")}>Tasks</li>
//           <li onClick={() => navigate("/admin/analytics")}>Analytics</li>
//           <li onClick={() => navigate("/admin/settings")}>Settings</li>
//         </ul>

//         <button
//           className="add-task-btn"
//           onClick={() => navigate("/admin/assign-task")}
//         >
//           + Assign Task
//         </button>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main className="main-content">{children}</main>
//     </div>
//   );
// };

// export default AdminLayout;
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  CheckSquare,
  BarChart2,
  Settings,
  PlusCircle
} from "lucide-react";
import AdminProfile from "./AdminProfile";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // helper function to check active route
  const isActive = (path) => location.pathname === path;

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">StudiIn</h2>

        <ul className="menu">
          <li
            className={isActive("/admin") ? "active" : ""}
            onClick={() => navigate("/admin")}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </li>

          <li
            className={isActive("/admin/students") ? "active" : ""}
            onClick={() => navigate("/admin/students")}
          >
            <Users size={20} />
            Students
          </li>

          {/* <li
            className={isActive("/admin/completed-tasks") ? "active" : ""}
            onClick={() => navigate("/admin/completed-tasks")}
          >
            Completed Tasks
          </li> */}

          <li
            className={isActive("/admin/tasks") ? "active" : ""}
            onClick={() => navigate("/admin/tasks")}
          >
            <ClipboardList size={20} />
            Tasks
          </li>
          <li
            className={isActive("/admin/completed-tasks") ? "active" : ""}
            onClick={() => navigate("/admin/completed-tasks")}
          >
            <CheckSquare size={20} />
            Completed Tasks
          </li>
          <li
            className={isActive("/admin/analytics") ? "active" : ""}
            onClick={() => navigate("/admin/analytics")}
          >
            <BarChart2 size={20} />
            Analytics
          </li>

          <li
            className={isActive("/admin/settings") ? "active" : ""}
            onClick={() => navigate("/admin/settings")}
          >
            <Settings size={20} />
            Settings
          </li>
        </ul>

        <button
          className="add-task-btn"
          onClick={() => navigate("/admin/assign-task")}
        >
          <PlusCircle size={20} /> Assign Task
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {!isActive("/admin/settings") && !isActive("/admin/task-summary") && (
          <AdminProfile />
        )}
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
