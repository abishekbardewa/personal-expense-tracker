import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import PrivateNav from './PrivateNav';
import UserMenu from './UserMenu';

export default function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.pageYOffset;
			setIsScrolled(scrollTop > 0);
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<>
			<nav className="fixed w-full z-10 shadow-lg border-b-[1px] transition-colors duration-500 bg-white">
				<div className="mx-auto max-w-8xl  px-2 sm:px-9 lg:px-20 ">
					<div className="relative flex h-16 items-center justify-between">
						<Logo />
						<div className="flex gap-2 justify-between sm:w-full ">
							<PrivateNav />
							<div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-0 sm:pr-0">
								<UserMenu />
							</div>
						</div>
					</div>
				</div>
			</nav>
		</>
	);
}
