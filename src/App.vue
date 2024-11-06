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
  <div v-if="!loginSignup" class="vh-100">
    <!-- Navigation for non-home pages -->
    <nav v-if="!homePage" class="navbar navbar-expand-lg custom-navbar fixed-top p-0">
      <div class="container-fluid p-0">
        <div class="d-flex align-items-center justify-content-between w-100 px-3">
          <button class="navbar-toggler border-0 shadow-sm" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
            aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <span v-if="isLoggedIn" class="welcome-message d-lg-none ms-2">Welcome, {{ currentUsername }}!</span>
        </div>

        <div class="collapse navbar-collapse" id="navbarContent">
          <div class="nav-container px-3">
            <!-- Welcome message for desktop above Home link -->
            <div v-if="isLoggedIn" class="d-none d-lg-block mb-3">
              <div class="welcome-message text-center">Welcome, {{ currentUsername }}!</div>
            </div>
            
            <ul class="navbar-nav flex-column align-items-stretch w-100 gap-1">
              <li class="nav-item">
                <RouterLink class="nav-link rounded-2" to="/">Home</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link rounded-2" to="/profile">Profile</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link rounded-2" to="/recipe-search">Recipe Search</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link rounded-2" to="/community-recipes">Community Recipes</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link rounded-2" to="/favourites">Favourites</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link rounded-2" to="/personal-recipes">Personal Recipes</RouterLink>
              </li>
              <li class="nav-item" v-if="isLoggedIn">
                <RouterLink class="nav-link rounded-2" to="/create-recipe">Create Recipe</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link rounded-2" to="/shopping-list">Shopping List</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link rounded-2" to="/vouchers">Redeem Vouchers</RouterLink>
              </li>
              <template v-if="isLoggedIn">
                <li class="nav-item">
                  <a class="nav-link rounded-2" href="#" @click.prevent="logout">Logout</a>
                </li>
              </template>
              <template v-else>
                <li class="nav-item">
                  <RouterLink class="nav-link rounded-2" to="/signup">Sign Up</RouterLink>
                </li>
                <li class="nav-item">
                  <RouterLink class="nav-link rounded-2" to="/login">Login</RouterLink>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <!-- Home page layout -->
    <div v-if="homePage" class="w-100">
      <nav class="navbar navbar-expand custom-navbar-home shadow-sm">
        <div class="container-fluid">
          <ul class="navbar-nav ms-auto d-flex align-items-center gap-3">
            <template v-if="isLoggedIn">
              <li class="nav-item">
                <span class="welcome-message-home">Welcome, {{ currentUsername }}!</span>
              </li>
              <li class="nav-item">
                <a class="nav-link rounded-2" href="#" @click.prevent="logout">Logout</a>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link rounded-2" to="/profile">Profile</RouterLink>
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <RouterLink class="nav-link rounded-2" to="/signup">Sign Up</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link rounded-2" to="/login">Login</RouterLink>
              </li>
            </template>
          </ul>
        </div>
      </nav>
      <RouterView />
    </div>

    <!-- Content area for other pages -->
    <div v-else class="content-area">
      <RouterView />
    </div>
  </div>

  <!-- Login and signup pages (no navbar) -->
  <div v-else class="vh-100">
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
}

.nav-container {
  width: 100%;
  max-width: 218px;
  margin: 0 auto;
  padding-top: 1rem;
}

.custom-navbar-home {
  background-color: #ffe0b2;
  height: 70px;
  border-bottom: 2px solid #d3a468;
}

.nav-link {
  color: #5d4037 !important;
  padding: 0.75rem 1rem !important;
  transition: all 0.3s ease;
  font-size: 1rem;
  white-space: nowrap;
  background-color: transparent;
}

.nav-link:hover {
  background-color: #ffcc80;
  transform: translateX(5px);
}

.router-link-active {
  background-color: #ffa726 !important;
  font-weight: 500;
}

.welcome-message {
  color: #5d4037;
  font-weight: 500;
  padding: 0.75rem 1rem;
  background-color: #ffa726;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-message-home {
  color: #5d4037;
  font-weight: 500;
  padding: 0.5rem 1rem;
  background-color: #ffa726;
  border-radius: 8px;
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

  .nav-container {
    max-width: 100%;
    padding-top: 0;
  }

  .content-area {
    margin-left: 0;
    padding: 1rem;
    margin-top: 70px;
  }

  .navbar-collapse {
    background-color: #ffe0b2;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
