const express = require('express');
const router = express.Router();
const { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe } = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/').get(getRecipes).post(protect, upload.single('image'), createRecipe);
router.route('/:id').get(protect, getRecipeById).put(protect, updateRecipe).delete(protect, deleteRecipe);

module.exports = router;
