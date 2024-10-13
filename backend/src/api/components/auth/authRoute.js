import express from 'express';
import { createUserApi, loginUserApi, addCustomCategoryApi, getCategoriesApi } from './authController.js';
import { checkSignature } from '../../middleware/auth.js';

const router = express.Router();

router.use((req, res, next) => {
	tags = ['Auth'];
	next();
});

router.post('/create-account', createUserApi);
router.post('/login', loginUserApi);
router.post('/add-custom-category', checkSignature, addCustomCategoryApi);
router.get('/categories', checkSignature, getCategoriesApi);

export default router;
