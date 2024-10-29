import jsonwebtoken from 'jsonwebtoken';
import config from '../config/config.js';

const generateApiJWT = async ({ payload }) => {
	const token = `${jsonwebtoken.sign(payload, config.ACCESS_TOKEN_SECRET, { expiresIn: config.apiLevelJWTExpiry })}`;
	return token;
};
const generateUserJWT = async ({ payload }) => {
	const token = `${jsonwebtoken.sign(payload, config.ACCESS_TOKEN_SECRET, { expiresIn: config.userLevelJWTExpiry })}`;
	return token;
};
const verifyJWT = ({ token }) => {
	// const data = jsonwebtoken.verify(token, config.ACCESS_TOKEN_SECRET);
	// return data;
	return new Promise((resolve, reject) => {
		jsonwebtoken.verify(token, config.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) {
				console.log('JWT verification error:', err);
				reject(err); // Reject if there’s an error
			} else {
				resolve(user); // Resolve with decoded user data if successful
			}
		});
	});
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
