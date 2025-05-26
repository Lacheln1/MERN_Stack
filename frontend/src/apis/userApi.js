import axios from "axios";

axios.defaults.withCredentials = true; // 모든 요청에 대해 withCredentials 설정
const API_URL = import.meta.env.VITE_BACK_URL || "http://localhost:3000";

export const registerUser = async (userData) => {
    const resonse = await axios.post(`${API_URL}/register`, userData);
    return resonse.data;
};

export const loginUser = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};
