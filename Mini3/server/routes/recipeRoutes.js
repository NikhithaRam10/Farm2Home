const express = require("express");
const {
  searchRecipes,
  getRecipeDetails,
  matchIngredientsWithProducts,
} = require("../controllers/recipeController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Search recipes (public)
router.get("/search", searchRecipes);

// Get recipe details (public)
router.get("/:recipeId", getRecipeDetails);

// Match ingredients with products (requires auth to add to cart later)
router.post("/match-ingredients", matchIngredientsWithProducts);

module.exports = router;
