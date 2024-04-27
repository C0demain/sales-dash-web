import axios from "axios";
import { getUserLocalStorage } from "context/AuthProvider/util";

export const Api = axios.create({
  baseURL: "http://localhost:8000/api/v1/auth",
});

Api.interceptors.request.use(
  (config) => {
    const user = getUserLocalStorage();

    if (user?.token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = user.token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

