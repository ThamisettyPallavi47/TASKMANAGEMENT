

// import axios from "axios";
// import authHeader from "./authHeader";

// const API_URL = "https://taskmanagement-w3gy.onrender.com/api/dashboard";

// const getStudentDashboard = () => {
//   return axios.get(`${API_URL}/student`, {
//     headers: authHeader(),
//   });
// };

// export default {
//   getStudentDashboard,
// };

import axios from "axios";
import authHeader from "./authHeader";

const API_URL = "https://taskmanagement-w3gy.onrender.com/api/dashboard";

const getStudentDashboard = () => {
  return axios.get(`${API_URL}/student`, {
    headers: authHeader(),
  });
};

const dashboardService = {
  getStudentDashboard,
};

export default dashboardService;