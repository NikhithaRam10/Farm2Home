# Recipe Finder Feature - Setup Guide

## Overview
This feature allows consumers to:
1. Search for recipes using Spoonacular API
2. See all ingredients needed for the recipe
3. View which vegetables are available in your platform
4. Adjust quantities based on number of servings/members
5. Add selected items directly to cart

---

## Backend Setup

### 1. Install Axios (if not already installed)
```bash
cd server
npm install axios
```

### 2. Set Spoonacular API Key
Add this to your `.env` file in the server directory:
```
SPOONACULAR_API_KEY=0d8b8ee14d8048a9a0e64a87a4eff2a0
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

**Get a free API key from:** https://spoonacular.com/food-api
- Free tier: 150 requests/day
- Go to https://spoonacular.com/food-api and sign up

### 3. Files Created/Modified:
- ✅ `controllers/recipeController.js` - Recipe API logic
- ✅ `routes/recipeRoutes.js` - Recipe endpoints
- ✅ `server.js` - Added recipe routes

---

## Frontend Setup

### 1. Files Created/Modified:
- ✅ `pages/RecipeFinder.jsx` - Main recipe finder page
- ✅ `pages/RecipeFinder.css` - Styling
- ✅ `components/ConsumerNavbar.jsx` - Added "Recipes" button
- ✅ `App.jsx` - Added route for recipe-finder

### 2. No additional packages needed (uses existing axios)

---

## How to Use

### For Consumers:
1. **Click "Recipes" button** in the Consumer navbar (🍳 icon)
2. **Search for a recipe** (e.g., "Tomato Pasta", "Salad", "Curry")
3. **Select a recipe** from results
4. **Adjust servings** using +/- buttons or input field
5. **Select vegetables** you want from available options
6. **Click "Add to Cart"** - items are added with calculated quantities

### Key Features:
- **Quantity Calculator**: Automatically adjusts ingredient quantities based on servings
- **Editable Quantities**: Users can modify calculated amounts before adding to cart
- **Available/Not Available**: Shows which ingredients are in stock
- **Product Info**: Display price and quantity of each matching product

---

## API Endpoints

### Recipe Endpoints:

**1. Search Recipes**
```
GET /api/recipes/search?query=tomato&number=10
Response: { results: [...] }
```

**2. Get Recipe Details**
```
GET /api/recipes/{recipeId}
Response: { recipe details with ingredients }
```

**3. Match Ingredients with Products**
```
POST /api/recipes/match-ingredients
Body: {
  ingredients: [{ name: "tomato", amount: 2, unit: "piece" }],
  servings: 2
}
Response: {
  ingredients: [{ 
    ingredient: "tomato", 
    calculatedAmount: 4, 
    matchedProducts: [...] 
  }]
}
```

---

## Troubleshooting

### Issue: "Failed to search recipes"
- Check if Spoonacular API key is correct in `.env`
- Check API rate limit (free tier = 150/day)
- Verify internet connection

### Issue: "No vegetables matching"
- Ingredients might not match database vegetable names
- Update `similarityMatch` function in `recipeController.js` for better matching
- Add more keywords to the keywords object

### Issue: Cart not working
- Ensure user is logged in
- Check if cart route is accessible from `userRoutes.js`

---

## Future Improvements

1. **Better Ingredient Matching**: Use fuzzy search or ML
2. **Allergen Filtering**: Show allergen warnings
3. **Nutritional Info**: Display calories, protein, etc.
4. **Save Favorite Recipes**: Allow users to bookmark recipes
5. **Dietary Preferences**: Filter recipes by vegan, gluten-free, etc.
6. **Recipe Ratings**: Let users rate recipes they've cooked

---

## Testing

1. Start your server: `npm start` (in server directory)
2. Start your client: `npm run dev` (in client directory)
3. Navigate to Consumer Dashboard
4. Click "Recipes" button
5. Try searching for a recipe like "pasta", "soup", or "salad"

---

## Files Summary

```
Backend:
✅ server/controllers/recipeController.js (NEW)
✅ server/routes/recipeRoutes.js (NEW)
✅ server/server.js (MODIFIED)

Frontend:
✅ client/src/pages/RecipeFinder.jsx (NEW)
✅ client/src/pages/RecipeFinder.css (NEW)
✅ client/src/components/ConsumerNavbar.jsx (MODIFIED)
✅ client/src/App.jsx (MODIFIED)
```

---

**Happy cooking! 🍳**
