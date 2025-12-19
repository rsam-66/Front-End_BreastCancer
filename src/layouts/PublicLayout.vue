<script setup>
import Header from '@/components/marketing/Header.vue';
import Footer from '@/components/marketing/Footer.vue';
</script>

<template>
  <div class="public-layout">
    <Header />

    <main class="main-content">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.public-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1; /* Pushes footer to bottom even if content is short */
}
</style>