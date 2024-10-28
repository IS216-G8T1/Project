<template>
  <div id="profile-page">
    <div id="profile-container">
      <div class="icon">
        <img src="../assets/icon.png" alt="icon" width="150px" />
      </div>
      <h1 class="title">Profile</h1>
      <p><strong>Username:</strong> {{ currentUsername }}</p>

      <!-- Display user's dietary restrictions -->
      <h3>Your Dietary Restrictions:</h3>
      <p v-if="dietaryRestrictions.length > 0">
        {{ dietaryRestrictions.join(", ") }} <!-- Display dietary restrictions as a comma-separated list -->
      </p>
      <p v-else>No dietary restrictions set.</p>

      <!-- Display user's dietary restrictions -->
      <h3>Your Allergies:</h3>
      <p v-if="allergies.length > 0">
        {{ allergies.join(", ") }} <!-- Display dietary restrictions as a comma-separated list -->
      </p>
      <p v-else>No allergies set.</p>

      <!-- Button to navigate to dietary restrictions page -->
      <button @click="goToDietaryRestrictions">Update Dietary Restrictions</button>

      <!-- Logout Button -->
      <button class="logout-btn" @click="logout">Logout</button>
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
    const allergies = ref([])
    const loading = ref(true)
    const error = ref(null)
    const currentUsername = ref(localStorage.getItem('loggedInUser')) // Make this reactive

    // Function to fetch dietary restrictions from the server
    const fetchDietaryRestrictions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dietary-info', {
          headers: { 'X-Username': localStorage.getItem('loggedInUser') }
        })
        if (response.ok) {
          dietaryRestrictions.value = await response.json()
          dietaryRestrictions.value = dietaryRestrictions.value.split(",")
        } else {
          throw new Error('Failed to fetch dietary restrictions')
        }
      } catch (err) {
        error.value = 'An error occurred while fetching dietary restrictions.'
      } finally {
        loading.value = false
      }
    }

    const fetchAllergies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/allergy-info', {
          headers: { 'X-Username': localStorage.getItem('loggedInUser') }
        })
        if (response.ok) {
          allergies.value = await response.json()
          console.log("Allergies data from server:", allergies.value);
          allergies.value = allergies.value.split(",") // Ensure allergies data comes in the expected format
        } else {
          throw new Error('Failed to fetch allergies')
        }
      } catch (err) {
        error.value = 'An error occurred while fetching allergies.'
      } finally {
        loading.value = false
      }
    }


    // Function to navigate to dietary restrictions page
    const goToDietaryRestrictions = () => {
      router.push('/dietary-restrictions')  // Use router instance directly
    }

    // Logout function
    const logout = () => {
      localStorage.removeItem('loggedInUser')
      localStorage.removeItem('isLoggedIn')
      currentUsername.value = ''  // Update reactive variable
      router.push('/login')  // Redirect to login page
    }

    // Fetch dietary restrictions and allergies when the component is mounted
    onMounted(() => {
      fetchDietaryRestrictions()
      fetchAllergies()
    })

    // Return variables and functions to be used in the template
    return {
      dietaryRestrictions,
      allergies,
      loading,
      error,
      currentUsername,
      goToDietaryRestrictions,  // Ensure you return the function to the template
      logout // Return the logout function
    }
  }
}
</script>

<style scoped>
#profile-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

#profile-container {
  background-color: #ffe0b2;
  color: #795548;
  border-radius: 8px;
  text-align: center;
  width: 400px;
  padding: 20px;
}

.title {
  color: #5d4037;
}

button {
  background-color: #ffa726;
  color: #5d4037;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin: 10px;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #ffcc80;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.logout-btn {
  background-color: #e57373;
}

.logout-btn:hover {
  background-color: #ef9a9a;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #fff3e0;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
}
</style>
