import message from '../config/message.js';
import { verifyJWT } from '../helpers/jwtService.js';
import { handleError, unAuthorized } from '../helpers/responseHandler.js';

const checkSignature = async (req, res, next) => {
	try {
		let token = req.header('Authorization') || req.header('authorization');
		if (!token) {
			return unAuthorized(res);
		}

		token = req.headers.authorization.replace('Bearer ', '');
		const payload = await verifyJWT({ token });
		req.user = payload;

		if (!req.user) {
			return unAuthorized(res);
		}

		return next();
	} catch (error) {
		return handleError({
			res,
			err_msg: message.AUTHORIZATION_ERROR,
		});
	}
};

export { checkSignature };
