import { createBrowserRouter } from 'react-router-dom';
import NotFoundPage from '../pages/NotFoundPage';
import Layout from '../layouts/Layout';
import IntroPage from '../pages/IntroPage';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <IntroPage />,
		// children: [{ path: '', element: <IntroPage /> }],
	},
	// {
	// 	path: '/',
	// 	element: <Layout />,
	// 	children: [{ path: '', element: <IntroPage /> }],
	// },

	{
		path: '*',
		element: <NotFoundPage />,
	},
]);
