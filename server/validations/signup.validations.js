const Joi = require('joi');

const signupValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format.',
    'any.required': 'Email is required.'
  }),
  firstName: Joi.string().required().messages({
    'string.empty': 'First name is required.',
    'any.required': 'First name is required.'
  }),
  lastName: Joi.string().optional(), // Optional field
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long.',
    'string.empty': 'Password is required.',
    'any.required': 'Password is required.'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().strip().messages({
    'any.only': 'Passwords do not match.',
    'any.required': 'Confirm password is required.'
  })
});

const validateSignup = (req, res, next) => {
  const { error } = signupValidationSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({ message: 'Validation error', errors: errorMessages });
  }
  
  next();
};

// Login validation
const loginValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format.',
    'string.empty': 'Email is required.',
    'any.required': 'Email is required.'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long.',
    'string.empty': 'Password is required.',
    'any.required': 'Password is required.'
  }),
});

const validateLogin = async (req, res, next) => {
  const { error } = loginValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({ message: 'Validation error', errors: errorMessages });
  }
  next();
};

module.exports = {
  validateSignup,
  validateLogin
};
