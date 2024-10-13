const bcrypt = require('bcrypt');
const { query } = require('./db');

const saltRounds = 10; // Number of salt rounds for bcrypt

// User authentication functions
async function createUser(username, password, dietaryRestrictions = '') {
  // Validate username length
  if (username.length > 50) {
    throw new Error('Username must be 50 characters or less');
  }
  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  // Insert new user into the database
  await query('INSERT INTO Users (Username, Password, DietaryRestrictions, Points) VALUES (?, ?, ?, 0)', 
    [username, hashedPassword, dietaryRestrictions]);
  return { username };
}

async function loginUser(username, password) {
  // Fetch user from database
  const [user] = await query('SELECT * FROM Users WHERE Username = ?', [username]);
  // Check if user exists and password is correct
  if (!user || !(await bcrypt.compare(password, user.Password))) {
    throw new Error('Invalid username or password');
  }
  // Return user information if login is successful
  return { 
    username: user.Username, 
    dietaryRestrictions: user.DietaryRestrictions, 
    points: user.Points 
  };
}

// Recipe management functions
function formatPrepTime(prepTime) {
  // Handle invalid input
  if (!prepTime || typeof prepTime !== 'string') {
    return '00:00';
  }
  // Parse hours and minutes
  const [hours, minutes] = prepTime.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    return '00:00';
  }
  // Format time as HH:MM
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

async function createPersonalRecipe(username, recipe) {
  const { recipeName, prepTime, servingSize, prepSteps, ingredientList } = recipe;
  const formattedPrepTime = formatPrepTime(prepTime);
  // Insert new recipe into the database
  const result = await query(
    'INSERT INTO UserMadeRecipe (Username, RecipeName, PrepTime, ServingSize, PrepSteps, IngredientList) VALUES (?, ?, ?, ?, ?, ?)', 
    [username, recipeName, formattedPrepTime, servingSize, prepSteps, ingredientList]
  );
  return { id: result.insertId, ...recipe, prepTime: formattedPrepTime };
}

async function getPersonalRecipes(username) {
  // Fetch all personal recipes for a user
  return await query('SELECT * FROM UserMadeRecipe WHERE Username = ?', [username]);
}

async function updatePersonalRecipe(username, recipeId, recipe) {
  const { recipeName, prepTime, servingSize, prepSteps, ingredientList } = recipe;
  const formattedPrepTime = formatPrepTime(prepTime);
  
  const params = [
    recipeName || null,
    formattedPrepTime,
    servingSize || null,
    prepSteps || null,
    ingredientList || null,
    recipeId,
    username
  ];

  // Update recipe in the database
  await query(
    'UPDATE UserMadeRecipe SET RecipeName = ?, PrepTime = ?, ServingSize = ?, PrepSteps = ?, IngredientList = ? WHERE UserMadeRecipeID = ? AND Username = ?', 
    params
  );
  
  return { id: recipeId, ...recipe, prepTime: formattedPrepTime };
}

async function deletePersonalRecipe(username, recipeId) {
  // Delete recipe from the database
  const result = await query('DELETE FROM UserMadeRecipe WHERE UserMadeRecipeID = ? AND Username = ?', [recipeId, username]);
  return result.affectedRows > 0;
}

// Favorite recipes functions
async function addFavoriteRecipe(username, recipeId, isEdamamRecipe) {
  // Add a recipe to user's favorites
  await query('INSERT INTO UserSavedRecipe (Username, RecipeID, isEdamamRecipe) VALUES (?, ?, ?)', 
    [username, recipeId, isEdamamRecipe]);
}

async function getFavoriteRecipes(username) {
  // Fetch all favorite recipes for a user
  return await query('SELECT * FROM UserSavedRecipe WHERE Username = ?', [username]);
}

// User profile functions
async function updateDietaryInfo(username, dietaryInfo) {
  // Update user's dietary information
  await query('UPDATE Users SET DietaryRestrictions = ? WHERE Username = ?', [dietaryInfo, username]);
  return true;
}

// Shopping list functions
async function addToShoppingList(username, itemName, itemQuantity) {
  // Add item to user's shopping list
  await query('INSERT INTO ShoppingList (Username, ItemName, ItemQuantity) VALUES (?, ?, ?)', 
    [username, itemName, itemQuantity]);
}

async function getShoppingList(username) {
  // Fetch user's shopping list
  return await query('SELECT * FROM ShoppingList WHERE Username = ?', [username]);
}

// Recipe rating and points system
async function rateRecipe(username, userMadeRecipeId, rating, description = '') {
  // Add a review for a recipe
  await query('INSERT INTO Reviews (Username, UserMadeRecipeID, Rating, Description) VALUES (?, ?, ?, ?)', 
    [username, userMadeRecipeId, rating, description]);
  
  // Award points for high ratings
  if (rating >= 4) {
    const pointsToAdd = rating === 5 ? 5 : 3;
    await query(
      'UPDATE Users SET Points = Points + ? WHERE Username = (SELECT Username FROM UserMadeRecipe WHERE UserMadeRecipeID = ?)', 
      [pointsToAdd, userMadeRecipeId]
    );
  }
}

async function getUserPoints(username) {
  // Fetch user's points
  const [user] = await query('SELECT Points FROM Users WHERE Username = ?', [username]);
  return user ? user.Points : 0;
}

async function redeemPoints(username, pointsToRedeem) {
  // Check if user has enough points and redeem them
  const [user] = await query('SELECT Points FROM Users WHERE Username = ?', [username]);
  if (user && user.Points >= pointsToRedeem) {
    await query('UPDATE Users SET Points = Points - ? WHERE Username = ?', [pointsToRedeem, username]);
    return { success: true, remainingPoints: user.Points - pointsToRedeem };
  }
  return { success: false, message: 'Insufficient points' };
}

// Top rated recipes
async function getTopRatedRecipes(limit = 10) {
  // Fetch top rated recipes
  return await query(`
    SELECT r.UserMadeRecipeID, r.Username, r.RecipeName, r.PrepTime, r.ServingSize, r.PrepSteps, r.IngredientList, 
           AVG(rv.Rating) as AverageRating, COUNT(rv.Rating) as RatingCount
    FROM UserMadeRecipe r
    LEFT JOIN Reviews rv ON r.UserMadeRecipeID = rv.UserMadeRecipeID
    GROUP BY r.UserMadeRecipeID
    ORDER BY AverageRating DESC, RatingCount DESC
    LIMIT ?
  `, [limit]);
}

module.exports = {
  createUser,
  loginUser,
  addFavoriteRecipe,
  getFavoriteRecipes,
  createPersonalRecipe,
  getPersonalRecipes,
  updatePersonalRecipe,
  deletePersonalRecipe,
  updateDietaryInfo,
  addToShoppingList,
  getShoppingList,
  rateRecipe,
  getUserPoints,
  redeemPoints,
  getTopRatedRecipes
};
