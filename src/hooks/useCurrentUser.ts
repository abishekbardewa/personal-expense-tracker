import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectIsAuthenticated, setUser } from '../redux/slices/authSlice';

const useCurrentUser = () => {
	const dispatch = useDispatch();
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getCurrentUserFromLocalStorage = () => {
			console.log('Triggered:useCurrentUser');
			setLoading(true);
			try {
				const token = localStorage.getItem('token');
				const user = JSON.parse(localStorage.getItem('user'));

				if (token && user) {
					dispatch(setUser(user));
				}
			} catch (error) {
				console.log('Error fetching user from localStorage:', error);
			} finally {
				setLoading(false);
			}
		};

		if (localStorage.getItem('token')) {
			getCurrentUserFromLocalStorage();
		}
	}, [dispatch, isAuthenticated]);

	return loading;
};

export default useCurrentUser;
