<template>
  <div class="home">
    <h1>Welcome to Recipe Manager</h1>
    <p>Discover, save, and organize your favorite recipes!</p>
    <ul>
      <li>Search for recipes</li>
      <li>Save your favorite recipes</li>
      <li>Create and manage your personal recipes</li>
      <li>Generate shopping lists</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  color: #5d4037;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
  color: #795548;
}
</style>
