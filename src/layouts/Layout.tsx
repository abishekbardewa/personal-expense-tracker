import React from 'react';
import { Outlet } from 'react-router';

const Layout = () => {
	return (
		<div className="flex flex-col justify-between px-12">
			<div className="pb-28">
				<Outlet />
			</div>
		</div>
	);
};

export default Layout;
