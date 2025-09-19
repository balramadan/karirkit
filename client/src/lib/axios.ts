import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import router from '@/router/index'

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/* The code `export const api = axios.create({baseURL, withCredentials: true});` is creating an
instance of Axios with a specific base URL and with credentials set to true. This instance is then
exported as `api`, which can be used throughout the application to make HTTP requests to the
specified base URL with credentials included in the requests. This setup allows for centralized
configuration of Axios requests with the specified base URL and credentials handling. */
export const api = axios.create({
  baseURL,
  withCredentials: true,
});

/* The code snippet `api.interceptors.request.use(...)` is setting up a request interceptor for the
Axios instance named `api`. This interceptor is a function that Axios will call before sending a
request. Here's what it does: */
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* The code snippet `api.interceptors.response.use(...)` is setting up a response interceptor for the
Axios instance named `api`. This interceptor is a function that Axios will call after receiving a
response from a request. Here's what it does: */
api.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401) {
    const authStore = useAuthStore()

    console.error("Unauthorized or token expired. Logging out.")

    // Logout Pengguna
    authStore.clearUser();

    // Arahkan ke halaman login
    router.push('/signin');
  }

  return Promise.reject(error);
})
