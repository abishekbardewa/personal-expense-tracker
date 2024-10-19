import { axiosPrivate } from './axios.service';
const API_URL = '/expense';

export const getExpenses = async (year: any, month: any) => {
	const response = await axiosPrivate.get(`${API_URL}/get-expense?year=${year}&month=${month}`);
	return response;
};
export const getCurrentMonthChart = async (year: any, month: any) => {
	const response = await axiosPrivate.get(`${API_URL}/monthly-chart/${year}/${month}`);
	return response;
};
export const getCurrentMonthInsights = async () => {
	const response = await axiosPrivate.get(`${API_URL}/monthly-insights`);
	return response;
};

export const addExpense = async (data: any) => {
	const response = await axiosPrivate.post(`${API_URL}/add-expense`, data);
	return response;
};

export const deleteExpense = async (expenseId) => {
	const response = await axiosPrivate.delete(`${API_URL}/delete-expense/${expenseId}`);
	return response;
};
export const editExpense = async (expenseId, updatedData) => {
	const response = await axiosPrivate.put(`${API_URL}/edit-expense/${expenseId}`, updatedData);
	return response;
};
