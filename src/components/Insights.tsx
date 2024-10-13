import EmptyState from './common/EmptyState';
import { useExpenseContext } from './context/ExpenseProvider';

const Insights: React.FC = () => {
	const { monthlyInsights, overallImprovement, overallWarnings } = useExpenseContext();
	return (
		<div>
			<h2 className="text-2xl font-semibold leading-6 text-gray-900 mb-5">Key Insights</h2>
			{monthlyInsights && monthlyInsights.length > 0 ? (
				<ul role="list" className="h-96 md:h-[500px] overflow-y-auto scrollbar-hidden">
					{monthlyInsights.map((ele, idx) => (
						<li key={`${ele}-${idx}`} className="flex justify-between gap-x-6 pb-3">
							<div className="flex min-w-0 gap-x-4">
								<div className="min-w-0 flex-auto">
									<p className="text-sm font-semibold leading-6 text-gray-900">{ele.category}</p>

									<p className="mt-1 text-xs leading-5 text-gray-500">{ele.message}</p>
								</div>
							</div>
						</li>
					))}
				</ul>
			) : (
				<EmptyState title="No expenses logged yet." subtitle="Begin tracking your spending to enhance your financial understanding." />
			)}
		</div>
	);
};
export default Insights;
