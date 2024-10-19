const InsightsList: React.FC<{ insights: any }> = ({ insights }) => (
	<>
		{insights && (
			<ul>
				{insights.highestSpendingMonth && <li>{insights.highestSpendingMonth}</li>}
				{insights.lowestSpendingMonth && <li>{insights.lowestSpendingMonth}</li>}
				{insights.spendingIncreaseDecrease && <li>{insights.spendingIncreaseDecrease}</li>}
				{insights.biggestCategorySpending && <li>{insights.biggestCategorySpending}</li>}
				{insights.totalSpent && <li>{insights.totalSpent}</li>}
				{insights.averageMonthlySpending && <li>{insights.averageMonthlySpending}</li>}
			</ul>
		)}
	</>
);

export default InsightsList;
