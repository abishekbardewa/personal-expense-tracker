import ExpenseCategory from '../components/ExpenseCategory';
import ExpenseTable from '../components/ExpenseTable';
import Insights from '../components/Insights';

import ExpenseHeader from '../components/ExpenseHeader';
import { ExpenseProvider } from '../components/context/ExpenseProvider';
import ExpenseDoughnutChart from '../components/ExpenseDoughnutChart';

const ExpensePage: React.FC = () => {
	return (
		<ExpenseProvider>
			<>
				<ExpenseHeader />
				<div className="grid grid-cols-1 md:grid-cols-[3fr_2fr]  gap-8 mt-20">
					<ExpenseDoughnutChart />
					<ExpenseCategory />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-[3fr_2fr]  gap-8 mt-20">
					<ExpenseTable />
					<Insights />
				</div>
			</>
		</ExpenseProvider>
	);
};

export default ExpensePage;
