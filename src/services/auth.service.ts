import { axiosInstance, axiosPrivate } from './axios.service';

export const loginUser = async (email: string, password: string) => {
	try {
		const response = await axiosInstance.post('/auth/login', { email, password });
		return response;
	} catch (error) {
		throw new Error('Login API failed');
	}
};
export const registerUser = async (name: string, email: string, password: string) => {
	try {
		const response = await axiosInstance.post('/auth/create-account', { name, email, password });
		return response;
	} catch (error) {
		throw new Error('Signup API failed');
	}
};

export const addCustomCategory = async (data: any) => {
	try {
		const response = await axiosPrivate.post('auth/add-custom-category', data);
		return response;
	} catch (error) {
		throw new Error('Add Category API failed');
	}
};
