<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { dataService } from "@/services/dataService.js";

const router = useRouter();
const route = useRoute();

const currentFilter = ref("All");
const patients = ref([]);
const isLoading = ref(true);

watch(
  () => route.query.filter,
  (newFilter) => {
    if (newFilter) {
      currentFilter.value = newFilter;
    } else {
      currentFilter.value = "All";
    }
  },
  { immediate: true }
);

onMounted(async () => {
  try {
    isLoading.value = true;
    patients.value = await dataService.getPatients();
  } catch (error) {
    console.error("Failed to fetch patients:", error);
  } finally {
    isLoading.value = false;
  }
});

const stats = computed(() => [
  {
    label: "My Patients",
    value: patients.value.length,
    icon: "users",
    color: "blue",
  },
  {
    label: "Pending Review",
    value: patients.value.filter(
      (p) => p.review === "Not Yet" || p.review === "-"
    ).length,
    icon: "clock",
    color: "red",
  },
  {
    label: "Completed",
    value: patients.value.filter((p) => p.review === "Done").length,
    icon: "check-circle",
    color: "green",
  },
]);

const filteredPatients = computed(() => {
  if (currentFilter.value === "All") {
    return patients.value;
  }
  if (currentFilter.value === "Not Yet") {
    return patients.value.filter(
      (p) => p.review === "Not Yet" || p.review === "-"
    );
  }
  return patients.value.filter((p) => p.review === currentFilter.value);
});

const getStatusColor = (status) => {
  switch (status) {
    case "Done":
      return "bg-green-100 text-green-600 border-green-200";
    case "Not Yet":
      return "bg-yellow-100 text-yellow-600 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-500 border-gray-200";
  }
};

const openReview = (patientId) => {
  router.push({ name: "review-console", params: { id: patientId } });
};
</script>

<template>
  <div>
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-800">
        {{
          currentFilter === "All"
            ? "Overview"
            : currentFilter === "Not Yet"
            ? "Waiting List"
            : "Patient History"
        }}
      </h2>
      <p class="text-gray-500 text-sm">Welcome back, Dr. Bachtiar</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 relative overflow-hidden"
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
              v-else-if="stat.icon === 'clock'"
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
            <svg
              v-else-if="stat.icon === 'check-circle'"
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
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="ml-4 flex-1">
            <h3 class="text-gray-500 text-sm font-medium">{{ stat.label }}</h3>
          </div>
        </div>
        <div
          class="absolute bottom-2 right-4 text-4xl font-bold"
          :class="
            stat.color === 'red'
              ? 'text-red-500'
              : stat.color === 'green'
              ? 'text-green-500'
              : 'text-[#0099ff]'
          "
        >
          {{ stat.value }}
        </div>
      </div>
    </div>

    <div
      class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div
        class="p-4 border-b border-gray-100 flex justify-between items-center"
      >
        <h3 class="font-bold text-gray-800">
          {{
            currentFilter === "All"
              ? "All Patients"
              : currentFilter === "Not Yet"
              ? "Pending Reviews"
              : "Completed Reviews"
          }}
        </h3>
        <span class="text-xs text-gray-400"
          >Showing {{ filteredPatients.length }} patients</span
        >
      </div>

      <div
        class="hidden md:flex bg-gray-50 text-gray-500 font-medium text-sm uppercase tracking-wider"
      >
        <div class="flex-1 py-3 px-6">Name</div>
        <div class="flex-1 py-3 px-6">Contact</div>
        <div class="flex-1 py-3 px-6 text-center">Status</div>
        <div class="flex-1 py-3 px-6 text-right">Action</div>
      </div>

      <div class="divide-y divide-gray-100">
        <div
          v-for="patient in filteredPatients"
          :key="patient.id"
          class="flex flex-col md:flex-row items-center p-4 hover:bg-blue-50/50 transition-colors group"
        >
          <div class="flex-1 w-full md:w-auto flex items-center gap-3 px-2">
            <div
              class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-100"
            >
              <img
                v-if="patient.image"
                :src="patient.image"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-400 font-bold text-sm"
              >
                {{ patient.name.charAt(0) }}
              </div>
            </div>
            <div>
              <p class="font-bold text-gray-800">{{ patient.name }}</p>
              <p class="text-xs text-gray-400">#{{ patient.id }}</p>
            </div>
          </div>
          <div
            class="flex-1 w-full md:w-auto px-2 mt-2 md:mt-0 text-sm text-gray-600"
          >
            <div class="flex flex-col">
              <span>{{ patient.email }}</span>
              <span class="text-xs text-gray-400">{{ patient.phone }}</span>
            </div>
          </div>
          <div
            class="flex-1 w-full md:w-auto px-2 mt-2 md:mt-0 flex md:justify-center"
          >
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-bold border',
                getStatusColor(patient.review),
              ]"
            >
              {{ patient.review === "-" ? "New" : patient.review }}
            </span>
          </div>
          <div
            class="flex-1 w-full md:w-auto px-2 mt-4 md:mt-0 flex md:justify-end"
          >
            <button
              @click="openReview(patient.id)"
              class="bg-[#0099ff] text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 shadow-md hover:shadow-lg transition-all active:scale-95 w-full md:w-auto"
            >
              Review Case
            </button>
          </div>
        </div>

        <div
          v-if="filteredPatients.length === 0"
          class="p-12 text-center text-gray-400"
        >
          No patients found in this category.
        </div>
      </div>
    </div>
  </div>
</template>
