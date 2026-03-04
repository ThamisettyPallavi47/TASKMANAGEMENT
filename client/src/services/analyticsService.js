
// import axios from "axios";
// import authHeader from "./authHeader";

// const API_URL = "https://taskmanagement-w3gy.onrender.com/api/analytics";

// const getStudentAnalytics = (type = "ALL") => {
//   return axios.get(`${API_URL}/student?type=${type}`, {
//     headers: authHeader(),   // ✅ CRITICAL FIX
//   });
// };

// export default {
//   getStudentAnalytics,
// };

import axios from "axios";
import authHeader from "./authHeader";

const API_URL = "https://taskmanagement-w3gy.onrender.com/api/analytics";

const getStudentAnalytics = (type = "ALL") => {
  return axios.get(`${API_URL}/student?type=${type}`, {
    headers: authHeader(),
  });
};

const analyticsService = {
  getStudentAnalytics,
};

export default analyticsService;