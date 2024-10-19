import { Outlet } from 'react-router';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
const Layout = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<div className="flex-grow mx-auto w-full px-4 lg:px-16 pt-28 pb-20">
				<Outlet />
			</div>
			<Footer />
		</div>
	);
};

export default Layout;
