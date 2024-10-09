<template>
  <div class="favorites">
    <h1>Favorite Recipes</h1>
    <div v-if="favorites.length">
      <ul>
        <li v-for="recipe in favorites" :key="recipe.id">
          {{ recipe.name }}
          <button @click="removeFromFavorites(recipe.id)">Remove</button>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>You haven't added any favorites yet.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Favorites',
  data() {
    return {
      favorites: [
        { id: 1, name: 'Spaghetti Bolognese' },
        { id: 2, name: 'Chocolate Chip Cookies' },
        { id: 3, name: 'Caesar Salad' }
      ]
    }
  },
  methods: {
    removeFromFavorites(id) {
      // TODO: Implement API call to remove favorite
      console.log('Removing favorite with id:', id)
      this.favorites = this.favorites.filter(recipe => recipe.id !== id)
    }
  }
}
</script>

<style scoped>
.favorites {
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
