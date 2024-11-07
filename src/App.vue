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

function closeNavbar() {
  const navbarCollapse = document.getElementById('navbarContent')
  if (navbarCollapse && navbarCollapse.classList.contains('show')) {
    new bootstrap.Collapse(navbarCollapse).toggle()
  }
}

function logout() {
  updateLoginState(false, '')
  closeNavbar()
  router.push('/')
}
</script>

<template>
  <!-- Main app layout -->
  <div v-if="!loginSignup" class="vh-100">
    <!-- Navigation for non-home pages -->
    <nav v-if="!homePage" class="navbar navbar-expand-lg custom-navbar fixed-top p-0">
      <div class="container-fluid p-0">
        <div>
          <button
            class="navbar-toggler border-0 shadow-sm"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <!-- <span v-if="isLoggedIn" class="welcome-message d-lg-none ms-2"
            >Welcome, {{ currentUsername }}!</span
          > -->
        </div>

        <div class="collapse navbar-collapse" id="navbarContent">
          <div class="nav-container px-3">
            <!-- Welcome message for desktop above Home link -->
            <!-- <div v-if="isLoggedIn" class="d-none d-lg-block mb-3">
              <div class="welcome-message text-center">Welcome, {{ currentUsername }}!</div>
            </div> -->
            <ul class="navbar-nav flex-column align-items-stretch w-100 gap-1">
              <li class="nav-item">
                <RouterLink class="nav-link rounded-2" to="/" @click="closeNavbar">Home</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link rounded-2" to="/profile" @click="closeNavbar"
                  >Profile</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link rounded-2" to="/recipe-search" @click="closeNavbar"
                  >Recipe Search</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link rounded-2" to="/community-recipes" @click="closeNavbar"
                  >Community Recipes</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link rounded-2" to="/favourites" @click="closeNavbar"
                  >Favourites</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link rounded-2" to="/personal-recipes" @click="closeNavbar"
                  >Personal Recipes</RouterLink
                >
              </li>
              <li class="nav-item" v-if="isLoggedIn">
                <RouterLink class="nav-link rounded-2" to="/create-recipe" @click="closeNavbar"
                  >Create Recipe</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link rounded-2" to="/shopping-list" @click="closeNavbar"
                  >Shopping List</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link rounded-2" to="/vouchers" @click="closeNavbar"
                  >Redeem Vouchers</RouterLink
                >
              </li>
              <template v-if="isLoggedIn">
                <li class="nav-item">
                  <a class="nav-link rounded-2" href="#" @click.prevent="logout">Logout</a>
                </li>
              </template>
              <template v-else>
                <li class="nav-item">
                  <RouterLink class="nav-link rounded-2" to="/signup" @click="closeNavbar"
                    >Sign Up</RouterLink
                  >
                </li>
                <li class="nav-item">
                  <RouterLink class="nav-link rounded-2" to="/login" @click="closeNavbar"
                    >Login</RouterLink
                  >
                </li>
              </template>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <!-- Home page layout -->
    <div v-if="homePage" class="w-100">
      <section class="video-section">
        <video class="video-bright" autoplay loop muted>
          <source src="./assets/vid.mp4" type="video/mp4" />
        </video>
        <div class="overlay-content">
          <div class="intro-text">
            <strong>Healthy meals for</strong><br />
            <strong class="intro-highlight">
              <span class="typed-text">{{ typeValue }}</span>
              <span class="blinking-cursor">|</span>
              <span class="cursor" :class="{ typing: typeStatus }">&nbsp;</span>
            </strong>
          </div>
          <div class="second-column">
            <div class="climate-text">Making a difference with every meal.</div>
            <div class="auth-buttons">
              <router-link to="/login" class="auth-link">
                <button class="home-button">Login</button>
              </router-link>
              <router-link to="/signup" class="auth-link">
                <button class="home-button">Sign Up</button>
              </router-link>
            </div>
          </div>
        </div>
      </section>
      <nav class="navbar navbar-expand custom-navbar-home shadow-sm">
        <div class="container-fluid">
          <div class="navbar-icon-box">
            <div class="navbar-icon-wrapper">
              <img src="./assets/icon.png" alt="logo" class="navbar-icon" />
            </div>
            <p class="navbar-app-name">QuickEats</p>
          </div>
          <ul class="navbar-nav ms-auto d-flex align-items-center gap-3">
            <template v-if="isLoggedIn">
              <!-- <li class="nav-item">
                <span class="welcome-message-home">Welcome, {{ currentUsername }}!</span>
              </li> -->
              <li class="nav-item">
                <RouterLink class="nav-link rounded-2" to="/recipe-search" @click="closeNavbar"
                  >Recipe Search</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link rounded-2" to="/profile" @click="closeNavbar"
                  >Profile</RouterLink
                >
              </li>
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

<script>
import LoginSignupButtons from './components/LoginSignupButtons.vue'

export default {
  components: {
    LoginSignupButtons
  },
  data() {
    return {
      auth: false,
      typeValue: '',
      typeStatus: false,
      displayTextArray: ['you 🌟', 'our communities 🌈', 'our planet 🌏'],
      typingSpeed: 70,
      erasingSpeed: 50,
      newTextDelay: 2000,
      displayTextArrayIndex: 0,
      charIndex: 0
    }
  },
  created() {
    setTimeout(this.typeText, this.newTextDelay + 200)
  },
  methods: {
    typeText() {
      if (this.charIndex < this.displayTextArray[this.displayTextArrayIndex].length) {
        if (!this.typeStatus) this.typeStatus = true
        this.typeValue += this.displayTextArray[this.displayTextArrayIndex].charAt(this.charIndex)
        this.charIndex += 1
        setTimeout(this.typeText, this.typingSpeed)
      } else {
        this.typeStatus = false
        setTimeout(this.eraseText, this.newTextDelay)
      }
    },
    eraseText() {
      if (this.charIndex > 0) {
        if (!this.typeStatus) this.typeStatus = true
        this.typeValue = this.displayTextArray[this.displayTextArrayIndex].substring(
          0,
          this.charIndex - 1
        )
        this.charIndex -= 1
        setTimeout(this.eraseText, this.erasingSpeed)
      } else {
        this.typeStatus = false
        this.displayTextArrayIndex += 1
        if (this.displayTextArrayIndex >= this.displayTextArray.length)
          this.displayTextArrayIndex = 0
        setTimeout(this.typeText, this.typingSpeed + 1000)
      }
    }
  }
}
</script>

<style>
body {
  /* background-color: #fff8e1; */
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.custom-navbar {
  background-color: #4b8063;
  width: 210px;
  min-height: 100vh;
  /* border-right: 2px solid #d3a468; */
  vertical-align: top;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.nav-container {
  width: 100%;
  max-width: 218px;
  margin: 0 auto;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  height: 100vh; /* Full height for alignment */
}

.navbar-nav {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start; /* Align items to the top */
  gap: 1rem;
  padding-top: 1rem;
}

.custom-navbar-home {
  background-color: #4b8063;
  height: 70px;
  /* border-bottom: 2px solid #d3a468; */
  position: sticky;
  top: 0;
  z-index: 10;
  padding-right: 20px;
  padding-bottom: 20px;
}

.navbar-icon-box {
  margin-top: 10px;
  margin-left: 20px;
  display: flex;
  align-items: center;
}

.navbar-icon {
  /* height: 80px; */
  /* margin-left: 15px; */
  max-width: 100%; /* Ensure the icon fits well within the circle */
  max-height: 100%; /* Maintain aspect ratio */
}

.navbar-icon-wrapper {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: #e6e6e6; /* Change to your desired background color */
  border-radius: 50%; /* Makes the background circular */
  width: 50px; /* Adjust size to fit the icon */
  height: 50px; /* Adjust size to fit the icon */
  margin-right: 10px;
}

.navbar-app-name {
  margin-top: 15px;
  font-size: 2rem;
  color: #e6e6e6;
  font-family: 'Caveat', cursive;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}

.nav-link {
  color: #e6e6e6 !important;
  padding: 0.75rem 1rem !important;
  transition: all 0.3s ease;
  font-size: 1rem;
  white-space: nowrap;
  background-color: transparent;
}

.nav-link:hover {
  background-color: #5e9b77;
  transform: translateX(5px);
}

.router-link-active {
  background-color: #3d6a52 !important;
  font-weight: 500;
}

/* .welcome-message {
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
} */

.content-area {
  margin-left: 250px;
  padding: 2rem;
  /* margin-top: 60px; */
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
    background-color: #4b8063;
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

/* Video Section */
.video-section {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.video-bright {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.5);
}

.overlay-content {
  position: absolute;
  width: 65%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 2 rem;
  align-items: start;
}

/* Intro text styling */
.intro-text {
  grid-column: 1; /* Place intro-text in the first column */
  font-size: 2.75rem;
  color: #e6e6e6;
  align-self: center; /* Center align in the first column */
}

.intro-highlight {
  color: #bfdb9c;
}

/* Cursor blinking CSS */
.blinking-cursor {
  font-size: 2.5rem; /* Match this to your font size */
  color: #bfdb9c; /* Cursor color */
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  from,
  to {
    color: transparent;
  }
  50% {
    color: #bfdb9c;
  }
}

.second-column {
  grid-column: 2;
}

/* Climate Text Styling */
.climate-text {
  font-size: 1.5rem;
  color: #e6e6e6;
  text-align: right; /* Align text to the left for readability */
  padding-bottom: 2rem;
  /* padding-right: 1rem; */
}

/* Auth Button Styling */
.auth-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  /* justify-content: end; */
}

.auth-link {
  display: inline-flex;
  text-decoration: none;
}

.home-button {
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
  color: #e6e6e6;
  border: 2px solid #e6e6e6;
  border-radius: 9999px;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.home-button:hover {
  background-color: #6b6b6b;
}
</style>
