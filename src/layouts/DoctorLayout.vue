<script setup>
import { ref, onMounted } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { dataService } from "@/services/dataService.js";
// 1. Import the reusable Modal
import BaseModal from "@/components/common/BaseModal.vue";

const route = useRoute();
const router = useRouter();

// 2. STATE FOR MODAL
const showLogoutModal = ref(false);
const stats = ref({ total: 0, pending: 0, completed: 0, attention: 0 });

// 3. MENU ITEMS (Added 'icon' keys to match your template logic)
const menuItems = ref([
  {
    name: "Dashboard",
    path: "/doctor/dashboard",
    icon: "grid",
    count: 0,
  },
  {
    name: "Pending",
    path: "/doctor/dashboard?filter=Pending",
    icon: "clock",
    count: 0,
  },
  {
    name: "Completed",
    path: "/doctor/dashboard?filter=Completed",
    icon: "check-circle",
    count: 0,
  },
  {
    name: "Attention",
    path: "/doctor/dashboard?filter=Attention",
    icon: "alert",
    count: 0,
  },
]);

onMounted(async () => {
  try {
    const data = await dataService.getDoctorStats();
    stats.value = data;

    // Update menu items with counts
    const pendingItem = menuItems.value.find((i) => i.name === "Pending");
    if (pendingItem) pendingItem.count = data.pending;

    const completedItem = menuItems.value.find((i) => i.name === "Completed");
    if (completedItem) completedItem.count = data.completed;

    const attentionItem = menuItems.value.find((i) => i.name === "Attention");
    if (attentionItem) attentionItem.count = data.attention;
  } catch (error) {
    console.error("Layout stats fetch failed:", error);
  }
});

// 4. ACTIVE STATE LOGIC
const isActive = (item) => {
  if (item.path.includes("?")) {
    const itemFilter = item.path.split("=")[1];
    return route.query.filter === itemFilter;
  }
  if (item.path === "/doctor/dashboard") {
    return route.path === "/doctor/dashboard" && !route.query.filter;
  }
  return route.path.startsWith(item.path);
};

// 5. LOGOUT HANDLERS
const handleLogoutClick = () => {
  showLogoutModal.value = true;
};

const confirmLogout = () => {
  localStorage.removeItem("userRole");
  localStorage.removeItem("userName");
  showLogoutModal.value = false;
  router.push("/");
};
</script>

<template>
  <div class="flex h-screen bg-white font-sans text-gray-800">
    <aside
      class="w-64 flex flex-col bg-gray-100 border-r border-gray-200 flex-shrink-0 transition-all duration-300 mobile-hidden md:flex"
    >
      <div class="p-6">
        <div class="font-bold text-xl text-gray-800">Doctor Panel</div>
        <div class="text-sm text-gray-500 mt-1">Medical Workspace</div>
      </div>

      <nav class="flex-1 px-4 space-y-2 mt-4">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          class="flex items-center px-4 py-3 rounded-lg font-medium transition-colors justify-between text-sm"
          :class="
            isActive(item)
              ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
              : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
          "
        >
          <div class="flex items-center">
            <span class="w-5 h-5 mr-3 flex items-center justify-center">
              <svg
                v-if="item.icon === 'grid'"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                />
              </svg>
              <svg
                v-else-if="item.icon === 'clock'"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <svg
                v-else-if="item.icon === 'check-circle'"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <svg
                v-else-if="item.icon === 'alert'"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              <svg
                v-else-if="item.icon === 'cog'"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.795"
                />
              </svg>
            </span>
            {{ item.name }}
          </div>
          <span
            v-if="item.count > 0"
            class="px-2 py-0.5 rounded-full text-xs font-bold"
            :class="{
              'bg-red-100 text-red-600':
                item.name === 'Pending' || item.name === 'Attention',
              'bg-blue-100 text-blue-600': item.name === 'Completed',
              'bg-gray-200 text-gray-700': item.name === 'Dashboard',
            }"
          >
            {{ item.count }}
          </span>
        </router-link>
      </nav>

      <div class="p-6 border-t border-gray-200">
        <button
          @click="handleLogoutClick"
          class="flex items-center text-red-500 font-medium hover:text-red-700 transition-colors w-full cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 mr-3"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          Log Out
        </button>
      </div>
    </aside>

    <main class="flex-1 flex flex-col overflow-hidden">
      <header
        class="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between"
      >
        <span class="font-bold">Doctor Dashboard</span>
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
        Are you sure you want to sign out of your account?
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
@media (max-width: 768px) {
  .mobile-hidden {
    display: none;
  }
}
</style>
