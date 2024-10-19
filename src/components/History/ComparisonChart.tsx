import { Bar } from 'react-chartjs-2';
import EmptyState from '../common/EmptyState';

const ComparisonChart: React.FC<{ data: any }> = ({ data }) => (
	<div className="h-[500px] p-6 bg-white rounded-[16px]">
		{data?.labels.length > 0 ? (
			<Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />
		) : (
			<EmptyState title="No insights available." subtitle="Add your expenses to visualize your spending patterns and trends." />
		)}
	</div>
);

export default ComparisonChart;
