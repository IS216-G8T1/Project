<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <!-- <header>
    <div>
      <div>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/signup">Sign Up</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </div>
    </div>
  </header> -->

  <table>
    <tr>
      <!-- Navbar -->
      <td id="navbar">
        <div>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/signup">Sign Up</RouterLink>
          <RouterLink to="/login">Login</RouterLink>
        </div>
      </td>
      <!-- Main content -->
      <td>
        <RouterView />
      </td>
    </tr>
  </table>
</template>

<style>
body {
  background-color: #fff8e1;
  margin: 0; /* Remove default margin around the body */
  padding: 0;
}

table {
  width: 100%;
}

#navbar {
  width: 200px;
  border: 2px solid gray;
}
</style>
