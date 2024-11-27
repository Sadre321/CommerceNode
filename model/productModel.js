const slugify = require("slugify");
const mongoose = require("mongoose");
const Joi = require("joi");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    colors: [{
        type: String
    }],
    sizes: [{
        type: String
    }],
    images: [{ // Birden fazla resim desteği için dizi
        type: String,
        required: true
    }],
    slug: {
        type: String,
        unique: true
    }
});

// Slug oluşturma
ProductSchema.pre("save", function(next) {
    this.slug = slugify(this.name, { lower: true, strict: true });
    next();
});

// Joi validasyonu
const productValidation = (object) => {
    const validationSchema = Joi.object({
        name: Joi.string().min(5).max(70).required(),
        description: Joi.string().min(15).max(1000).required(),
        price: Joi.number().min(10).max(10000).required(), // Fiyat aralığını isteğe göre ayarlayabilirsiniz
        colors: Joi.array().items(Joi.string()).optional(), // Renkler dizisi
        size: Joi.array().items(Joi.string()).optional(), // Boyutlar dizisi
        images: Joi.array().items(Joi.string().uri()).min(1).required() // En az bir resim olmalı, URI formatında
    });

    return validationSchema.validate(object);
};

const Product = mongoose.model("Products", ProductSchema);

module.exports = { Product, productValidation };
