<script setup>
import { ref, onMounted } from "vue";
import { dataService } from "@/services/dataService.js";
import Loading from "@/components/common/Loading.vue";

const stats = ref([]);
const activities = ref([]);
const isLoading = ref(true);

const fetchData = async () => {
  isLoading.value = true;
  try {
    const [statsData, activitiesData] = await Promise.all([
      dataService.getDashboardStats(),
      dataService.getActivities(),
    ]);
    stats.value = statsData;
    activities.value = activitiesData;
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div>
    <div class="text-center mb-8">
      <h2 class="text-gray-500 font-medium text-lg">
        Leading-edge technology for better diagnosis
      </h2>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <Loading text="Loading dashboard data..." />
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
    >
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-xl p-5 shadow-sm border relative overflow-hidden transition-transform hover:-translate-y-1"
        :class="stat.color === 'red' ? 'border-red-100' : 'border-blue-100'"
      >
        <div class="flex justify-between items-start h-full relative z-10">
          <div
            class="p-3 rounded-lg"
            :class="
              stat.color === 'red'
                ? 'bg-red-50 text-red-500'
                : stat.color === 'green'
                ? 'bg-green-50 text-green-500'
                : 'bg-blue-50 text-blue-500'
            "
          >
            <svg
              v-if="stat.icon === 'users'"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
            <svg
              v-else-if="stat.icon === 'user-md'"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            <svg
              v-else-if="stat.icon === 'image'"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div class="ml-4 flex-1">
            <h3 class="text-gray-500 text-sm font-medium">{{ stat.label }}</h3>
          </div>
        </div>

        <div
          class="absolute bottom-2 right-4 text-4xl font-bold"
          :class="stat.color === 'red' ? 'text-red-500' : 'text-[#0099ff]'"
        >
          {{ stat.value }}
        </div>
      </div>
    </div>

    <div>
      <h3 class="font-bold text-gray-800 text-lg mb-6">Newest Activity</h3>

      <div class="space-y-4">
        <div
          v-for="activity in activities"
          :key="activity.id"
          class="bg-gray-100 rounded-xl p-4 flex items-center justify-between hover:bg-gray-200 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center"
              :class="activity.iconColor"
            >
              <svg
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
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.101.433-.101.66 0 .793.645 1.432 1.432 1.432h.122c.132 0 .263.013.391.038a2.25 2.25 0 012.012 2.63l-.403 2.816a.75.75 0 01-.743.643H6.75a.75.75 0 01-.743-.643l-.403-2.816a2.25 2.25 0 012.012-2.63c.128-.025.259-.038.391-.038h.122c.787 0 1.432-.639 1.432-1.432 0-.227-.036-.45-.101-.66"
                />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-800">{{ activity.title }}</p>
              <p class="text-sm text-gray-500">{{ activity.user }}</p>
            </div>
          </div>

          <div class="text-sm text-gray-500 font-medium">
            {{ activity.time }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
