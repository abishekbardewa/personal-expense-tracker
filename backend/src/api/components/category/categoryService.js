import logger from '../../config/logger.js';
import message from '../../config/message.js';
import Users from '../../models/usersModel.js';
import Expense from '../../models/expenseModal.js';

const getCategories = async (userId) => {
	try {
		const user = await Users.findById(userId);
		return {
			status: 'SUCCESS',
			data: user.categories,
		};
	} catch (error) {
		console.error(error);
		return {
			status: 'ERROR',
			error: message.SOMETHING_WENT_WRONG,
		};
	}
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

const removeCategory = async (userId, categoryName) => {
	try {
		const user = await Users.findById(userId);

		if (!user) {
			return {
				status: 'ERROR',
				error: message.USER_NOT_FOUND,
			};
		}
		user.categories = user.categories.filter((cat) => cat.name !== categoryName);
		await user.save();
		await Expense.deleteMany({ userId, category: categoryName });

		return {
			status: 'SUCCESS',
		};
	} catch (error) {
		console.error(error);
		return {
			status: 'ERROR',
			error: message.SOMETHING_WENT_WRONG,
		};
	}
};

export { addCustomCategory, removeCategory, getCategories };
