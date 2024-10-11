import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
	return (
		<>
			<main className="grid h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
				<div className="text-center">
					<p className="text-base font-semibold text-indigo-600">404</p>
					<h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
					<p className="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn’t find the page you’re looking for.</p>
					<div className="mt-10 flex items-center justify-center gap-x-6">
						<Link
							to="/"
							className="cursor-pointer rounded-full border font-semibold shadow-xs transition-colors focus:outline-none focus:ring-4 px-6 py-2.5 text-sm leading-6 bg-primary border-primary text-white hover:bg-primary-600 hover:border-primary-600 disabled:bg-gray-200 disabled:border-gray-200 focus:ring-primary-50"
						>
							Go back
						</Link>
					</div>
				</div>
			</main>
		</>
	);
};

export default NotFoundPage;
