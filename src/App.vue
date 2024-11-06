<script setup>
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { computed, ref, onMounted, provide, readonly, watch } from 'vue'

const route = useRoute()
const router = useRouter()

const homePage = computed(() => route.path === '/')
const loginSignup = computed(() => route.path === '/login' || route.path === '/signup')

const isLoggedIn = ref(false)
const currentUsername = ref('')

provide('loginState', readonly(isLoggedIn))
provide('currentUsername', readonly(currentUsername))
provide('updateLoginState', updateLoginState)

onMounted(() => {
  updateLoginState()
})

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
    <!-- Navigation for non-home pages -->
    <nav v-if="!homePage" class="navbar navbar-expand-lg custom-navbar fixed-top">
      <div class="container-fluid p-0">
        <div class="d-flex align-items-center w-100">
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
            aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <span v-if="isLoggedIn" class="welcome-message d-lg-none ms-2">Welcome, {{ currentUsername }}!</span>
        </div>

        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav flex-column w-100 nav-list">
            <!-- Welcome message for desktop above Home link -->
            <li v-if="isLoggedIn" class="nav-item d-none d-lg-block">
              <div class="welcome-message">Welcome, {{ currentUsername }}!</div>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/">Home</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/profile">Profile</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/recipe-search">Recipe Search</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/community-recipes">Community Recipes</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/favourites">Favourites</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/personal-recipes">Personal Recipes</RouterLink>
            </li>
            <li class="nav-item" v-if="isLoggedIn">
              <RouterLink class="nav-link" to="/create-recipe">Create Recipe</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/shopping-list">Shopping List</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/vouchers">Redeem Vouchers</RouterLink>
            </li>
            <template v-if="isLoggedIn">
              <li class="nav-item">
                <a class="nav-link" href="#" @click.prevent="logout">Logout</a>
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/signup">Sign Up</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/login">Login</RouterLink>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Home page layout -->
    <div v-if="homePage" class="w-100">
      <nav class="navbar navbar-expand custom-navbar-home">
        <div class="container-fluid">
          <ul class="navbar-nav ms-auto d-flex align-items-center">
            <template v-if="isLoggedIn">
              <li class="nav-item">
                <span class="welcome-message-home">Welcome, {{ currentUsername }}!</span>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" @click.prevent="logout">Logout</a>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/profile">Profile</RouterLink>
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/signup">Sign Up</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/login">Login</RouterLink>
              </li>
            </template>
          </ul>
        </div>
      </nav>
      <RouterView />
    </div>

    <!-- Content area for other pages -->
    <div v-else id="content" class="content-area">
      <RouterView />
    </div>
  </div>

  <!-- Login and signup pages (no navbar) -->
  <div v-else>
    <RouterView />
  </div>
</template>

<style>
body {
  background-color: #fff8e1;
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.custom-navbar {
  background-color: #ffe0b2;
  width: 250px;
  min-height: 100vh;
  border-right: 2px solid #d3a468;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  position: fixed;
}

.nav-list {
  padding: 1rem;
  width: 100%;
}

.custom-navbar-home {
  background-color: #ffe0b2;
  height: 70px;
  border-bottom: 2px solid #d3a468;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.navbar-toggler {
  margin: 10px;
  background-color: #fff;
  border: 1px solid #d3a468;
}

.nav-item {
  width: 218px;
  margin: 0 auto;
}

.nav-link {
  color: #5d4037 !important;
  padding: 12px 16px !important;
  margin: 4px 0;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 1rem;
  white-space: nowrap;
  display: block;
  width: 100%;
  box-sizing: border-box;
  position: relative;
}

.nav-link:hover {
  background-color: #ffcc80;
  transform: translateX(5px);
}

.router-link-active {
  background-color: #ffa726 !important;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
}

.welcome-message {
  color: #5d4037;
  font-weight: bold;
  padding: 12px 16px;
  background-color: #fff8e1;
  border-radius: 8px;
  margin: 8px auto 16px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 218px;
  box-sizing: border-box;
}

.welcome-message-home {
  color: #5d4037;
  font-weight: bold;
  padding: 8px 16px;
  background-color: #fff8e1;
  border-radius: 8px;
  margin: 0 12px;
  display: inline-block;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.content-area {
  margin-left: 250px;
  padding: 2rem;
  margin-top: 60px;
}

/* Mobile Styles */
@media (max-width: 991.98px) {
  .custom-navbar {
    width: 100%;
    min-height: auto;
  }

  .nav-list {
    padding: 0.5rem;
  }

  .nav-item {
    width: 100%;
  }

  .welcome-message {
    width: 100%;
    margin: 4px 0 12px 0;
  }

  .content-area {
    margin-left: 0;
    padding: 1rem;
    margin-top: 70px;
  }

  .navbar-collapse {
    background-color: #ffe0b2;
    padding: 1rem;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .nav-link {
    padding: 10px 14px !important;
  }

  .nav-link:hover {
    transform: none;
  }

  /* Hide navbar when collapsed */
  .navbar-collapse:not(.show) {
    display: none;
  }
}
</style>
