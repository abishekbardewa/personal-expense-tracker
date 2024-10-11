import React, { useState } from 'react';
import axios from 'axios';
import { axiosInstance } from '../services/axios.service';
import { setUser } from '../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
	onClose: () => void;
	onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const loginUser = async () => {
		try {
			const { data } = await axiosInstance.post('auth/login', { email, password });
			console.log(data);
			if (data.result) {
				dispatch(setUser(data.data.user));
				localStorage.setItem('token', data.data.accessToken);
				localStorage.setItem('user', JSON.stringify(data.data.user));
				toast.success('Login success');
				navigate('/dashboard');
			} else {
				toast.error(data.msg);
			}
		} catch (error) {
			console.log('Login Error', error);
			toast.error('Login failed');
		}
	};

	return (
		<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
			<div className="bg-white p-8 rounded shadow-lg w-96">
				<h2 className="text-xl font-semibold mb-4">Login</h2>
				<input type="email" placeholder="Email" className="border p-2 rounded w-full mb-4" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input
					type="password"
					placeholder="Password"
					className="border p-2 rounded w-full mb-4"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button className="bg-blue-500 text-white p-2 rounded w-full" onClick={loginUser}>
					Login
				</button>
				<button className="text-red-500 mt-4" onClick={onClose}>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default LoginModal;
