import express from 'express';

import { checkSignature } from '../../middleware/auth.js';
import { addCustomCategoryApi, removeCategoryApi } from './categoryController.js';

const router = express.Router();

router.use((req, res, next) => {
	/* #swagger.tags = ['Category'] */
	/* #swagger.security = [{ "BearerAuth": []}] */
	next();
});

router.post('/add-custom-category', checkSignature, addCustomCategoryApi);
router.delete('/delete-category', checkSignature, removeCategoryApi);

export default router;
