import { useEffect, useState } from 'react';
import RadioGroup from '../components/common/RadioGroup';
import Button from '../components/common/Button';
import Dropdown from '../components/common/Dropdown';
import { months, timeRange, timeRangeNames, trendOptions, years } from '../constants';
import { toast } from 'react-toastify';
import { axiosPrivate } from '../services/axios.service';
import { Line } from 'react-chartjs-2';
import EmptyState from '../components/common/EmptyState';
import { formatCurrency } from '../utils';
import Loader from '../components/common/Loader';

const TrendPage: React.FC = () => {
	const [selectedOption, setSelectedOption] = useState('totalSpent');
	const [range, setRange] = useState(timeRangeNames[0]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [compareCategory, setCompareCategory] = useState(null);
	const [loading, setLoading] = useState(false);

	const [categories, setCategories] = useState<any>([]);
	const [totalSpentChart, setTotalSpentChart] = useState<any>([]);
	const [insights, setInsights] = useState<any>(null);
	const [categoryChart, setCategorySpentChart] = useState<any>([]);
	const [categoryInsights, setcategoryInsights] = useState<any>(null);

	const handleOptionChange = (value) => {
		setSelectedOption(value);
	};
	const getData = async () => {
		if (selectedOption === 'totalSpent') {
			getTotalSpentTrends();
		} else {
			getCategoryTrends();
		}
	};
	const getCategoryTrends = async () => {
		if (selectedCategory?._id === compareCategory?._id) {
			toast.error('Please select a different cateogry for comparison.');
			return;
		}
		setLoading(true);
		try {
			const { data } = await axiosPrivate.post(`/expense/expense-category-trend`, {
				category: selectedCategory.name,
				compareCategory: compareCategory.name,
				range: range.value.toString(),
			});
			const { chart, insights } = data.data;
			setCategorySpentChart(chart);
			setcategoryInsights(insights);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	const getTotalSpentTrends = async () => {
		setLoading(true);
		try {
			const { data } = await axiosPrivate.get(`/expense/expense-total-spent-trend?range=${range.value}`);
			const { chart, insights } = data.data;
			setTotalSpentChart(chart);
			setInsights(insights);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getUserCategories();
	}, []);

	const getUserCategories = async () => {
		const { data } = await axiosPrivate.get(`/category`);
		setCategories(data.data);
		setSelectedCategory(data.data[0]);
		setCompareCategory(data.data[1]);
		getData();
	};
	return (
		<>
			<RadioGroup options={trendOptions} name="trendOption" selectedOption={selectedOption} onChange={handleOptionChange} />
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mt-8 mb-20">
				<div className="col-span-1 flex flex-col gap-4">
					<Dropdown
						label="Time range"
						options={timeRangeNames}
						selectedValue={range}
						onSelect={setRange}
						displayValue={(range) => range.name}
						keyExtractor={(range) => range.value.toString()}
					/>
				</div>
				{selectedOption === 'category' && (
					<>
						<div className="col-span-1 flex flex-col gap-4">
							<Dropdown
								label="Select a category"
								options={categories}
								selectedValue={selectedCategory}
								onSelect={setSelectedCategory}
								displayValue={(category) => category.name}
								keyExtractor={(category) => category._id}
							/>
						</div>
						<div className="col-span-1 flex flex-col gap-4">
							<Dropdown
								label="Compare with"
								options={categories}
								selectedValue={compareCategory}
								onSelect={setCompareCategory}
								displayValue={(category) => category.name}
								keyExtractor={(category) => category._id}
							/>
						</div>
					</>
				)}
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
			) : selectedOption === 'category' ? (
				<>
					{/* className="px-5 py-5 bg-white rounded-[16px]" */}
					<div>
						{/* <div className="grid grid-cols-1 md:grid-cols-2  gap-8 "> */}
						{categoryInsights && categoryInsights.length > 0 ? (
							<>
								<ul role="list" className="">
									{categoryInsights?.map((insight, idx) => (
										<li key={insight + idx} className="flex justify-between gap-x-6">
											<p className="text-md   text-gray-500">{insight}</p>
										</li>
									))}
								</ul>
							</>
						) : (
							<EmptyState title="No insights available." subtitle="Add your expenses to visualize your spending patterns and trends." />
						)}
					</div>
					{/* </div> */}
					<div className="grid grid-cols-1 md:grid-cols-1  gap-8 mt-20">
						<div>
							<h2 className="text-2xl font-semibold leading-6 text-gray-900 mb-5">Trend Chart</h2>
							<div className="h-[500px] p-6 bg-white rounded-[16px]">
								{categoryChart && categoryChart?.labels?.length > 0 ? (
									<Line
										data={categoryChart}
										options={{
											responsive: true,
											maintainAspectRatio: false,
										}}
										style={{ height: '100%', width: '100%' }}
									/>
								) : (
									<EmptyState title="No insights available." subtitle="Add your expenses to visualize your spending patterns and trends." />
								)}
							</div>
						</div>
					</div>
				</>
			) : (
				<>
					{/* className="px-5 py-5 bg-white rounded-[16px]" */}
					<div>
						{insights ? (
							<div className="grid grid-cols-1 md:grid-cols-2  gap-8 ">
								<div>
									<ul role="list" className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
										{insights?.totalSpent && (
											<li className="col-span-1 flex rounded-md shadow-sm">
												<div className="flex flex-1 items-center justify-between truncate rounded-md border border-gray-200 bg-white">
													<div className="flex-1 truncate px-4 py-2 text-sm">
														<h2 className="font-medium text-gray-900 hover:text-gray-600">Total spent</h2>
														<p className="text-gray-500">{formatCurrency(insights?.totalSpent)}</p>
													</div>
												</div>
											</li>
										)}
										{insights?.averageSpent && (
											<li className="col-span-1 flex rounded-md shadow-sm">
												<div className="flex flex-1 items-center justify-between truncate rounded-md border border-gray-200 bg-white">
													<div className="flex-1 truncate px-4 py-2 text-sm">
														<h2 className="font-medium text-gray-900 hover:text-gray-600">Average spent</h2>
														<p className="text-gray-500">{formatCurrency(insights?.averageSpent)}</p>
													</div>
												</div>
											</li>
										)}
										{insights?.numberOfEntries && (
											<li className="col-span-1 flex rounded-md shadow-sm">
												<div className="flex flex-1 items-center justify-between truncate rounded-md border border-gray-200 bg-white">
													<div className="flex-1 truncate px-4 py-2 text-sm">
														<h2 className="font-medium text-gray-900 hover:text-gray-600">Numebr of entries</h2>
														<p className="text-gray-500">{insights?.numberOfEntries}</p>
													</div>
												</div>
											</li>
										)}
									</ul>
									{insights?.topCategories && insights.topCategories?.length > 0 && (
										<div>
											<h2 className="text-medium font-medium text-gray-900 mt-3">Top categories</h2>
											<ul role="list" className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
												{insights.topCategories.map((top) => (
													<li key={top.totalSpent} className="col-span-1 flex rounded-md shadow-sm">
														<div className="flex flex-1 items-center justify-between truncate rounded-md border border-gray-200 bg-white">
															<div className="flex-1 truncate px-4 py-2 text-sm">
																<h2 className="font-medium text-gray-900 hover:text-gray-600">{top?.category}</h2>
																<p className="text-gray-500">{formatCurrency(top?.totalSpent)}</p>
															</div>
														</div>
													</li>
												))}
											</ul>
										</div>
									)}
								</div>
								<ul role="list" className="">
									{insights?.spendingTrend && (
										<li className="flex justify-between gap-x-6">
											<p className="text-md   text-gray-500">{insights?.spendingTrend}</p>
										</li>
									)}
									{insights?.comparison && (
										<li className="flex justify-between gap-x-6">
											<p className="text-md   text-gray-500">{insights?.comparison}</p>
										</li>
									)}
									{insights?.suggestions && (
										<li className="flex justify-between gap-x-6">
											<p className="text-md   text-gray-500">{insights?.suggestions}</p>
										</li>
									)}
								</ul>
							</div>
						) : (
							<EmptyState title="No insights available." subtitle="Add your expenses to visualize your spending patterns and trends." />
						)}
					</div>
					<div className="grid grid-cols-1 md:grid-cols-1  gap-8 mt-20">
						<div>
							<h2 className="text-2xl font-semibold leading-6 text-gray-900 mb-5">Trend Chart</h2>
							<div className="h-[500px] p-6 bg-white rounded-[16px]">
								{totalSpentChart && totalSpentChart?.labels?.length > 0 ? (
									<Line
										data={totalSpentChart}
										options={{
											responsive: true,
											maintainAspectRatio: false,
										}}
										style={{ height: '100%', width: '100%' }}
									/>
								) : (
									<EmptyState title="No insights available." subtitle="Add your expenses to visualize your spending patterns and trends." />
								)}
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default TrendPage;
