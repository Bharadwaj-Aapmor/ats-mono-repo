import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? `http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/`
      : "/",
  // withCredentials: true,
});
