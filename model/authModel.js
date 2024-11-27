const Joi = require("joi");
const mongoose = require("mongoose");

const adressSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    title:String,
    adress:{
        type:String,required:true
    }
});

const ordersSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Products"
    },
    color:String,
    size:String,
    quantity:Number
});

const authSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure email is unique
    },
    password: {
        type: String, // Change to String for hashed passwords
        required: true
    },
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    },
    addresses: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Adress"
    }],
    orders: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Orders"
    }]
    ,
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products"
    }]
});

const User = mongoose.model("User", authSchema);
const Adress = mongoose.model("Adress", adressSchema);
const Orders = mongoose.model("Orders", ordersSchema);

const registerValidation = (body) => {
    const validationSchema = Joi.object({
        name: Joi.string().min(4).max(30).required(),
        email: Joi.string().email().required(), // Fixed Joi.email() to Joi.string().email()
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(3).max(30)
            .required() // Ensure password is required
    });

    return validationSchema.validate(body);
}

const loginValidation = (body) => {
    const validationSchema = Joi.object({
        email: Joi.string().email().required(), // Fixed Joi.email() to Joi.string().email()
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(3).max(30)
            .required() // Ensure password is required
    });

    return validationSchema.validate(body);
}

module.exports = { User, registerValidation, loginValidation,Adress,Orders };
