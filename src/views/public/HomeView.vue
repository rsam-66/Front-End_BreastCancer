<script setup>
</script>

<template>
  <section class="hero">
    <div class="container">
      <div class="hero-text">
        <div class="badge">
          <span class="icon">⚙️</span> Powered By AI
        </div>
        
        <h1>
          Early Detection of <br />
          Breast Cancer with <br />
          AI Technology
        </h1>
        
        <p class="subtitle">
          An AI-based mammogram analysis system that helps doctors provide
          more accurate and faster diagnoses for breast cancer treatment.
        </p>

        <button class="btn-primary">Start Now!</button>
      </div>

      <div class="hero-image">
        <div class="image-placeholder">
          (Doctor Image Here)
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  background-color: #eaf6ff; /* Light blue background */
  padding: 4rem 2rem;
  min-height: 80vh; /* Takes up most of the screen */
  display: flex;
  align-items: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

h1 {
  font-size: 3rem;
  color: white; /* Based on design, text might be white or dark depending on contrast */
  color: #2c3e50;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.subtitle {
  color: #5d6d7e;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 90%;
}

.badge {
  display: inline-flex;
  align-items: center;
  background: #0099ff;
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.btn-primary {
  background: white;
  color: #0099ff;
  border: 2px solid #0099ff;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}

.image-placeholder {
  width: 100%;
  height: 400px;
  background: #cbd5e1;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
</style>