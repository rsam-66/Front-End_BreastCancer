<script setup>
import { ref, onMounted, computed } from "vue";
import { stats } from "../data/dashboardData.js";
import { dataService } from "@/services/dataService.js";
import { useToast } from "@/composables/useToast";
import Loading from "@/components/common/Loading.vue";
import ModalAddDoctor from "../components/ModalAddDoctor.vue";
import ModalEditDoctor from "../components/ModalEditDoctor.vue";
import ModalDeleteDoctor from "../components/ModalDeleteDoctor.vue";

// Import PNG Icons
import PatientIcon from "@/assets/admin/patient.png";
import DoctorIcon from "@/assets/admin/doctor.png";
import ImageIcon from "@/assets/admin/image.png";
import WaitingIcon from "@/assets/admin/waiting.png";
import EditIcon from "@/assets/admin/edit.png";
import DeleteIcon from "@/assets/admin/delete.png";

const doctorList = ref([]);
const searchQuery = ref("");
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedDoctor = ref(null);
const isLoading = ref(true);
const errorMessage = ref("");

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

const filteredDoctorList = computed(() => {
  if (!searchQuery.value) return doctorList.value;
  const lowerQuery = searchQuery.value.toLowerCase();
  return doctorList.value.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(lowerQuery) ||
      String(doctor.id).includes(lowerQuery) ||
      doctor.email.toLowerCase().includes(lowerQuery)
  );
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
    // Optimistic update or refetch
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

onMounted(() => {
  fetchDoctors();
});
</script>

<template>
  <div class="w-full">
    <!-- Top Header Text -->
    <div class="text-center mb-8">
      <h2 class="text-gray-500 font-medium text-lg">
        Leading-edge technology for better diagnosis
      </h2>
    </div>

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
          <span class="text-4xl text-gray-800 font-normal leading-none mb-1">{{
            stats[0]?.value || 0
          }}</span>
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
          <span class="text-4xl text-gray-800 font-normal leading-none mb-1">{{
            stats[1]?.value || 0
          }}</span>
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
          <span class="text-4xl text-gray-800 font-normal leading-none mb-1">{{
            stats[2]?.value || 0
          }}</span>
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
          <span class="text-4xl text-gray-800 font-normal leading-none mb-1">{{
            stats[3]?.value || 0
          }}</span>
        </div>
      </div>
    </div>

    <!-- Management Section Header -->
    <div
      class="w-full flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
    >
      <h1 class="text-2xl font-bold text-gray-700">Doctor Management</h1>

      <div class="flex items-center gap-4 w-full md:w-auto">
        <!-- Search Bar -->
        <div class="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search"
            v-model="searchQuery"
            class="w-full bg-gray-100 rounded-full py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-600"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 absolute right-3 top-2.5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <!-- Add Button -->
        <button
          @click="openAddModal"
          class="bg-[#0099ff] hover:bg-blue-600 text-white font-medium py-2.5 px-6 rounded-full whitespace-nowrap transition-colors"
        >
          Add Doctor
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <Loading text="Loading doctors..." />
    </div>
    <div v-else-if="errorMessage" class="text-center py-8 text-red-500">
      {{ errorMessage }}
    </div>

    <template v-else>
      <!-- Table Headers -->
      <div class="hidden md:flex w-full mb-4 px-6 text-gray-500 font-medium">
        <div class="flex-1 text-center">ID</div>
        <div class="flex-1 text-center">Name</div>
        <div class="flex-1 text-center">Email</div>
        <div class="flex-1 text-center">Status</div>
        <div class="flex-1 text-center">Action</div>
      </div>

      <!-- Doctor Rows -->
      <div v-if="filteredDoctorList.length > 0" class="flex flex-col gap-4">
        <div
          v-for="doctor in filteredDoctorList"
          :key="doctor.id"
          class="w-full bg-gray-100 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between hover:bg-gray-200/80 transition-colors"
        >
          <!-- ID -->
          <div
            class="flex-1 w-full md:w-auto flex justify-between md:justify-center items-center mb-2 md:mb-0"
          >
            <span class="md:hidden font-bold">ID:</span>
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-white"
              >
                <img
                  :src="DoctorIcon"
                  alt="Total Doctor"
                  class="w-8 h-8 object-contain"
                />
              </div>
              <span class="text-gray-700 font-medium whitespace-nowrap">{{
                doctor.id
              }}</span>
            </div>
          </div>

          <!-- Name -->
          <div
            class="flex-1 w-full md:w-auto flex justify-between md:justify-center items-center mb-2 md:mb-0"
          >
            <span class="md:hidden font-bold">Name:</span>
            <span class="text-gray-700">{{ doctor.name }}</span>
          </div>

          <!-- Email -->
          <div
            class="flex-1 w-full md:w-auto flex justify-between md:justify-center items-center mb-2 md:mb-0"
          >
            <span class="md:hidden font-bold">Email:</span>
            <span class="text-gray-700 text-sm md:text-base">{{
              doctor.email
            }}</span>
          </div>

          <!-- Status -->
          <div
            class="flex-1 w-full md:w-auto flex justify-between md:justify-center items-center mb-2 md:mb-0"
          >
            <span class="md:hidden font-bold">Status:</span>
            <span class="text-green-500 font-medium">{{ doctor.status }}</span>
          </div>

          <!-- Actions -->
          <div
            class="flex-1 w-full md:w-auto flex justify-center items-center gap-4 mt-2 md:mt-0"
          >
            <!-- Edit Button -->
            <button
              @click="openEditModal(doctor)"
              class="w-8 h-8 flex items-center justify-center rounded hover:opacity-80 transition-opacity"
            >
              <img
                :src="EditIcon"
                alt="Edit"
                class="w-10 h-10 object-contain"
              />
            </button>
            <!-- Delete Button -->
            <button
              @click="openDeleteModal(doctor)"
              class="w-8 h-8 flex items-center justify-center rounded hover:opacity-80 transition-opacity"
            >
              <img
                :src="DeleteIcon"
                alt="Delete"
                class="w-10 h-10 object-contain"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="w-full flex flex-col items-center justify-center py-12 text-gray-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 mb-4 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="text-lg font-medium">No doctors found</p>
        <p class="text-sm">Try using different keywords</p>
      </div>
    </template>

    <!-- Modals -->
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
