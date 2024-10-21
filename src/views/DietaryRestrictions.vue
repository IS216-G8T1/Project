<template>
    <div id="dietary-page">
      <div id="dietary-container">
        <div class="icon">
          <img src="../assets/icon.png" alt="icon" width="150px" />
        </div>
        <h1 class="title">Dietary Restrictions</h1>
        <form @submit.prevent="updateDietaryRestrictions" class="dietary-form">
          <h3>Select Dietary Restrictions:</h3>
          <div class="checkbox-group">
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
          <button type="submit" :disabled="isLoading">
            {{ isLoading ? 'Updating...' : 'Update Restrictions' }}
          </button>
        </form>
        <div v-if="message" :class="['message', messageType]">{{ message }}</div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  const API_BASE_URL = 'http://localhost:5000/api';
  
  export default {
    data() {
      return {
        dietaryOptions: [
          'Vegetarian',
          'Vegan',
          'Gluten-Free',
          'Dairy-Free',
          'Nut-Free',
          'Egg-Free',
          'Soy-Free',
          'Halal',
          'Kosher'
        ],
        selectedRestrictions: [],
        isLoading: false,
        message: '',
        messageType: '',
      }
    },
    mounted() {
      this.loadUserDietaryRestrictions();
    },
    methods: {
      async loadUserDietaryRestrictions() {
        const username = localStorage.getItem('loggedInUser');
        if (username) {
          try {
            const response = await axios.get(`${API_BASE_URL}/users/${username}`);
            if (response.data.dietaryRestrictions) {
              this.selectedRestrictions = response.data.dietaryRestrictions.split(',');
            }
          } catch (error) {
            console.error('Error fetching dietary restrictions:', error);
          }
        } else {
          this.$router.push('/login');
        }
      },
      async updateDietaryRestrictions() {
        this.isLoading = true;
        const username = localStorage.getItem('loggedInUser');
        if (!username) {
          this.message = 'You need to log in to update your dietary restrictions.';
          this.messageType = 'error';
          this.isLoading = false;
          return;
        }
        try {
          const response = await axios.put(`${API_BASE_URL}/users/${username}`, {
            
            dietaryRestrictions: this.selectedRestrictions.join(','),
            
          });
          console.log(response)
          if (response.status === 200) {
            this.message = 'Dietary restrictions updated successfully!';
            this.messageType = 'success';
          } else {
            this.message = 'Failed to update dietary restrictions.';
            this.messageType = 'error';
          }
        } catch (error) {
          console.error('Error updating dietary restrictions:', error);
          this.message = 'An error occurred while updating your dietary restrictions.';
          this.messageType = 'error';
        } finally {
          this.isLoading = false;
        }
      },
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
  