<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { dataService } from "@/services/dataService.js";
import Loading from "@/components/common/Loading.vue";

// Import PNG Icons
import PatientIcon from "@/assets/admin/patient.png";
import WaitingIcon from "@/assets/admin/waiting.png";

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

const stats = computed(() => {
  const total = patients.value.length;
  const pending = patients.value.filter(
    (p) => p.review === "Not Yet" || p.review === "-"
  ).length;
  const completed = patients.value.filter((p) => p.review === "Done").length;

  return [
    {
      label: "My Patients",
      value: total,
      icon: PatientIcon,
      bgColor: "bg-blue-50",
      textColor: "text-[#0099ff]",
      borderColor: "hover:border-[#0099ff]/50",
    },
    {
      label: "Pending Review",
      value: pending,
      icon: WaitingIcon,
      bgColor: "bg-red-50",
      textColor: "text-red-500",
      borderColor: "hover:border-red-500/50",
    },
    {
      label: "Completed",
      value: completed,
      icon: PatientIcon, // Reuse PatientIcon with green theme
      bgColor: "bg-green-50",
      textColor: "text-green-500",
      borderColor: "hover:border-green-500/50",
    },
  ];
});

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
    <!-- Header -->
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

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm relative h-32 flex flex-col justify-between group transition-all cursor-pointer"
        :class="stat.borderColor"
      >
        <div class="flex items-start justify-between">
          <div
            class="p-2.5 rounded-xl min-w-[48px] h-[48px] flex items-center justify-center"
            :class="stat.bgColor"
          >
            <img
              :src="stat.icon"
              :alt="stat.label"
              class="w-6 h-6 object-contain"
            />
          </div>
          <span class="text-gray-500 text-sm font-medium pt-1 text-right">{{
            stat.label
          }}</span>
        </div>
        <div class="flex justify-end items-end">
          <span class="text-4xl font-normal leading-none mb-1 text-gray-800">{{
            stat.value
          }}</span>
        </div>
      </div>
    </div>

    <!-- Patient List -->
    <div
      class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <!-- Header -->
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

      <div v-if="isLoading" class="flex justify-center py-12">
        <Loading text="Loading patients..." />
      </div>

      <div v-else>
        <!-- Table Header (Desktop) -->
        <div
          class="hidden md:flex bg-gray-50 text-gray-500 font-medium text-sm border-b border-gray-100"
        >
          <div class="flex-1 py-3 px-6">Name</div>
          <div class="flex-1 py-3 px-6">Contact</div>
          <div class="flex-1 py-3 px-6 text-center">Status</div>
          <div class="flex-1 py-3 px-6 text-right">Action</div>
        </div>

        <!-- List Items -->
        <div class="divide-y divide-gray-100">
          <div
            v-for="patient in filteredPatients"
            :key="patient.id"
            class="flex flex-col md:flex-row items-center p-4 hover:bg-gray-50 transition-colors group"
          >
            <!-- Name & Avatar -->
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
                  class="w-full h-full flex items-center justify-center text-gray-500 font-bold text-sm bg-gray-100"
                >
                  {{ patient.name.charAt(0) }}
                </div>
              </div>
              <div>
                <p class="font-bold text-gray-800">{{ patient.name }}</p>
                <p class="text-xs text-gray-400">#{{ patient.id }}</p>
              </div>
            </div>

            <!-- Contact -->
            <div
              class="flex-1 w-full md:w-auto px-2 mt-2 md:mt-0 text-sm text-gray-600"
            >
              <div class="flex flex-col">
                <span>{{ patient.email }}</span>
                <span class="text-xs text-gray-400">{{ patient.phone }}</span>
              </div>
            </div>

            <!-- Status -->
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

            <!-- Action -->
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
  </div>
</template>
