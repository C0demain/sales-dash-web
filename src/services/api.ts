import axios from "axios";
import { getUserLocalStorage } from "context/util";

export const apiLogin = axios.create({
  baseURL: "http://localhost:8000/api/v1/auth",
});

apiLogin.interceptors.request.use(
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

