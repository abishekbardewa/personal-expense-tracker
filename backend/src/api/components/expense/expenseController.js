import logger from '../../config/logger.js';
import catchAsync from '../../helpers/catchAsync.js';
import { handleError, handleResponse } from '../../helpers/responseHandler.js';
import {
	addExpense,
	getExpensesByUserId,
	getCompareExpenseChart,
	getYearlyMonthlyChart,
	getYearlyChart,
	getYearlyExpenseComparison,
	getInsights,
	updateExpense,
	deleteExpense,
	getCompareExpense,
	getExpenseCategoryTrend,
	getTotalSpentTrend,
	getCompareExpenseExpenseDetail,
} from './expenseService.js';

const addExpenseApi = catchAsync(async (req, res) => {
	logger.info('Inside addExpenseApi Controller');
	const { amount, category, description, date } = req.body;
	const { userId } = req.user;

	// Validate input
	if (!userId || !amount || !category) {
		return handleError({
			res,
			statusCode: 400,
			err: 'User ID, amount, and category are required.',
		});
	}

	const result = await addExpense(userId, amount, category, description, date);

	if (result.status === 'SUCCESS') {
		return handleResponse({
			res,
			data: result.data,
		});
	}

	return handleError({
		res,
		statusCode: 500,
		err: result.error,
	});
});

const getExpensesApi = catchAsync(async (req, res) => {
	logger.info('Inside getExpensesApi Controller');
	const { year, month } = req.query;
	const { userId } = req.user;
	if (!userId) {
		return handleError({
			res,
			statusCode: 400,
			err: 'User ID is required.',
		});
	}
	if (!year || !month) {
		return handleError({
			res,
			statusCode: 400,
			err: 'Month & Year are required.',
		});
	}
	const response = await getExpensesByUserId(userId, year, month);

	if (response.status === 'SUCCESS') {
		return handleResponse({
			res,
			data: response.data,
		});
	}

	return handleError({
		res,
		statusCode: 500,
		err: response.error,
	});
});

const getCompareExpenseChartApi = catchAsync(async (req, res) => {
	logger.info('Inside getCompareExpenseChartApi Controller');

	const { userId } = req.user;
	if (!userId) {
		return handleError({
			res,
			statusCode: 400,
			err: 'User ID is required.',
		});
	}

	const response = await getCompareExpenseChart(userId);

	if (response.status === 'SUCCESS') {
		return handleResponse({
			res,
			data: response.data,
		});
	}

	return handleResponse({
		res,
		statusCode: 500,
		err: response.error,
	});
});
const getYearlyMonthlyChartApi = catchAsync(async (req, res) => {
	logger.info('Inside getYearlyMonthlyChartApi Controller');

	const { year, month } = req.params;
	const { userId } = req.user;
	if (!userId) {
		return handleError({
			res,
			statusCode: 400,
			err: 'User ID is required.',
		});
	}
	if (!year || !month) {
		return handleError({
			res,
			statusCode: 400,
			err: 'Month & Year are required.',
		});
	}
	const response = await getYearlyMonthlyChart(userId, year, month);

	if (response.status === 'SUCCESS') {
		return handleResponse({
			res,
			data: response.data,
		});
	}

	return handleResponse({
		res,
		statusCode: 500,
		err: response.error,
	});
});
const getYearlyChartApi = catchAsync(async (req, res) => {
	logger.info('Inside getYearlyChartApi Controller');

	const { year } = req.params;
	const { userId } = req.user;
	if (!userId) {
		return handleError({
			res,
			statusCode: 400,
			err: 'User ID is required.',
		});
	}
	if (!year) {
		return handleError({
			res,
			statusCode: 400,
			err: 'Year is required.',
		});
	}
	const response = await getYearlyChart(userId, year);

	if (response.status === 'SUCCESS') {
		return handleResponse({
			res,
			data: response.data,
		});
	}

	return handleResponse({
		res,
		statusCode: 500,
		err: response.error,
	});
});
const getYearlyExpenseComparisonApi = catchAsync(async (req, res) => {
	logger.info('Inside getYearlyExpenseComparisonApi Controller');

	const { years } = req.body;
	const { userId } = req.user;
	if (!userId) {
		return handleError({
			res,
			statusCode: 400,
			err: 'User ID is required.',
		});
	}
	if (!Array.isArray(years)) {
		return handleError({
			res,
			statusCode: 400,
			err: 'Invalid years',
		});
	}
	const response = await getYearlyExpenseComparison(userId, years);

	if (response.status === 'SUCCESS') {
		return handleResponse({
			res,
			data: response.data,
		});
	}

	return handleResponse({
		res,
		statusCode: 500,
		err: response.error,
	});
});
const getInsightsApi = catchAsync(async (req, res) => {
	logger.info('Inside getInsightsApi Controller');

	const { userId } = req.user;
	if (!userId) {
		return handleError({
			res,
			statusCode: 400,
			err: 'User ID is required.',
		});
	}

	const response = await getInsights(userId);

	if (response.status === 'SUCCESS') {
		return handleResponse({
			res,
			data: response.data,
		});
	}

	return handleResponse({
		res,
		statusCode: 500,
		err: response.error,
	});
});

const updateExpenseApi = catchAsync(async (req, res) => {
	logger.info('Inside updateExpenseApi Controller');

	const { expenseId } = req.params;
	const expenseData = req.body;
	if (!expenseId) {
		return handleError({
			res,
			statusCode: 400,
			err: 'Expense ID is required.',
		});
	}
	// if (!categoryName) {
	// 	return handleError({
	// 		res,
	// 		statusCode: 400,
	// 		err: 'Category Name is required.',
	// 	});
	// }
	const response = await updateExpense(expenseId, expenseData);

	if (response.status === 'SUCCESS') {
		return handleResponse({
			res,
			data: response.data,
		});
	}

	return handleError({
		res,
		statusCode: 500,
		err: response.error,
	});
});
const deleteExpenseApi = catchAsync(async (req, res) => {
	logger.info('Inside deleteExpenseApi Controller');

	const { expenseId } = req.params;

	if (!expenseId) {
		return handleError({
			res,
			statusCode: 400,
			err: 'Expense ID is required.',
		});
	}
	// if (!categoryName) {
	// 	return handleError({
	// 		res,
	// 		statusCode: 400,
	// 		err: 'Category Name is required.',
	// 	});
	// }
	const response = await deleteExpense(expenseId);

	if (response.status === 'SUCCESS') {
		return handleResponse({
			res,
			data: {},
		});
	}

	return handleError({
		res,
		statusCode: 500,
		err: response.error,
	});
});

const getCompareExpenseApi = catchAsync(async (req, res) => {
	logger.info('Inside getCompareExpenseApi Controller');
	const { year, months } = req.body;

	const { userId } = req.user;
	if (!userId) {
		return handleError({
			res,
			statusCode: 400,
			err: 'User ID is required.',
		});
	}
	if (!year || !months || !months.length) {
		return handleError({
			res,
			statusCode: 400,
			err: 'Year and months are required.',
		});
	}

	const response = await getCompareExpense(userId, year, months);
	console.log(response.data);
	if (response.status === 'SUCCESS') {
		return handleResponse({
			res,
			data: response.data,
		});
	}

	return handleResponse({
		res,
		statusCode: 500,
		err: response.error,
	});
});
const getCompareExpenseExpenseDetailApi = catchAsync(async (req, res) => {
	logger.info('Inside getCompareExpenseExpenseDetailApi Controller');
	const { year, months } = req.body;

	const { userId } = req.user;
	if (!userId) {
		return handleError({
			res,
			statusCode: 400,
			err: 'User ID is required.',
		});
	}
	if (!year || !months || !months.length) {
		return handleError({
			res,
			statusCode: 400,
			err: 'Year and months are required.',
		});
	}

	const response = await getCompareExpenseExpenseDetail(userId, year, months);
	console.log(response.data);
	if (response.status === 'SUCCESS') {
		return handleResponse({
			res,
			data: response.data,
		});
	}

	return handleResponse({
		res,
		statusCode: 500,
		err: response.error,
	});
});

const getExpenseCategoryTrendApi = catchAsync(async (req, res) => {
	logger.info('Inside getExpenseCategoryTrendApi Controller');
	const { range, category, compareCategory } = req.body;

	const { userId } = req.user;
	if (!userId) {
		return handleError({
			res,
			statusCode: 400,
			err: 'User ID is required.',
		});
	}
	if (!range || !category) {
		return handleError({
			res,
			statusCode: 400,
			err: 'Range and category are required',
		});
	}

	const response = await getExpenseCategoryTrend(userId, range, category, compareCategory);
	if (response.status === 'SUCCESS') {
		return handleResponse({
			res,
			data: response.data,
		});
	}

	return handleResponse({
		res,
		statusCode: 500,
		err: response.error,
	});
});
const getTotalSpentTrendApi = catchAsync(async (req, res) => {
	logger.info('Inside getTotalSpentTrendApi Controller');
	const { range } = req.query;

	const { userId } = req.user;
	if (!userId) {
		return handleError({
			res,
			statusCode: 400,
			err: 'User ID is required.',
		});
	}
	if (!range) {
		return handleError({
			res,
			statusCode: 400,
			err: 'Range is required',
		});
	}

	const response = await getTotalSpentTrend(userId, range);
	// console.log(response.data);
	if (response.status === 'SUCCESS') {
		return handleResponse({
			res,
			data: response.data,
		});
	}

	return handleResponse({
		res,
		statusCode: 500,
		err: response.error,
	});
});
export {
	addExpenseApi,
	getExpensesApi,
	getCompareExpenseChartApi,
	getYearlyMonthlyChartApi,
	getYearlyChartApi,
	getYearlyExpenseComparisonApi,
	getInsightsApi,
	updateExpenseApi,
	deleteExpenseApi,
	getCompareExpenseApi,
	getExpenseCategoryTrendApi,
	getTotalSpentTrendApi,
	getCompareExpenseExpenseDetailApi,
};
