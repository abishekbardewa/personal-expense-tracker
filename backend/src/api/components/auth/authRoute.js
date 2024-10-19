import express from 'express';
import { createUserApi, loginUserApi, addCustomCategoryApi } from './authController.js';
import { checkSignature } from '../../middleware/auth.js';

const router = express.Router();

router.use((req, res, next) => {
	/* #swagger.tags = ['Auth'] */
	/* #swagger.security = [{ "BearerAuth": []}] */
	next();
});

router.post('/create-account', createUserApi);
router.post('/login', loginUserApi);
router.post('/add-custom-category', checkSignature, addCustomCategoryApi);

export default router;
