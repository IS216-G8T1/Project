<template>
  <div class="signup-container">
    <h1>Signup</h1>
    <form @submit.prevent="handleSignup" class="signup-form">
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required minlength="3" maxlength="20" @blur="checkUsername">
        <small>Username must be 3-20 characters long and unique.</small>
        <small v-if="usernameError" class="error-message">{{ usernameError }}</small>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required minlength="8">
        <small>Password must be at least 8 characters long.</small>
      </div>
      <button type="submit" :disabled="isLoading || !isFormValid || !!usernameError">
        {{ isLoading ? 'Signing up...' : 'Sign Up' }}
      </button>
    </form>
    <div v-if="message" :class="['message', messageType]">{{ message }}</div>
    <div class="login-link">
      Already have an account? <router-link to="/login">Login here</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export default {
  data() {
    return {
      username: '',
      password: '',
      message: '',
      messageType: '',
      isLoading: false,
      usernameError: ''
    }
  },
  computed: {
    isFormValid() {
      return this.username.length >= 3 && this.username.length <= 20 && this.password.length >= 8 && !this.usernameError;
    }
  },
  methods: {
    async checkUsername() {
      if (this.username.length < 3 || this.username.length > 20) {
        this.usernameError = 'Username must be 3-20 characters long.';
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/check-username/${this.username}`);
        if (response.data.exists) {
          this.usernameError = 'This username is already taken.';
        } else {
          this.usernameError = '';
        }
      } catch (error) {
        console.error('Error checking username:', error);
        this.usernameError = 'Error checking username availability.';
      }
    },
    async handleSignup() {
      if (!this.isFormValid) {
        this.message = 'Please ensure all fields are filled correctly.';
        this.messageType = 'error';
        return;
      }

      this.isLoading = true;
      this.message = '';
      try {
        const response = await axios.post(`${API_BASE_URL}/signup`, {
          username: this.username,
          password: this.password,
          dietaryRestrictions: ''
        });
        this.message = 'Signup successful! You can now login.';
        this.messageType = 'success';
        // Clear the form
        this.username = '';
        this.password = '';
        // Redirect to login page after a short delay
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
      } catch (error) {
        this.message = error.response?.data?.error || 'An error occurred during signup.';
        this.messageType = 'error';
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.signup-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
  display: block;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

small {
  display: block;
  margin-top: 5px;
  color: #666;
}

button {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.login-link {
  margin-top: 20px;
  text-align: center;
}

.login-link a {
  color: #4CAF50;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
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

.error-message {
  color: #721c24;
  font-weight: bold;
}
</style>
