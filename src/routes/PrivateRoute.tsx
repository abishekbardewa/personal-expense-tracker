import React from 'react';
import { useSelector } from 'react-redux';

import { Navigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../redux/slices/authSlice';

const PrivateRoute = ({ children }) => {
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const isAuthorized = isAuthenticated;

	return isAuthorized ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
