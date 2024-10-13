import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import globalErrorHandler from './helpers/globalErrorHandler.js';
import logger from './config/logger.js';
import { handleError } from './helpers/responseHandler.js';
import router from './components/index.js';
import config from './config/config.js';
import { defaultLimiter, apiLimiter, createAccountLimiter } from './config/apiLimits.js';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';

const app = express();
app.use(express.json());

let corsOptions = {
	// origin: config.whitelistUrl,
	origin: '*',
};

app.set('trust proxy', config.numberOfProxies);
app.use(defaultLimiter);
app.use('/api', apiLimiter);
app.use('/api/auth/createAccount', createAccountLimiter);
app.use(express.json({ limit: config.fileSizeLimit }));
app.use(express.urlencoded({ limit: config.fileSizeLimit, extended: false }));
app.use(mongoSanitize());
app.use(cors(corsOptions));
app.use(config.apiVersionUrl, router);

const swaggerFilePath = path.resolve('src/api/swaggerDocs/swagger-output.json');
let swaggerFile;
try {
	swaggerFile = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'));
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
} catch (error) {
	console.error('Failed to load Swagger JSON file:', error);
}
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// find local ip to set numberOfProxy in config
app.get(config.apiVersionUrl, (req, res) => {
	logger.info('Api endpoint called');
	res.send({ yourIp: req.ip });
});

app.all('*', (req, res, next) => {
	next(
		handleError({
			res,
			statusCode: 404,
			err: `Can't find ${req.originalUrl} on this server!`,
		}),
	);
});

app.use(globalErrorHandler);

app.listen(config.appPort, () => {
	logger.info(`Listening on ${config.appPort}`);
});

export default app;
