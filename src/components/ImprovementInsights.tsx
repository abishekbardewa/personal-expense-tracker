import EmptyState from './common/EmptyState';
import { useExpenseContext } from './context/ExpenseProvider';

const ImprovementInsights: React.FC = () => {
	const { overallImprovement } = useExpenseContext();

	return (
		<>
			{overallImprovement && overallImprovement.length > 0 ? (
				<ul role="list" className="h-[400px] overflow-y-auto scrollbar-hidden">
					{overallImprovement.map((ele, idx) => (
						<li key={`${ele}-${idx}`} className="flex justify-between gap-x-6 pb-3">
							<div className="flex min-w-0 gap-x-4">
								<div className="min-w-0 flex-auto">
									{/* <p className="text-md font-semibold  text-gray-900">{ele.category}</p> */}

									<p className="mt-1 text-sm  text-gray-500">{ele}</p>
								</div>
							</div>
						</li>
					))}
				</ul>
			) : (
				<EmptyState title="No Areas for Improvement" subtitle="You're on track!" />
			)}
		</>
	);
};
export default ImprovementInsights;
