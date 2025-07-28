import axios from "axios";

export const axiosInstance = axios.create({
 baseURL: "http://localhost:5000/api",
  withCredentials: true
});


export const BaseUrl = "http://localhost:5000"
