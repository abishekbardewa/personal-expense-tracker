import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/navbar/Navbar';
const Layout = () => {
	return (
		<div className="flex flex-col justify-between px-12">
			<Navbar />
			<div className="pb-28">
				<Outlet />
			</div>
		</div>
	);
};

export default Layout;
