


import axios from "axios";
import authHeader from "./authHeader";

const API_URL = "https://taskmanagement-w3gy.onrender.com/api/tasks";

const addTask = (taskData) => {
  return axios.post(`${API_URL}/add`, taskData, {
    headers: authHeader(),
  });
};

const getMyTasks = () => {
  return axios.get(`${API_URL}/student`, {
    headers: authHeader(),
  });
};

const updateTaskProgress = (id, progress, comment) => {
  return axios.put(
    `${API_URL}/progress/${id}`,
    { progress, comment },
    { headers: authHeader() }
  );
};

const deleteTask = (id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: authHeader(),
  });
};

export default {
  addTask,
  getMyTasks,
  updateTaskProgress,
  deleteTask,
};
