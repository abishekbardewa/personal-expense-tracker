import { useEffect, useState } from 'react';
import Dropdown from '../components/common/Dropdown';
import Button from '../components/common/Button';
import { months, years } from '../constants';
import { axiosPrivate } from '../services/axios.service';
import { toast } from 'react-toastify';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { formatCurrency, formatDate } from '../utils';
const History: React.FC = () => {
	const [selectedYear, setSelectedYear] = useState(() => localStorage.getItem('selectedYear') || new Date().getFullYear());
	const [selectedMonth, setSelectedMonth] = useState(() => localStorage.getItem('selectedMonth') || new Date().getMonth() + 1);
	const [selectedMonth2, setSelectedMonth2] = useState(() => localStorage.getItem('selectedMonth2') || new Date().getMonth());
	const [comparisonData, setComparisonData] = useState<any>(null);
	const [totalSpentData, setTotalSpentData] = useState<any>(null);
	const [monthlyExpense, setMonthlyExpense] = useState<any>([]);
	const [insights, setInsights] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const isCompareDisabled = selectedMonth === selectedMonth2;

	useEffect(() => {
		localStorage.setItem('selectedYear', selectedYear.toString());
	}, [selectedYear]);

	useEffect(() => {
		localStorage.setItem('selectedMonth', selectedMonth.toString());
	}, [selectedMonth]);

	useEffect(() => {
		localStorage.setItem('selectedMonth2', selectedMonth2.toString());
	}, [selectedMonth2]);

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		if (isCompareDisabled) {
			toast.error('Please select a different month for comparison.');
			return;
		}
		setLoading(true);

		try {
			const { data } = await axiosPrivate.post('/expense/compare-expenses', {
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
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mb-20">
				<div className="col-span-1 flex flex-col gap-4">
					<Dropdown
						label="Select year"
						options={years}
						selectedValue={selectedYear}
						onSelect={setSelectedYear}
						displayValue={(year) => year.toString()}
						keyExtractor={(year) => year.toString()}
					/>
				</div>
				<div className="col-span-1 flex flex-col gap-4">
					<Dropdown
						label="Select month"
						options={months.map((_, idx) => idx + 1)}
						selectedValue={selectedMonth}
						onSelect={setSelectedMonth}
						displayValue={(month) => months[(month as number) - 1]}
						keyExtractor={(month) => months[(month as number) - 1]}
					/>
				</div>
				<div className="col-span-1 flex flex-col gap-4">
					<Dropdown
						label="Compare with"
						options={months.map((_, idx) => idx + 1)}
						selectedValue={selectedMonth2}
						onSelect={setSelectedMonth2}
						displayValue={(month) => months[(month as number) - 1]}
						keyExtractor={(month) => months[(month as number) - 1]}
					/>
				</div>
				<div className="col-span-1 flex flex-col gap-4 justify-end">
					<Button
						buttonType="button"
						size="sm"
						variant="filled"
						innerClass="w-full bg-blue-500 text-white border-primary"
						onClick={getData}
						disable={loading}
						loading={loading}
					>
						Generate
					</Button>
				</div>
			</div>

			{loading ? (
				<Loader />
			) : (
				<>
					{insights && (
						<>
							<h2 className="text-2xl font-semibold leading-6 text-gray-900 mb-5">Insights</h2>
							<ul role="list" className="">
								{insights.highestSpendingMonth && (
									<li className="flex justify-between gap-x-6">
										<p className="text-md   text-gray-500">{insights.highestSpendingMonth}</p>
									</li>
								)}
								{insights.lowestSpendingMonth && (
									<li className="flex justify-between gap-x-6">
										<p className="text-md   text-gray-500">{insights.lowestSpendingMonth}</p>
									</li>
								)}
								{insights.spendingIncreaseDecrease && (
									<li className="flex justify-between gap-x-6">
										<p className="text-md   text-gray-500">{insights.spendingIncreaseDecrease}</p>
									</li>
								)}
								{insights.biggestCategorySpending && (
									<li className="flex justify-between gap-x-6">
										<p className="text-md   text-gray-500">{insights.biggestCategorySpending}</p>
									</li>
								)}
								{insights.totalSpent && (
									<li className="flex justify-between gap-x-6">
										<p className="text-md   text-gray-500">{insights.totalSpent}</p>
									</li>
								)}
								{insights.averageMonthlySpending && (
									<li className="flex justify-between gap-x-6">
										<p className="text-md   text-gray-500">{insights.averageMonthlySpending}</p>
									</li>
								)}
							</ul>
						</>
					)}
					{comparisonData && totalSpentData && (
						<div className="grid grid-cols-1 md:grid-cols-2  gap-8 mt-20">
							<div>
								<h2 className="text-2xl font-semibold leading-6 text-gray-900 mb-5">Category Comparison</h2>
								<div className="h-[500px] p-6 bg-white rounded-[16px]">
									{comparisonData?.labels.length > 0 ? (
										<Bar
											data={comparisonData}
											options={{
												responsive: true,
												maintainAspectRatio: false,
											}}
											style={{ height: '100%', width: '100%' }}
										/>
									) : (
										<EmptyState
											title="No comparison data available."
											subtitle="Add expenses to compare your spending across categories and time periods."
										/>
									)}
								</div>
							</div>

							{totalSpentData && (
								<div>
									<h2 className="text-2xl font-semibold leading-6 text-gray-900 mb-5">Total Spent Comparison</h2>
									<div className="h-[500px] p-6 bg-white rounded-[16px]">
										{totalSpentData?.labels.length > 0 ? (
											<Bar
												data={totalSpentData}
												options={{
													responsive: true,
													maintainAspectRatio: false,
												}}
												style={{ height: '100%', width: '100%' }}
											/>
										) : (
											<EmptyState
												title="No spending data available."
												subtitle="Start tracking your expenses to gain insights into your total spending trends."
											/>
										)}
									</div>
								</div>
							)}
						</div>
					)}

					{monthlyExpense && monthlyExpense.length > 0 && (
						<div className="grid grid-cols-1 md:grid-cols-2  gap-8 mt-20">
							{monthlyExpense.map((expDetails: any) => (
								<>
									{expDetails.chart && expDetails.chart.labels.length > 0 ? (
										<div key={expDetails.month}>
											<h2 className="text-2xl font-semibold leading-6 text-gray-900 mb-5">
												{expDetails.month} {formatCurrency(expDetails.totalAmount)}
												<span className="ml-2 font-normal text-sm text-gray-500">Total spent</span>
											</h2>

											<div className="h-[500px] p-6 ">
												<Doughnut
													data={expDetails.chart}
													options={{
														responsive: true,
														maintainAspectRatio: false,
													}}
													style={{ height: '100%', width: '100%' }}
												/>
											</div>

											<div>
												<h2 className="text-2xl font-semibold leading-6 text-gray-900 mb-5">{expDetails.month} Entries</h2>
												<div className="min-w-full py-2 align-middle sm:px-6 lg:px-8  rounded-[16px] bg-white md:h-[500px] overflow-y-auto overflow-x-auto">
													{expDetails.expensesEntries && expDetails.expensesEntries.length > 0 ? (
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
																	{/* <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
																	Action
																</th> */}
																</tr>
															</thead>
															<tbody className="divide-y divide-gray-200 bg-white">
																{expDetails.expensesEntries.map((entry, idx) => (
																	<tr key={`${entry?._id}-${idx}`}>
																		<td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
																			{entry?.category}
																			{entry?.description && <p className="mt-1   text-xs leading-5 text-gray-500">{entry?.description}</p>}
																		</td>
																		<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
																			{formatDate(entry.date)}
																			{/* {entry?.date} */}
																		</td>
																		<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(entry?.amount)}</td>
																	</tr>
																))}
															</tbody>
														</table>
													) : (
														<EmptyState title="No expenses recorded yet." subtitle="Start adding your expenses to monitor your financial activity." />
													)}
												</div>
											</div>
										</div>
									) : (
										<EmptyState
											title={`No data available for ${expDetails.month}`}
											subtitle="Start adding expenses for this month to see detailed charts and expense entries."
										/>
									)}
								</>
							))}
						</div>
					)}
				</>
			)}
		</>
	);
};

export default History;
