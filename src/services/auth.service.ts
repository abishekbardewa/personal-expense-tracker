import { axiosInstance } from './axios.service';
const API_URL = '/auth';

export const loginUser = async (email: string, password: string) => {
	const response = await axiosInstance.post(`${API_URL}/login`, { email, password });
	return response;
};
export const registerUser = async (name: string, email: string, password: string) => {
	const response = await axiosInstance.post(`${API_URL}/create-account`, { name, email, password });
	return response;
};
