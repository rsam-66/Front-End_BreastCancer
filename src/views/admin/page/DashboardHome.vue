<script setup>
import { ref, onMounted } from "vue";
import { dataService } from "@/services/dataService.js";
import Loading from "@/components/common/Loading.vue";

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
        <!-- Card 1: Total Patient -->
        <div
          class="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm relative h-32 flex flex-col justify-between group hover:border-[#0099ff]/50 transition-all cursor-pointer"
        >
          <div class="flex items-start justify-between">
            <div
              class="bg-blue-50 p-2.5 rounded-xl min-w-[48px] h-[48px] flex items-center justify-center"
            >
              <img
                :src="PatientIcon"
                alt="Total Patient"
                class="w-6 h-6 object-contain"
              />
            </div>
            <span class="text-gray-500 text-sm font-medium pt-1 text-right"
              >Total Patient</span
            >
          </div>
          <div class="flex justify-end items-end">
            <span
              class="text-4xl text-gray-800 font-normal leading-none mb-1"
              >{{ stats[0]?.value || 0 }}</span
            >
          </div>
        </div>

        <!-- Card 2: Total Doctor -->
        <div
          class="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm relative h-32 flex flex-col justify-between group hover:border-[#004d80]/50 transition-all cursor-pointer"
        >
          <div class="flex items-start justify-between">
            <div
              class="bg-[#eef5fa] p-2.5 rounded-xl min-w-[48px] h-[48px] flex items-center justify-center"
            >
              <img
                :src="DoctorIcon"
                alt="Total Doctor"
                class="w-6 h-6 object-contain"
              />
            </div>
            <span class="text-gray-500 text-sm font-medium pt-1 text-right"
              >Total Doctor</span
            >
          </div>
          <div class="flex justify-end items-end">
            <span
              class="text-4xl text-gray-800 font-normal leading-none mb-1"
              >{{ stats[1]?.value || 0 }}</span
            >
          </div>
        </div>

        <!-- Card 3: Image Uploaded -->
        <div
          class="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm relative h-32 flex flex-col justify-between group hover:border-green-500/50 transition-all cursor-pointer"
        >
          <div class="flex items-start justify-between">
            <div
              class="bg-green-50 p-2.5 rounded-xl min-w-[48px] h-[48px] flex items-center justify-center"
            >
              <img
                :src="ImageIcon"
                alt="Image Uploaded"
                class="w-6 h-6 object-contain"
              />
            </div>
            <span class="text-gray-500 text-sm font-medium pt-1 text-right"
              >Image Uploaded</span
            >
          </div>
          <div class="flex justify-end items-end">
            <span
              class="text-4xl text-gray-800 font-normal leading-none mb-1"
              >{{ stats[2]?.value || 0 }}</span
            >
          </div>
        </div>

        <!-- Card 4: Waiting -->
        <div
          class="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm relative h-32 flex flex-col justify-between group hover:border-red-500/50 transition-all cursor-pointer"
        >
          <div class="flex items-start justify-between">
            <div
              class="bg-red-50 p-2.5 rounded-xl min-w-[48px] h-[48px] flex items-center justify-center"
            >
              <img
                :src="WaitingIcon"
                alt="Waiting For Review"
                class="w-6 h-6 object-contain"
              />
            </div>
            <span class="text-gray-500 text-sm font-medium pt-1 text-right"
              >Waiting For Review</span
            >
          </div>
          <div class="flex justify-end items-end">
            <span
              class="text-4xl text-gray-800 font-normal leading-none mb-1"
              >{{ stats[3]?.value || 0 }}</span
            >
          </div>
        </div>
      </div>

      <!-- Newest Activity -->
      <div>
        <h3 class="font-bold text-gray-800 text-2xl mb-6">Newest Activity</h3>

        <div class="space-y-4">
          <div
            v-for="(activity, index) in activities"
            :key="activity.id"
            class="bg-[#EEEEEE] rounded-2xl p-4 flex items-center justify-between hover:bg-gray-200 transition-colors"
          >
            <div class="flex items-center gap-4">
              <!-- Icon Box -->
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center"
                :class="getActivityIconColor(index)"
              >
                <img
                  :src="getActivityIcon(index)"
                  class="w-6 h-6 object-contain"
                />
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
