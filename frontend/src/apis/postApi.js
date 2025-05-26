import axios from "axios";
axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_BACK_URL;

export const createPost = async (postData) => {
    const response = await axios.post(`${API_URL}/postWrite`, postData);
    return response.data;
};
