const express = require('express');
const recipeService = require('./recipeService');
const userService = require('./userService');

const router = express.Router();

// Middleware to check if user is authenticated
const authenticateUser = (req, res, next) => {
  const username = req.header('X-Username');
  if (!username) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.username = username;
  next();
};

// User routes
router.post('/signup', async (req, res) => {
  try {
    const { username, password, dietaryRestrictions } = req.body;
    const user = await userService.createUser(username, password, dietaryRestrictions);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userService.loginUser(username, password);
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Recipe routes
router.get('/search-recipes', async (req, res) => {
  try {
    const { query, healthLabels } = req.query;
    const recipes = await recipeService.searchAllRecipes(query, healthLabels ? healthLabels.split(',') : []);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/recipes-by-ingredients', async (req, res) => {
  try {
    const { ingredients, healthLabels } = req.query;
    const recipes = await recipeService.getRecipesByIngredients(ingredients.split(','), healthLabels ? healthLabels.split(',') : []);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/recipe/:recipeId', async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { isEdamamRecipe } = req.query;
    const recipe = await recipeService.getRecipe(recipeId, isEdamamRecipe === 'true');
    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ error: 'Recipe not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Favorite recipes routes
router.post('/favorites', authenticateUser, async (req, res) => {
  try {
    const { recipeId, isEdamamRecipe } = req.body;
    await userService.addFavoriteRecipe(req.username, recipeId, isEdamamRecipe);
    res.status(201).json({ message: 'Recipe added to favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/favorites', authenticateUser, async (req, res) => {
  try {
    const favorites = await userService.getFavoriteRecipes(req.username);
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Personal recipes routes
router.post('/personal-recipes', authenticateUser, async (req, res) => {
  try {
    const recipe = req.body;
    const newRecipe = await userService.createPersonalRecipe(req.username, recipe);
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/personal-recipes', authenticateUser, async (req, res) => {
  try {
    const recipes = await userService.getPersonalRecipes(req.username);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/personal-recipes/:recipeId', authenticateUser, async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipe = req.body;
    const updatedRecipe = await userService.updatePersonalRecipe(req.username, recipeId, recipe);
    if (updatedRecipe) {
      res.json(updatedRecipe);
    } else {
      res.status(404).json({ error: 'Recipe not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/personal-recipes/:recipeId', authenticateUser, async (req, res) => {
  try {
    const { recipeId } = req.params;
    const deleted = await userService.deletePersonalRecipe(req.username, recipeId);
    if (deleted) {
      res.json({ message: 'Recipe deleted successfully' });
    } else {
      res.status(404).json({ error: 'Recipe not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dietary information route
router.post('/dietary-info', authenticateUser, async (req, res) => {
  try {
    const { dietaryInfo } = req.body;
    await userService.updateDietaryInfo(req.username, dietaryInfo);
    res.json({ message: 'Dietary information updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Shopping list routes
router.post('/shopping-list', authenticateUser, async (req, res) => {
  try {
    const { itemName, itemQuantity } = req.body;
    await userService.addToShoppingList(req.username, itemName, itemQuantity);
    res.status(201).json({ message: 'Item added to shopping list' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/shopping-list', authenticateUser, async (req, res) => {
  try {
    const shoppingList = await userService.getShoppingList(req.username);
    res.json(shoppingList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recipe rating route
router.post('/rate-recipe', authenticateUser, async (req, res) => {
  try {
    const { userMadeRecipeId, rating, description } = req.body;
    await userService.rateRecipe(req.username, userMadeRecipeId, rating, description);
    res.json({ message: 'Recipe rated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User points routes
router.get('/user-points', authenticateUser, async (req, res) => {
  try {
    const points = await userService.getUserPoints(req.username);
    res.json({ points });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/redeem-points', authenticateUser, async (req, res) => {
  try {
    const { pointsToRedeem } = req.body;
    const result = await userService.redeemPoints(req.username, pointsToRedeem);
    if (result.success) {
      res.json({ message: 'Points redeemed successfully', remainingPoints: result.remainingPoints });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Top rated recipes route
router.get('/top-rated-recipes', async (req, res) => {
  try {
    const { limit } = req.query;
    const topRatedRecipes = await userService.getTopRatedRecipes(limit ? parseInt(limit) : 10);
    res.json(topRatedRecipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Valid health labels route
router.get('/valid-health-labels', (req, res) => {
  const validHealthLabels = recipeService.getValidHealthLabels();
  res.json(validHealthLabels);
});

module.exports = router;