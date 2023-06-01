const mongoose = require("mongoose")
const Joi = require("joi")
const jwt = require("jsonwebtoken")
const cakeSchema = new mongoose.Schema({
    name:String,
    cals: Number,
    price: Number,
    user_id: String
})

exports.CakeModel = mongoose.model("cakes", cakeSchema)

exports.validateCake = (_bodyValid) =>{
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        cals: Joi.number().required(),
        price: Joi.number().required(),
        user_id: Joi.string().required()
    })
    return joiSchema.validate(_bodyValid)
}