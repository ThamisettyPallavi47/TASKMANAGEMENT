// import axios from "axios";

// const STUDENT_ID = "student123";

// const getStudentAnalytics = () => {
//   return axios.get(
//     `http://localhost:5000/api/analytics/student/${STUDENT_ID}`
//   );
// };

// export default {
//   getStudentAnalytics,
// };

// client/src/services/analyticsService.js
import axios from "axios";
import authHeader from "./authHeader";

const API_URL = "http://localhost:5000/api/analytics";

const getStudentAnalytics = (type = "ALL") => {
  return axios.get(`${API_URL}/student?type=${type}`, {
    headers: authHeader(),   // ✅ CRITICAL FIX
  });
};

export default {
  getStudentAnalytics,
};
