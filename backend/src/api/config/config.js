import dotenv from 'dotenv';

dotenv.config();

export default {
	apiVersionUrl: '/api/v1',
	appPort: process.env.PORT || 3001,
	numberOfProxies: process.env.NO_OF_PROXY,
	otpTimeout0InMinutes: 20,
	fileSizeLimit: '100mb',
	whitelistUrl: [/\localhost\$/, 'http://localhost:3000', 'http://localhost:4200', 'http://localhost:5173'],
	apiLevelJWTExpiry: '90d',
	userLevelJWTExpiry: '7d',
	numberOfFilesUserUpload: 15,
	db: {
		str: process.env.NODE_ENV === 'production' ? process.env.MONGO_DB_STRING_PROD : process.env.MONGO_DB_STRING_DEV,
		options: {
			readPreference: 'primaryPreferred',
		},
	},
};
