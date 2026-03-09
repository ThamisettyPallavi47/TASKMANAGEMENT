

import axios from "axios";

const API = "https://taskmanagement-w3gy.onrender.com/api/auth";

const login = (data) => axios.post(`${API}/login`, data);
const signup = (data) => axios.post(`${API}/signup`, data);
const forgotPassword = (data) => axios.post(`${API}/forgot-password`, data);
const resetPassword = (data) => axios.post(`${API}/reset-password`, data);

const authService = {
  login,
  signup,
  forgotPassword,
  resetPassword,
};

export default authService;

// import axios from "axios";

// const API = "http://localhost:5000/api/auth";

// const login = (data) => axios.post(`${API}/login`, data);
// const signup = (data) => axios.post(`${API}/signup`, data);
// const forgotPassword = (data) => axios.post(`${API}/forgot-password`, data);
// const resetPassword = (data) => axios.post(`${API}/reset-password`, data);

// const authService = {
//   login,
//   signup,
//   forgotPassword,
//   resetPassword,
// };

// export default authService;