import React from 'react';
import { NavLink } from 'react-router-dom';

const MenuLink = ({ to, onClick, children }) => {
	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				isActive
					? 'block px-6 md:px-3 py-2  bg-primary text-white md:rounded-md font-semibold'
					: 'block px-6 md:px-3 py-2 my-3 md:my-0 font-medium text-primary hover:bg-primary hover:text-white sm:rounded-md'
			}
			onClick={onClick}
		>
			{children}
		</NavLink>
	);
};

export default MenuLink;
