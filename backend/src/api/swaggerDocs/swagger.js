import swaggerAutogen from 'swagger-autogen';
import config from '../config/config.js';

const swaggerAutogenInstance = swaggerAutogen();

const doc = {
	info: {
		title: 'FinTrack Backend API',
		description: 'API documentation for FinTrack Backend',
	},
	host: 'https://personal-expense-tracker-zqw8.onrender.com',
	basePath: config.apiVersionUrl || '/', // Ensure basePath is set correctly
	schemes: ['https', 'http'], // Add 'https' if needed
	consumes: ['application/json', 'form-data', 'multipart/form-data'],
	produces: ['application/json'],
	tags: [
		{ name: 'Auth', description: 'Endpoints for authentication' },
		{ name: 'Category', description: 'Endpoints for category' },
		{ name: 'Expense', description: 'Endpoints for expense' },
		// 	// Add more tags for other groups as needed
	],
	securityDefinitions: {
		BearerAuth: {
			// Definition for JWT authorization
			type: 'apiKey',
			name: 'Authorization',
			in: 'header',
			description: 'Enter your JWT token in the format: Bearer <token>',
		},
	},
	definitions: {},
};

const outputFile = './src/api/swaggerDocs/swagger-output.json';
const endpointsFiles = ['./src/api/components/index.js']; // Paths to your route files

swaggerAutogenInstance(outputFile, endpointsFiles, doc);
