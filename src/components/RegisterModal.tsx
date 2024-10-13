import React, { useState } from 'react';
import { registerUser } from '../services/auth.service';
import { toast } from 'react-toastify';
import Button from './common/Button';
import { validateEmail, validatePassword } from '../utils';
import InputField from './common/InputField';

interface RegisterModalProps {
	onClose: () => void;
	onRegisterSuccess: (value: boolean) => void;
	onLoginSuccess: (value: boolean) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onRegisterSuccess, onLoginSuccess }) => {
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<{ name?: string; email?: string; password?: string }>({});

	const handleRegister = async () => {
		setError({});
		const newError: { name?: string; email?: string; password?: string } = {};
		if (!name) {
			newError.name = 'Name is required';
		}
		if (!email) {
			newError.email = 'Email is required';
		} else if (!validateEmail(email)) {
			newError.email = 'Invalid email address';
		}

		if (!password) {
			newError.password = 'Password is required';
		} else if (!validatePassword(password)) {
			newError.password = 'Password must be at least 6 characters';
		}

		if (Object.keys(newError).length > 0) {
			setError(newError);
			return;
		}
		setLoading(true);
		try {
			const { data } = await registerUser(name, email, password);
			if (data.result) {
				toast.success('User registered successfully');
				onRegisterSuccess(false);
			} else {
				toast.error(err.msg);
			}
		} catch (error: any) {
			toast.error(error.response.data.msg);
		} finally {
			setLoading(false);
		}
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		handleRegister();
	};

	const openLogin = () => {
		onRegisterSuccess(false);
		onLoginSuccess(true);
	};

	return (
		<div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center">
			<div className="bg-white p-8 rounded shadow-lg w-96">
				<h2 className="text-xl font-semibold mb-4">Sign Up</h2>
				<form onSubmit={handleSubmit} noValidate>
					<InputField
						label="Name"
						id="name"
						name="name"
						type="text"
						value={name}
						placeholder="your name"
						required={true}
						error={error.name}
						onChange={handleNameChange}
					/>

					<InputField
						label="Email"
						id="email"
						name="email"
						type="email"
						value={email}
						placeholder="youremail@example.com"
						required={true}
						error={error.email}
						onChange={handleEmailChange}
					/>

					<InputField
						label="Password"
						id="password"
						name="password"
						type="password"
						placeholder="password"
						required={true}
						value={password}
						error={error.password}
						onChange={handlePasswordChange}
					/>

					<Button
						buttonType="button"
						size="sm"
						variant="filled"
						innerClass="w-full bg-blue-500 text-white"
						onClick={handleRegister}
						disabled={loading}
					>
						{loading ? 'Signing up...' : 'Sign Up'}
					</Button>

					<Button buttonType="button" size="sm" variant="outline" innerClass="w-full mt-4 text-red-500" onClick={onClose} disabled={loading}>
						Cancel
					</Button>
				</form>
				<div className="mt-4 text-center">
					<h2 className="text-sm font-medium text-gray-600">
						Already have a account?{' '}
						<span className="text-primary font-semibold cursor-pointer" onClick={openLogin}>
							{' '}
							Login Here!
						</span>
					</h2>
				</div>
			</div>
		</div>
	);
};

export default RegisterModal;
