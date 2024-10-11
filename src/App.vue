<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <table>
    <tbody>
      <tr>
        <!-- Navbar -->
        <td id="navbar">
          <div>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/signup">Sign Up</RouterLink>
            <RouterLink to="/login">Login</RouterLink>
            <RouterLink to="/recipe-search">Recipe Search</RouterLink>
            <RouterLink to="/favorites">Favorites</RouterLink>
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

#navbar {
  width: 200px;
  border-right: 2px solid gray;
  background-color: #ffe0b2;
  vertical-align: top;
}

#navbar div {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

#navbar a {
  color: #5d4037;
  text-decoration: none;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  transition: background-color 0.3s;
}

#navbar a:hover {
  background-color: #ffcc80;
}

#navbar a.router-link-active {
  background-color: #ffa726;
  font-weight: bold;
}
</style>
