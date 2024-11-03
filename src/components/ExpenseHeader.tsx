import { LuLoader2 } from 'react-icons/lu';
import { formatCurrency } from '../utils';
import { useExpenseContext } from './context/ExpenseProvider';

const ExpenseHeader: React.FC = () => {
	const { loading, totalAmount, totalAmountToday, newCategory, topSpentCategory, LowestSpentCategory, mostFrequent, leastFrequent } =
		useExpenseContext();
	const currentDate = new Date().toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
	});
	const monthName = new Date().toLocaleString('default', { month: 'long' });
	// className = ' flex  items-center justify-center gap-8';
	return (
		<div>
			{loading ? (
				<LuLoader2 className="w-6 h-6 text-primary animate-spin" />
			) : (
				<>
					<div>
						<div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2 ">
							<div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
								<dt className="truncate text-sm font-medium text-gray-500">Total spent in {monthName}</dt>
								<dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{formatCurrency(totalAmount)}</dd>
							</div>
							<div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
								<dt className="truncate text-sm font-medium text-gray-500">Total spent today</dt>
								<dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{formatCurrency(totalAmountToday)}</dd>
							</div>
						</div>

						{/* <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
								<dt className="mb-1 text-sm font-medium text-gray-500">New categories</dt>
								{newCategory.length > 0 ? (
									newCategory.map((category, index) => (
										<dd className=" text-lg font-semibold tracking-tight text-gray-900" key={index}>
											{category}
										</dd>
									))
								) : (
									<dd className="text-lg font-semibold tracking-tight text-gray-900">No data available</dd>
								)}
							</div> */}
					</div>

					<ul role="list" className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
						<li className="col-span-1 flex rounded-md shadow-sm ">
							<div className="flex flex-1 items-start justify-between truncate rounded-md border border-gray-200 bg-white">
								<div className="flex-1 truncate px-4 py-2 text-sm">
									<h2 className="mb-1 text-sm font-medium text-gray-500">Highest spent</h2>
									{topSpentCategory.length > 0 ? (
										topSpentCategory.map((category, index) => (
											<p className="text-gray-500" key={index}>
												{category}
											</p>
										))
									) : (
										<p className="mt-1 text-gray-500">No data available</p>
									)}
								</div>
							</div>
						</li>
						<li className="col-span-1 flex rounded-md shadow-sm ">
							<div className="flex flex-1 items-start justify-between truncate rounded-md border border-gray-200 bg-white">
								<div className="flex-1 truncate px-4 py-2 text-sm">
									<h2 className="mb-1 text-sm font-medium text-gray-500">Lowest spent</h2>
									{LowestSpentCategory.length > 0 ? (
										LowestSpentCategory.map((category, index) => (
											<p className="text-gray-500" key={index}>
												{category}
											</p>
										))
									) : (
										<p className="text-gray-500">No data available</p>
									)}
								</div>
							</div>
						</li>
						<li className="col-span-1 flex rounded-md shadow-sm">
							<div className="flex flex-1 items-start justify-between truncate rounded-md border border-gray-200 bg-white">
								<div className="flex-1 truncate px-4 py-2 text-sm">
									<h2 className="mb-1 text-sm font-medium text-gray-500">Most frequent</h2>
									{mostFrequent.length > 0 ? (
										mostFrequent.map((category, index) => (
											<p className="text-gray-500" key={index}>
												{category}
											</p>
										))
									) : (
										<p className="text-gray-500">No data available</p>
									)}
								</div>
							</div>
						</li>
						<li className="col-span-1 flex rounded-md shadow-sm">
							<div className="flex flex-1 items-start justify-between truncate rounded-md border border-gray-200 bg-white">
								<div className="flex-1 truncate px-4 py-2 text-sm">
									<h2 className="mb-1 text-sm font-medium text-gray-500">Least frequent</h2>
									{leastFrequent.length > 0 ? (
										leastFrequent.map((category, index) => (
											<p className="text-gray-500" key={index}>
												{category}
											</p>
										))
									) : (
										<p className="text-gray-500">No data available</p>
									)}
								</div>
							</div>
						</li>
					</ul>
				</>
			)}
		</div>
	);
};

export default ExpenseHeader;
