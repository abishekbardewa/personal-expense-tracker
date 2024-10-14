import express from 'express';
import { checkSignature } from '../../middleware/auth.js';
import {
	addExpenseApi,
	getExpensesApi,
	getMonthlyChartApi,
	getYearlyMonthlyChartApi,
	getYearlyChartApi,
	getYearlyExpenseComparisonApi,
	getInsightsApi,
	updateExpenseApi,
	deleteExpenseApi,
} from './expenseController.js';

const router = express.Router();

router.use((req, res, next) => {
	/* #swagger.tags = ['Expense'] */
	/* #swagger.security = [{ "BearerAuth": []}] */
	next();
});

router.post('/add-expense', checkSignature, addExpenseApi);
router.get('/get-expense', checkSignature, getExpensesApi);
// router.get('/monthly-chart', checkSignature, getMonthlyChartApi);
router.get('/monthly-chart/:year/:month', checkSignature, getYearlyMonthlyChartApi);
router.get('/yearly-chart/:year', checkSignature, getYearlyChartApi);
router.post('/compare-expenses', checkSignature, getYearlyExpenseComparisonApi);
router.get('/insights', checkSignature, getInsightsApi);
router.put('/edit-expense/:expenseId', checkSignature, updateExpenseApi);
router.delete('/delete-expense/:expenseId', checkSignature, deleteExpenseApi);

export default router;
