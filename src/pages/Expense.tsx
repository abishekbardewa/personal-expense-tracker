import ExpenseCategory from '../components/ExpenseCategory';
import ExpenseTable from '../components/ExpenseTable';
import CurrentMonthBarChart from '../components/Charts/CurrentMonthBarChart';
import Insights from '../components/Insights';

import ExpenseHeader from '../components/ExpenseHeader';
import { ExpenseProvider } from '../components/context/ExpenseProvider';

const ExpensePage: React.FC = () => {
	return (
		<ExpenseProvider>
			<>
				<ExpenseHeader />
				<div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-8 mt-20">
					<CurrentMonthBarChart />
					<ExpenseCategory />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-8 mt-20">
					<ExpenseTable />
					<Insights />
				</div>
			</>
		</ExpenseProvider>
	);
};

export default ExpensePage;
