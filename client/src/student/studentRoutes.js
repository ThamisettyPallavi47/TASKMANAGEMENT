import StudentDashboard from "./pages/StudentDashboard";
import MyTasks from "./pages/MyTasks";
import AddTask from "./pages/AddTask";
import TaskProgress from "./pages/TaskProgress";
import StudentAnalytics from "./pages/StudentAnalytics";
import Settings from "./pages/Settings";
import TaskSummaryView from "./pages/TaskSummaryView";
import CompletedTasks from "./pages/CompletedTasks";

const studentRoutes = [
  {
    path: "/student",
    element: <StudentDashboard />,
  },
  {
    path: "/student/tasks",
    element: <MyTasks />,
  },
  {
    path: "/student/add-task",
    element: <AddTask />,
  },
  {
    path: "/student/progress",
    element: <TaskProgress />,
  },
  {
    path: "/student/analytics",
    element: <StudentAnalytics />,
  },
  {
  path: "/student/settings",
  element: <Settings />,
},
{
  path:"/student/task-summary",
   element:<TaskSummaryView />,
},

{
  path: "/student/completed-tasks",
  element: <CompletedTasks />,
}
];

export default studentRoutes;



