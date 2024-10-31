import React, { createContext, useContext, useEffect, useState } from 'react';
import {
	addExpense,
	deleteExpense,
	editExpense,
	// getCategories,
	getCurrentMonthChart,
	getCurrentMonthInsights,
	getExpenses,
	getPaginatedExpense,
} from '../../services/expense.service';
import { toast } from 'react-toastify';
import { addCategory, deleteCategory } from '../../services/category.service';

const ExpenseContext = createContext(null);

export const useExpenseContext = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }: { children: React.ReactNode }) => {
	const [expenses, setExpenses] = useState([]);
	const [paginatedExpenses, setPaginatedExpense] = useState([]);
	const [categories, setCategories] = useState([]);
	const [monthlyInsights, setMonthlyInsights] = useState([]);
	const [overallImprovement, setOverallImprovement] = useState([]);
	const [overallWarnings, setOverallWarnings] = useState([]);
	const [chartData, setChartData] = useState({ labels: [], datasets: [] });
	const [totalAmount, setTotalAmount] = useState(0);
	const selectedMonth = new Date().getMonth() + 1;
	const selectedYear = new Date().getFullYear();
	const [loading, setLoading] = useState(false);
	const [paginationLoading, setPaginationLoading] = useState(false);
	const [totalCount, setTotalCount] = useState(0);

	useEffect(() => {
		fetchExpenses();
		fetchCurrentMonthlChart();
		fetchCurrentMonthlInsights();
	}, []);

	const fetchPaginatedExpenses = async (page: any = 1, limit = 10) => {
		setPaginationLoading(true);
		try {
			const { data: paginatedExpenseResponse } = await getPaginatedExpense(page, limit, selectedYear, selectedMonth);
			console.log('paginatedExpenseResponse', paginatedExpenseResponse);
			setPaginatedExpense(paginatedExpenseResponse.data.expenses);
			setTotalCount(paginatedExpenseResponse.data.total);
		} catch (error) {
			toast.error('Failed to fetch paginated expenses');
		} finally {
			setPaginationLoading(false);
		}
	};
	const fetchExpenses = async () => {
		setLoading(true);
		try {
			const { data: expenseResponse } = await getExpenses(selectedYear, selectedMonth);

			setExpenses(expenseResponse.data.expenses);
			setCategories(expenseResponse.data.categoryExpenses);
			setTotalAmount(expenseResponse.data.totalSpent);
		} catch (error) {
			toast.error('Failed to fetch expenses');
		} finally {
			setLoading(false);
		}
	};

	const fetchCurrentMonthlChart = async () => {
		setLoading(true);
		try {
			const { data: chartResponse } = await getCurrentMonthChart(selectedYear, selectedMonth);

			setChartData({
				labels: chartResponse.data.labels,
				datasets: chartResponse.data.datasets,
			});
		} catch (error) {
			toast.error('Failed to fetch monthly chart');
		} finally {
			setLoading(false);
		}
	};
	const fetchCurrentMonthlInsights = async () => {
		setLoading(true);
		try {
			const { data: insightsResponse } = await getCurrentMonthInsights();
			setMonthlyInsights(insightsResponse.data.monthlyInsights);
			setOverallImprovement(insightsResponse.data.overallImprovement);
			setOverallWarnings(insightsResponse.data.overallWarnings);
		} catch (error) {
			toast.error('Failed to fetch monthly insights');
		} finally {
			setLoading(false);
		}
	};

	const handleAddCategory = async (categoryData) => {
		const categoryExists = categories.some((category) => category?.category.name?.toLowerCase() === categoryData.categoryName?.toLowerCase());

		if (categoryExists) {
			toast.error('Category already exists!');
			return;
		}

		setLoading(true);
		try {
			await addCategory(categoryData);
			toast.success('Category added successfully');
			fetchExpenses();
			fetchCurrentMonthlChart();
			fetchCurrentMonthlInsights();
		} catch (error) {
			toast.error('Failed to add category');
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteCategory = async (categoryData) => {
		setLoading(true);
		try {
			await deleteCategory(categoryData);
			toast.success('Category deleted successfully');
			fetchExpenses();
			fetchCurrentMonthlChart();
			fetchCurrentMonthlInsights();
		} catch (error) {
			toast.error('Failed to delete category');
		} finally {
			setLoading(false);
		}
	};

	const handleAddExpense = async (expenseData) => {
		setLoading(true);
		try {
			await addExpense(expenseData);
			toast.success('Expense added successfully');
			fetchExpenses();
			fetchCurrentMonthlChart();
			fetchCurrentMonthlInsights();
			fetchPaginatedExpenses();
		} catch (error) {
			toast.error('Failed to add expense');
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteExpense = async (expenseId) => {
		setLoading(true);
		try {
			await deleteExpense(expenseId);
			toast.success('Expense deleted successfully');
			fetchExpenses();
			fetchCurrentMonthlChart();
			fetchCurrentMonthlInsights();
			fetchPaginatedExpenses();
		} catch (error) {
			toast.error('Failed to delete expense');
		} finally {
			setLoading(false);
		}
	};

	const handleEditExpense = async (expenseId, updatedData) => {
		setLoading(true);

		try {
			await editExpense(expenseId, updatedData);
			toast.success('Expense updated successfully');
			fetchExpenses();
			fetchCurrentMonthlChart();
			fetchCurrentMonthlInsights();
			fetchPaginatedExpenses();
		} catch (error) {
			toast.error('Failed to update expense');
		} finally {
			setLoading(false);
		}
	};

	return (
		<ExpenseContext.Provider
			value={{
				loading,
				expenses,
				categories,
				chartData,
				totalAmount,
				monthlyInsights,
				overallImprovement,
				overallWarnings,
				totalCount,
				paginatedExpenses,
				paginationLoading,
				handleAddCategory,
				handleDeleteCategory,
				handleAddExpense,
				handleDeleteExpense,
				handleEditExpense,
				fetchPaginatedExpenses,
			}}
		>
			{children}
		</ExpenseContext.Provider>
	);
};
