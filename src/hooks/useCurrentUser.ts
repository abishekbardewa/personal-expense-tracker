import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectIsAuthenticated, setUser } from '../redux/slices/authSlice';
import { useState } from 'react';
import { axiosPrivate } from '../services/axios.service';

const useCurrentUser = () => {
	const dispatch = useDispatch();
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		const getCurrentUser = async () => {
			setLoading(true);
			try {
				const { data } = await axiosPrivate.get('/user/current-user');

				dispatch(setUser(data.data));
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};

		const token = localStorage.getItem('token');

		if (token) {
			getCurrentUser();
		}
	}, [dispatch, isAuthenticated]);

	return loading;
};

export default useCurrentUser;
