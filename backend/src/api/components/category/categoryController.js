import logger from '../../config/logger.js';
import catchAsync from '../../helpers/catchAsync.js';
import { handleError, handleResponse } from '../../helpers/responseHandler.js';
import { addCustomCategory, removeCategory, getCategories } from './categoryService.js';

const getCategoriesApi = catchAsync(async (req, res) => {
	logger.info('Inside getCategoriesApi Controller');

	const { userId } = req.user;
	if (!userId) {
		return handleError({
			res,
			statusCode: 400,
			err: 'User ID is required.',
		});
	}
	const response = await getCategories(userId);

	if (response.status === 'SUCCESS') {
		return handleResponse({
			res,
			data: response.data,
		});
	}

	return handleError({
		res,
		statusCode: 500,
		err: response.error,
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

const removeCategoryApi = catchAsync(async (req, res) => {
	logger.info('Inside removeCategoryApi Controller');

	const { userId } = req.user;
	const { categoryName } = req.body;
	if (!userId) {
		return handleError({
			res,
			statusCode: 400,
			err: 'User ID is required.',
		});
	}
	if (!categoryName) {
		return handleError({
			res,
			statusCode: 400,
			err: 'Category Name is required.',
		});
	}
	const response = await removeCategory(userId, categoryName);

	if (response.status === 'SUCCESS') {
		return handleResponse({
			res,
			data: {},
		});
	}

	return handleError({
		res,
		statusCode: 500,
		err: response.error,
	});
});

export { addCustomCategoryApi, removeCategoryApi, getCategoriesApi };
