import express from 'express';
import { checkSignature } from '../../middleware/auth.js';
import {
	addExpenseApi,
	getExpensesApi,
	getMonthChartApi,
	getMonthlyInsightsApi,
	updateExpenseApi,
	deleteExpenseApi,
	getCompareExpenseApi,
	getExpenseCategoryTrendApi,
	getTotalSpentTrendApi,
	getCompareExpenseExpenseDetailApi,
	getPaginatedExpensesApi,
} from './expenseController.js';

const router = express.Router();

router.use((req, res, next) => {
	/* #swagger.tags = ['Expense'] */
	/* #swagger.security = [{ "BearerAuth": []}] */
	next();
});

router.post('/add-expense', checkSignature, addExpenseApi);
router.get('/get-expense', checkSignature, getExpensesApi);
router.get('/get-paginated-expense', checkSignature, getPaginatedExpensesApi);
router.put('/edit-expense/:expenseId', checkSignature, updateExpenseApi);
router.delete('/delete-expense/:expenseId', checkSignature, deleteExpenseApi);
router.post('/monthly-expense-details', checkSignature, getCompareExpenseExpenseDetailApi);
router.get('/monthly-insights', checkSignature, getMonthlyInsightsApi);
router.get('/month-chart/:year/:month', checkSignature, getMonthChartApi);
router.post('/compare-expenses', checkSignature, getCompareExpenseApi);
router.post('/expense-category-trend', checkSignature, getExpenseCategoryTrendApi);
router.get('/expense-total-spent-trend', checkSignature, getTotalSpentTrendApi);

export default router;
