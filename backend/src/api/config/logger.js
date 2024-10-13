import appRoot from 'app-root-path';
import winston from 'winston';

const options = {
	file: {
		level: 'info',
		filename: `${appRoot}/logs/app.log`,
		handleExceptions: true,
		json: true,
		maxsize: 5242880,
		maxFiles: 5,
		colorize: true,
		timestamp: true,
	},
	console: {
		level: 'debug',
		handleExceptions: true,
		json: false,
		colorize: true,
		timestamp: true,
	},
	exceptions: {
		level: 'error',
		filename: `${appRoot}/logs/exceptions.log`,
		timestamp: true,
		maxsize: 5242880,
		json: true,
		colorize: true,
	},
};

const logger = new winston.createLogger({
	format: winston.format.combine(winston.format.timestamp(), winston.format.json(), winston.format.colorize()),
	transports: [
		new winston.transports.File(options.file),
		new winston.transports.Console(options.console),
		new winston.transports.File(options.exceptions),
	],
	exceptionHandlers: new winston.transports.File(options.exceptions),
	exitOnError: false,
});

logger.stream = {
	write: (message) => {
		logger.info(message);
	},
};

export default logger;
