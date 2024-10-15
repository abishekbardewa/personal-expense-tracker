import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
// import useCurrentUser from './hooks/useCurrentUser';
// import Loader from './components/common/Loader';

function App() {
	// const loading = useCurrentUser();
	// if (loading) {
	// 	return <Loader />;
	// }

	return <RouterProvider router={router} />;
}

export default App;
