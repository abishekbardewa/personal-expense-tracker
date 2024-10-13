import React from 'react';
import { LuLoader2 } from 'react-icons/lu';

const Button: React.FC<any> = ({
	size = 'md',
	startIcon = '',
	endIcon = '',
	buttonType = 'button',
	disabled = false,
	innerClass = '',
	innerTextClass = '',
	variant = 'filled',
	loading = false,
	onClick = () => {},
	children,
}) => {
	const getVariantClass = () => {
		switch (variant) {
			case 'filled':
				return 'bg-primary border-primary-200 text-white hover:bg-primary-600 hover:border-primary-600 disabled:bg-gray-200 disabled:border-gray-200 focus:ring-primary-50';
			case 'outline':
				return 'bg-transparent border-gray-200 text-gray-900 hover:border-gray-300 hover:bg-gray-25 disabled:text-gray-200 disabled:border-gray-200 focus:ring-gray-100';
			case 'error':
				return 'hover:bg-transparent border-error-600 bg-error-600 text-white hover:text-error-600 hover:border-error-600 hover:bg-error-700 ';
			default:
				return '';
		}
	};

	const getSizeClass = () => {
		switch (size) {
			case 'sm':
				return 'px-4 py-2 text-sm leading-6';
			case 'md':
				return 'px-6 py-2.5 text-sm leading-6';
			case 'noPadding':
				return 'text-sm leading-6';
			case 'lg':
				return 'px-8 py-2.5 text-base leading-7';
			default:
				return '';
		}
	};

	return (
		<button
			className={`cursor-pointer rounded-full border font-semibold shadow-xs transition-colors focus:ring-1 ${getVariantClass()} ${getSizeClass()} ${innerClass}`}
			disabled={disabled || loading}
			type={buttonType}
			onClick={onClick}
		>
			<div className={`flex items-center justify-center ${size === 'lg' ? 'h-7' : size === 'md' || size === 'sm' ? 'h-6' : ''}`}>
				{loading ? (
					<LuLoader2 className="w-5 h-5 text-white animate-spin" />
				) : (
					<div className={`flex h-6 items-center justify-center gap-2 text-center ${innerTextClass}`}>
						{startIcon && startIcon}
						{children}
						{endIcon && endIcon}
					</div>
				)}
			</div>
		</button>
	);
};

export default Button;
