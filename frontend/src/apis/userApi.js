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

export const logoutUser = async () => {
    const response = await axios.post(`${API_URL}/auth/logout`);
    return response.data;
};

export const getUserProfile = async () => {
    try {
        const res = await axios.get(`${API_URL}/auth/profile`);
        return res.data;
    } catch (error) {
        console.error("프로필 조회 실패", error);
        throw error;
    }
};
