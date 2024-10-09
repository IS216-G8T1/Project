<template>
  <div class="recipe-search">
    <h1>Recipe Search</h1>
    <div class="search-form">
      <input type="text" v-model="searchQuery" placeholder="Enter ingredients or recipe name">
      <button @click="searchRecipes">Search</button>
    </div>
    <div class="results" v-if="searchResults.length">
      <h2>Search Results</h2>
      <ul>
        <li v-for="recipe in searchResults" :key="recipe.id">
          {{ recipe.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecipeSearch',
  data() {
    return {
      searchQuery: '',
      searchResults: []
    }
  },
  methods: {
    searchRecipes() {
      // TODO: Implement API call to search recipes
      console.log('Searching for:', this.searchQuery)
      // Placeholder: Set dummy results
      this.searchResults = [
        { id: 1, name: 'Pasta Carbonara' },
        { id: 2, name: 'Chicken Curry' },
        { id: 3, name: 'Vegetable Stir Fry' }
      ]
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

h1, h2 {
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
}
</style>
