<script setup>
import { ref, onMounted, computed } from "vue";
import { stats } from "../data/dashboardData.js";
import { dataService } from "@/services/dataService.js";
import { useToast } from "@/composables/useToast";
import Loading from "@/components/common/Loading.vue";
import ModalAddDoctor from "../components/ModalAddDoctor.vue";
import ModalEditDoctor from "../components/ModalEditDoctor.vue";
import ModalDeleteDoctor from "../components/ModalDeleteDoctor.vue";
import Pagination from "@/components/common/Pagination.vue";

const heads = ["ID", "Name", "Email", "Status", "Actions"];

const doctorList = ref([]);
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedDoctor = ref(null);
const isLoading = ref(true);
const errorMessage = ref("");

const currentPage = ref(1);
const itemsPerPage = 10;

const toast = useToast();

const fetchDoctors = async () => {
  isLoading.value = true;
  try {
    doctorList.value = await dataService.getDoctors();
  } catch (error) {
    console.error("Error fetching doctors:", error);
    errorMessage.value = "Failed to load doctors.";
    toast.error("Failed to load doctors");
  } finally {
    isLoading.value = false;
  }
};

const paginatedDoctors = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return doctorList.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(doctorList.value.length / itemsPerPage);
});

const handlePageChange = (page) => {
  currentPage.value = page;
};

onMounted(() => {
  fetchDoctors();
});

const openAddModal = () => {
  isAddModalOpen.value = true;
};

const openEditModal = (doctor) => {
  selectedDoctor.value = doctor;
  isEditModalOpen.value = true;
};

const openDeleteModal = (doctor) => {
  selectedDoctor.value = doctor;
  isDeleteModalOpen.value = true;
};

const handleAddDoctor = async (newDoctor) => {
  try {
    await dataService.addDoctor(newDoctor);
    await fetchDoctors();
    isAddModalOpen.value = false;
    toast.success("Doctor added successfully");
  } catch (error) {
    console.error("Failed to add doctor:", error);
    toast.error("Failed to add doctor");
  }
};

const handleEditDoctor = async (updatedDoctor) => {
  try {
    await dataService.updateDoctor(selectedDoctor.value.id, updatedDoctor);
    await fetchDoctors();
    isEditModalOpen.value = false;
    selectedDoctor.value = null;
    toast.success("Doctor updated successfully");
  } catch (error) {
    console.error("Failed to update doctor:", error);
    toast.error("Failed to update doctor");
  }
};

const handleDeleteDoctor = async () => {
  try {
    await dataService.deleteDoctor(selectedDoctor.value.id);
    doctorList.value = doctorList.value.filter(
      (d) => d.id !== selectedDoctor.value.id
    );
    isDeleteModalOpen.value = false;
    selectedDoctor.value = null;
    toast.success("Doctor deleted successfully");
  } catch (error) {
    console.error("Failed to delete doctor:", error);
    toast.error("Failed to delete doctor");
  }
};
</script>

<template>
  <div class="p-6">
    <div class="text-center mb-8">
      <h2 class="text-gray-500 font-medium text-lg">
        Leading-edge technology for better diagnosis
      </h2>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <Loading text="Loading doctors..." />
    </div>
    <div v-else-if="errorMessage" class="text-center py-8 text-red-500">
      {{ errorMessage }}
    </div>

    <div v-if="!isLoading && !errorMessage">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
              <h3 class="text-gray-500 text-sm font-medium">
                {{ stat.label }}
              </h3>
            </div>
          </div>

          <div class="absolute bottom-2 right-4">
            <div
              class="absolute bottom-2 right-4 text-4xl font-bold"
              :class="stat.color === 'red' ? 'text-red-500' : 'text-[#0099ff]'"
            >
              {{ stat.value }}
            </div>
          </div>
        </div>
      </div>
      <div class="w-full flex justify-between items-center">
        <h1 class="text-2xl font-bold">Doctors Management</h1>
        <button
          @click="openAddModal"
          class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-[12px]"
        >
          Add Doctor
        </button>
      </div>

      <!-- Table Header -->
      <div
        class="w-full flex p-3 my-3 bg-white items-center rounded-[12px] shadow-sm font-semibold text-gray-700 border"
      >
        <div v-for="head in heads" :key="head" class="flex-1 text-center">
          {{ head }}
        </div>
      </div>

      <div
        class="w-full flex p-3 my-3 bg-gray-100 items-center rounded-[12px]"
        v-for="doctor in paginatedDoctors"
        :key="doctor.id"
      >
        <div class="flex-1 h-10 flex items-center justify-center">
          <div>{{ doctor.id }}</div>
        </div>
        <div
          class="flex-1 h-10 flex items-center justify-center overflow-hidden"
        >
          <div class="truncate max-w-[150px]" :title="doctor.name">
            {{ doctor.name }}
          </div>
        </div>
        <div
          class="flex-1 h-10 flex items-center justify-center overflow-hidden"
        >
          <div class="truncate max-w-[200px]" :title="doctor.email">
            {{ doctor.email }}
          </div>
        </div>
        <div
          class="flex-1 h-10 flex items-center text-green-500 justify-center font-semibold"
        >
          <div>{{ doctor.status }}</div>
        </div>
        <div class="flex-1 h-10 flex items-center justify-center">
          <div class="gap-2 flex">
            <button
              @click="openEditModal(doctor)"
              class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-[12px]"
            >
              Edit
            </button>
            <button
              @click="openDeleteModal(doctor)"
              class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-[12px]"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="handlePageChange"
      />
    </div>
    <Toast />

    <ModalAddDoctor
      :isOpen="isAddModalOpen"
      @close="isAddModalOpen = false"
      @submit="handleAddDoctor"
    />
    <ModalEditDoctor
      :isOpen="isEditModalOpen"
      :doctor="selectedDoctor"
      @close="isEditModalOpen = false"
      @submit="handleEditDoctor"
    />
    <ModalDeleteDoctor
      :isOpen="isDeleteModalOpen"
      :doctor="selectedDoctor"
      @close="isDeleteModalOpen = false"
      @confirm="handleDeleteDoctor"
    />
  </div>
</template>
