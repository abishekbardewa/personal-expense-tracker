import React from 'react';

interface InputFieldProps {
	label: string;
	id: string;
	name: string;
	type: 'text' | 'email' | 'number' | 'password' | 'phone' | 'time' | 'date';
	value: string;
	placeholder?: string;
	required?: boolean;
	error?: string;
	disabled?: boolean;
	readOnly?: boolean;
	className?: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
	label,
	id,
	name,
	type,
	value,
	placeholder = '',
	required = false,
	error,
	disabled = false,
	readOnly = false,
	className = '',
	onChange,
}) => {
	const inputClassNames = `mt-1 focus:ring-indigo-500 focus:outline-none focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md
    ${error ? '!border-error-700 focus:border-error-700 focus:ring-error-700' : 'border-gray-100 focus:border-primary-300 focus:ring-primary-50'}
    ${disabled ? 'bg-gray-50 text-opacity-70' : ''}
    ${className}`;

	return (
		<div className="mb-4">
			<label htmlFor={id} className="block text-sm font-medium text-gray-700">
				{label} {required && <span className="text-red-500">*</span>}
			</label>

			<input
				type={type}
				id={id}
				name={name}
				value={value}
				onChange={onChange}
				placeholder={type === 'email' && !placeholder ? 'youremail@example.com' : placeholder}
				disabled={disabled}
				readOnly={readOnly}
				className={inputClassNames}
			/>

			{error && <span className="text-red-500 text-sm">{error}</span>}
		</div>
	);
};

export default InputField;
