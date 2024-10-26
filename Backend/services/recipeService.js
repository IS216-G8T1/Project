const { query } = require('../db')

function formatPrepTime(prepTime) {
  if (!prepTime || typeof prepTime !== 'string') {
    return '00:00'
  }
  const [hours, minutes] = prepTime.split(':').map(Number)
  if (isNaN(hours) || isNaN(minutes)) {
    return '00:00'
  }
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

async function createPersonalRecipe(username, recipe) {
  const { recipeName, prepTime, servingSize, prepSteps, ingredientList } = recipe
  const formattedPrepTime = formatPrepTime(prepTime)
  const result = await query(
    'INSERT INTO UserMadeRecipe (Username, RecipeName, PrepTime, ServingSize, PrepSteps, IngredientList) VALUES (?, ?, ?, ?, ?, ?)',
    [username, recipeName, formattedPrepTime, servingSize, prepSteps, ingredientList]
  )
  return { id: result.insertId, ...recipe, prepTime: formattedPrepTime }
}

async function getPersonalRecipes(username) {
  return await query('SELECT * FROM UserMadeRecipe WHERE Username = ?', [username])
}

async function getAllPersonalRecipes() {
  return await query('SELECT * FROM UserMadeRecipe')
}

async function updatePersonalRecipe(username, recipeId, recipe) {
  const [existingRecipe] = await query(
    'SELECT * FROM UserMadeRecipe WHERE UserMadeRecipeID = ? AND Username = ?',
    [recipeId, username]
  )

  if (!existingRecipe) {
    throw new Error('Recipe not found or does not belong to the user')
  }

  const updateFields = {}
  if (recipe.RecipeName !== existingRecipe.RecipeName) updateFields.RecipeName = recipe.RecipeName
  if (recipe.PrepTime !== existingRecipe.PrepTime)
    updateFields.PrepTime = formatPrepTime(recipe.PrepTime)
  if (recipe.ServingSize !== existingRecipe.ServingSize)
    updateFields.ServingSize = recipe.ServingSize
  if (recipe.PrepSteps !== existingRecipe.PrepSteps) updateFields.PrepSteps = recipe.PrepSteps
  if (recipe.IngredientList !== existingRecipe.IngredientList)
    updateFields.IngredientList = recipe.IngredientList

  if (Object.keys(updateFields).length === 0) {
    return existingRecipe
  }

  const setClause = Object.keys(updateFields)
    .map((key) => `${key} = ?`)
    .join(', ')
  const params = [...Object.values(updateFields), recipeId, username]

  const updateQuery = `UPDATE UserMadeRecipe SET ${setClause} WHERE UserMadeRecipeID = ? AND Username = ?`
  await query(updateQuery, params)

  const [updatedRecipe] = await query('SELECT * FROM UserMadeRecipe WHERE UserMadeRecipeID = ?', [
    recipeId
  ])

  return updatedRecipe
}

async function deletePersonalRecipe(username, recipeId) {
  const result = await query(
    'DELETE FROM UserMadeRecipe WHERE UserMadeRecipeID = ? AND Username = ?',
    [recipeId, username]
  )
  return result.affectedRows > 0
}

module.exports = {
  createPersonalRecipe,
  getPersonalRecipes,
  getAllPersonalRecipes,
  updatePersonalRecipe,
  deletePersonalRecipe
}
