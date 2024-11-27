const Joi = require("joi");
const mongoose = require("mongoose");
const slugify = require("slugify");

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    slug: {
        type: String,
        unique: true
    }
});

// `this` anahtar kelimesinin doğru kullanılmasını sağlamak için `function` ifadesi kullanılıyor
CategorySchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true, strict: true });
    next();
});

const categoryValidation = (body)=>{
    const validationSchema = Joi.object({
        name:Joi.string().min(3).max(20).required()
    });

    return validationSchema.validate(body);
}

const Category = mongoose.model("Category", CategorySchema);

module.exports = {Category,categoryValidation};
