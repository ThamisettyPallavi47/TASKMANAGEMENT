import AdminDashboard from "./pages/AdminDashboard";
import Students from "./pages/Students";
import AssignTask from "./pages/AssignTask";
import AdminTasks from "./pages/AdminTasks";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSettings from "./pages/AdminSettings";
import AdminCompletedTasks from "./pages/AdminCompletedTasks";
import AdminTaskSummaryView from "./pages/AdminTaskSummaryView";

const adminRoutes = [
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/students",
    element: <Students />,
  },
  {
    path: "/admin/assign-task",
    element: <AssignTask />,
  },
  {
    path: "/admin/tasks",
    element: <AdminTasks />,
  },
  {
    path: "/admin/analytics",
    element: <AdminAnalytics />,
  },
  {
    path: "/admin/settings",
    element: <AdminSettings />,
  },
  {
  path: "/admin/completed-tasks",
  element: <AdminCompletedTasks />,
},
{
  path: "/admin/task-summary",
  element: <AdminTaskSummaryView />,
},
];

export default adminRoutes;
