import React from 'react';

interface TabButtonProps {
	label: string;
	onClick: () => void;
	color?: string;
	borderColor?: string;
	isSelected: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ label, onClick, color, borderColor, isSelected }) => {
	return (
		<div
			role="button"
			className={`inline-block p-2 ${
				isSelected ? `${color} border-b-2 ${borderColor} font-normal` : `text-gray-600 hover:${color} hover:${borderColor}`
			} rounded-t-lg cursor-pointer`}
			onClick={onClick}
		>
			{label}
		</div>
	);
};

export default TabButton;
