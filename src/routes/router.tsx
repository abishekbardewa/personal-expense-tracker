import { createBrowserRouter } from 'react-router-dom';
import NotFoundPage from '../pages/NotFoundPage';
import Layout from '../layouts/Layout';
import IntroPage from '../pages/IntroPage';
import Dashboard from '../pages/Dashboard';

import PrivateRoute from './PrivateRoute';
import ExpensePage from '../pages/Expense';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <IntroPage />,
	},
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				path: 'dashboard',
				element: (
					<PrivateRoute>
						<Dashboard />
					</PrivateRoute>
				),
			},
			{
				path: 'expense',
				element: (
					<PrivateRoute>
						<ExpensePage />
					</PrivateRoute>
				),
			},
		],
	},

	{
		path: '*',
		element: <NotFoundPage />,
	},
]);
