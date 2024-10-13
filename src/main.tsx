import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import store from './redux/store.ts';
import { Bounce, ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')!).render(
	<Provider store={store}>
		<StrictMode>
			<App />
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="colored"
				transition={Bounce}
			/>
		</StrictMode>
	</Provider>,
);
