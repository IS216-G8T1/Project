<template>
  <div class="personal-recipes">
    <h2>My Recipes</h2>
    <!-- Show loading message while fetching recipes -->
    <div v-if="loading">Loading...</div>
    <!-- Show error message if there's an error -->
    <div v-else-if="error">{{ error }}</div>
    <!-- Show message if no recipes are found -->
    <div v-else-if="recipes.length === 0">You haven't created any recipes yet.</div>
    <!-- Display recipes if they exist -->
    <div v-else class="recipe-list">
      <div v-for="recipe in recipes" :key="recipe.UserMadeRecipeID" class="recipe-card">
        <h3>{{ recipe.RecipeName }}</h3>
        <p>Prep Time: {{ formatTime(recipe.PrepTime) }}</p>
        <p>Serving Size: {{ recipe.ServingSize }}</p>
        <p>Ingredients: {{ recipe.IngredientList }}</p>
        <div>
          <p>Steps:</p>
          <!-- Use v-html to render the formatted steps -->
          <ol v-html="formatSteps(recipe.PrepSteps)"></ol>
        </div>
        <div class="recipe-actions">
          <button @click="editRecipe(recipe)">Edit</button>
          <button @click="deleteRecipe(recipe.UserMadeRecipeID)">Delete</button>
        </div>
      </div>
    </div>

    <!-- Edit recipe modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>Edit Recipe</h3>
        <form @submit.prevent="updateRecipe">
          <input v-model="editingRecipe.RecipeName" placeholder="Recipe Name" required />
          <div class="prep-time">
            <label>Preparation Time: Hours/Minutes</label>
            <div class="time-inputs">
              <input
                v-model.number="editingPrepTimeHours"
                type="number"
                min="0"
                placeholder="Hours"
                required
              />
              <input
                v-model.number="editingPrepTimeMinutes"
                type="number"
                min="0"
                max="59"
                placeholder="Minutes"
                required
              />
            </div>
          </div>
          <input
            v-model.number="editingRecipe.ServingSize"
            type="number"
            placeholder="Serving Size"
            required
          />
          <textarea
            v-model="editingRecipe.IngredientList"
            placeholder="Ingredients"
            required
          ></textarea>
          <textarea
            v-model="editingRecipe.PrepSteps"
            placeholder="Preparation Steps"
            required
          ></textarea>
          <button type="submit">Save</button>
          <button type="button" @click="showEditModal = false">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    // Declare reactive variables
    const recipes = ref([])
    const loading = ref(true)
    const error = ref(null)
    const showEditModal = ref(false)
    const editingRecipe = ref(null)
    const editingPrepTimeHours = ref(0)
    const editingPrepTimeMinutes = ref(0)

    // Function to fetch recipes from the server
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/personal-recipes', {
          headers: { 'X-Username': localStorage.getItem('loggedInUser') }
        })
        if (response.ok) {
          recipes.value = await response.json()
        } else {
          throw new Error('Failed to fetch recipes')
        }
      } catch (err) {
        error.value = 'An error occurred while fetching recipes.'
      } finally {
        loading.value = false
      }
    }

    // Function to format time from minutes to hours and minutes
    const formatTime = (timeString) => {
      if (!timeString || typeof timeString !== 'string') return 'N/A'
      const [hours, minutes] = timeString.split(':').map(Number)
      if (hours > 0) {
        return `${hours}h ${minutes}m`
      } else {
        return `${minutes}m`
      }
    }

    // Function to format steps into an HTML list
    const formatSteps = (steps) => {
      if (!steps) return ''
      return steps
        .split('\n')
        .map((step) => `<li>${step}</li>`)
        .join('')
    }

    // Function to prepare a recipe for editing
    const editRecipe = (recipe) => {
      editingRecipe.value = { ...recipe }
      const [hours, minutes] = recipe.PrepTime.split(':').map(Number)
      editingPrepTimeHours.value = hours
      editingPrepTimeMinutes.value = minutes
      showEditModal.value = true
    }

    // Function to update a recipe
    const updateRecipe = async () => {
      try {
        // Format prep time back to HH:MM
        editingRecipe.value.PrepTime = `${editingPrepTimeHours.value.toString().padStart(2, '0')}:${editingPrepTimeMinutes.value.toString().padStart(2, '0')}`

        const response = await fetch(
          `http://localhost:5000/api/personal-recipes/${editingRecipe.value.UserMadeRecipeID}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Username': localStorage.getItem('loggedInUser')
            },
            body: JSON.stringify(editingRecipe.value)
          }
        )

        if (response.ok) {
          const updatedRecipe = await response.json()
          const index = recipes.value.findIndex(
            (r) => r.UserMadeRecipeID === updatedRecipe.UserMadeRecipeID
          )
          if (index !== -1) recipes.value[index] = updatedRecipe
          showEditModal.value = false
        } else {
          const errorData = await response.json()
          throw new Error(`Failed to update recipe: ${errorData.error || 'Unknown error'}`)
        }
      } catch (err) {
        error.value = `Failed to update recipe: ${err.message}`
      }
    }

    // Function to delete a recipe
    const deleteRecipe = async (recipeId) => {
      if (confirm('Are you sure you want to delete this recipe?')) {
        try {
          const response = await fetch(`http://localhost:5000/api/personal-recipes/${recipeId}`, {
            method: 'DELETE',
            headers: { 'X-Username': localStorage.getItem('loggedInUser') }
          })
          if (response.ok) {
            recipes.value = recipes.value.filter((r) => r.UserMadeRecipeID !== recipeId)
          } else {
            throw new Error('Failed to delete recipe')
          }
        } catch (err) {
          error.value = 'Failed to delete recipe'
        }
      }
    }

    // Fetch recipes when the component is mounted
    onMounted(fetchRecipes)

    // Return variables and functions to be used in the template
    return {
      recipes,
      loading,
      error,
      showEditModal,
      editingRecipe,
      editingPrepTimeHours,
      editingPrepTimeMinutes,
      editRecipe,
      updateRecipe,
      deleteRecipe,
      formatTime,
      formatSteps
    }
  }
}
</script>

<style scoped>
/* Styles remain unchanged */
.personal-recipes {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.recipe-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.recipe-card {
  background-color: #ffe0b2;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.recipe-actions {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
}

form {
  display: flex;
  flex-direction: column;
}

input,
textarea,
button {
  margin-bottom: 10px;
  padding: 5px;
}

.prep-time {
  margin-top: 10px;
}

.time-inputs {
  display: flex;
  gap: 10px;
}

.time-inputs input {
  width: 50%;
}

ol {
  padding-left: 20px;
}

li {
  margin-bottom: 5px;
}
</style>
