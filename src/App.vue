<script setup>
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { computed, ref, onMounted, provide, readonly, watch } from 'vue'

const route = useRoute()
const router = useRouter()

const homePage = computed(() => route.path === '/')
const loginSignup = computed(() => route.path === '/login' || route.path === '/signup')

const isLoggedIn = ref(false)
const currentUsername = ref('')

// Provide the login state and a function to update it
provide('loginState', readonly(isLoggedIn))
provide('currentUsername', readonly(currentUsername))
provide('updateLoginState', updateLoginState)

onMounted(() => {
  updateLoginState()
})

// Watch for route changes
watch(
  () => route.path,
  () => {
    updateLoginState()
  }
)

function updateLoginState(loggedIn, username) {
  const loggedInState = localStorage.getItem('isLoggedIn')
  const loggedInUser = localStorage.getItem('loggedInUser')

  if (loggedIn !== undefined && username !== undefined) {
    isLoggedIn.value = loggedIn
    currentUsername.value = username
    if (loggedIn) {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('loggedInUser', username)
    } else {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('loggedInUser')
    }
  } else if (loggedInState === 'true' && loggedInUser) {
    isLoggedIn.value = true
    currentUsername.value = loggedInUser
  } else {
    isLoggedIn.value = false
    currentUsername.value = ''
  }
}

function logout() {
  updateLoginState(false, '')
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
              <RouterLink to="/profile">Profile</RouterLink>
              <RouterLink to="/recipe-search">Recipe Search</RouterLink>
              <RouterLink to="/community-recipes">Community Recipes</RouterLink>
              <RouterLink to="/favourites">Favourites</RouterLink>
              <RouterLink to="/personal-recipes">Personal Recipes</RouterLink>
              <RouterLink v-if="isLoggedIn" to="/create-recipe">Create Recipe</RouterLink>
              <RouterLink to="/shopping-list">Shopping List</RouterLink>
              <RouterLink to="/vouchers">Redeem Vouchers</RouterLink>
              <a v-if="isLoggedIn" href="#" @click.prevent="logout">Logout</a>
            </div>
          </td>
          <!-- Main content area -->
          <td id="content">
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
  height: 100vh;
  width: 210px;
  border-right: 2px solid gray;
  background-color: #ffe0b2;
  vertical-align: top;
  position: fixed;
}

#navbar-column div {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.navbar-content a,
.navbar-content span {
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

#content {
  padding-left: 215px;
}
</style>
