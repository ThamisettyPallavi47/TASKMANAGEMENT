

import axios from "axios";
import authHeader from "./authHeader";

const API_URL = "http://localhost:5000/api/dashboard";

const getStudentDashboard = () => {
  return axios.get(`${API_URL}/student`, {
    headers: authHeader(),
  });
};

export default {
  getStudentDashboard,
};
