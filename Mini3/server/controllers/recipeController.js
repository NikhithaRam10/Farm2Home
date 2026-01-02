const axios = require("axios");
const Product = require("../models/Product");

// Spoonacular API Key - Get free key from https://spoonacular.com/food-api
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY || "0d8b8ee14d8048a9a0e64a87a4eff2a0"; // Replace with your API key

// Mock recipes database (fallback when API key is invalid)
const mockRecipes = [
  {
    id: 1,
    title: "Tomato Pasta",
    image: "https://via.placeholder.com/300x200?text=Tomato+Pasta",
    servings: 4,
    extendedIngredients: [
      { id: 1, name: "tomato", amount: 5, unit: "pieces" },
      { id: 2, name: "garlic", amount: 3, unit: "cloves" },
      { id: 3, name: "onion", amount: 1, unit: "piece" },
      { id: 4, name: "spinach", amount: 200, unit: "grams" },
    ],
    summary: "A classic Italian pasta with fresh tomato sauce",
  },
  {
    id: 2,
    title: "Vegetable Salad",
    image: "https://via.placeholder.com/300x200?text=Vegetable+Salad",
    servings: 2,
    extendedIngredients: [
      { id: 1, name: "cucumber", amount: 1, unit: "piece" },
      { id: 2, name: "tomato", amount: 2, unit: "pieces" },
      { id: 3, name: "lettuce", amount: 1, unit: "head" },
      { id: 4, name: "carrot", amount: 1, unit: "piece" },
    ],
    summary: "Fresh and healthy vegetable salad",
  },
  {
    id: 3,
    title: "Vegetable Curry",
    image: "https://via.placeholder.com/300x200?text=Vegetable+Curry",
    servings: 4,
    extendedIngredients: [
      { id: 1, name: "potato", amount: 3, unit: "pieces" },
      { id: 2, name: "onion", amount: 2, unit: "pieces" },
      { id: 3, name: "tomato", amount: 3, unit: "pieces" },
      { id: 4, name: "carrot", amount: 2, unit: "pieces" },
      { id: 5, name: "spinach", amount: 100, unit: "grams" },
    ],
    summary: "Delicious Indian-style vegetable curry",
  },
  {
    id: 4,
    title: "Broccoli Stir Fry",
    image: "https://via.placeholder.com/300x200?text=Broccoli+Stir+Fry",
    servings: 3,
    extendedIngredients: [
      { id: 1, name: "broccoli", amount: 1, unit: "head" },
      { id: 2, name: "garlic", amount: 2, unit: "cloves" },
      { id: 3, name: "onion", amount: 1, unit: "piece" },
      { id: 4, name: "carrot", amount: 1, unit: "piece" },
    ],
    summary: "Quick and healthy broccoli stir fry",
  },
];

// Search recipes
const searchRecipes = async (req, res) => {
  try {
    const { query, number = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Recipe query is required" });
    }

    // Filter mock recipes by query
    const filtered = mockRecipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(query.toLowerCase())
    );

    const results = filtered.slice(0, number).map((r) => ({
      id: r.id,
      title: r.title,
      image: r.image,
      servings: r.servings,
    }));

    // If we have results, return them. Otherwise, try Spoonacular API
    if (results.length > 0) {
      return res.json({ results });
    }

    // Try Spoonacular API as fallback
    if (!SPOONACULAR_API_KEY || SPOONACULAR_API_KEY === "0d8b8ee14d8048a9a0e64a87a4eff2a0") {
      console.warn(
        "⚠️ Using mock recipes. To use real recipes, add a valid Spoonacular API key to .env"
      );
      return res.json({ results: mockRecipes.slice(0, number) });
    }

    try {
      const response = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {
        params: {
          query,
          number,
          apiKey: SPOONACULAR_API_KEY,
          addRecipeInformation: true,
        },
        timeout: 5000,
      });

      return res.json(response.data);
    } catch (apiErr) {
      console.warn("Spoonacular API unavailable, returning mock results.", apiErr.message);
      return res.json({ results: mockRecipes.slice(0, number) });
    }
  } catch (err) {
    console.error("Error searching recipes:", err.message);
    // Fallback to mock recipes on error
    const filtered = mockRecipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(req.query.query.toLowerCase())
    );
    res.json({ results: filtered.slice(0, req.query.number || 10) });
  }
};

// Get recipe details with ingredients
const getRecipeDetails = async (req, res) => {
  try {
    const { recipeId } = req.params;

    if (!recipeId) {
      return res.status(400).json({ message: "Recipe ID is required" });
    }

    // Check mock recipes first
    const mockRecipe = mockRecipes.find((r) => r.id === parseInt(recipeId));
    if (mockRecipe) {
      return res.json(mockRecipe);
    }

    // Try Spoonacular API
    if (!SPOONACULAR_API_KEY || SPOONACULAR_API_KEY === "0d8b8ee14d8048a9a0e64a87a4eff2a0") {
      return res.status(404).json({ message: "Recipe not found" });
    }

    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${recipeId}/information`,
        {
          params: {
            apiKey: SPOONACULAR_API_KEY,
          },
          timeout: 5000,
        }
      );

      return res.json(response.data);
    } catch (apiErr) {
      console.warn("Spoonacular details API unavailable for id", recipeId, apiErr.message);
      return res.status(404).json({ message: "Recipe not found" });
    }
  } catch (err) {
    console.error("Error fetching recipe details:", err.message);
    res.status(500).json({ message: "Failed to fetch recipe details", error: err.message });
  }
};

// Match recipe ingredients with available products
const matchIngredientsWithProducts = async (req, res) => {
  try {
    const { ingredients, servings = 1, recipeServings } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: "Ingredients array is required" });
    }

    // Get all available products
    const products = await Product.find();

    // desired servings (what user wants)
    const desiredServings = servings || 1;
    // original recipe servings (if provided). If not provided, assume 1.
    const origServings = recipeServings || 1;

    // helper: token intersection match
    const tokenMatch = (a, b) => {
      const t1 = a.split(/\W+/).filter(Boolean);
      const t2 = b.split(/\W+/).filter(Boolean);
      return t1.some((tok) => t2.includes(tok)) || t2.some((tok) => t1.includes(tok));
    };

    // Match ingredients with products and normalize units
    const matchedResults = ingredients.map((ingredient) => {
      const ingredientName = (ingredient.name || "").toLowerCase();
      const amount = parseFloat(ingredient.amount) || 1;
      const unit = (ingredient.unit || "unit").toLowerCase();

      // Find matching products in database
      const matchedProducts = products.filter((product) => {
        const productNameLower = (product.name || "").toLowerCase();

        // Exact or partial token match
        if (productNameLower.includes(ingredientName) || ingredientName.includes(productNameLower)) {
          return true;
        }

        if (tokenMatch(ingredientName, productNameLower)) return true;

        // fallback to keyword mapping
        if (similarityMatch(ingredientName, productNameLower)) return true;

        return false;
      });

      // Scale amount according to desired servings vs original recipe servings
      const scaledAmount = amount * (desiredServings / Math.max(1, origServings));

      // Normalize units to kg when possible, otherwise treat as units
      const convertToKg = (amt, u) => {
        if (!u) return { kg: null, units: null };
        const uu = u.toLowerCase();
        if (uu.includes("g") || uu.includes("gram")) {
          return { kg: amt / 1000, units: null };
        }
        if (uu.includes("kg") || uu.includes("kilogram")) {
          return { kg: amt, units: null };
        }
        if (uu.includes("pound") || uu === "lb" || uu === "lbs" || uu === "pounds") {
          return { kg: amt * 0.453592, units: null };
        }
        if (uu.includes("ounce") || uu === "oz") {
          return { kg: amt * 0.0283495, units: null };
        }
        // pieces / unit / medium / tablespoon etc -> treat as count/units
        return { kg: null, units: amt };
      };

      const normalized = convertToKg(scaledAmount, unit);

      return {
        ingredient: ingredient.name,
        originalAmount: amount,
        originalUnit: unit,
        calculatedAmount: scaledAmount,
        calculatedUnit: unit,
        calculatedAmountKg: normalized.kg, // null if not weight-based
        calculatedAmountUnits: normalized.units, // null if weight-based
        matchedProducts: matchedProducts.map((p) => ({
          _id: p._id,
          name: p.name,
          pricePerKg: p.pricePerKg,
          quantity: p.quantity,
          description: p.description,
          images: p.images,
        })),
        found: matchedProducts.length > 0,
      };
    });

    // Deduplicate ingredients by normalized name (preserve first occurrence)
    const unique = [];
    const seen = new Set();
    for (const item of matchedResults) {
      const key = (item.ingredient || "").toLowerCase().trim();
      if (!seen.has(key)) {
        unique.push(item);
        seen.add(key);
      }
    }

    res.json({
      ingredients: unique,
      servings: desiredServings,
      totalItems: unique.length,
      matchedCount: unique.filter((r) => r.found).length,
    });
  } catch (err) {
    console.error("Error matching ingredients:", err.message);
    res.status(500).json({ message: "Failed to match ingredients", error: err.message });
  }
};

// Simple similarity match helper
const similarityMatch = (str1, str2) => {
  const keywords = {
    tomato: ["tomato", "tomatoes"],
    onion: ["onion", "onions"],
    garlic: ["garlic"],
    potato: ["potato", "potatoes"],
    carrot: ["carrot", "carrots"],
    spinach: ["spinach", "leaf spinach"],
    broccoli: ["broccoli"],
    lettuce: ["lettuce"],
    cucumber: ["cucumber", "cucumbers"],
    pepper: ["bell pepper", "pepper", "peppers"],
    cabbage: ["cabbage"],
    beans: ["bean", "beans"],
    peas: ["pea", "peas"],
    corn: ["corn", "maize"],
  };

  for (const [key, values] of Object.entries(keywords)) {
    if (values.some((v) => str1.includes(v)) && values.some((v) => str2.includes(v))) {
      return true;
    }
  }

  return false;
};

module.exports = {
  searchRecipes,
  getRecipeDetails,
  matchIngredientsWithProducts,
};
