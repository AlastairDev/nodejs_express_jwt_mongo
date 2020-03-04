const Joi = require('@hapi/joi')

const registrationValidation = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required()
})

const loginValidation = Joi.object({
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required()
})

module.exports = {
    registrationValidation,
    loginValidation
}