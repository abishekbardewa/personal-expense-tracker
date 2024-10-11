import React, { useState } from 'react';
import RegisterModal from '../components/RegisterModal';
import LoginModal from '../components/LoginModal';
import Button from '../components/common/Button';

const IntroPage: React.FC = () => {
	const [showLogin, setShowLogin] = useState(false);
	const [showRegister, setShowRegister] = useState(false);

	const handleLoginSuccess = (value: boolean) => {
		setShowLogin(value);
	};

	const handleRegisterSuccess = (value: boolean) => {
		setShowRegister(value);
	};

	return (
		<>
			<div className="flex items-center justify-center h-screen p-8">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Welcome to FinTRACK</h1>

					<div className="flex flex-row items-center justify-center gap-2">
						<Button
							buttonType="button"
							size="sm"
							variant="filled"
							innerClass="w-full md:w-28  border border-white"
							innerTextClass="text-white"
							onClick={() => setShowLogin(true)}
						>
							Log In
						</Button>

						<Button
							buttonType="button"
							size="sm"
							variant="outline"
							innerClass="w-full md:w-28  border border-primary whitespace-nowrap"
							innerTextClass="text-primary"
							onClick={() => setShowRegister(true)}
						>
							Sign Up
						</Button>
					</div>
				</div>
			</div>

			{showLogin && <LoginModal onClose={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} onRegisterSuccess={handleRegisterSuccess} />}

			{showRegister && (
				<RegisterModal onClose={() => setShowRegister(false)} onRegisterSuccess={handleRegisterSuccess} onLoginSuccess={handleLoginSuccess} />
			)}
		</>
	);
};

export default IntroPage;
