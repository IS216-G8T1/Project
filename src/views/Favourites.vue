<template>
  <div class="favourites">
    <h1>Favourite Recipes</h1>
    <div v-if="favourites.length">
      <ul>
        <li v-for="recipe in favourites" :key="recipe.id">
          {{ recipe.name }}
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
export default {
  name: 'Favourites',
  data() {
    return {
      favourites: [
        { id: 1, name: 'Spaghetti Bolognese' },
        { id: 2, name: 'Chocolate Chip Cookies' },
        { id: 3, name: 'Caesar Salad' }
      ]
    }
  },
  methods: {
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
