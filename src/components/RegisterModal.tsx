import React, { useState } from 'react';
import axios from 'axios';
import { axiosInstance } from '../services/axios.service';

interface RegisterModalProps {
	onClose: () => void;
	onRegisterSuccess: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onRegisterSuccess }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const registerUser = async () => {
		try {
			const { data } = await axiosInstance.post('auth/create-account', { name, email, password });
			console.log(data);
			alert('User registered successfully');
			onRegisterSuccess(); // Call the success handler
			onClose(); // Close the modal
		} catch (error) {
			alert('Registration failed');
		}
	};

	return (
		<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
			<div className="bg-white p-8 rounded shadow-lg w-96">
				<h2 className="text-xl font-semibold mb-4">Register</h2>
				<input
					type="text"
					placeholder="First Name"
					className="border p-2 rounded w-full mb-4"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>

				<input type="email" placeholder="Email" className="border p-2 rounded w-full mb-4" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input
					type="password"
					placeholder="Password"
					className="border p-2 rounded w-full mb-4"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				<button className="bg-green-500 text-white p-2 rounded w-full" onClick={registerUser}>
					Register
				</button>
				<button className="text-red-500 mt-4" onClick={onClose}>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default RegisterModal;
