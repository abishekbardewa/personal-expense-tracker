import Joi from 'joi';

const createUserValidation = Joi.object({
	name: Joi.string().min(3).max(30).required().label('Name').messages({
		'string.base': 'Name must be a string',
		'any.required': 'Name is required',
		'string.min': 'Name must be at least 3 characters',
		'string.max': 'Name must be at most 30 characters',
	}),
	password: Joi.string()
		.min(8)
		.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,30}$/)
		.required()
		.label('Password')
		.messages({
			'string.base': 'Password must be a string',
			'any.required': 'Password is required',
			'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
		}),

	email: Joi.string().email({ minDomainSegments: 2 }).required().label('Email').messages({
		'any.required': 'Email is required',
		'string.email': 'Email is invalid',
	}),
});

const validateNewUserInput = (payload) => {
	return createUserValidation.validate(payload);
};

export { validateNewUserInput };
