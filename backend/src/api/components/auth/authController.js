import logger from '../../config/logger.js';
import catchAsync from '../../helpers/catchAsync.js';
import { generateApiJWT } from '../../helpers/jwtService.js';
import { handleError, handleResponse } from '../../helpers/responseHandler.js';
import { validateNewUserInput } from '../../validation/userValidation.js';
import { createUser, loginUser, addCustomCategory } from './authService.js';

const createUserApi = catchAsync(async (req, res) => {
	logger.info('Inside createUserApi Controller');
	const { name, email, password } = req.body;

	const validatedPayload = validateNewUserInput({
		name,
		email,
		password,
	});
	if (validatedPayload.error) {
		return handleError({
			res,
			status: 'ERROR',
			err_msg: validatedPayload.error,
		});
	}

	const result = await createUser(name, email, password);

	if (result.status === 'SUCCESS') {
		const user = result.data._doc;

		// Delete the password from the user object
		delete user.password;

		logger.info(user);
		return handleResponse({
			res,
			data: result.data,
		});
	}
	return handleError({
		res,
		statusCode: 500,
		err: result.error,
	});
});

const loginUserApi = catchAsync(async (req, res) => {
	const { email, password } = req.body;
	const response = await loginUser(email, password);
	if (response.status === 'SUCCESS') {
		const user = response.user._doc;
		delete user.password;
		return handleResponse({
			res,
			result: true,
			data: {
				user: response.user,
				accessToken: response.accessToken,
			},
		});
	}

	return handleError({
		res,
		statusCode: 500,
		err: response.error,
		result: false,
	});
});

const addCustomCategoryApi = catchAsync(async (req, res) => {
	const { categoryName } = req.body;

	const { userId } = req.user;

	// Validate input
	if (!userId || !categoryName) {
		return handleError({
			res,
			statusCode: 400,
			err: 'User ID and category name are required.',
		});
	}

	const result = await addCustomCategory(userId, categoryName);

	if (result.status === 'SUCCESS') {
		return handleResponse({
			res,
			data: result.data,
		});
	}

	return handleError({
		res,
		statusCode: 500,
		err: result.error,
	});
});

export { createUserApi, loginUserApi, addCustomCategoryApi };
