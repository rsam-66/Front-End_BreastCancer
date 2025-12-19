<script setup>
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-content">
        <div class="brand-column">
          <div class="logo">
            <span class="logo-text">Lumira AI</span>
          </div>
          <p class="mission-text">
            Empowering doctors with AI-driven precision for early breast cancer detection.
          </p>
        </div>

        <div class="link-column">
          <h4>Product</h4>
          <ul>
            <li><a href="#features">Key Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#pricing">Pricing</a></li>
          </ul>
        </div>

        <div class="link-column">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <hr class="divider" />

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Lumira AI. All rights reserved.</p>
        <div class="socials">
          <span>Instagram</span>
          <span>Twitter</span>
          <span>LinkedIn</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background-color: #f8f9fa; /* Very light grey */
  padding: 3rem 2rem 1.5rem;
  color: #5d6d7e;
  border-top: 1px solid #eef2f6;
  margin-top: auto; /* Ensures it stays at bottom if content is short */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 2rem;
}

.logo-text {
  font-weight: bold;
  font-size: 1.5rem;
  color: #2c3e50;
  display: block;
  margin-bottom: 1rem;
}

.mission-text {
  line-height: 1.6;
  max-width: 300px;
}

h4 {
  color: #2c3e50;
  margin-bottom: 1.2rem;
  font-size: 1.1rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 0.8rem;
}

a {
  text-decoration: none;
  color: #5d6d7e;
  transition: color 0.2s;
}

a:hover {
  color: #0099ff; /* Lumira Blue */
}

.divider {
  border: 0;
  border-top: 1px solid #e0e0e0;
  margin: 1rem 0;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  padding-top: 1rem;
}

.socials {
  display: flex;
  gap: 1.5rem;
  font-weight: 500;
  cursor: pointer;
}
</style>