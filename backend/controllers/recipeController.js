const asyncHandler = require('express-async-handler');
const Recipe = require('../models/Recipe');
const User = require('../models/User');

// @desc    Get recipes
// @route   GET /api/recipes
// @access  Public
const getRecipes = asyncHandler(async (req, res) => {
    const { keyword, category } = req.query;

    let query = {};

    if (keyword) {
        query.title = { $regex: keyword, $options: 'i' };
    }

    if (category) {
        query.category = category;
    }

    const recipes = await Recipe.find(query).populate('user', 'name');
    res.status(200).json(recipes);
});

// @desc    Get single recipe
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id).populate('user', 'name');
    if (recipe) {
        res.status(200).json(recipe);
    } else {
        res.status(404);
        throw new Error('Recipe not found');
    }
});

// @desc    Set recipe
// @route   POST /api/recipes
// @access  Private
const createRecipe = asyncHandler(async (req, res) => {
    if (!req.body.title || !req.body.description || !req.body.category) {
        res.status(400);
        throw new Error('Please add required fields');
    }

    const recipe = await Recipe.create({
        user: req.user.id,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        ingredients: req.body.ingredients,
        steps: req.body.steps,
        image: req.file ? req.file.path : req.body.image, // Use uploaded file or URL string
        videoUrl: req.body.videoUrl,
        nutritionInfo: req.body.nutritionInfo
    });

    res.status(200).json(recipe);
});

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private
const updateRecipe = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        res.status(404);
        throw new Error('Recipe not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the recipe user
    if (recipe.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const { title, description, category, ingredients, steps, image, videoUrl, calories, protein, fat, nutritionInfo } = req.body;

    const recipeData = {
        title,
        description,
        category,
        ingredients,
        steps,
        image: req.file ? req.file.path : image,
        videoUrl,
        nutritionInfo: nutritionInfo || {
            calories: Number(calories),
            protein: Number(protein),
            fat: Number(fat)
        }
    };

    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, recipeData, {
        new: true,
    });

    res.status(200).json(updatedRecipe);
});

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private
const deleteRecipe = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
        res.status(404);
        throw new Error('Recipe not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the recipe user
    if (recipe.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await recipe.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
};
