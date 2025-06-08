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

//특정 사용자 정보 조회
export const getUserInfo = async (username) => {
    try {
        const response = await axios.get(`${API_URL}/user/${username}`);
        return response.data;
    } catch (error) {
        console.error("사용자 정보 조회 실패", error);
        throw error;
    }
};

//특정 사용자가 작성한 글 조회
export const getUserPosts = async (username) => {
    try {
        const response = await axios.get(`${API_URL}/user/${username}/posts`);
        return response.data;
    } catch (error) {
        console.error("사용자 게시물 조회 실패", error);
        throw error;
    }
};

//특정 사용자가 작성한 댓글 조회
export const getUserComments = async (username) => {
    try {
        const response = await axios.get(`${API_URL}/user/${username}/comments`);
        return response.data;
    } catch (error) {
        console.error("사용자 댓글 조회 실패", error);
        throw error;
    }
};

// 특정 사용자가 좋아요 클릭한 글 조회
export const getUserLikes = async (username) => {
    try {
        const response = await axios.get(`${API_URL}/user/${username}/likes`);
        return response.data;
    } catch (err) {
        console.error("사용자 좋아요 게시물 조회 실패:", err);
        throw err;
    }
};
