import logger from '../../config/logger.js';
import message from '../../config/message.js';
import Users from '../../models/usersModel.js';
import Expense from '../../models/expenseModal.js';
import mongoose from 'mongoose';
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
			error: message.SOMETHING_WENT_WRONG, // Customize your error message
		};
	}
};

const getExpensesByUserId = async (userId, year, month) => {
	try {
		// Set start and end dates for the specified month
		const startDate = new Date(Date.UTC(year, month - 1, 1)); // Start of the month
		const endDate = new Date(Date.UTC(year, month, 1)); // Start of the next month

		// Step 1: Fetch user's categories from the User schema
		const user = await Users.findById(userId).select('categories');
		const userCategories = user.categories || [];

		// Step 2: Fetch expenses for the specified userId and month, already sorted by createdAt
		const expenses = await Expense.find({
			userId,
			date: { $gte: startDate, $lt: endDate },
		}).sort({ createdAt: -1 }); // Sort by creation date (newest first)

		// Step 3: Calculate total spent for the month
		const totalSpent = expenses.reduce((total, expense) => total + expense.amount, 0);

		// Step 4: Combine expenses with categories and ensure each category's expenses are sorted by createdAt
		const categoryExpenses = userCategories.map((category) => {
			// Filter expenses by category and keep the same order from the 'expenses' array
			const categoryExpensesData = expenses.filter((expense) => expense.category === category.name);

			// Calculate total amount spent for the current category
			const categoryTotal = categoryExpensesData.reduce((sum, expense) => sum + expense.amount, 0);

			// Collect sorted dates for each expense in this category
			const spentDates = categoryExpensesData.map((expense) => expense.date);
			const latestCreatedAt = categoryExpensesData.length ? categoryExpensesData[0].createdAt : null;

			return {
				category,
				totalAmount: categoryTotal || 0, // If no expenses, set total to 0
				spentDates: spentDates.length ? spentDates : [], // Dates when expenses were made, sorted by creation date
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
				return 0; // If no expenses in both categories, keep the original order
			}
		});
		return {
			status: 'SUCCESS',
			data: {
				categoryExpenses, // Total expenses for each category
				totalSpent, // Total spent for the month
				expenses, // List of expenses already sorted by creation date
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

const getYearlyMonthlyChart = async (userId, year, month) => {
	logger.info('Inside getYearlyMonthlyChart Service');
	try {
		const startDate = new Date(Date.UTC(year, month - 1, 1)); // Start of the month in UTC
		const endDate = new Date(Date.UTC(year, month, 1)); // Start of the next month in UTC

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

		const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		// Set the label for the month
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

		// Prepare labels and dataset for response
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
						fill: false, // For line charts
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

const getYearlyChart = async (userId, year) => {
	logger.info('Inside getYearlyChart Service');
	try {
		const startDate = new Date(year, 0, 1); // January 1st of the given year
		const endDate = new Date(year + 1, 0, 1);

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
					label: '$_id',
					totalSpent: 1,
				},
			},
		]);

		if (result.length === 0) {
			return {
				status: 'SUCCESS',
				data: {
					labels: [],
					datasets: [
						{
							label: `Expenses in ${year}`,
							data: [],
							backgroundColor: [],
							borderColor: [],
						},
					],
				},
			};
		}

		// Prepare labels and dataset for response
		const labels = result.map((item) => item.label);
		const data = result.map((item) => item.totalSpent);
		const backgroundColor = labels.map((_, index) => getBaseColor(index));

		return {
			status: 'SUCCESS',
			data: {
				labels,
				datasets: [
					{
						label: `Expenses in ${year}`,
						data,
						backgroundColor,
						borderColor: backgroundColor,
						fill: false, // For line charts
					},
				],
			},
		};
	} catch (error) {
		console.error('Error fetching yearly expenses by category:', error);
		return {
			status: 'ERROR',
			error: 'Something went wrong while fetching yearly expenses.',
		};
	}
};

const getMonthlyChart = async (userId) => {
	logger.info('Inside  getMonthlyChart Service');
	try {
		// Fetch all expenses for the user
		const userExpenses = await Expense.find({ userId });

		// Process the expenses to calculate monthly totals by category
		const monthlyCategoryTotals = userExpenses.reduce((acc, expense) => {
			const month = new Date(expense.date).toISOString().slice(0, 7); // Format YYYY-MM
			if (!acc[month]) {
				acc[month] = {};
			}
			if (!acc[month][expense.category]) {
				acc[month][expense.category] = 0;
			}
			acc[month][expense.category] += expense.amount; // Sum the amounts by category
			return acc;
		}, {});

		// Convert the monthly category totals object to a structured array
		const result = Object.entries(monthlyCategoryTotals).map(([month, categories]) => ({
			month,
			categories: Object.entries(categories).map(([category, total]) => ({
				category,
				total,
			})),
		}));

		return {
			status: 'SUCCESS',
			data: result,
		};
	} catch (error) {
		console.error('Error fetching monthly expenses by category:', error);
		return {
			status: 'ERROR',
			error: 'Something went wrong while fetching monthly expenses by category.',
		};
	}
};
const getYearlyExpenseComparison = async (userId, years) => {
	logger.info('Inside  getYearlyExpenseComparison Service');
	try {
		// Prepare to store results
		const yearlyExpenses = {};

		// Loop through each year to get expenses
		for (const year of years) {
			const startDate = new Date(`${year}-01-01`);
			const endDate = new Date(`${year + 1}-01-01`);

			const result = await Expense.aggregate([
				{
					$match: { userId: new mongoose.Types.ObjectId(userId), date: { $gte: startDate, $lt: endDate } },
				},
				{
					$group: { _id: { category: '$category' }, totalSpent: { $sum: '$amount' } },
				},
			]);

			// Store results by year
			yearlyExpenses[year] = result.reduce((acc, curr) => {
				acc[curr._id.category] = curr.totalSpent;
				return acc;
			}, {});
		}

		// Prepare labels and datasets for response
		const categories = new Set();
		const datasets = [];

		Object.keys(yearlyExpenses).forEach((year, index) => {
			const dataset = {
				label: `Expenses in ${year}`,
				data: [],
				backgroundColor: getBaseColor(index), // Use base color for background
				borderColor: getBaseColor(index), // Use base color for border
				fill: false, // For line charts, set fill to false
				gradient: false,
			};
			Object.entries(yearlyExpenses[year]).forEach(([category, total]) => {
				categories.add(category);
				dataset.data.push(total);
			});
			datasets.push(dataset);
		});

		// Convert categories Set to an array
		const labels = Array.from(categories);

		// Fill datasets with zeros for categories not present in certain years
		datasets.forEach((dataset) => {
			const year = dataset.label.split(' ')[2]; // Extract year
			const data = [];
			labels.forEach((label) => {
				data.push(yearlyExpenses[year][label] || 0);
			});
			dataset.data = data;
		});

		return {
			status: 'SUCCESS',
			data: {
				labels: labels,
				datasets: datasets,
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
const getInsights = async (userId) => {
	logger.info('Inside  getInsights Service');
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

			// Initialize monthly insights for the category
			const monthIndex = monthlyInsights.findIndex((insight) => insight.category === category && insight.year === year);
			if (monthIndex === -1) {
				monthlyInsights.push({
					category: category,
					year: year,
					months: Array(12).fill(0), // Initialize months to zero
					messages: [], // Array to hold messages for each category
				});
			}

			monthlyInsights.find((insight) => insight.category === category && insight.year === year).months[month] += expense.amount;
		});

		// Calculate insights for the current month compared to previous months
		const currentMonthInsights = [];

		monthlyInsights.forEach((insight) => {
			const category = insight.category;
			const currentMonth = currentDate.getMonth();

			const currentMonthAmount = insight.months[currentMonth] || 0;

			// Calculate previous month amount
			const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Handle year transition
			const previousMonthAmount = insight.months[previousMonth] || 0;

			// Check if any previous month has a value
			const hasPreviousData = insight.months.some((amount, index) => index !== currentMonth && amount > 0);

			// Update the message logic
			const message =
				currentMonthAmount > 0 && previousMonthAmount === 0 && !hasPreviousData
					? `This is your first time spending on ${category}. You spent ₹${currentMonthAmount} this month. Keep tracking your expenses to see how this category develops!`
					: currentMonthAmount > previousMonthAmount
					? `You spent ₹${
							currentMonthAmount - previousMonthAmount
					  } more on ${category} compared to last month. Consider reviewing this category to manage your budget better.`
					: currentMonthAmount < previousMonthAmount
					? `You spent ₹${previousMonthAmount - currentMonthAmount} less on ${category} compared to last month. Great job on saving money!`
					: `Your spending on ${category} has remained the same compared to last month.`;

			currentMonthInsights.push({
				category: category,
				currentMonthAmount,
				previousMonthAmount,
				message,
			});

			// Add to overall improvement or warnings
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

export {
	addExpense,
	getExpensesByUserId,
	getMonthlyChart,
	getYearlyMonthlyChart,
	getYearlyChart,
	getYearlyExpenseComparison,
	getInsights,
	updateExpense,
	deleteExpense,
};

// Define a set of base colors
const baseColors = [
	'#06C',
	'#470000',
	'#7CC674',
	'#8481DD',
	'#8BC1F7',
	'#F9E0A2',
	'#F0AB00',
	'#6A6E73',
	'#009596',
	'#8F4700',
	'#A2D9D9',
	'#C9190B',
	'#23511E',
	'#EC7A08',
	'#B8BBBE',
	'#2A265F',
];

const getBaseColor = (index) => {
	return baseColors[index % baseColors.length]; // Loop through base colors
};

const getMonthYear = (date) => {
	const month = date.getMonth(); // 0-indexed
	const year = date.getFullYear();
	return { month, year };
};
