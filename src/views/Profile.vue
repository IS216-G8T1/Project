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
      <ul v-if="dietaryRestrictions.length">
        <li v-for="(restriction, index) in dietaryRestrictions" :key="index">
          {{ restriction }}
        </li>
      </ul>
      <p v-else>No dietary restrictions set.</p>

      <!-- Button to navigate to dietary restrictions page -->
      <button @click="goToDietaryRestrictions">Update Dietary Restrictions</button>

      <!-- Logout Button -->
      <button class="logout-btn" @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export default {
  data() {
    return {
      currentUsername: '',
      dietaryRestrictions: [],
    };
  },
  mounted() {
    this.currentUsername = localStorage.getItem('loggedInUser');
    if (!this.currentUsername) {
      this.$router.push('/login'); // Redirect to login if not logged in
    } else {
      this.fetchDietaryRestrictions();
    }
  },
  methods: {
    async fetchDietaryRestrictions() {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/${this.currentUsername}`);
        if (response.data.dietaryRestrictions) {
          this.dietaryRestrictions = response.data.dietaryRestrictions.split(',');
        }
      } catch (error) {
        console.error('Error fetching dietary restrictions:', error);
      }
    },
    goToDietaryRestrictions() {
      this.$router.push('/dietary-restrictions'); // Route to the dietary restrictions page
    },
    logout() {
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('isLoggedIn');
      this.$router.push('/login');
    }
  }
};
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
