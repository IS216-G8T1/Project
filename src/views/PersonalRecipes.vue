<template>
  <div class="personal-recipes">
    <h1>Personal Recipes</h1>
    <button @click="showAddForm = true">Add New Recipe</button>
    <div v-if="showAddForm" class="add-recipe-form">
      <h2>Add New Recipe</h2>
      <input v-model="newRecipe.name" placeholder="Recipe Name">
      <textarea v-model="newRecipe.ingredients" placeholder="Ingredients (one per line)"></textarea>
      <textarea v-model="newRecipe.instructions" placeholder="Instructions"></textarea>
      <button @click="addRecipe">Save Recipe</button>
      <button @click="showAddForm = false">Cancel</button>
    </div>
    <div v-if="personalRecipes.length">
      <ul>
        <li v-for="recipe in personalRecipes" :key="recipe.id">
          <h3>{{ recipe.name }}</h3>
          <button @click="deleteRecipe(recipe.id)">Delete</button>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>You haven't added any personal recipes yet.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonalRecipes',
  data() {
    return {
      personalRecipes: [
        { id: 1, name: 'Grandma\'s Apple Pie' },
        { id: 2, name: 'Homemade Pizza' }
      ],
      showAddForm: false,
      newRecipe: {
        name: '',
        ingredients: '',
        instructions: ''
      }
    }
  },
  methods: {
    addRecipe() {
      // TODO: Implement API call to add recipe
      console.log('Adding new recipe:', this.newRecipe)
      this.personalRecipes.push({
        id: this.personalRecipes.length + 1,
        name: this.newRecipe.name
      })
      this.newRecipe = { name: '', ingredients: '', instructions: '' }
      this.showAddForm = false
    },
    deleteRecipe(id) {
      // TODO: Implement API call to delete recipe
      console.log('Deleting recipe with id:', id)
      this.personalRecipes = this.personalRecipes.filter(recipe => recipe.id !== id)
    }
  }
}
</script>

<style scoped>
.personal-recipes {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1, h2, h3 {
  color: #5d4037;
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

button {
  padding: 5px 10px;
  background-color: #ffa726;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

button:hover {
  background-color: #ff9800;
}

.add-recipe-form {
  margin-top: 20px;
  padding: 20px;
  background-color: #fff3e0;
  border-radius: 4px;
}

input, textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #795548;
  border-radius: 4px;
}

textarea {
  height: 100px;
}
</style>
