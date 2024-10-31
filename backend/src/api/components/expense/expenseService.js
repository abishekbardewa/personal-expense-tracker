import logger from '../../config/logger.js';
import message from '../../config/message.js';
import Users from '../../models/usersModel.js';
import Expense from '../../models/expenseModal.js';
import mongoose from 'mongoose';
import {
	getMonthLabels,
	formatCurrency,
	formatMonthYear,
	fillMissingData,
	generateInsights,
	getBaseColor,
	getMonthYear,
	getMonthRange,
	getStartDate,
	monthNames,
} from '../../helpers/utils.js';
const addExpense = async (userId, amount, category, description = '', date) => {
	try {
		const newExpense = new Expense({
			userId,
			amount,
			category,
			description,
			date,
		});

		const savedExpense = await newExpense.save();

		return {
			status: 'SUCCESS',
			data: savedExpense,
		};
	} catch (error) {
		console.error(error);
		return {
			status: 'ERROR',
			error: message.SOMETHING_WENT_WRONG,
		};
	}
};

const getExpensesByUserId = async (userId, year, month) => {
	try {
		const startDate = new Date(Date.UTC(year, month - 1, 1));
		const endDate = new Date(Date.UTC(year, month, 1));

		const user = await Users.findById(userId).select('categories');
		const userCategories = user.categories || [];

		const expenses = await Expense.find({
			userId,
			date: { $gte: startDate, $lt: endDate },
		}).sort({ createdAt: -1 });

		const totalSpent = expenses.reduce((total, expense) => total + expense.amount, 0);

		const categoryExpenses = userCategories.map((category) => {
			const categoryExpensesData = expenses.filter((expense) => expense.category === category.name);

			const categoryTotal = categoryExpensesData.reduce((sum, expense) => sum + expense.amount, 0);
			const percentage = totalSpent > 0 ? (categoryTotal / totalSpent) * 100 : 0;

			const spentDates = categoryExpensesData.map((expense) => expense.date);
			const latestCreatedAt = categoryExpensesData.length ? categoryExpensesData[0].createdAt : null;

			return {
				category,
				totalAmount: categoryTotal || 0,
				percentage: parseFloat(percentage.toFixed(2)), // Limit to 2 decimal places

				spentDates: spentDates.length ? spentDates : [],
				latestCreatedAt,
			};
		});
		categoryExpenses.sort((a, b) => {
			if (a.latestCreatedAt && b.latestCreatedAt) {
				return new Date(b.latestCreatedAt) - new Date(a.latestCreatedAt);
			} else if (a.latestCreatedAt) {
				return -1;
			} else if (b.latestCreatedAt) {
				return 1;
			} else {
				return 0;
			}
		});
		return {
			status: 'SUCCESS',
			data: {
				categoryExpenses,
				totalSpent,
				expenses,
			},
		};
	} catch (error) {
		console.error('Error fetching monthly expenses:', error);
		return {
			status: 'ERROR',
			error: 'Something went wrong while fetching monthly expenses.',
		};
	}
};

const getMonthChart = async (userId, year, month) => {
	logger.info('Inside getMonthChart Service');
	try {
		const startDate = new Date(Date.UTC(year, month - 1, 1));
		const endDate = new Date(Date.UTC(year, month, 1));

		const result = await Expense.aggregate([
			{
				$match: { userId: new mongoose.Types.ObjectId(userId), date: { $gte: startDate, $lt: endDate } },
			},
			{
				$group: { _id: '$category', totalSpent: { $sum: '$amount' } },
			},
			{
				$project: {
					_id: 0,
					label: { $concat: ['$_id', ': ₹', { $toString: '$totalSpent' }] },
					totalSpent: 1,
				},
			},
		]);

		const monthLabel = `${monthNames[month - 1]}`;

		if (result.length === 0) {
			return {
				status: 'SUCCESS',
				data: {
					labels: [],
					datasets: [
						{
							label: `Expenses in ${monthLabel}`,
							data: [],
							backgroundColor: [],
							borderColor: [],
						},
					],
				},
			};
		}

		const labels = result.map((item) => item.label);
		const data = result.map((item) => item.totalSpent);
		const backgroundColor = labels.map((_, index) => getBaseColor(index));

		return {
			status: 'SUCCESS',
			data: {
				labels,
				datasets: [
					{
						label: `Expenses in ${monthLabel}-${year}`,
						data,
						backgroundColor,
						borderColor: backgroundColor,
						fill: false,
					},
				],
			},
		};
	} catch (error) {
		console.error('Error fetching monthly expenses by category:', error);
		return {
			status: 'ERROR',
			error: 'Something went wrong while fetching monthly expenses by category.',
		};
	}
};

const getMonthlyInsights = async (userId) => {
	logger.info('Inside  getMonthlyInsights Service');
	try {
		const currentDate = new Date();
		const monthlyInsights = [];
		let overallImprovement = [];
		let overallWarnings = [];
		const expenses = await Expense.find({ userId: userId });

		if (expenses.length === 0) {
			return {
				status: 'SUCCESS',
				data: { monthlyInsights, overallImprovement, overallWarnings },
			};
		}

		expenses.forEach((expense) => {
			const { month, year } = getMonthYear(expense.date);
			const category = expense.category;

			const monthIndex = monthlyInsights.findIndex((insight) => insight.category === category && insight.year === year);
			if (monthIndex === -1) {
				monthlyInsights.push({
					category: category,
					year: year,
					months: Array(12).fill(0),
					messages: [],
				});
			}

			monthlyInsights.find((insight) => insight.category === category && insight.year === year).months[month] += expense.amount;
		});

		const currentMonthInsights = [];

		monthlyInsights.forEach((insight) => {
			const category = insight.category;
			const currentMonth = currentDate.getMonth();

			const currentMonthAmount = insight.months[currentMonth] || 0;

			const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
			const previousMonthAmount = insight.months[previousMonth] || 0;

			const hasPreviousData = insight.months.some((amount, index) => index !== currentMonth && amount > 0);

			const message =
				currentMonthAmount > 0 && previousMonthAmount === 0 && !hasPreviousData
					? `First time spending on ${category}: ₹${currentMonthAmount}. Keep tracking!`
					: currentMonthAmount > previousMonthAmount
					? `You spent ₹${currentMonthAmount - previousMonthAmount} more on ${category} than last month. Review your budget.`
					: currentMonthAmount < previousMonthAmount
					? `You spent ₹${previousMonthAmount - currentMonthAmount} less on ${category} than last month. Great job!`
					: `Your spending on ${category} is the same as last month.`;

			currentMonthInsights.push({
				category: category,
				currentMonthAmount,
				previousMonthAmount,
				message,
			});

			if (currentMonthAmount > previousMonthAmount) {
				overallImprovement.push(message);
			} else if (currentMonthAmount < previousMonthAmount) {
				overallWarnings.push(message);
			}
		});

		return {
			status: 'SUCCESS',
			data: {
				overallImprovement,
				overallWarnings,
				monthlyInsights: currentMonthInsights,
			},
		};
	} catch (error) {
		console.error('Error fetching yearly expense comparison:', error);
		return {
			status: 'ERROR',
			error: 'Something went wrong while fetching yearly expense comparison.',
		};
	}
};

const updateExpense = async (expenseId, expenseData) => {
	try {
		const updatedExpense = await Expense.findByIdAndUpdate(expenseId, expenseData, { new: true });

		if (!updatedExpense) {
			return {
				status: 'ERROR',
				error: 'Expense not found',
			};
		}

		return {
			status: 'SUCCESS',
			date: updatedExpense,
		};
	} catch (error) {
		console.error(error);
		return {
			status: 'ERROR',
			error: message.SOMETHING_WENT_WRONG,
		};
	}
};
const deleteExpense = async (expenseId, expenseData) => {
	try {
		const expense = await Expense.findByIdAndDelete(expenseId);
		if (!expense) {
			return {
				status: 'ERROR',
				error: 'Expense not found',
			};
		}

		return {
			status: 'SUCCESS',
		};
	} catch (error) {
		console.error(error);
		return {
			status: 'ERROR',
			error: message.SOMETHING_WENT_WRONG,
		};
	}
};

const getCompareExpense = async (userId, year, months) => {
	logger.info('Inside  getCompareExpense Service');
	try {
		const monthlyExpenses = await Promise.all(
			months.map(async (month) => {
				const { start, end } = getMonthRange(year, month);

				const expenses = await Expense.find({
					userId: new mongoose.Types.ObjectId(userId),
					date: { $gte: start, $lt: end },
				}).exec();

				if (expenses.length === 0) {
					return {
						month: monthNames[month - 1],
						totalAmount: 0,
						categoryWiseExpenses: {},
					};
				}

				const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
				const categoryWiseExpenses = expenses.reduce((acc, expense) => {
					acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
					return acc;
				}, {});

				return {
					month: monthNames[month - 1],
					totalAmount,
					categoryWiseExpenses,
				};
			}),
		);

		const validMonthlyExpenses = monthlyExpenses.filter((data) => data.totalAmount > 0);

		const comparisonChart = { labels: [], datasets: [] };
		const totalSpentChart = { labels: [], datasets: [] };

		if (validMonthlyExpenses.length > 0) {
			const allCategories = [...new Set(validMonthlyExpenses.flatMap((data) => Object.keys(data.categoryWiseExpenses)))];

			const datasets = validMonthlyExpenses.map((monthlyData) => ({
				label: `Expenses in ${monthlyData.month}`,
				data: allCategories.map((category) => monthlyData.categoryWiseExpenses[category] || 0),
				backgroundColor: getBaseColor(validMonthlyExpenses.indexOf(monthlyData)),
				borderColor: getBaseColor(validMonthlyExpenses.indexOf(monthlyData)),
				fill: false,
			}));

			comparisonChart.labels = allCategories;
			comparisonChart.datasets = datasets;

			totalSpentChart.labels = validMonthlyExpenses.map((data) => data.month);
			totalSpentChart.datasets = [
				{
					label: 'Total Spent',
					data: validMonthlyExpenses.map((data) => data.totalAmount),
					backgroundColor: validMonthlyExpenses.map((_, index) => getBaseColor(index)),
					borderColor: validMonthlyExpenses.map((_, index) => getBaseColor(index)),
					fill: false,
				},
			];
		}

		const insights = {
			highestSpendingMonth: 'No spending data available.',
			lowestSpendingMonth: 'No spending data available.',
			spendingIncreaseDecrease: 'No comparison available.',
			totalSpent: 'You spent ₹0 over the selected months.',
			averageMonthlySpending: 'No average spending due to lack of data.',
		};

		if (validMonthlyExpenses.length > 0) {
			const totalSpent = validMonthlyExpenses.reduce((sum, data) => sum + data.totalAmount, 0);
			const averageSpent = totalSpent / validMonthlyExpenses.length;

			const highestExpenseMonth = validMonthlyExpenses.reduce(
				(prev, curr) => (curr.totalAmount > prev.totalAmount ? curr : prev),
				validMonthlyExpenses[0],
			);
			const lowestExpenseMonth = validMonthlyExpenses.reduce(
				(prev, curr) => (curr.totalAmount < prev.totalAmount ? curr : prev),
				validMonthlyExpenses[0],
			);

			insights.highestSpendingMonth = `You spent the most in ${highestExpenseMonth.month}, with ${formatCurrency(highestExpenseMonth.totalAmount)}.`;
			insights.lowestSpendingMonth = `Your lowest spending was in ${lowestExpenseMonth.month}, with ${formatCurrency(
				lowestExpenseMonth.totalAmount,
			)}.`;
			insights.totalSpent = `You spent a total of ${formatCurrency(totalSpent)} over the selected months.`;
			insights.averageMonthlySpending = `Your average monthly spending was ${formatCurrency(averageSpent.toFixed(2))}.`;
		}
		return {
			status: 'SUCCESS',
			data: {
				comparisonChart,
				totalSpentChart,
				insights,
			},
		};
	} catch (error) {
		console.error('Error fetching monthly:', error);
		return {
			status: 'ERROR',
			error: 'Something went wrong.',
		};
	}
};
const getCompareExpenseExpenseDetail = async (userId, year, months) => {
	logger.info('Inside  getCompareExpenseExpenseDetail Service');
	try {
		const monthlyExpenses = await Promise.all(
			months.map(async (month) => {
				const { start, end } = getMonthRange(year, month);

				const expenses = await Expense.find({
					userId: new mongoose.Types.ObjectId(userId),
					date: { $gte: start, $lt: end },
				})
					.sort({ date: -1 })
					.exec();

				if (expenses.length === 0) {
					return {
						month: monthNames[month - 1],
						totalAmount: 0,
						categoryWiseExpenses: {},
						expensesEntries: [],
						chart: {
							labels: [],
							datasets: [
								{
									label: `Expenses in ${monthNames[month - 1]}`,
									data: [],
									backgroundColor: [],
									borderColor: [],
									fill: false,
								},
							],
						},
					};
				}

				const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

				const categoryWiseExpenses = expenses.reduce((acc, expense) => {
					acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
					return acc;
				}, {});

				const categories = Object.keys(categoryWiseExpenses);
				const data = categories.map((category) => categoryWiseExpenses[category]);
				const backgroundColor = categories.map((category, idx) => getBaseColor(idx));

				const chart = {
					labels: categories,
					datasets: [
						{
							label: `Expenses in ${monthNames[month - 1]}`,
							data,
							backgroundColor: backgroundColor,
							borderColor: backgroundColor,
							fill: false,
						},
					],
				};

				const expensesEntries = categories.map((category) => ({
					category,
					entries: expenses
						.filter((expense) => expense.category === category)
						.map((exp) => ({
							amount: exp.amount,
							description: exp.description,
							date: exp.date,
						})),
				}));

				return {
					month: monthNames[month - 1],
					totalAmount,
					// expenses: expensesEntries,
					expensesEntries: expenses,
					chart,
				};
			}),
		);

		return {
			status: 'SUCCESS',
			data: monthlyExpenses,
		};
	} catch (error) {
		console.error('Error fetching monthly:', error);
		return {
			status: 'ERROR',
			error: 'Something went wrong.',
		};
	}
};

const getExpenseCategoryTrend = async (userId, range, category, compareCategory) => {
	logger.info('Inside getExpenseCategoryTrend Service');
	try {
		const startDate = getStartDate(range);
		const primaryCategoryExpenses = await getExpensesByCategory(userId, category, startDate);
		let compareCategoryExpenses = [];
		if (compareCategory) {
			compareCategoryExpenses = await getExpensesByCategory(userId, compareCategory, startDate);
		}

		const labels = getMonthLabels(range);

		const primaryData = fillMissingData(labels, primaryCategoryExpenses);
		const compareData = compareCategory ? fillMissingData(labels, compareCategoryExpenses) : [];

		const primaryDataset = {
			label: category,
			data: primaryData,
			backgroundColor: '#fd7f6f',
			borderColor: '#fd7f6f',
			borderWidth: 4,
		};

		const compareDataset = compareCategory
			? {
					label: compareCategory,
					data: compareData,
					backgroundColor: '#7eb0d5',
					borderColor: '#7eb0d5',
					borderWidth: 4,
			  }
			: null;

		const insights = generateInsights(primaryData, compareData, labels, category, compareCategory);

		return {
			status: 'SUCCESS',
			data: {
				chart: { labels, datasets: compareDataset ? [primaryDataset, compareDataset] : [primaryDataset] },
				insights,
				primaryCategoryExpenses,
				compareCategoryExpenses,
			},
		};
	} catch (error) {
		console.error('Error fetching monthly:', error);
		return {
			status: 'ERROR',
			error: 'Something went wrong.',
		};
	}
};

const getTotalSpentTrend = async (userId, range) => {
	logger.info('Inside getTotalSpentTrend Service');
	try {
		const startDate = getStartDate(range);
		console.log({ startDate });

		const totalSpentData = await Expense.aggregate([
			{
				$match: {
					userId: new mongoose.Types.ObjectId(userId),
					date: { $gte: startDate },
				},
			},
			{
				$group: {
					_id: {
						$dateToString: { format: '%Y-%m', date: '$date' },
					},
					totalSpent: { $sum: '$amount' },
				},
			},
			{
				$sort: { _id: 1 },
			},
		]);

		const monthlyData = {};
		const currentDate = new Date();

		let monthsToInclude;
		switch (range) {
			case '2':
				monthsToInclude = 24;
				break;
			case '5':
				monthsToInclude = 60;
				break;
			case '9999':
				monthsToInclude = (currentDate.getFullYear() - 2020) * 12 + currentDate.getMonth() + 1;
				break;
			default:
				monthsToInclude = parseInt(range, 10);
				break;
		}

		for (let i = 0; i < monthsToInclude; i++) {
			const monthDate = new Date();
			monthDate.setMonth(currentDate.getMonth() - i);
			const monthKey = monthDate.toISOString().substring(0, 7);
			monthlyData[monthKey] = 0;
		}

		totalSpentData.forEach((item) => {
			monthlyData[item._id] = item.totalSpent;
		});

		const formattedTotalSpentData = {
			labels: Object.keys(monthlyData).reverse().map(formatMonthYear),
			datasets: [
				{
					label: 'Total Spent',
					data: Object.values(monthlyData).reverse(),
					backgroundColor: '#fd7f6f',
					borderColor: '#fd7f6f',
					borderWidth: 4,
				},
			],
		};

		const totalSpent = Object.values(monthlyData).reduce((acc, curr) => acc + curr, 0);
		const numberOfMonths = Object.keys(monthlyData).length;
		const averageSpent = numberOfMonths ? (totalSpent / numberOfMonths).toFixed(2) : 0;

		let spendingTrend = 'No spending recorded in this period.';
		if (numberOfMonths > 1) {
			const lastMonthSpent = monthlyData[Object.keys(monthlyData).reverse()[0]];
			const firstMonthSpent = monthlyData[Object.keys(monthlyData).reverse()[numberOfMonths - 1]];
			spendingTrend =
				lastMonthSpent > firstMonthSpent
					? 'Your spending has increased over the selected period.'
					: 'Your spending has decreased over the selected period.';
		}

		const categoryBreakdown = await Expense.aggregate([
			{
				$match: {
					userId: new mongoose.Types.ObjectId(userId),
					date: { $gte: startDate },
				},
			},
			{
				$group: {
					_id: '$category',
					totalSpent: { $sum: '$amount' },
				},
			},
			{
				$sort: { totalSpent: -1 },
			},
			{
				$limit: 3,
			},
		]);

		const topCategories = categoryBreakdown.map((cat) => ({
			category: cat._id,
			totalSpent: cat.totalSpent,
		}));

		const insights = {
			totalSpent,
			averageSpent,
			numberOfMonths,
			spendingTrend,
			topCategories,
			comparison: `You spent a total of ${formatCurrency(totalSpent)} during this period, averaging ${formatCurrency(averageSpent)} per month.`,
			suggestions: `Consider reducing your spending in the top categories to save more!.`,
		};

		return {
			status: 'SUCCESS',
			data: {
				chart: formattedTotalSpentData,
				insights,
			},
		};
	} catch (error) {
		console.error('Error fetching monthly:', error);
		return {
			status: 'ERROR',
			error: 'Something went wrong.',
		};
	}
};

const getExpensesByCategory = async (userId, category, startDate) => {
	return await Expense.aggregate([
		{ $match: { userId: new mongoose.Types.ObjectId(userId), category, date: { $gte: startDate } } },
		{
			$group: {
				_id: { month: { $month: '$date' }, year: { $year: '$date' } },
				totalAmount: { $sum: '$amount' },
				count: { $sum: 1 },
			},
		},
		{ $sort: { '_id.year': 1, '_id.month': 1 } },
	]);
};

const getPaginatedExpenses = async (userId, page = 1, limit = 10, year, month) => {
	logger.info('Inside getPaginatedExpenses Service');
	try {
		const startDate = new Date(Date.UTC(year, month - 1, 1));
		const endDate = new Date(Date.UTC(year, month, 1));

		// Fetch expenses for the user based on the month and year
		const expenses = await Expense.find({
			userId: new mongoose.Types.ObjectId(userId),
			date: {
				$gte: startDate,
				$lt: endDate,
			},
		})
			.skip((page - 1) * limit) // Skip records for pagination
			.limit(limit) // Limit the number of records returned
			.sort({ date: -1 }); // Sort by date descending

		// Count total number of expenses for the user in the specified month and year
		const totalExpenses = await Expense.countDocuments({
			userId: new mongoose.Types.ObjectId(userId),
			date: {
				$gte: startDate,
				$lt: endDate,
			},
		});
		return {
			status: 'SUCCESS',
			data: {
				total: totalExpenses,
				page,
				limit,
				expenses,
			},
		};
	} catch (error) {
		console.error('Error fetching monthly paginated expenses:', error);
		return {
			status: 'ERROR',
			error: 'Something went wrong while fetching monthly paginated expenses.',
		};
	}
};

export {
	addExpense,
	getExpensesByUserId,
	getMonthChart,
	getMonthlyInsights,
	updateExpense,
	deleteExpense,
	getCompareExpense,
	getExpenseCategoryTrend,
	getTotalSpentTrend,
	getCompareExpenseExpenseDetail,
	getPaginatedExpenses,
};
