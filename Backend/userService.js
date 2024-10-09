const bcrypt = require('bcrypt');
const { query } = require('./db');

const saltRounds = 10;

async function createUser(username, password, dietaryRestrictions = '') {
  if (username.length > 50) {
    throw new Error('Username must be 50 characters or less');
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  await query('INSERT INTO Users (Username, Password, DietaryRestrictions, Points) VALUES (?, ?, ?, 0)', [username, hashedPassword, dietaryRestrictions]);
  return { username };
}

async function loginUser(username, password) {
  const [user] = await query('SELECT * FROM Users WHERE Username = ?', [username]);
  if (!user) {
    throw new Error('User not found');
  }
  const match = await bcrypt.compare(password, user.Password);
  if (!match) {
    throw new Error('Invalid password');
  }
  return { username: user.Username, dietaryRestrictions: user.DietaryRestrictions, points: user.Points };
}

async function addFavoriteRecipe(username, recipeId, isEdamamRecipe) {
  await query('INSERT INTO UserSavedRecipe (Username, RecipeID, isEdamamRecipe) VALUES (?, ?, ?)', [username, recipeId, isEdamamRecipe]);
}

async function getFavoriteRecipes(username) {
  return await query('SELECT * FROM UserSavedRecipe WHERE Username = ?', [username]);
}

async function createPersonalRecipe(username, recipe) {
  const { recipeName, prepTime, servingSize, prepSteps, ingredientList } = recipe;
  const result = await query('INSERT INTO UserMadeRecipe (Username, RecipeName, PrepTime, ServingSize, PrepSteps, IngredientList) VALUES (?, ?, ?, ?, ?, ?)', 
    [username, recipeName, prepTime, servingSize, prepSteps, ingredientList]);
  return { id: result.insertId, ...recipe };
}

async function getPersonalRecipes(username) {
  return await query('SELECT * FROM UserMadeRecipe WHERE Username = ?', [username]);
}

async function updatePersonalRecipe(username, recipeId, recipe) {
  const { recipeName, prepTime, servingSize, prepSteps, ingredientList } = recipe;
  await query('UPDATE UserMadeRecipe SET RecipeName = ?, PrepTime = ?, ServingSize = ?, PrepSteps = ?, IngredientList = ? WHERE UserMadeRecipeID = ? AND Username = ?',
    [recipeName, prepTime, servingSize, prepSteps, ingredientList, recipeId, username]);
  return { id: recipeId, ...recipe };
}

async function deletePersonalRecipe(username, recipeId) {
  const result = await query('DELETE FROM UserMadeRecipe WHERE UserMadeRecipeID = ? AND Username = ?', [recipeId, username]);
  return result.affectedRows > 0;
}

async function updateDietaryInfo(username, dietaryInfo) {
  await query('UPDATE Users SET DietaryRestrictions = ? WHERE Username = ?', [dietaryInfo, username]);
  return true;
}

async function addToShoppingList(username, itemName, itemQuantity) {
  await query('INSERT INTO ShoppingList (Username, ItemName, ItemQuantity) VALUES (?, ?, ?)', [username, itemName, itemQuantity]);
}

async function getShoppingList(username) {
  return await query('SELECT * FROM ShoppingList WHERE Username = ?', [username]);
}

async function rateRecipe(username, userMadeRecipeId, rating, description = '') {
  await query('INSERT INTO Reviews (Username, UserMadeRecipeID, Rating, Description) VALUES (?, ?, ?, ?)', [username, userMadeRecipeId, rating, description]);
  
  if (rating >= 4) {
    const pointsToAdd = rating === 5 ? 5 : 3;
    await query('UPDATE Users SET Points = Points + ? WHERE Username = (SELECT Username FROM UserMadeRecipe WHERE UserMadeRecipeID = ?)', [pointsToAdd, userMadeRecipeId]);
  }
}

async function getUserPoints(username) {
  const [user] = await query('SELECT Points FROM Users WHERE Username = ?', [username]);
  return user ? user.Points : 0;
}

async function redeemPoints(username, pointsToRedeem) {
  const [user] = await query('SELECT Points FROM Users WHERE Username = ?', [username]);
  if (user && user.Points >= pointsToRedeem) {
    await query('UPDATE Users SET Points = Points - ? WHERE Username = ?', [pointsToRedeem, username]);
    return { success: true, remainingPoints: user.Points - pointsToRedeem };
  }
  return { success: false, message: 'Insufficient points' };
}

async function getTopRatedRecipes(limit = 10) {
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