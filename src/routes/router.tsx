import { createBrowserRouter } from 'react-router-dom';
import NotFoundPage from '../pages/NotFoundPage';
import Layout from '../layouts/Layout';
import IntroPage from '../pages/IntroPage';
import PrivateRoute from './PrivateRoute';
import ExpensePage from '../pages/Expense';
import History from '../pages/History';
import TrendPage from '../pages/TrendPage';

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
				path: 'overview',
				element: (
					<PrivateRoute>
						<ExpensePage />
					</PrivateRoute>
				),
			},
			{
				path: 'history',
				element: (
					<PrivateRoute>
						<History />
					</PrivateRoute>
				),
			},
			{
				path: 'trend',
				element: (
					<PrivateRoute>
						<TrendPage />
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
