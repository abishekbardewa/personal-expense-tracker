export const formatDateToUTC = (date) => {
	const utcDate = new Date(date);
	return utcDate.toISOString();
};

export const validateEmail = (email: string) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const validatePassword = (password: string) => {
	return password.length >= 6;
};
export const validateText = (text: string) => {
	return !text.length;
};
