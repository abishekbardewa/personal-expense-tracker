import { Outlet } from 'react-router';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
const Layout = () => {
	return (
		<>
			<Navbar />
			<div className="mx-auto w-full px-4 lg:px-16 pb-20 pt-28 ">
				<Outlet />
			</div>
			<Footer />
		</>
	);
};

export default Layout;
