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

const getCompareExpenseChart = async (userId) => {
	logger.info('Inside  getCompareExpenseChart Service');
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

		// Prepare comparisonChart and totalSpentChart
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

		// Prepare insights
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
		// Fetch expenses for both months
		const monthlyExpenses = await Promise.all(
			months.map(async (month) => {
				const { start, end } = getMonthRange(year, month);

				// Find all expenses for the given month
				const expenses = await Expense.find({
					userId: new mongoose.Types.ObjectId(userId),
					date: { $gte: start, $lt: end },
				}).exec();

				if (expenses.length === 0) {
					// If no expenses, return empty structure
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

				// Total amount spent in the month
				const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

				// Group expenses by category for the chart and entries
				const categoryWiseExpenses = expenses.reduce((acc, expense) => {
					acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
					return acc;
				}, {});

				// Prepare category labels and data for the chart
				const categories = Object.keys(categoryWiseExpenses);
				const data = categories.map((category) => categoryWiseExpenses[category]);
				const backgroundColor = categories.map((category, idx) => getBaseColor(idx));

				// Prepare chart data
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

				// Prepare expense entries for the table, grouped by category
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
					// categoryWiseExpenses,
					expensesEntries,
					chart,
				};
			}),
		);

		// Prepare the response with monthlyExpenseChart and monthlyExpenseEntries

		const monthlyExpenseChart = monthlyExpenses.map((monthlyData) => ({
			month: monthlyData.month,
			chart: monthlyData.chart,
		}));

		const monthlyExpenseEntries = monthlyExpenses.map((monthlyData) => ({
			month: monthlyData.month,
			entries: monthlyData.expensesEntries,
		}));

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

		console.log(category, compareCategory);

		const primaryCategoryExpenses = await getExpensesByCategory(userId, category, startDate);
		let compareCategoryExpenses = [];
		if (compareCategory) {
			compareCategoryExpenses = await getExpensesByCategory(userId, compareCategory, startDate);
		}
		// Generate labels based on range (5 years or 2015-present)
		const labels = getMonthLabels(range);

		// Fill in data for both primary and comparison datasets
		const primaryData = fillMissingData(labels, primaryCategoryExpenses);
		const compareData = compareCategory ? fillMissingData(labels, compareCategoryExpenses) : [];

		const primaryDataset = {
			label: category,
			data: primaryData,
			backgroundColor: '#fd7f6f',
			borderColor: '#fd7f6f',
			borderWidth: 2,
		};

		const compareDataset = compareCategory
			? {
					label: compareCategory,
					data: compareData,
					backgroundColor: '#7eb0d5',
					borderColor: '#7eb0d5',
					borderWidth: 2,
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
						$dateToString: { format: '%Y-%m', date: '$date' }, // Group by year-month
					},
					totalSpent: { $sum: '$amount' },
				},
			},
			{
				$sort: { _id: 1 },
			},
		]);

		// Prepare a map of months to hold the total spent data
		const monthlyData = {};
		const currentDate = new Date();

		// Determine the number of months to include based on the selected range
		let monthsToInclude;
		switch (range) {
			case '2':
				monthsToInclude = 24; // 24 months for 2 years
				break;
			case '5':
				monthsToInclude = 60; // 60 months for 5 years
				break;
			case '9999':
				monthsToInclude = (currentDate.getFullYear() - 2020) * 12 + currentDate.getMonth() + 1;
				break;
			default:
				monthsToInclude = parseInt(range, 10);
				break;
		}

		// Initialize all months to 0
		for (let i = 0; i < monthsToInclude; i++) {
			const monthDate = new Date();
			monthDate.setMonth(currentDate.getMonth() - i);
			const monthKey = monthDate.toISOString().substring(0, 7); // Get 'YYYY-MM'
			monthlyData[monthKey] = 0; // Initialize with 0
		}

		// Populate the monthlyData with actual spending values
		totalSpentData.forEach((item) => {
			monthlyData[item._id] = item.totalSpent;
		});

		// Convert the data into the desired format
		const formattedTotalSpentData = {
			labels: Object.keys(monthlyData).reverse().map(formatMonthYear), // Format and reverse the order
			datasets: [
				{
					label: 'Total Spent',
					data: Object.values(monthlyData).reverse(), // Reverse to match labels
					backgroundColor: '#fd7f6f',
					borderColor: '#fd7f6f',
					borderWidth: 2,
				},
			],
		};

		// Calculate insights
		const totalSpent = Object.values(monthlyData).reduce((acc, curr) => acc + curr, 0);
		const numberOfEntries = Object.keys(monthlyData).length; // Count all months
		const averageSpent = numberOfEntries ? (totalSpent / numberOfEntries).toFixed(2) : 0;

		// Determine spending trend
		let spendingTrend = 'No spending recorded in this period.';
		if (numberOfEntries > 1) {
			const lastMonthSpent = monthlyData[Object.keys(monthlyData).reverse()[0]];
			const firstMonthSpent = monthlyData[Object.keys(monthlyData).reverse()[numberOfEntries - 1]];
			spendingTrend =
				lastMonthSpent > firstMonthSpent
					? 'Your spending has increased over the selected period.'
					: 'Your spending has decreased over the selected period.';
		}

		// Get category breakdown for insights
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
				$limit: 3, // Top 3 categories
			},
		]);

		const topCategories = categoryBreakdown.map((cat) => ({
			category: cat._id,
			totalSpent: cat.totalSpent,
		}));

		// Compile insights
		const insights = {
			totalSpent,
			averageSpent,
			numberOfEntries,
			spendingTrend,
			topCategories,
			comparison: `You spent a total of ${formatCurrency(totalSpent)} during this period, averaging ${formatCurrency(averageSpent)} per month.`,
			suggestions: `Consider reducing your spending in the top categories to save more!`,
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

const formatCurrency = (amount) => {
	return `₹ ${amount.toLocaleString('en-IN')}`;
};

const formatMonthYear = (date) => {
	const options = { year: '2-digit', month: 'short' };
	return new Date(date).toLocaleDateString('en-GB', options);
};

const fillMissingData = (labels, data) => {
	const dataMap = data.reduce((acc, item) => {
		const label = `${monthNames[item._id.month - 1]} ${item._id.year}`; // "October 2020", etc.
		acc[label] = item.totalAmount; // Store totalAmount in a map
		return acc;
	}, {});

	return labels.map((label) => dataMap[label] || 0); // Return 0 if no data exists for the label
};

// Insights generation function
const generateInsights = (primaryData, compareData, labels, category, compareCategory) => {
	let insights = [];
	let totalPrimary = primaryData.reduce((sum, amount) => sum + amount, 0);
	let totalCompare = compareData.reduce((sum, amount) => sum + amount, 0);

	insights.push(`Total spent on ${category}: ${formatCurrency(totalPrimary)}`);
	if (compareCategory) {
		insights.push(`Total spent on ${compareCategory}: ${formatCurrency(totalCompare)}`);
		if (totalPrimary > totalCompare) {
			insights.push(`You spent more on ${category} compared to ${compareCategory}`);
		} else if (totalPrimary < totalCompare) {
			insights.push(`You spent less on ${category} compared to ${compareCategory}`);
		} else {
			insights.push(`Spending on ${category} and ${compareCategory} was equal`);
		}
	}

	// Monthly trend insights
	for (let i = 1; i < primaryData.length; i++) {
		if (primaryData[i] > primaryData[i - 1]) {
			insights.push(`In ${labels[i]}, expenses increased compared to ${labels[i - 1]}`);
		} else if (primaryData[i] < primaryData[i - 1]) {
			insights.push(`In ${labels[i]}, expenses decreased compared to ${labels[i - 1]}`);
		}
	}

	return insights;
};

export {
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
};

const getMonthLabels = (range) => {
	const currentDate = new Date();
	let labels = new Set();
	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	switch (range) {
		case '1':
		case '3':
		case '6':
		case '12':
			// Monthly ranges (no changes)
			for (let i = range; i >= 0; i--) {
				const date = new Date(currentDate);
				date.setMonth(date.getMonth() - i);
				labels.add(`${monthNames[date.getMonth()]} ${date.getFullYear()}`);
			}
			break;
		case '2': // Past 2 years (bi-monthly)
			for (let i = 23; i >= 0; i -= 2) {
				// bi-monthly
				const date = new Date(currentDate);
				date.setMonth(date.getMonth() - i);
				labels.add(`${monthNames[date.getMonth()]} ${date.getFullYear()}`);
			}
			break;
		case '5': // Past 5 years (monthly for each year)
			for (let i = 59; i >= 0; i--) {
				// 12 months * 5 years
				const date = new Date(currentDate);
				date.setMonth(date.getMonth() - i);
				labels.add(`${monthNames[date.getMonth()]} ${date.getFullYear()}`);
			}
			break;
		case '9999': // 2015 - present (monthly for each year)
			const startYear = 2020;
			const currentYear = currentDate.getFullYear();
			for (let year = startYear; year <= currentYear; year++) {
				for (let month = 0; month < 12; month++) {
					if (year === currentYear && month > currentDate.getMonth()) break; // Don't include future months
					labels.add(`${monthNames[month]} ${year}`);
				}
			}
			break;
		default:
			labels = [];
	}

	return Array.from(labels);
};

// Helper function to fetch expenses by category
const getExpensesByCategory = async (userId, category, startDate) => {
	return await Expense.aggregate([
		{ $match: { userId: new mongoose.Types.ObjectId(userId), category, date: { $gte: startDate } } },
		{
			$group: {
				_id: { month: { $month: '$date' }, year: { $year: '$date' } }, // Group by month and year
				totalAmount: { $sum: '$amount' },
				count: { $sum: 1 },
			},
		},
		{ $sort: { '_id.year': 1, '_id.month': 1 } },
	]);
};

const getStartDate = (range) => {
	const currentDate = new Date();

	switch (range) {
		case '1':
			return new Date(currentDate.setMonth(currentDate.getMonth() - 2));
		case '3':
			return new Date(currentDate.setMonth(currentDate.getMonth() - 3));
		case '6':
			return new Date(currentDate.setMonth(currentDate.getMonth() - 6));
		case '12':
			return new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
		case '2':
			return new Date(currentDate.setFullYear(currentDate.getFullYear() - 2));
		case '5':
			return new Date(currentDate.setFullYear(currentDate.getFullYear() - 5));
		case '9999':
			return new Date(2020, 0, 1);
		default:
			return new Date(0);
	}
};

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Define a set of base colors
const baseColors = ['#fd7f6f', '#7eb0d5', '#b2e061', '#bd7ebe', '#ffb55a', '#ffee65', '#beb9db', '#fdcce5', '#8bd3c7'];

const getBaseColor = (index) => {
	return baseColors[index % baseColors.length]; // Loop through base colors
};

const getMonthYear = (date) => {
	const month = date.getMonth(); // 0-indexed
	const year = date.getFullYear();
	return { month, year };
};
const getMonthRange = (year, month) => {
	const start = new Date(year, month - 1, 1);
	const end = new Date(year, month, 0);
	return { start, end };
};
