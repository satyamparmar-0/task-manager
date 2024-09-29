const Joi = require('joi');

// Task validation using Joi
exports.taskValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(1).required().messages({
      'string.base': `Title should be a type of 'text'`,
      'string.empty': `Title cannot be an empty field`,
      'string.min': `Title should have a minimum length of {#limit}`,
      'any.required': `Title is a required field`,
    }),
    description: Joi.string().min(6).optional().allow(null, '').messages({
      'string.base': `Description should be a type of 'text'`,
      'string.min': `Description should have a minimum length of {#limit}`,
    }),
    column: Joi.string().min(1).required().messages({
      'string.base': `Column should be a type of 'text'`,
      'string.empty': `Column cannot be an empty field`,
      'string.min': `Column should have a minimum length of {#limit}`,
      'any.required': `Column is a required field`,
    }),
    dueDate: Joi.date().optional().allow(null, '').messages({
      'date.base': `Due date should be a valid date`,
    }),
    assignedTo: Joi.string().min(3).optional().allow(null, '').messages({
      'string.base': `Assigned to should be a type of 'text'`,
      'string.min': `Assigned to should have a minimum length of {#limit}`,
    }),
  });

  return schema.validate(data, { abortEarly: false });
};
