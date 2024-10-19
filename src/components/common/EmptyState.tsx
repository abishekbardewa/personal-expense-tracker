import React from 'react';
interface EmptyStateProps {
	title: string;
	subtitle?: string;
}
const EmptyState: React.FC<EmptyStateProps> = ({ title, subtitle }) => {
	return (
		<div className="flex flex-col items-center justify-center h-[60vh]">
			<h3 className="mt-2 text-sm font-semibold ">{title}</h3>
			<p className="mt-1 text-sm text-gray-500 text-center">{subtitle}</p>
		</div>
	);
};

export default EmptyState;
