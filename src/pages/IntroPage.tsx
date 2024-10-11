import React, { useState } from 'react';
import RegisterModal from '../components/RegisterModal';
import LoginModal from '../components/LoginModal';

const IntroPage: React.FC = () => {
	const [showLogin, setShowLogin] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const handleLoginSuccess = () => {
		setIsAuthenticated(true);
		setShowLogin(false);
	};

	const handleRegisterSuccess = () => {
		setIsAuthenticated(true);
		setShowRegister(false);
	};

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-4">Welcome to Expense Tracker</h1>

			<div className="flex justify-center space-x-4">
				<button className="bg-blue-500 text-white p-2 rounded" onClick={() => setShowLogin(true)}>
					Login
				</button>
				<button className="bg-green-500 text-white p-2 rounded" onClick={() => setShowRegister(true)}>
					Register
				</button>
			</div>

			{/* Modals */}
			{showLogin && <LoginModal onClose={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />}
			{showRegister && <RegisterModal onClose={() => setShowRegister(false)} onRegisterSuccess={handleRegisterSuccess} />}
		</div>
	);
};

export default IntroPage;
