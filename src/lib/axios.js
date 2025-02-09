import axios from "axios";
import { BASE_URL } from "./utils";

export const axiosInstance = axios.create({
    baseURL : BASE_URL,
    withCredentials: true // this will set the cookie for each request
})