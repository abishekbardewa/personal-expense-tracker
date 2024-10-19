import React, { useEffect, useRef, useState } from 'react';

interface DropdownProps<T> {
	label: string;
	options: T[];
	selectedValue: T | null;
	onSelect: (value: T) => void;
	displayValue: (value: T) => string;
	keyExtractor: (value: T) => string | number;
}

function Dropdown<T>({ label, options, selectedValue, onSelect, displayValue, keyExtractor }: DropdownProps<T>) {
	const [isOpen, setIsOpen] = useState(false);

	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown if user clicks outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div ref={dropdownRef}>
			<label id={`${label}-label`} className="block text-md font-medium leading-6 text-gray-900">
				{label}
			</label>
			<div className="relative mt-1">
				<button
					type="button"
					className="relative w-full cursor-default bg-white py-2 px-3 rounded-md text-left text-gray-900 shadow-sm ring-1 ring-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
					aria-haspopup="listbox"
					aria-expanded={isOpen}
					aria-labelledby={`${label}-label`}
					onClick={() => setIsOpen(!isOpen)}
				>
					<span className="block truncate">{selectedValue ? displayValue(selectedValue) : `${label}`}</span>
					<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
						<svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path
								fillRule="evenodd"
								d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
								clipRule="evenodd"
							/>
						</svg>
					</span>
				</button>
				{isOpen && (
					<ul
						className="absolute z-10 max-h-52 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
						tabIndex={-1}
						role="listbox"
						aria-labelledby={`${label}-label`}
					>
						{options.map((option) => (
							<li
								key={keyExtractor(option)}
								className="text-gray-900 relative cursor-default select-none py-2 pl-8 pr-4 hover:bg-primary hover:text-white"
								role="option"
								onClick={() => {
									onSelect(option);
									setIsOpen(false);
								}}
							>
								<span className="font-normal block truncate">{displayValue(option)}</span>
								{selectedValue === option && (
									<span className="text-gray-900 absolute inset-y-0 left-0 flex items-center pl-1.5 hover:text-white">
										<svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
											<path
												fillRule="evenodd"
												d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
												clipRule="evenodd"
											/>
										</svg>
									</span>
								)}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}

export default Dropdown;
