import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API || "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const auth = localStorage.getItem("auth");
  if (auth) {
    const parsed = JSON.parse(auth);
    if (parsed?.token) {
      config.headers.Authorization = parsed.token;
    }
  }
  return config;
});

export default api;
