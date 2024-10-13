import jsonwebtoken from 'jsonwebtoken';
import config from '../config/config.js';

const generateApiJWT = async ({ payload }) => {
	const token = `${jsonwebtoken.sign(payload, process.env.JWT_SECRET, { expiresIn: config.apiLevelJWTExpiry })}`;
	return token;
};
const generateUserJWT = async ({ payload }) => {
	const token = `${jsonwebtoken.sign(payload, process.env.JWT_SECRET, { expiresIn: config.userLevelJWTExpiry })}`;
	return token;
};
const verifyJWT = async ({ token }) => {
	const data = jsonwebtoken.verify(token, process.env.JWT_SECRET);
	return data;
};
const refreshJWT = async ({ token }) => {
	const data_ = await verifyJWT({ token: token });

	if (!data_ || !data_.exp) {
		throw new Error('Invalid token');
	}

	const token_ = await generateUserJWT({ payload: { email: data_.email, name: data_.name } });
	return token_;
};

export { generateApiJWT, verifyJWT, generateUserJWT, refreshJWT };
