import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';

function App() {
	// const loading = useCurrentUser();
	// if (loading) {
	// 	return <Loader />;
	// }

	return <RouterProvider router={router} />;
}

export default App;
