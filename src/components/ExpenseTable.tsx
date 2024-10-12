import { useExpenseContext } from './context/ExpenseProvider';
import EmptyState from './common/EmptyState';
import { FaPenToSquare, FaTrash } from 'react-icons/fa6';

const ExpenseTable: React.FC = () => {
	const { expenses } = useExpenseContext();

	return (
		<div>
			<h2 className="text-2xl font-semibold leading-6 text-gray-900 mb-5">Expense Entries</h2>
			<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8  bg-white rounded-[16px] h-96 md:h-[500px] overflow-y-auto overflow-x-auto">
				{expenses && expenses.length > 0 ? (
					<table className="min-w-full divide-y divide-gray-300">
						<thead>
							<tr>
								<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
									Category
								</th>
								<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Added date
								</th>
								<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Amount
								</th>
								<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Action
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 bg-white">
							{expenses.map((expense) => (
								<tr key={expense.category}>
									<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
										{expense.category}
										{expense.description && <p className="mt-1 truncate text-xs leading-5 text-gray-500">{expense.description}</p>}
									</td>
									<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</td>
									<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Rs.{expense.amount}</td>

									<td className="whitespace-nowrap  px-3 py-5 text-right text-sm font-medium sm:pr-0 ">
										<div className="flex item-center  gap-4">
											<div className="text-indigo-600 hover:text-indigo-900">
												<FaPenToSquare className="h-5 w-5 text-primary" />
											</div>
											<div className="text-indigo-600 hover:text-indigo-900">
												<FaTrash className="h-5 w-5 text-red-600" />
											</div>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<EmptyState title="No expenses recorded yet." subtitle="Start adding your expenses to monitor your financial activity." />
				)}
			</div>
		</div>
	);
};

export default ExpenseTable;
