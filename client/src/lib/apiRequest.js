import axios from "axios";

const apiRequest = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API + "/api/v1",
  withCredentials: true,
});



export default apiRequest;