import React from 'react';

interface TextAreaFieldProps {
	label: string;
	id: string;
	name: string;
	value: string;
	required?: boolean;
	error?: string;
	placeholder?: string;
	maxLength?: number;
	rows: number;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, id, name, value, rows, required, error, placeholder, maxLength, onChange }) => {
	return (
		<div className="mb-4">
			<label htmlFor={id} className="block text-sm font-medium text-gray-700">
				{label} {required && <span className="text-red-500">*</span>}
			</label>
			<textarea
				maxLength={maxLength}
				placeholder={placeholder}
				id={id}
				name={name}
				value={value}
				onChange={onChange}
				rows={rows}
				className={`focus:outline-none focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
					error ? 'border-red-500' : ''
				}`}
				required={required}
			></textarea>
			{required ? (
				<div className="flex items-center mt-2 justify-between">
					{error && <span className="text-red-500 text-sm">{error}</span>}

					<div className="text-sm text-gray-500 text-right">
						{value?.length ?? 0}/{maxLength ?? '∞'}
					</div>
				</div>
			) : (
				<div className="text-sm text-gray-500 text-right">
					{value?.length ?? 0}/{maxLength ?? '∞'}
				</div>
			)}
		</div>
	);
};

export default TextAreaField;
