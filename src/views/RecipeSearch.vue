<template>
  <div class="recipe-search">
    <h1>Recipe Search</h1>
    <div class="search-form">
      <input type="text" v-model="searchQuery" placeholder="Enter ingredients or recipe name" />
      <button @click="searchRecipes" :disabled="isLoading">
        {{ isLoading ? 'Searching...' : 'Search' }}
      </button>
    </div>
    <div class="results" v-if="searchResults.length">
      <h2>Search Results</h2>
      <ul>
        <li v-for="recipe in searchResults" :key="recipe.id">
          <div class="recipe-info">
            <h3>{{ recipe.title }}</h3>
            <p>Calories: {{ Math.round(recipe.calories) }}</p>
            <p>Cooking Time: {{ Math.round(recipe.calories) }}</p>
            <p>Source: {{ recipe.source }}</p>
            <a :href="recipe.url" target="_blank">View Recipe</a>
          </div>
          <img :src="recipe.image" :alt="recipe.title" class="recipe-image" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'RecipeSearch',
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      isLoading: false
    }
  },
  methods: {
    async searchRecipes() {
      this.isLoading = true
      try {
        const response = await axios.get('/api/search-recipes', {
          params: { query: this.searchQuery }
        })
        console.log('Full response:', response);
        this.searchResults = response.data
      } catch (error) {
        console.error('Error searching recipes:', error) //Shows error messages for user
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.recipe-search {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1,
h2 {
  color: #5d4037;
}

.search-form {
  margin-bottom: 20px;
}

input {
  padding: 10px;
  width: 70%;
  border: 1px solid #795548;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background-color: #ffa726;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #ff9800;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
  padding: 10px;
  background-color: #ffe0b2;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
}

.recipe-info {
  flex: 1;
}

.recipe-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-left: auto;
  border-radius: 4px;
}
</style>
