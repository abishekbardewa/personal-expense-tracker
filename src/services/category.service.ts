import { axiosPrivate } from './axios.service';
const API_URL = '/category';

export const addCategory = async (categoryData) => {
	const response = await axiosPrivate.post(`${API_URL}/add-custom-category`, categoryData);
	return response;
};
export const deleteCategory = async (categoryData) => {
	const response = await axiosPrivate.delete(`${API_URL}/delete-category`, { data: categoryData });
	return response;
};
