<script setup>
// Import necessary functions and components
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { computed, ref, onMounted } from 'vue'

// Get the current route and router instance
const route = useRoute()
const router = useRouter()

// Computed properties to determine current page
const homePage = computed(() => route.path === '/')
const loginSignup = computed(() => route.path === '/login' || route.path === '/signup')

// Reactive references for login state
const isLoggedIn = ref(false)
const currentUsername = ref('')

// Check login state when component is mounted
onMounted(() => {
  checkLoginState()
})

// Function to check if user is logged in
function checkLoginState() {
  const loggedInUser = localStorage.getItem('loggedInUser')
  const loggedInState = localStorage.getItem('isLoggedIn')
  
  if (loggedInState === 'true' && loggedInUser) {
    isLoggedIn.value = true
    currentUsername.value = loggedInUser
  } else {
    isLoggedIn.value = false
    currentUsername.value = ''
  }
}

// Function to handle logout
function logout() {
  localStorage.removeItem('loggedInUser')
  localStorage.removeItem('isLoggedIn')
  isLoggedIn.value = false
  currentUsername.value = ''
  router.push('/login')
}
</script>

<template>
  <!-- Main app layout -->
  <div v-if="!loginSignup">
    <!-- Home page layout -->
    <table v-if="homePage">
      <tbody>
        <tr>
          <!-- Navbar as a row for home page -->
          <td id="navbar-row">
            <div class="navbar-content">
              <template v-if="isLoggedIn">
                <span>Welcome, {{ currentUsername }}!</span>
                <a href="#" @click.prevent="logout">Logout</a>
                <RouterLink to="/profile">Profile</RouterLink>
              </template>
              <template v-else>
                <RouterLink to="/signup">Sign Up</RouterLink>
                <RouterLink to="/login">Login</RouterLink>
              </template>
            </div>
          </td>
        </tr>
        <tr>
          <!-- Main content area -->
          <td>
            <RouterView />
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Other pages layout -->
    <table v-else>
      <tbody>
        <tr>
          <!-- Navbar as a column on the left for other pages -->
          <td id="navbar-column">
            <div class="navbar-content">
              <RouterLink to="/">Home</RouterLink>
              <RouterLink to="/recipe-search">Recipe Search</RouterLink>
              <RouterLink to="/favourites">Favourites</RouterLink>
              <RouterLink to="/personal-recipes">Personal Recipes</RouterLink>
              <RouterLink v-if="isLoggedIn" to="/create-recipe">Create Recipe</RouterLink>
              <RouterLink to="/shopping-list">Shopping List</RouterLink>
              <RouterLink to="/profile">Profile</RouterLink>
              <a v-if="isLoggedIn" href="#" @click.prevent="logout">Logout</a>
            </div>
          </td>
          <!-- Main content area -->
          <td>
            <RouterView />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Login and signup pages (no navbar) -->
  <div v-else>
    <RouterView />
  </div>
</template>

<style>
/* Styles remain unchanged */
body {
  background-color: #fff8e1;
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

table {
  width: 100%;
  height: 100vh;
  border-collapse: collapse;
}

#navbar-row {
  height: 70px;
  border-bottom: 2px solid gray;
  background-color: #ffe0b2;
}

#navbar-row div {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  padding: 0 20px;
}

#navbar-column {
  width: 210px;
  border-right: 2px solid gray;
  background-color: #ffe0b2;
  vertical-align: top;
}

#navbar-column div {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.navbar-content a, .navbar-content span {
  color: #5d4037;
  text-decoration: none;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.navbar-content a:hover {
  background-color: #ffcc80;
}

.navbar-content a.router-link-active {
  background-color: #ffa726;
  font-weight: bold;
}
</style>
