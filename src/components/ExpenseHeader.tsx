import { LuLoader2 } from 'react-icons/lu';
import { formatCurrency } from '../utils';
import { useExpenseContext } from './context/ExpenseProvider';

const ExpenseHeader: React.FC = () => {
	const { loading, totalAmount } = useExpenseContext();
	const currentDate = new Date().toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
	});

	return (
		<div className=" flex  items-center justify-center gap-8">
			{loading ? (
				<LuLoader2 className="w-6 h-6 text-primary animate-spin" />
			) : (
				<>
					<div className="flex flex-col items-start justify-center">
						<p className="text-md font-semibold leading-6 text-gray-900">Total spent</p>
						<p className="text-sm text-gray-400">{currentDate}</p>
					</div>

					<h2 className="mt text-3xl font-semibold leading-7   md:text-4xl sm:tracking-tight">{formatCurrency(totalAmount)}</h2>
				</>
			)}
		</div>
	);
};

export default ExpenseHeader;
