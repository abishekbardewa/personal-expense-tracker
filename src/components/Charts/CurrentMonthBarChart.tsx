import { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { useExpenseContext } from '../context/ExpenseProvider';
import EmptyState from '../common/EmptyState';
import 'chart.js/auto';
const CurrentMonthBarChart: React.FC<any> = () => {
	const chartRef = useRef<any>();
	const { chartData } = useExpenseContext();

	useEffect(() => {
		if (chartRef.current) {
			const chartInstance = chartRef.current.chartInstance;
			if (chartInstance) {
				chartInstance.destroy();
			}
		}
	}, [chartData]);

	return (
		<div>
			<h2 className="text-2xl font-semibold leading-6 text-gray-900 mb-5">Spending Trends</h2>
			<div className="h-[500px] w-full p-6 bg-white rounded-[16px]">
				{chartData && chartData.labels.length > 0 ? (
					<Bar
						ref={chartRef}
						data={chartData}
						options={{
							responsive: true,
							maintainAspectRatio: false,
							scales: {
								y: {
									beginAtZero: true,
									title: {
										display: true,
										text: 'Total Amount Spent',
									},
								},
							},
						}}
						style={{ height: '100%', width: '100%' }}
					/>
				) : (
					<EmptyState title="No insights available." subtitle="Add your expenses to visualize your spending patterns and trends." />
				)}
			</div>
		</div>
	);
};

export default CurrentMonthBarChart;
