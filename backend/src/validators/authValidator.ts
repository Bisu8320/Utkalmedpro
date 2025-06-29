import Joi from 'joi'

export const validateRegister = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    phone: Joi.string().pattern(/^[+]?[0-9]{10,15}$/).required(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional()
  })

  return schema.validate(data)
}

export const validateLogin = (data: any) => {
  const schema = Joi.object({
    identifier: Joi.string().required(), // phone or email
    password: Joi.string().required()
  })

  return schema.validate(data)
}

export const validateOTP = (data: any) => {
  const schema = Joi.object({
    phone: Joi.string().pattern(/^[+]?[0-9]{10,15}$/).required(),
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required()
  })

  return schema.validate(data)
}