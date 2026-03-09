

import axios from "axios";
import authHeader from "./authHeader";

const API = "https://taskmanagement-w3gy.onrender.com/api/user";

const getProfile = () =>
  axios.get(`${API}/profile`, { headers: authHeader() });

const updateProfile = (data) =>
  axios.put(`${API}/profile`, data, {
    headers: authHeader(),
  });

const changePassword = (data) =>
  axios.put(`${API}/change-password`, data, {
    headers: authHeader(),
  });

const userService = {
  getProfile,
  updateProfile,
  changePassword,
};

export default userService;