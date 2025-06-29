import Joi from 'joi'

export const validateBooking = (data: any) => {
  const schema = Joi.object({
    service: Joi.string().required(),
    name: Joi.string().min(2).max(50).required(),
    phone: Joi.string().pattern(/^[+]?[0-9]{10,15}$/).required(),
    email: Joi.string().email().optional(),
    address: Joi.string().min(10).max(200).required(),
    date: Joi.string().isoDate().required(),
    time: Joi.string().required(),
    notes: Joi.string().max(500).optional(),
    price: Joi.string().optional()
  })

  return schema.validate(data)
}