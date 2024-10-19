import { useEffect, useState } from 'react';
import { axiosPrivate } from '../services/axios.service';

export const useExpense = (selectedYear, selectedMonth, selectedMonth2, isCompareDisabled) => {
	const [comparisonData, setComparisonData] = useState(null);
	const [totalSpentData, setTotalSpentData] = useState(null);
	const [monthlyExpense, setMonthlyExpense] = useState([]);
	const [insights, setInsights] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!isCompareDisabled) {
			fetchData();
		}
	}, [selectedYear, selectedMonth, selectedMonth2]);

	const fetchData = async () => {
		setLoading(true);
		try {
			const { data } = await axiosPrivate.post('/expense/monthly-compare-expenses', {
				year: selectedYear,
				months: [selectedMonth, selectedMonth2],
			});
			const { data: monthlyExpenseDetails } = await axiosPrivate.post('/expense/monthly-expense-details', {
				year: selectedYear,
				months: [selectedMonth, selectedMonth2],
			});

			setMonthlyExpense(monthlyExpenseDetails.data);
			const { comparisonChart, totalSpentChart, insights } = data.data;
			setComparisonData(comparisonChart);
			setTotalSpentData(totalSpentChart);
			setInsights(insights);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return { comparisonData, totalSpentData, monthlyExpense, insights, loading };
};

export default useExpense;
