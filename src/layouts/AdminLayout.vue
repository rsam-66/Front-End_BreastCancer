<script setup>
import { ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
// 1. IMPORT REUSABLE MODAL
import BaseModal from '@/components/common/BaseModal.vue'

const route = useRoute()
const router = useRouter()

// 2. STATE FOR MODAL
const showLogoutModal = ref(false)

const menuItems = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Doctor', path: '/admin/doctors' },
  { name: 'Patient', path: '/admin/patients' },
]

const isActive = (path) => {
  if (path === '/admin' && route.path === '/admin') return true
  if (path !== '/admin' && route.path.startsWith(path)) return true
  return false
}

// 3. UPDATED LOGOUT HANDLERS
// Triggers the modal instead of instant logout
const handleLogoutClick = () => {
  showLogoutModal.value = true
}

// Performs the actual logout action
const confirmLogout = () => {
  localStorage.removeItem('userRole') // Clear auth
  // localStorage.removeItem('userName') // Optional: Clear name if you store it
  showLogoutModal.value = false
  router.push('/')
}
</script>

<template>
  <div class="flex h-screen bg-white font-sans text-gray-800">
    <aside
      class="w-64 flex flex-col bg-gray-100 border-r border-gray-200 flex-shrink-0 transition-all duration-300 mobile-hidden md:flex">
      <div class="p-6">
        <div class="font-bold text-xl text-gray-800">Admin Dashboard</div>
        <div class="text-sm text-gray-500 mt-1">Breast Cancer Analytics</div>
      </div>

      <nav class="flex-1 px-4 space-y-2 mt-4">
        <router-link v-for="item in menuItems" :key="item.name" :to="item.path"
          class="flex items-center px-4 py-3 rounded-lg font-medium transition-colors" :class="isActive(item.path)
            ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
            : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'">
          <span class="w-5 h-5 mr-3 bg-gray-300 rounded-sm opacity-50"></span>
          {{ item.name }}
        </router-link>
      </nav>

      <div class="p-6 border-t border-gray-200">
        <button @click="handleLogoutClick"
          class="flex items-center text-red-500 font-medium hover:text-red-700 transition-colors w-full cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-5 h-5 mr-3">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Log Out
        </button>
      </div>
    </aside>

    <main class="flex-1 flex flex-col overflow-hidden">
      <header class="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <span class="font-bold">Admin Dashboard</span>
        <button class="text-gray-500">Menu</button>
      </header>

      <div class="flex-1 overflow-auto bg-white p-8">
        <RouterView />
      </div>
    </main>

    <BaseModal 
      :isOpen="showLogoutModal" 
      title="Sign Out" 
      @close="showLogoutModal = false"
      maxWidth="max-w-sm"
    >
      <div class="text-gray-600 mb-2">
        Are you sure you want to sign out of the Admin panel?
      </div>
      
      <template #footer>
        <button 
          @click="showLogoutModal = false"
          class="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors"
        >
          Cancel
        </button>
        <button 
          @click="confirmLogout"
          class="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold shadow-sm transition-colors"
        >
          Yes, Sign Out
        </button>
      </template>
    </BaseModal>

  </div>
</template>

<style scoped>
/* Utility to hide on mobile using standard CSS as fallback or if Tailwind responsive classes need help,
   but classes 'mobile-hidden md:flex' on sidebar handle it. 
   'hidden md:flex' is the Tailwind way.
*/
</style>