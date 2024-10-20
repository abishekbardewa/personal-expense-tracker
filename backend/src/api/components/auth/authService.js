import logger from '../../config/logger.js';
import message from '../../config/message.js';
import { hashPassword } from '../../helpers/passwordService.js';
import { generateUserJWT } from '../../helpers/jwtService.js';
import { comparePassword } from '../../helpers/passwordService.js';
import Users from '../../models/usersModel.js';
import { predefinedCategories } from '../../helpers/utils.js';

const createUser = async (name, email, password) => {
	logger.info('Inside createUser Service');
	try {
		const foundUser = await Users.findOne({ email });
		if (foundUser) {
			return {
				status: 'ERROR',
				error: message.USER_ALREADY_EXIST,
			};
		}
		const hasedPassword = hashPassword(password);

		const resp = await Users.create({
			name,
			email,
			password: hasedPassword,
			categories: predefinedCategories,
		});

		return {
			status: 'SUCCESS',
			data: resp,
		};
	} catch (error) {
		return {
			status: 'ERROR',
			error: message.SOMETHING_WENT_WRONG,
		};
	}
};

const loginUser = async (email, password) => {
	const user = await Users.findOne({
		email: email,
	}).select('+password');
	if (!user || !comparePassword(password, user.password)) {
		return {
			status: 'ERROR',
			error: message.LOGIN_FAILED,
		};
	}
	const userId = user._id.toString();
	const token = await generateUserJWT({
		payload: {
			email: user.email,
			name: user.name,
			userId: userId,
		},
	});

	return {
		status: 'SUCCESS',
		user: user,
		accessToken: token,
	};
};

const addCustomCategory = async (userId, categoryName) => {
	try {
		// Find the user and add the custom category
		const updatedUser = await Users.findByIdAndUpdate(
			userId,
			{ $addToSet: { categories: { name: categoryName } } }, // Use $addToSet to avoid duplicates
			{ new: true },
		);

		if (!updatedUser) {
			return {
				status: 'ERROR',
				error: message.USER_NOT_FOUND,
			};
		}

		return {
			status: 'SUCCESS',
			data: updatedUser.categories, // Return updated categories
		};
	} catch (error) {
		console.error('Error adding custom category:', error);
		return {
			status: 'ERROR',
			error: message.SOMETHING_WENT_WRONG,
		};
	}
};

export { createUser, loginUser, addCustomCategory };
