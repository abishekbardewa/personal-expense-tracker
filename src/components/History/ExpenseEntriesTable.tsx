import { Doughnut } from 'react-chartjs-2';
import { formatCurrency, formatDate } from '../../utils';

const ExpenseEntriesTable: React.FC<{ monthlyExpense: any[] }> = ({ monthlyExpense }) => (
	<>
		{monthlyExpense.length > 0 && (
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
				{monthlyExpense.map((expDetails) => (
					<div key={expDetails.month}>
						<h2>{`${expDetails.month} ${formatCurrency(expDetails.totalAmount)} Total spent`}</h2>
						<Doughnut data={expDetails.chart} options={{ responsive: true, maintainAspectRatio: false }} />
						<table className="min-w-full divide-y divide-gray-300">
							<thead>
								<tr>
									<th>Category</th>
									<th>Added date</th>
									<th>Amount</th>
								</tr>
							</thead>
							<tbody>
								{expDetails.expensesEntries.map((entry, idx) => (
									<tr key={idx}>
										<td>{entry.category}</td>
										<td>{formatDate(entry.entries[0].date)}</td>
										<td>{formatCurrency(entry.entries[0].amount)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				))}
			</div>
		)}
	</>
);

export default ExpenseEntriesTable;
