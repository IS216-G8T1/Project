<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const homePage = computed(() => route.path === '/')
const loginSignup = computed(() => route.path === '/login' || route.path === '/signup')
</script>

<template>
  <!-- Display navbar -->
  <div v-if="!loginSignup">
    <table v-if="homePage">
      <tbody>
        <tr>
          <!-- Navbar is a row at the top -->
          <td id="navbar-row">
            <div class="navbar-content">
              <RouterLink to="/profile">Profile</RouterLink>
              <RouterLink to="/signup">Sign Up</RouterLink>
              <RouterLink to="/login">Login</RouterLink>
            </div>
          </td>
        </tr>
        <tr>
          <!-- Main content -->
          <td>
            <RouterView />
          </td>
        </tr>
      </tbody>
    </table>
    <table v-else>
      <tbody>
        <tr>
          <!-- Navbar is a column on the left -->
          <td id="navbar-column">
            <div class="navbar-content">
              <RouterLink to="/">Home</RouterLink>
              <RouterLink to="/recipe-search">Recipe Search</RouterLink>
              <RouterLink to="/favourites">Favourites</RouterLink>
              <RouterLink to="/personal-recipes">Personal Recipes</RouterLink>
              <RouterLink to="/shopping-list">Shopping List</RouterLink>
              <RouterLink to="/profile">Profile</RouterLink>
            </div>
          </td>
          <!-- Main content -->
          <td>
            <RouterView />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- No navbar for login and signup pages -->
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

.navbar-content a {
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
