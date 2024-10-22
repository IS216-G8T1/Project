<template>
  <div id="dietary-page">
    <div id="dietary-container">
      <div class="icon">
        <img src="../assets/icon.png" alt="icon" width="150px" />
      </div>
      <h1 class="title">Dietary Restrictions</h1>
      <form @submit.prevent="updateDietaryRestrictions" class="dietary-form">
        <h3 v-if="!message">Select Dietary Restrictions:</h3>
        <div v-if="!message" class="checkbox-group">
          <div v-for="(restriction, index) in dietaryOptions" :key="index" class="checkbox-item">
            <input 
              type="checkbox" 
              :id="restriction" 
              :value="restriction" 
              v-model="selectedRestrictions" 
            />
            <label :for="restriction">{{ restriction }}</label>
          </div>
        </div>
        <button type="submit" :disabled="loading" v-if="!message">
          {{ loading ? 'Updating...' : 'Update Restrictions' }}
        </button>
      </form>
      <div v-if="message" :class="['message', messageType]">{{ message }}</div>
        <!-- Button to navigate to dietary restrictions page -->
      <button v-if="message" @click="goBackToProfile">Go back to profile page</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'  // Import useRouter

export default {
  setup() {
    // Access the router instance
    const router = useRouter()
    
    // Declare reactive variables
    const dietaryRestrictions = ref([])
    const loading = ref(false) // Initialize loading state
    const error = ref(null)
    const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free']
    const selectedRestrictions = ref([]) // Make this a ref
    const message = ref("")
    const messageType = ref("")

    // Function to fetch dietary restrictions from the server
    const fetchDietaryRestrictions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dietary-info', {
          headers: { 'X-Username': localStorage.getItem('loggedInUser') }
        })
        if (response.ok) {
          const restrictions = await response.json()
          dietaryRestrictions.value = restrictions.split(",")
          selectedRestrictions.value = dietaryRestrictions.value // Set selected restrictions to the fetched ones
        } else {
          throw new Error('Failed to fetch dietary restrictions')
        }
      } catch (err) {
        error.value = 'An error occurred while fetching dietary restrictions.'
      } finally {
        loading.value = false
      }
    }

    const updateDietaryRestrictions = async () => {
      loading.value = true
      try {
        const result = await fetch('http://localhost:5000/api/dietary-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Username': localStorage.getItem('loggedInUser')
          },
          body: JSON.stringify({ DietaryInfo: selectedRestrictions.value })
        })

        if (result.ok) {
          message.value = 'Dietary restrictions updated successfully!'
          messageType.value = 'success'
        } else {
          throw new Error('Failed to update dietary restrictions')
        }
      } catch (err) {
        message.value = 'An error occurred while updating dietary restrictions.'
        messageType.value = 'error'
      } finally {
        loading.value = false
      }
    }

    // Function to navigate to dietary restrictions page
    const goBackToProfile = () => {
      router.push('/profile')  // Use router instance directly
    }


    // Fetch dietary restrictions when the component is mounted
    onMounted(fetchDietaryRestrictions)

    // Return variables and functions to be used in the template
    return {
      dietaryRestrictions,
      loading,
      error,
      message,
      messageType,
      dietaryOptions, // Return dietary options
      selectedRestrictions, // Return selected restrictions
      updateDietaryRestrictions, // Return update function
      goBackToProfile
    }
  }
}
</script>

<style scoped>
#dietary-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

#dietary-container {
  background-color: #ffe0b2;
  color: #795548;
  border-radius: 8px;
  text-align: center;
  width: 400px;
  padding: 20px;
}

.title {
  margin-top: -5px;
  color: #5d4037;
}

.dietary-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h3 {
  margin-bottom: 1rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

input[type="checkbox"] {
  margin-right: 0.5rem;
}

button {
  background-color: #ffa726;
  color: #5d4037;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #ffcc80;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.message {
  margin-top: 15px;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 4px;
}

.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
