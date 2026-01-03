import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConsumerNavbar from "../components/ConsumerNavbar";
import "./RecipeFinder.css";

const RecipeFinder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [servings, setServings] = useState(1);
  const [ingredients, setIngredients] = useState([]);
  const [matchedIngredients, setMatchedIngredients] = useState([]);
  const [showIngredients, setShowIngredients] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Search recipes
  const handleSearchRecipes = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a recipe name");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        "https://farmtohome-pt2e.onrender.com/api/recipes/search",
        {
          params: { query: searchQuery, number: 8 },
        }
      );
      setRecipes(response.data.results || []);
      setSelectedRecipe(null);
      setMatchedIngredients([]);
      setShowIngredients(false);
    } catch (err) {
      console.error("Error searching recipes:", err.message);
      alert("Failed to search recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get recipe details and ingredients
  const handleSelectRecipe = async (recipe) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://farmtohome-pt2e.onrender.com/api/recipes/${recipe.id}`
      );

      setSelectedRecipe(response.data);
      setIngredients(response.data.extendedIngredients || []);
      setServings(response.data.servings || 1);

      // Match ingredients with products (send recipeServings + desired servings)
      const matchResponse = await axios.post(
        "https://farmtohome-pt2e.onrender.com/api/recipes/match-ingredients",
        {
          ingredients: response.data.extendedIngredients.map((ing) => ({
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
          })),
          // initial desired servings = recipe's servings
          servings: response.data.servings || 1,
          recipeServings: response.data.servings || 1,
        }
      );

      // Deduplicate matched ingredients by name (preserve order)
      const incoming = matchResponse.data.ingredients || [];
      const deduped = [];
      const seen = new Set();
      for (const item of incoming) {
        const key = (item.ingredient || "").toLowerCase().trim();
        if (!seen.has(key)) {
          deduped.push(item);
          seen.add(key);
        }
      }
      setMatchedIngredients(deduped);
      setShowIngredients(true);
      setSelectedItems({});
    } catch (err) {
      console.error("Error getting recipe details:", err.message);
      alert("Failed to fetch recipe details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (index, newQuantity) => {
    const updated = [...matchedIngredients];
    updated[index].calculatedAmount = newQuantity;
    setMatchedIngredients(updated);
  };

  // Add selected items to cart
  const handleAddToCart = async () => {
    if (Object.keys(selectedItems).length === 0) {
      alert("Please select at least one vegetable");
      return;
    }

    if (!token) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      for (const [ingredientIndex, productId] of Object.entries(selectedItems)) {
        const ingredient = matchedIngredients[ingredientIndex];
        const product = ingredient.matchedProducts.find(
          (p) => p._id === productId
        );

        if (product) {
          // Add to cart with quantity (use correct endpoint)
          await axios.post(
            "https://farmtohome-pt2e.onrender.com/api/users/cart/add",
            {
              productId: product._id,
              quantity: Math.ceil(ingredient.calculatedAmount), // Round up to nearest whole number
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
      }

      alert("All items added to cart!");
      navigate("/cart");
    } catch (err) {
      console.error("Error adding to cart:", err.message);
      alert("Failed to add items to cart");
    }
  };

  return (
    <div className="recipe-finder-container">
      <ConsumerNavbar hideSearch={true} />

      <div className="recipe-finder-content">
        {/* Search Section */}
        <div className="recipe-search-section">
          <h1>🍳 Find Recipes & Get Ingredients</h1>
          <p>Search for a recipe and we'll show you which vegetables are available</p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search recipe (e.g., Tomato Pasta, Salad, Curry)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSearchRecipes();
              }}
              className="recipe-search-input"
            />
            <button
              onClick={handleSearchRecipes}
              disabled={loading}
              className="recipe-search-btn"
            >
              {loading ? "Searching..." : "🔍 Search"}
            </button>
          </div>
        </div>

        {/* Recipes Grid */}
        {recipes.length > 0 && !showIngredients && (
          <div className="recipes-grid">
            <h2>Available Recipes</h2>
            <div className="grid">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="recipe-card"
                  onClick={() => handleSelectRecipe(recipe)}
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="recipe-image"
                  />
                  <h3>{recipe.title}</h3>
                  <p className="recipe-servings">
                    👥 {recipe.servings} Servings
                  </p>
                  <button className="select-recipe-btn">Select Recipe</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ingredients Matching Section */}
        {showIngredients && matchedIngredients.length > 0 && (
          <div className="ingredients-section">
            <div className="ingredients-header">
              <h2>📋 Recipe: {selectedRecipe?.title}</h2>
              <button
                className="back-btn"
                onClick={() => {
                  setShowIngredients(false);
                  setSelectedRecipe(null);
                }}
              >
                ← Back to Recipes
              </button>
            </div>

            {/* Servings Selector */}
            <div className="servings-selector">
              <label>Number of Members/Servings:</label>
              <div className="servings-controls">
                <button
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="servings-btn"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={servings}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setServings(Math.min(10, Math.max(1, val)));
                    // Recalculate quantities
                    const updated = matchedIngredients.map((ing) => ({
                      ...ing,
                      calculatedAmount:
                        ing.originalAmount * (val / (selectedRecipe?.servings || 1)),
                    }));
                    setMatchedIngredients(updated);
                  }}
                  className="servings-input"
                />
                <button
                  onClick={() => setServings(Math.min(10, servings + 1))}
                  className="servings-btn"
                >
                  +
                </button>
              </div>
            </div>

            {/* Ingredients Table */}
            <div className="ingredients-table-container">
              <table className="ingredients-table">
                <thead>
                  <tr>
                    <th>Ingredient</th>
                    <th>Needed (Calculated)</th>
                    <th>Available in Our Store</th>
                    <th>Select & Customize</th>
                  </tr>
                </thead>
                <tbody>
                  {matchedIngredients.map((ingredient, index) => (
                    <tr
                      key={index}
                      className={ingredient.found ? "" : "not-found"}
                    >
                      <td>
                        <strong>{ingredient.ingredient}</strong>
                      </td>
                      <td>
                        <div className="quantity-editor">
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={ingredient.calculatedAmount.toFixed(2)}
                            onChange={(e) =>
                              handleQuantityChange(index, parseFloat(e.target.value))
                            }
                            className="quantity-input"
                          />
                          <span className="unit">{ingredient.calculatedUnit}</span>
                        </div>
                      </td>
                      <td>
                        {ingredient.found ? (
                          <div className="products-list">
                            {ingredient.matchedProducts.map((product) => (
                              <div
                                key={product._id}
                                className={`product-option ${
                                  selectedItems[index] === product._id
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() =>
                                  setSelectedItems({
                                    ...selectedItems,
                                    [index]: product._id,
                                  })
                                }
                              >
                                <div className="product-info">
                                  <span className="product-name">
                                    {product.name}
                                  </span>
                                  <span className="product-price">
                                    ₹{product.pricePerKg}/kg
                                  </span>
                                </div>
                                <input
                                  type="radio"
                                  checked={selectedItems[index] === product._id}
                                  onChange={() =>
                                    setSelectedItems({
                                      ...selectedItems,
                                      [index]: product._id,
                                    })
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="not-available">
                            ❌ Not Available
                          </span>
                        )}
                      </td>
                      <td>
                        {ingredient.found && selectedItems[index] && (
                          <span className="selected-check">✓</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add to Cart Button */}
            <div className="action-buttons">
              <button
                onClick={handleAddToCart}
                disabled={Object.keys(selectedItems).length === 0}
                className="add-to-cart-btn"
              >
                🛒 Add Selected to Cart ({Object.keys(selectedItems).length})
              </button>
            </div>

            {/* Recipe Info removed per user request */}
          </div>
        )}

        {/* Empty State */}
        {!loading && recipes.length === 0 && !showIngredients && (
          <div className="empty-state">
            <p>🔍 Search for a recipe to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeFinder;
