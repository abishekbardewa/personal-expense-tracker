import React, { useState } from 'react';

interface Option {
	value: string;
	label: string;
}

// Define props interface for RadioGroup
interface RadioGroupProps {
	options: Option[];
	name: string;
	selectedOption: string;
	onChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, name, selectedOption, onChange }) => {
	return (
		<fieldset aria-label={`Choose a ${name} option`}>
			<div className="flex items-center justify-between">
				<div className="text-md font-medium leading-6 text-gray-900">Choose option to generate trends</div>
			</div>

			<div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-8 ">
				{' '}
				{/* Adjusted grid columns */}
				{options.map((option) => (
					<label
						key={option.value}
						className={`flex cursor-pointer items-center justify-center rounded-md px-3 py-2 text-sm font-semibold whitespace-nowrap focus:outline-none sm:flex-1 ${
							selectedOption === option.value
								? 'ring-2 ring-gray-900 bg-gray-900 text-white'
								: 'ring-1 ring-gray-300 bg-white text-gray-900 hover:bg-gray-50'
						}`}
					>
						<input
							type="radio"
							name={name}
							value={option.value}
							className="sr-only"
							checked={selectedOption === option.value}
							onChange={() => onChange(option.value)}
						/>
						<span>{option.label}</span>
					</label>
				))}
			</div>
		</fieldset>
	);
};

export default RadioGroup;
