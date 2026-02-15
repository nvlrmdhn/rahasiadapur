const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Minuman', 'Makanan', 'Dessert', 'Lunch', 'Vegan']
    },
    ingredients: {
        type: [String],
        required: true
    },
    steps: {
        type: [String],
        required: true
    },
    image: {
        type: String,
        required: false
    },
    videoUrl: {
        type: String,
        required: false
    },
    nutritionInfo: {
        calories: Number,
        protein: Number,
        fat: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema);
