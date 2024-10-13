import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';
import { loginUser } from '../services/auth.service';
import { setUser } from '../redux/slices/authSlice';
import InputField from './common/InputField';
import { validateEmail, validatePassword } from '../utils';

interface LoginModalProps {
	onClose: () => void;
	onLoginSuccess: (value: boolean) => void;
	onRegisterSuccess: (value: boolean) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess, onRegisterSuccess }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [loading, setLoading] = useState<boolean>(false);
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [error, setError] = useState<{ email?: string; password?: string }>({});

	const handleLogin = async () => {
		setError({});

		const newError: { email?: string; password?: string } = {};

		if (!email) {
			newError.email = 'Email is required';
		} else if (!validateEmail(email)) {
			newError.email = 'Invalid email address';
		}

		if (!password) {
			newError.password = 'Password is required';
		} else if (!validatePassword(password)) {
			newError.password =
				'Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character';
		}

		if (Object.keys(newError).length > 0) {
			setError(newError);
			return;
		}
		setLoading(true);
		try {
			const { data } = await loginUser(email, password);
			if (data.result) {
				dispatch(setUser(data.data.user));
				localStorage.setItem('token', data.data.accessToken);
				localStorage.setItem('user', JSON.stringify(data.data.user));
				toast.success('Login successful');
				onLoginSuccess(false);
				navigate('/overview');
			} else {
				toast.error(data.msg);
			}
		} catch (error: any) {
			toast.error(error.response.data.msg);
		} finally {
			setLoading(false);
		}
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		handleLogin();
	};
	const openRegister = () => {
		onLoginSuccess(false);
		onRegisterSuccess(true);
	};

	return (
		<div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center">
			<div className="bg-white p-8 rounded shadow-lg w-96">
				<h2 className="text-xl font-semibold mb-4">Login</h2>
				<form onSubmit={handleSubmit} noValidate>
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

					<Button buttonType="submit" size="sm" variant="filled" innerClass="w-full bg-blue-500 text-white" disabled={loading} loading={loading}>
						{loading ? 'Logging in...' : 'Login'}
					</Button>

					<Button buttonType="button" size="sm" variant="outline" innerClass="w-full mt-4 text-red-500" onClick={onClose} disabled={loading}>
						Cancel
					</Button>
				</form>
				<div className="mt-4 text-center">
					<h2 className="text-sm font-medium text-gray-600">
						Don't have a account?{' '}
						<span className="text-primary font-semibold cursor-pointer" onClick={openRegister}>
							{' '}
							Sign Up Here!
						</span>
					</h2>
				</div>
			</div>
		</div>
	);
};

export default LoginModal;
