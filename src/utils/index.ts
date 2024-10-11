export const formatDateToUTC = (date) => {
	const utcDate = new Date(date);
	return utcDate.toISOString();
};

export const validateEmail = (email: string) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

// Validate password (e.g., at least 6 characters)
export const validatePassword = (password: string) => {
	return password.length >= 6; // Adjust as per your requirement
};
export const validateText = (text: string) => {
	return !text.length; // Adjust as per your requirement
};
