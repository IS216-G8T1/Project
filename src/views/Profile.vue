<template>
  <div id="profile-page">
    <div id="profile-container">
      <!-- Left Column: Icon and Username -->
      <div class="profile-left">
        <img src="../assets/icon.png" alt="icon" class="icon" />
        <h1 class="username">{{ currentUsername }}</h1>
      </div>
      <!-- <div class="icon">
        <img src="../assets/icon.png" alt="icon" width="150px" />
      </div>
      <h1 class="title">Profile</h1>
      <p><strong>Username:</strong> {{ currentUsername }}</p> -->

      <!-- Display user's dietary restrictions -->
      <!-- <h3>Your Dietary Restrictions:</h3>
      <p v-if="dietaryRestrictions.length > 0">
        {{ dietaryRestrictions.join(', ') }} -->
      <!-- Display dietary restrictions as a comma-separated list -->
      <!-- </p>
      <p v-else>No dietary restrictions set.</p> -->

      <!-- Display user's dietary restrictions -->
      <!-- <h3>Your Allergies:</h3>
      <p v-if="allergies.length > 0">
        {{ allergies.join(', ') }} -->
      <!-- Display dietary restrictions as a comma-separated list -->
      <!-- </p>
      <p v-else>No allergies set.</p> -->

      <!-- Button to navigate to dietary restrictions page -->
      <!-- <button @click="goToDietaryRestrictions">Update Dietary Restrictions</button> -->

      <!-- Logout Button -->
      <!-- <button class="logout-btn" @click="logout">Logout</button> -->

      <!-- Right Column: User Information -->
      <div class="profile-right">
        <div class="profile-section">
          <h3>Meal Type</h3>
          <p v-if="dietaryRestrictions.length > 0">
            {{ dietaryRestrictions.join(', ') }}
          </p>
          <p v-else>No meal type set.</p>
        </div>

        <div class="profile-section">
          <h3>Allergies</h3>
          <p v-if="allergies.length > 0">
            {{ allergies.join(', ') }}
          </p>
          <p v-else>No allergies set.</p>

          <!-- Button to Update Dietary Restrictions -->
          <button class="update-btn" @click="goToDietaryRestrictions">
            Update Dietary Restrictions
          </button>
        </div>

        <!-- Placeholder for User Points and Redeem Button -->
        <div class="profile-section">
          <h3>Your Points</h3>
          <p v-if="pointsBalance >= 0">
            <span class="points-placeholder">{{ pointsBalance }}</span> Points
          </p>
          <p v-else>No points available.</p>
          <button @click="goToVouchers">Redeem Points</button>
        </div>

        <!-- Logout Button -->
        <button class="logout-btn" @click="logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router' // Import useRouter

export default {
  setup() {
    // Access the router instance
    const router = useRouter()

    // Declare reactive variables
    const dietaryRestrictions = ref([])
    const allergies = ref([])
    const selectedAllergies = ref([])
    const pointsBalance = ref(0)
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
          dietaryRestrictions.value = dietaryRestrictions.value.split(',')
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
          const data = await response.json()
          const allergiesList = data.Allergies
          allergies.value = allergiesList.split(',')
          selectedAllergies.value = allergies.value
        } else {
          throw new Error('Failed to fetch allergies')
        }
      } catch (err) {
        error.value = 'An error occurred while fetching allergies.'
      } finally {
        loading.value = false
        console.log(selectedAllergies)
      }
    }

    const fetchUserPoints = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user-points', {
          headers: { 'X-Username': localStorage.getItem('loggedInUser') }
        })
        if (response.ok) {
          const data = await response.json()
          pointsBalance.value = data.points
          console.log(pointsBalance)
        } else {
          throw new Error('Failed to fetch points balance')
        }
      } catch (err) {
        console.error(err)
      }
    }

    // Function to navigate to dietary restrictions page
    const goToDietaryRestrictions = () => {
      router.push('/dietary-restrictions') // Use router instance directly
    }

    // Function to navigate to vouchers page
    const goToVouchers = () => {
      router.push('/vouchers') // Use router instance directly
    }

    // Logout function
    const logout = () => {
      localStorage.removeItem('loggedInUser')
      localStorage.removeItem('isLoggedIn')
      currentUsername.value = '' // Update reactive variable
      router.push('/') // Redirect to home page
    }

    

    // Fetch dietary restrictions and allergies when the component is mounted
    onMounted(() => {
      fetchDietaryRestrictions()
      fetchAllergies()
      fetchUserPoints()
    })

    // Return variables and functions to be used in the template
    return {
      dietaryRestrictions,
      allergies,
      pointsBalance,
      loading,
      error,
      currentUsername,
      goToDietaryRestrictions, // Ensure you return the function to the template
      goToVouchers,
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

/* #profile-container {
  background-color: #e0ebe4;
  color: #795548;
  border-radius: 8px;
  text-align: center;
  width: 70%;
  padding: 20px;
} */

#profile-container {
  display: flex;
  background-color: #e0ebe4;
  color: #795548;
  border-radius: 8px;
  padding: 20px;
  width: 70%;
  position: relative;
}
/* 
.title {
  color: #5d4037;
} */

.profile-left {
  text-align: center;
  flex: 1;
  padding: 20px;
}

.icon {
  width: 150px;
  border-radius: 50%;
}

.username {
  color: #5d4037;
  margin-top: 15px;
  font-size: 1.8rem;
}

.profile-right {
  flex: 2;
  padding: 20px;
}

h2 {
  color: #5d4037;
  margin-bottom: 15px;
}

.profile-section {
  margin-bottom: 20px;
}

.profile-section h3 {
  color: #5d4037;
  margin-bottom: 8px;
}

.points-placeholder {
  font-weight: bold;
}

/* button {
  background-color: #5e9b77;
  color: #e6e6e6;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin: 10px;
  transition: background-color 0.3s ease;
} */

button {
  display: inline-block;
  background-color: #5e9b77;
  color: #e6e6e6;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s ease;
}

/* button:hover:not(:disabled) {
  background-color: #4b8063;
} */

button:hover {
  background-color: #4b8063;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.logout-btn {
  background-color: #e57373;
  position: absolute; /* Positioned absolutely within the profile container */
  bottom: 20px; /* Adjust the distance from the bottom */
  right: 20px; /* Adjust the distance from the right */
}

.logout-btn:hover {
  background-color: #ef9a9a;
}

.redeem-btn {
  background-color: #4caf50;
}

.redeem-btn:hover {
  background-color: #66bb6a;
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
