export const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const timeRange = [1, 3, 6, 12, 2, 5, 9999];

export const timeRangeNames = [
	{
		value: 1,
		name: 'Past 1 month',
	},
	{
		value: 3,
		name: 'Past 3 months',
	},
	{
		value: 6,
		name: 'Past 6 months',
	},
	{
		value: 12,
		name: 'Past 12 months',
	},
	{
		value: 2,
		name: 'Past 2 years',
	},
	{
		value: 5,
		name: 'Past 5 years',
	},
	{
		value: 9999,
		name: '2020 - present',
	},
];

export const trendOptions = [
	{ value: 'category', label: 'Category' },
	{ value: 'totalSpent', label: 'Total spent' },
];
