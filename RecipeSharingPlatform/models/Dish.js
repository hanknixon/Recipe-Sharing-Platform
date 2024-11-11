const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    title: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [String], required: true }, // This defines ingredients as an array of strings
    instructions: { type: [String], required: true }, // This ensures instructions are an array of strings
    prepTime: { type: Number, required: true },
    extras: { type: [String], required: true },
    specialNote: { type: String, required: false }
});

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;
