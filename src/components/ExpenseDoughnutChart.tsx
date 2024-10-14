import { useEffect, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';

import 'chart.js/auto';
import { useExpenseContext } from './context/ExpenseProvider';
import EmptyState from './common/EmptyState';
const ExpenseDoughnutChart: React.FC<any> = () => {
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
			<div className="h-[500px] p-6 bg-white rounded-[16px]">
				{chartData && chartData.labels.length > 0 ? (
					<Doughnut
						ref={chartRef}
						data={chartData}
						options={{
							responsive: true,
							maintainAspectRatio: false,
							plugins: {
								legend: {
									position: 'right',
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

export default ExpenseDoughnutChart;
