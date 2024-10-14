import swaggerAutogen from 'swagger-autogen';
import config from '../config/config.js';

const swaggerAutogenInstance = swaggerAutogen();

const doc = {
	info: {
		title: 'FinTrack Backend API',
		description: 'API documentation for FinTrack Backend',
	},
	host: 'personal-expense-tracker-zqw8.onrender.com',
	basePath: config.apiVersionUrl || '/',
	schemes: ['https', 'http'],
	consumes: ['application/json', 'form-data', 'multipart/form-data'],
	produces: ['application/json'],
	tags: [
		{ name: 'Auth' },
		{ name: 'Category' },
		{ name: 'Expense' },
		// 	// Add more tags for other groups as needed
	],
	securityDefinitions: {
		BearerAuth: {
			type: 'apiKey',
			name: 'Authorization',
			in: 'header',
			description: 'Enter your JWT token in the format: Bearer <token>',
		},
	},
	definitions: {},
};

const outputFile = './src/api/swaggerDocs/swagger-output.json';
const endpointsFiles = ['./src/api/components/index.js'];

swaggerAutogenInstance(outputFile, endpointsFiles, doc);
