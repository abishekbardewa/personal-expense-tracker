import express from 'express';
import { checkSignature } from '../../middleware/auth.js';
import {
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
} from './expenseController.js';

const router = express.Router();

router.use((req, res, next) => {
	/* #swagger.tags = ['Expense'] */
	/* #swagger.security = [{ "BearerAuth": []}] */
	next();
});

router.post('/add-expense', checkSignature, addExpenseApi);
router.get('/get-expense', checkSignature, getExpensesApi);
router.put('/edit-expense/:expenseId', checkSignature, updateExpenseApi);
router.delete('/delete-expense/:expenseId', checkSignature, deleteExpenseApi);
router.post('/monthly-expense-details', checkSignature, getCompareExpenseExpenseDetailApi);
router.get('/monthly-insights', checkSignature, getInsightsApi);
router.post('/compare-expenses', checkSignature, getCompareExpenseApi);
router.get('/monthly-chart/:year/:month', checkSignature, getYearlyMonthlyChartApi);
router.get('/yearly-chart/:year', checkSignature, getYearlyChartApi);
router.post('/expense-category-trend', checkSignature, getExpenseCategoryTrendApi);
router.get('/expense-total-spent-trend', checkSignature, getTotalSpentTrendApi);

export default router;
