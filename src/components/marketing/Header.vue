<script setup>
// No script logic needed yet
</script>

<template>
  <nav class="bg-white shadow-sm py-6 px-8">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <div class="flex items-center gap-2.5 font-bold text-xl text-gray-800">
        <!-- <img src="@/assets/lumira-logo.png" alt="Lumira AI" class="logo-img" /> -->
        <span>Lumira AI</span>
      </div>

      <ul class="flex gap-8 list-none m-0 p-0">
        <li><a href="#features" class="text-gray-500 font-medium hover:text-[#0099ff] transition-colors">Key Features</a></li>
        <li><a href="#how-it-works" class="text-gray-500 font-medium hover:text-[#0099ff] transition-colors">How It Works</a></li>
        <li><a href="#why-us" class="text-gray-500 font-medium hover:text-[#0099ff] transition-colors">Why Choose Us?</a></li>
      </ul>

      <button 
        @click="$emit('open-login')"
        class="bg-[#0099ff] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#007acc] transition-colors cursor-pointer"
      >
        Login
      </button>
    </div>
  </nav>
</template>
