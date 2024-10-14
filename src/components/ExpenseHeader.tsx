import { useExpenseContext } from './context/ExpenseProvider';

const ExpenseHeader: React.FC = () => {
	const { totalAmount } = useExpenseContext();
	return (
		<div className="flex flex-col items-center justify-center gap-3">
			<p className="text-md text-gray-500">Total spent</p>
			<h2 className="mt text-3xl font-semibold leading-7  sm:truncate md:text-4xl sm:tracking-tight">₹ {totalAmount}</h2>
		</div>
	);
};

export default ExpenseHeader;
