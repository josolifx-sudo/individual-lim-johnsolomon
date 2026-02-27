import axios from "axios";

const API_BASE_URL = "https://movieapi-lim.onrender.com";

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.timeout = 15000;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("movieapp_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;