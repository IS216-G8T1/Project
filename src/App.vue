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
  router.push('/')
}
</script>

<template>
  <!-- Main app layout -->
  <div v-if="!loginSignup">
    <!-- Home page layout -->
    <table v-if="homePage">
      <tbody>
        <tr>
          <!-- Video and Intro Section -->
          <td>
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
          </td>
        </tr>
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
              <RouterLink to="/browse-recipes">Browse Recipes</RouterLink>
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
/* Styles remain unchanged */
body {
  /* background-color: #fff8e1; */
  background-color: #f5f5f5;
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
  position: sticky;
  top: 0;
  z-index: 10;
  height: 70px;
  border-bottom: 2px solid gray;
  /* background-color: #ffe0b2; */
  background-color: #4b8063;
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
  background-color: #4b8063;
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
  color: #e6e6e6;
  text-decoration: none;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.navbar-content a:hover {
  background-color: #5e9b77;
}

.navbar-content a.router-link-active {
  background-color: #3d6a52;
  font-weight: bold;
}

#content {
  padding-left: 215px;
}

/* Video Section */
.video-section {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}

.video-bright {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.5);
}

.overlay-content {
  position: absolute;
  width: 60%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1.5rem;
  align-items: start;
}

/* Intro text styling */
.intro-text {
  grid-column: 1; /* Place intro-text in the first column */
  font-size: 2.5rem;
  color: #ffffff;
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
  font-size: 1.25rem;
  color: #ffffff;
  text-align: left; /* Align text to the left for readability */
  padding-bottom: 2rem;
  /* padding-right: 1rem; */
}

/* Auth Button Styling */
.auth-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  /* justify-content: end; */
}

.auth-link {
  display: inline-flex;
  text-decoration: none;
}

.home-button {
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
  color: white;
  border: 2px solid white;
  border-radius: 9999px;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.home-button:hover {
  background-color: lightslategray;
}
</style>
