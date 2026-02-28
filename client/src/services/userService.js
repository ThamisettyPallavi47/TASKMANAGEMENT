import axios from "axios";
import authHeader from "./authHeader";

const API = "http://localhost:5000/api/user";

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

export default {
  getProfile,
  updateProfile,
  changePassword,
};
