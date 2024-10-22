const bcrypt = require('bcrypt')
const { query } = require('./db')

const saltRounds = 10 // Number of salt rounds for bcrypt

// User authentication functions
async function createUser(username, password, dietaryRestrictions = '') {
  // Validate username length
  if (username.length > 50) {
    throw new Error('Username must be 50 characters or less')
  }
  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  // Insert new user into the database
  await query(
    'INSERT INTO Users (Username, Password, DietaryRestrictions, Points) VALUES (?, ?, ?, 0)',
    [username, hashedPassword, dietaryRestrictions]
  )
  return { username }
}

async function loginUser(username, password) {
  // Fetch user from database
  const [user] = await query('SELECT * FROM Users WHERE Username = ?', [username])
  // Check if user exists and password is correct
  if (!user || !(await bcrypt.compare(password, user.Password))) {
    throw new Error('Invalid username or password')
  }
  // Return user information if login is successful
  return {
    username: user.Username,
    dietaryRestrictions: user.DietaryRestrictions,
    points: user.Points
  }
}

// New function to check if a username already exists
async function checkUsernameExists(username) {
  const [user] = await query('SELECT Username FROM Users WHERE Username = ?', [username])
  return !!user
}

// Recipe management functions
function formatPrepTime(prepTime) {
  // Handle invalid input
  if (!prepTime || typeof prepTime !== 'string') {
    return '00:00'
  }
  // Parse hours and minutes
  const [hours, minutes] = prepTime.split(':').map(Number)
  if (isNaN(hours) || isNaN(minutes)) {
    return '00:00'
  }
  // Format time as HH:MM
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

async function createPersonalRecipe(username, recipe) {
  const { recipeName, prepTime, servingSize, prepSteps, ingredientList } = recipe
  const formattedPrepTime = formatPrepTime(prepTime)
  // Insert new recipe into the database
  const result = await query(
    'INSERT INTO UserMadeRecipe (Username, RecipeName, PrepTime, ServingSize, PrepSteps, IngredientList) VALUES (?, ?, ?, ?, ?, ?)',
    [username, recipeName, formattedPrepTime, servingSize, prepSteps, ingredientList]
  )
  return { id: result.insertId, ...recipe, prepTime: formattedPrepTime }
}

async function getPersonalRecipes(username) {
  // Fetch all personal recipes for a user
  return await query('SELECT * FROM UserMadeRecipe WHERE Username = ?', [username])
}

async function getAllPersonalRecipes() {
  // Fetch all personal recipes in the database
  return await query('SELECT * FROM UserMadeRecipe')
}

async function updatePersonalRecipe(username, recipeId, recipe) {
  console.log('Updating recipe:', { username, recipeId, recipe }) // Debug log

  // Fetch the existing recipe
  const [existingRecipe] = await query(
    'SELECT * FROM UserMadeRecipe WHERE UserMadeRecipeID = ? AND Username = ?',
    [recipeId, username]
  )

  console.log('Existing recipe:', existingRecipe) // Debug log

  if (!existingRecipe) {
    throw new Error('Recipe not found or does not belong to the user')
  }

  // Prepare the update object by comparing with existing recipe
  const updateFields = {}
  if (recipe.RecipeName !== existingRecipe.RecipeName) updateFields.RecipeName = recipe.RecipeName
  if (recipe.PrepTime !== existingRecipe.PrepTime)
    updateFields.PrepTime = formatPrepTime(recipe.PrepTime)
  if (recipe.ServingSize !== existingRecipe.ServingSize)
    updateFields.ServingSize = recipe.ServingSize
  if (recipe.PrepSteps !== existingRecipe.PrepSteps) updateFields.PrepSteps = recipe.PrepSteps
  if (recipe.IngredientList !== existingRecipe.IngredientList)
    updateFields.IngredientList = recipe.IngredientList

  console.log('Update fields:', updateFields) // Debug log

  // If no fields to update, return the existing recipe
  if (Object.keys(updateFields).length === 0) {
    console.log('No fields to update') // Debug log
    return existingRecipe
  }

  // Construct the SQL query dynamically
  const setClause = Object.keys(updateFields)
    .map((key) => `${key} = ?`)
    .join(', ')
  const params = [...Object.values(updateFields), recipeId, username]

  const updateQuery = `UPDATE UserMadeRecipe SET ${setClause} WHERE UserMadeRecipeID = ? AND Username = ?`
  console.log('Update query:', updateQuery) // Debug log
  console.log('Update params:', params) // Debug log

  // Update recipe in the database
  await query(updateQuery, params)

  // Fetch and return the updated recipe
  const [updatedRecipe] = await query('SELECT * FROM UserMadeRecipe WHERE UserMadeRecipeID = ?', [
    recipeId
  ])

  console.log('Updated recipe:', updatedRecipe) // Debug log

  return updatedRecipe
}

async function deletePersonalRecipe(username, recipeId) {
  // Delete recipe from the database
  const result = await query(
    'DELETE FROM UserMadeRecipe WHERE UserMadeRecipeID = ? AND Username = ?',
    [recipeId, username]
  )
  return result.affectedRows > 0
}

// Favorite recipes functions
async function addFavoriteRecipe(username, recipeId, isEdamamRecipe) {
  // Add a recipe to user's favorites
  await query('INSERT INTO UserSavedRecipe (Username, RecipeID, isEdamamRecipe) VALUES (?, ?, ?)', [
    username,
    recipeId,
    isEdamamRecipe
  ])
}

async function getFavoriteRecipes(username) {
  // Fetch all favorite recipes for a user
  return await query('SELECT * FROM UserSavedRecipe WHERE Username = ?', [username])
}

// User profile functions
async function getDietaryInfo(username) {
  // Update user's dietary information
  const [user] = await query('SELECT DietaryRestrictions FROM Users WHERE Username = ?', [username])
  return user ? user.DietaryRestrictions : ""
}

// User profile functions
async function updateDietaryInfo(username, dietaryInfo) {
  // Update user's dietary information
  const newDietaryInfo = dietaryInfo.join(',') // Convert array to comma-separated string

  await query('UPDATE Users SET DietaryRestrictions = ? WHERE Username = ?', [
    newDietaryInfo,
    username
  ])

  return true
}

// Shopping list functions
async function addToShoppingList(username, itemName, itemQuantity) {
  // Add item to user's shopping list
  await query('INSERT INTO ShoppingList (Username, ItemName, ItemQuantity) VALUES (?, ?, ?)', [
    username,
    itemName,
    itemQuantity
  ])
}

async function getShoppingList(username) {
  // Fetch user's shopping list
  return await query('SELECT * FROM ShoppingList WHERE Username = ?', [username])
}

async function deleteFromShoppingList(shoppingListID) {
  // Delete item from user's shopping list
  const result = await query('DELETE FROM ShoppingList WHERE ShoppingListID = ?', [shoppingListID])
  return result.affectedRows > 0
}

// Recipe rating and points system
async function rateRecipe(username, userMadeRecipeId, rating, description = '') {
  // Add a review for a recipe
  await query(
    'INSERT INTO Reviews (Username, UserMadeRecipeID, Rating, Description) VALUES (?, ?, ?, ?)',
    [username, userMadeRecipeId, rating, description]
  )

  // Award points for high ratings
  if (rating >= 4) {
    const pointsToAdd = rating === 5 ? 5 : 3
    await query(
      'UPDATE Users SET Points = Points + ? WHERE Username = (SELECT Username FROM UserMadeRecipe WHERE UserMadeRecipeID = ?)',
      [pointsToAdd, userMadeRecipeId]
    )
  }
}

async function getUserPoints(username) {
  // Fetch user's points
  const [user] = await query('SELECT Points FROM Users WHERE Username = ?', [username])
  return user ? user.Points : 0
}

async function redeemPoints(username, pointsToRedeem) {
  // Check if user has enough points and redeem them
  const [user] = await query('SELECT Points FROM Users WHERE Username = ?', [username])
  if (user && user.Points >= pointsToRedeem) {
    await query('UPDATE Users SET Points = Points - ? WHERE Username = ?', [
      pointsToRedeem,
      username
    ])
    return { success: true, remainingPoints: user.Points - pointsToRedeem }
  }
  return { success: false, message: 'Insufficient points' }
}

// Top rated recipes
async function getTopRatedRecipes(limit = 10) {
  // Fetch top rated recipes
  return await query(
    `
    SELECT r.UserMadeRecipeID, r.Username, r.RecipeName, r.PrepTime, r.ServingSize, r.PrepSteps, r.IngredientList, 
           AVG(rv.Rating) as AverageRating, COUNT(rv.Rating) as RatingCount
    FROM UserMadeRecipe r
    LEFT JOIN Reviews rv ON r.UserMadeRecipeID = rv.UserMadeRecipeID
    GROUP BY r.UserMadeRecipeID
    ORDER BY AverageRating DESC, RatingCount DESC
    LIMIT ?
  `,
    [limit]
  )
}

module.exports = {
  createUser,
  loginUser,
  checkUsernameExists,
  addFavoriteRecipe,
  getFavoriteRecipes,
  createPersonalRecipe,
  getPersonalRecipes,
  getAllPersonalRecipes,
  updatePersonalRecipe,
  deletePersonalRecipe,
  getDietaryInfo,
  updateDietaryInfo,
  addToShoppingList,
  getShoppingList,
  deleteFromShoppingList,
  rateRecipe,
  getUserPoints,
  redeemPoints,
  getTopRatedRecipes
}
