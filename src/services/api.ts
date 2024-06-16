import axios from "axios";
import { getUserLocalStorage } from "context/util";

export const apiBackend = "https://sales-dash-backend.onrender.com";

export const apiLogin = axios.create({
  baseURL: `${apiBackend}/api/v1/auth`,
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

export const apiInstance = axios.create({
  baseURL: apiBackend,
});

apiInstance.interceptors.request.use(
  (config) => {
    const user = getUserLocalStorage();

    if (user?.token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
