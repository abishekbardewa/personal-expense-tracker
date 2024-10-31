export const predefinedCategories = [{ name: 'Groceries' }, { name: 'Fruits & Vegetables' }];
export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const baseColors = [
	'#fd7f6f',
	'#7eb0d5',
	'#b2e061',
	'#bd7ebe',
	'#ffb55a',
	'#ffee65',
	'#beb9db',
	'#fdcce5',
	'#8bd3c7',
	'#ea5545',
	'#f46a9b',
	'#ef9b20',
	'#edbf33',
	'#ede15b',
	'#bdcf32',
	'#87bc45',
	'#27aeef',
	'#b33dc6',
];

export const getBaseColor = (index) => {
	return baseColors[index % baseColors.length];
};

export const getMonthYear = (date) => {
	const month = date.getMonth();
	const year = date.getFullYear();
	return { month, year };
};
export const getMonthRange = (year, month) => {
	const start = new Date(Date.UTC(year, month - 1, 1));
	const end = new Date(Date.UTC(year, month, 1));
	return { start, end };
};
export const getStartDate = (range) => {
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

export const getMonthLabels = (range) => {
	const currentDate = new Date();
	let labels = new Set();

	switch (range) {
		case '1':
		case '3':
		case '6':
		case '12':
			for (let i = range; i >= 0; i--) {
				const date = new Date(currentDate);
				date.setMonth(date.getMonth() - i);
				labels.add(`${monthNames[date.getMonth()]} ${date.getFullYear()}`);
			}
			break;
		case '2':
			for (let i = 23; i >= 0; i -= 2) {
				const date = new Date(currentDate);
				date.setMonth(date.getMonth() - i);
				labels.add(`${monthNames[date.getMonth()]} ${date.getFullYear()}`);
			}
			break;
		case '5':
			for (let i = 59; i >= 0; i--) {
				const date = new Date(currentDate);
				date.setMonth(date.getMonth() - i);
				labels.add(`${monthNames[date.getMonth()]} ${date.getFullYear()}`);
			}
			break;
		case '9999':
			const startYear = 2020;
			const currentYear = currentDate.getFullYear();
			for (let year = startYear; year <= currentYear; year++) {
				for (let month = 0; month < 12; month++) {
					if (year === currentYear && month > currentDate.getMonth()) break;
					labels.add(`${monthNames[month]} ${year}`);
				}
			}
			break;
		default:
			labels = [];
	}

	return Array.from(labels);
};

export const formatCurrency = (amount) => {
	return `₹ ${amount.toLocaleString('en-IN')}`;
};

export const formatMonthYear = (date) => {
	const options = { year: '2-digit', month: 'short' };
	return new Date(date).toLocaleDateString('en-GB', options);
};

export const fillMissingData = (labels, data) => {
	const dataMap = data.reduce((acc, item) => {
		const label = `${monthNames[item._id.month - 1]} ${item._id.year}`;
		acc[label] = item.totalAmount;
		return acc;
	}, {});

	return labels.map((label) => dataMap[label] || 0);
};

export const generateInsights = (primaryData, compareData, labels, category, compareCategory) => {
	let insights = [];
	let totalPrimary = primaryData.reduce((sum, amount) => sum + amount, 0);
	let totalCompare = compareData.reduce((sum, amount) => sum + amount, 0);

	insights.push(`Total spent on ${category}: ${formatCurrency(totalPrimary)}.`);
	if (compareCategory) {
		insights.push(`Total spent on ${compareCategory}: ${formatCurrency(totalCompare)}.`);
		if (totalPrimary > totalCompare) {
			insights.push(`You spent more on ${category} compared to ${compareCategory}.`);
		} else if (totalPrimary < totalCompare) {
			insights.push(`You spent less on ${category} compared to ${compareCategory}.`);
		} else {
			insights.push(`Spending on ${category} and ${compareCategory} was equal.`);
		}
	}

	for (let i = 1; i < primaryData.length; i++) {
		if (primaryData[i] > primaryData[i - 1]) {
			insights.push(`In ${labels[i]}, expenses increased compared to ${labels[i - 1]}.`);
		} else if (primaryData[i] < primaryData[i - 1]) {
			insights.push(`In ${labels[i]}, expenses decreased compared to ${labels[i - 1]}.`);
		}
	}

	return insights;
};
