import { Outlet } from 'react-router';
import Navbar from '../components/navbar/Navbar';
const Layout = () => {
	return (
		<>
			<Navbar />
			<div className="bg-gradient mx-auto w-full px-4 lg:px-16 pb-28 pt-32 ">
				<Outlet />
			</div>
		</>
	);
};

export default Layout;
