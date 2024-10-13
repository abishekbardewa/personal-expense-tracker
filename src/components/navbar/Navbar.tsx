import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';

export default function Navbar() {
	return (
		<nav className="fixed z-10 mx-auto w-full transition-colors duration-500 bg-white flex h-16 items-center justify-between  px-4 lg:px-16">
			<Link to="/overview" className=" cursor-pointer rounded-3xl">
				<div className="text-xl  font-bold  text-primary">FinTRACK</div>
			</Link>

			<UserMenu />
		</nav>
	);
}
