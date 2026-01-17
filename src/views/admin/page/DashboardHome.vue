<script setup>
import { ref, onMounted } from "vue";
import { dataService } from "@/services/dataService.js";
import Loading from "@/components/common/Loading.vue";
import InfoCard from "../components/InfoCard.vue";

// Import PNG Icons
import PatientIcon from "@/assets/admin/patient.png";
import DoctorIcon from "@/assets/admin/doctor.png";
import ImageIcon from "@/assets/admin/image.png";
import WaitingIcon from "@/assets/admin/waiting.png";

const stats = ref([]);
const activities = ref([]);
const isLoading = ref(true);

const fetchData = async () => {
  isLoading.value = true;

  // Fetch Stats
  try {
    const statsData = await dataService.getDashboardStats();
    stats.value = statsData;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
  }

  // Fetch Activities
  try {
    const activitiesData = await dataService.getActivities();
    activities.value = activitiesData;
  } catch (error) {
    console.error("Failed to fetch activities:", error);
  } finally {
    isLoading.value = false;
  }
};

// Simple helper to get colors for activity icons matching the design
const getActivityIconColor = (index) => {
  // Alternating/Variety based on screenshot intuition or data
  // Design showed: green, blue, blue, green essentially
  const colors = [
    "bg-green-100 text-green-600",
    "bg-blue-100 text-[#0099ff]",
    "bg-[#dbeafe] text-[#006699]",
    "bg-green-100 text-green-600",
  ];
  return colors[index % colors.length];
};

const getActivityIcon = (index) => {
  // 0: Image (Green)
  // 1: Add Patient (Blue)
  // 2: Doctor (Dark Blue)
  // 3: Image (Green)
  // Return the imported image objects directly
  const icons = [ImageIcon, PatientIcon, DoctorIcon, ImageIcon];
  return icons[index % icons.length];
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="w-full">
    <!-- Header Text -->
    <div class="text-center mb-8">
      <h2 class="text-gray-500 font-medium text-lg">
        Leading-edge technology for better diagnosis
      </h2>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <Loading text="Loading dashboard data..." />
    </div>

    <div v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <InfoCard title="Total Patient" :value="stats[0]?.value || 0" :icon="PatientIcon" theme="blue" />
        <InfoCard title="Total Doctor" :value="stats[1]?.value || 0" :icon="DoctorIcon" theme="dark-blue" />
        <InfoCard title="Image Uploaded" :value="stats[2]?.value || 0" :icon="ImageIcon" theme="green" />
        <InfoCard title="Waiting For Review" :value="stats[3]?.value || 0" :icon="WaitingIcon" theme="red" />
      </div>

      <!-- Newest Activity -->
      <div>
        <h3 class="font-bold text-gray-800 text-2xl mb-6">Newest Activity</h3>

        <div class="space-y-4">
          <div v-for="(activity, index) in activities" :key="activity.id"
            class="bg-[#EEEEEE] rounded-2xl p-4 flex items-center justify-between hover:bg-gray-200 transition-colors">
            <div class="flex items-center gap-4">
              <!-- Icon Box -->
              <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="getActivityIconColor(index)">
                <img :src="getActivityIcon(index)" class="w-6 h-6 object-contain" />
              </div>

              <!-- Text Info -->
              <div>
                <p class="font-bold text-gray-700 text-lg leading-tight">
                  {{ activity.title }}
                </p>
                <p class="text-sm text-gray-400 mt-0.5">{{ activity.user }}</p>
              </div>
            </div>

            <div class="text-sm text-gray-400 font-medium">
              {{ activity.time }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
