<!-- <template>
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
</style> -->

<template>
  <div class="home">
    <!-- Main Content Sections -->
    <section class="section">
      <h2 class="section-title">What we do</h2>
      <p class="section-paragraph">Discover, save, and organize your favorite recipes!</p>
    </section>

    <!-- Statistics Section -->
    <section class="statistics">
      <div class="stat-box">
        <div class="stat-value">240</div>
        <p class="stat-label">users reducing food wastage</p>
      </div>
      <!-- Repeat for other statistics -->
    </section>

    <!-- Top Users Table -->
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Carbon savings</th>
          </tr>
        </thead>
        <tbody>
          <!-- Table rows here -->
          <!-- Placeholders -->
          <tr>
            <th>1</th>
            <th>User1</th>
            <th>50</th>
          </tr>
          <tr>
            <th>2</th>
            <th>User2</th>
            <th>35</th>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- How It Works Section -->
    <section class="how-it-works-grid">
      <div class="how-it-works-box">
        <!-- <img src="../assets/icon.png" /> -->
        <h3 class="how-it-works-title">SEARCH</h3>
        <p class="how-it-works-description">Search for recipes</p>
      </div>
      <div class="how-it-works-box">
        <!-- <img src="../assets/icon.png" /> -->
        <h3 class="how-it-works-title">SAVE</h3>
        <p class="how-it-works-description">Save your favorite recipes</p>
      </div>
      <div class="how-it-works-box">
        <!-- <img src="../assets/icon.png" /> -->
        <h3 class="how-it-works-title">CREATE</h3>
        <p class="how-it-works-description">Create and manage your personal recipes</p>
      </div>
      <div class="how-it-works-box">
        <!-- <img src="../assets/icon.png" /> -->
        <h3 class="how-it-works-title">GENERATE</h3>
        <p class="how-it-works-description">Generate shopping lists</p>
      </div>
      <!-- Repeat for other steps -->
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      auth: false
    }
  }
}
</script>

<style scoped>
/* Container and layout */
/* .home {
  width: 100%;
  max-width: 100vw;
  margin: 0 auto;
  padding: 20px;
} */

/* Main content sections */
.section {
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.section-title {
  font-size: 3rem;
  color: #4e632e;
  margin-bottom: 20px;
}

.section-paragraph {
  color: #4e632e;
  font-size: 1.5rem;
  line-height: 1.6;
}

/* Statistics Section */
.statistics {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 30px;
}

.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #4e622e;
}

.stat-label {
  font-size: 1rem;
  color: #795548;
}

/* Table styling */
.table-container {
  width: 100%;
  margin: 30px auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th,
.table td {
  padding: 15px;
  text-align: center;
  color: #4e622e;
}

.table th {
  font-weight: bold;
  background-color: #f5f5f5;
}

.table td {
  border-bottom: 2px solid #bfdb9c;
}

/* How It Works Section */
.how-it-works-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 20px;
}

.how-it-works-box {
  text-align: center;
  width: 240px;
}

.how-it-works-title {
  font-size: 1.5rem;
  color: #4e632e;
  margin-top: 15px;
}

.how-it-works-description {
  font-size: 1rem;
  color: #795548;
}
</style>
