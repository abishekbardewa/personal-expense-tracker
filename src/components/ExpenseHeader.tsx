import { LuLoader2 } from 'react-icons/lu';
import { formatCurrency } from '../utils';
import { useExpenseContext } from './context/ExpenseProvider';

const ExpenseHeader: React.FC = () => {
	const { loading, totalAmount } = useExpenseContext();

	return (
		<div className="flex flex-col items-center justify-center gap-3">
			{loading ? (
				<LuLoader2 className="w-6 h-6 text-primary animate-spin" />
			) : (
				<>
					<p className="text-md text-gray-500">Total spent</p>
					<h2 className="mt text-3xl font-semibold leading-7  sm:truncate md:text-4xl sm:tracking-tight">{formatCurrency(totalAmount)}</h2>
				</>
			)}
		</div>
	);
};

export default ExpenseHeader;
