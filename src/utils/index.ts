export const formatDateToUTC = (date) => {
	const utcDate = new Date(date);
	return utcDate.toISOString();
};

export const validateEmail = (email: string) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const validatePassword = (password: string) => {
	const hasLowerCase = /[a-z]/.test(password);
	const hasUpperCase = /[A-Z]/.test(password);
	const hasNumber = /\d/.test(password);
	const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Adjust special characters as needed

	return password.length >= 6 && hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar;
};
export const validateText = (text: string) => {
	return !text.length;
};

export const formatDate = (dateString: any) => {
	const date = new Date(dateString);
	const options = { day: '2-digit', month: 'short', year: '2-digit' };
	const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);

	return formattedDate.replace(/(\d{2}) (\w{3}), (\d{2})/, '$1 $2, $3');
};
