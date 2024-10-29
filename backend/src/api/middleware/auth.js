import config from '../config/config.js';
import message from '../config/message.js';
import { handleError, unAuthorized } from '../helpers/responseHandler.js';
import jsonwebtoken from 'jsonwebtoken';
export const checkSignature = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization || req.headers.Authorization;
		if (!authHeader?.startsWith('Bearer ')) {
			return res.status(400).json({
				message: 'Token not found',
				status: 400,
			});
		}
		const token = authHeader.split(' ')[1];
		if (!token) {
			return res.status(400).json({
				message: 'Token not found',
				status: 400,
			});
		}

		const decodedUser = jsonwebtoken.verify(token, config.ACCESS_TOKEN_SECRET);
		if (!decodedUser) {
			return unAuthorized(res);
		}
		req.user = decodedUser;
		return next();
	} catch (error) {
		return handleError({
			res,
			err_msg: message.AUTHORIZATION_ERROR,
			statusCode: 401,
		});
	}
};
