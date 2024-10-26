const { query } = require('../db')

async function rateRecipe(username, userMadeRecipeId, rating, description = '') {
  await query(
    'INSERT INTO Reviews (Username, UserMadeRecipeID, Rating, Description) VALUES (?, ?, ?, ?)',
    [username, userMadeRecipeId, rating, description]
  )

  if (rating >= 4) {
    const pointsToAdd = rating === 5 ? 5 : 3
    await query(
      'UPDATE Users SET Points = Points + ? WHERE Username = (SELECT Username FROM UserMadeRecipe WHERE UserMadeRecipeID = ?)',
      [pointsToAdd, userMadeRecipeId]
    )
  }
}

async function getUserPoints(username) {
  const [user] = await query('SELECT Points FROM Users WHERE Username = ?', [username])
  return user ? user.Points : 0
}

async function redeemPoints(username, pointsToRedeem) {
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

async function getTopRatedRecipes(limit = 10) {
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
  rateRecipe,
  getUserPoints,
  redeemPoints,
  getTopRatedRecipes
}
