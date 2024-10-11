import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
	baseURL: API_URL,
	// withCredentials: true,
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json', //this line solved cors
	},
});

export const axiosPrivate = axios.create({
	baseURL: API_URL,
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json', //this line solved cors
	},
	// withCredentials: true,
});

// Request interceptor for adding access token to headers
axiosPrivate.interceptors.request.use(
	(config) => {
		const accessToken = localStorage.getItem('token');
		if (accessToken) {
			config.headers['Authorization'] = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);
