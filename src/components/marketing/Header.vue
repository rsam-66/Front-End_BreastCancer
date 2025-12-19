<script setup>
// No script logic needed yet
</script>

<template>
  <nav class="navbar">
    <div class="container">
      <div class="logo">
        <!-- <img src="@/assets/lumira-logo.png" alt="Lumira AI" class="logo-img" /> -->
        <span class="logo-text">Lumira AI</span>
      </div>

      <ul class="nav-links">
        <li><a href="#features">Key Features</a></li>
        <li><a href="#how-it-works">How It Works</a></li>
        <li><a href="#why-us">Why Choose Us?</a></li>
      </ul>

      <router-link to="#" class="btn-login">
        Login
      </router-link>
    </div>
  </nav>
</template>

<style scoped>
/* Simple styling to match your screenshot */
.navbar {
  padding: 1.5rem 2rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  font-size: 1.2rem;
  color: #333;
}

.nav-links {
  display: flex;
  gap: 30px;
  list-style: none;
}

.nav-links a {
  text-decoration: none;
  color: #666;
  font-weight: 500;
}

.btn-login {
  background-color: #0099ff; /* The blue from your design */
  color: white;
  padding: 0.6rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s;
}

.btn-login:hover {
  background-color: #007acc;
}
</style>