import { useState } from 'react';
import Loader from './common/Loader';
import { useExpenseContext } from './context/ExpenseProvider';
import MonthlyInsights from './MonthlyInsights';
import ImprovementInsights from './ImprovementInsights';
import WarningInsights from './WarningsInsight';
import TabButton from './common/TabButton';

const Insights: React.FC = () => {
	const { loading } = useExpenseContext();

	const [selectedTab, setSelectedTab] = useState<string>('insights');

	if (loading) {
		// return <Loader />;
		return;
	}
	return (
		<div>
			<h2 className="text-2xl font-semibold leading-6 text-gray-900 mb-5">Key Insights</h2>

			<div className="h-[500px] px-5 py-4 pb-2 bg-white rounded-[16px]">
				<ul className="flex overflow-y-auto md:mb-4">
					<li className="me-2">
						<TabButton
							label="Insights"
							onClick={() => setSelectedTab('insights')}
							color="text-primary"
							borderColor="border-primary"
							isSelected={selectedTab === 'insights'}
						/>
					</li>
					<li className="me-2">
						<TabButton
							label="Improvements"
							onClick={() => setSelectedTab('improvement')}
							color="text-blue-600"
							borderColor="border-blue-600"
							isSelected={selectedTab === 'improvement'}
						/>
					</li>
					<li className="me-2">
						<TabButton
							label="Warnings"
							onClick={() => setSelectedTab('warnings')}
							color="text-error-600"
							borderColor="border-error-600"
							isSelected={selectedTab === 'warnings'}
						/>
					</li>
				</ul>
				{selectedTab === 'insights' ? <MonthlyInsights /> : selectedTab === 'improvement' ? <ImprovementInsights /> : <WarningInsights />}
			</div>
		</div>
	);
};
export default Insights;
