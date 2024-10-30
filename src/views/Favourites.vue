<template>
  <div class="favourites">
    <h1>Favourite Recipes</h1>
    <div v-if="favourites.length">
      <ul>
        <li v-for="recipe in favourites" :key="recipe.id">
          {{ recipe.username }}, {{ recipe.recipe_name }}
          <button @click="removeFromFavourites(recipe.id)">Remove</button>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>You haven't added any favourites yet.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Favourites',
  data() {
    return {
      username: '',
      favourites: []
    }
  },
  mounted() {
    this.username = localStorage.getItem('loggedInUser')
    this.getFavourites()
  },
  methods: {
    async makeRequest(url, method, body = null) {
      const headers = {
        'Content-Type': 'application/json',
        'X-Username': this.username
      }
      const options = { method, headers }
      if (body) options.body = JSON.stringify(body)
      try {
        const response = await fetch(`http://localhost:5000/api${url}`, options)
        return await response.json()
      } catch (error) {
        console.error('Error during fetch:', error)
        return { error: 'An error occurred (Shopping List).' }
      }
    },
    async getFavourites() {
      try {
        const result = await this.makeRequest('/favourites', 'GET')
        // console.log(result)

        for (const fav of result) {
          if (fav.isEdamamRecipe == 0) {
            const recipeDetails = await this.displayUserRecipe(fav.RecipeID)
            this.favourites.push({
              id: recipeDetails[0].UserMadeRecipeID,
              username: recipeDetails[0].Username,
              recipe_name: recipeDetails[0].RecipeName
            })
          } else {
            try {
              const response = await axios.get(`/api/recipe/${fav.RecipeID}`, {
                params: { isEdamamRecipe: true }
              })
              this.favourites.push({
                id: response.data.id,
                username: response.data.source,
                recipe_name: response.data.title
              })
            } catch (error) {
              console.error('Error searching recipes:', error) //Shows error messages for user
            }
          }
          // console.log(this.favourites)
        }
      } catch (error) {
        console.error('Error fetching favourites:', error)
      }
    },
    async displayUserRecipe(recipeId) {
      try {
        const result = await this.makeRequest(`/personal-recipes/${recipeId}`, 'GET')
        return result
      } catch (error) {
        console.error('Error fetching recipe:', error)
      }
    },
    removeFromFavourites(id) {
      // TODO: Implement API call to remove favourite
      console.log('Removing favourite with id:', id)
      this.favourites = this.favourites.filter((recipe) => recipe.id !== id)
    }
  }
}
</script>

<style scoped>
.favourites {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #5d4037;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  padding: 10px;
  background-color: #ffe0b2;
  border-radius: 4px;
}

button {
  padding: 5px 10px;
  background-color: #ffa726;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #ff9800;
}
</style>
