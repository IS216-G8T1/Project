const { query } = require('../db')

async function addFavoriteRecipe(username, recipeId, isEdamamRecipe) {
  await query('INSERT INTO UserSavedRecipe (Username, RecipeID, isEdamamRecipe) VALUES (?, ?, ?)', [
    username,
    recipeId,
    isEdamamRecipe
  ])
}

async function getFavoriteRecipes(username) {
  return await query('SELECT * FROM UserSavedRecipe WHERE Username = ?', [username])
}

module.exports = {
  addFavoriteRecipe,
  getFavoriteRecipes
}
