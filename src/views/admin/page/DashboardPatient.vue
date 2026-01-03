<script setup>
import { ref, onMounted, computed } from "vue";
import { stats } from "../data/dashboardData.js";
import { dataService } from "@/services/dataService.js";
import { useToast } from "@/composables/useToast";
import Loading from "@/components/common/Loading.vue";
import ModalAddPatient from "../components/ModalAddPatient.vue";
import ModalEditPatient from "../components/ModalEditPatient.vue";
import ModalDeletePatient from "../components/ModalDeletePatient.vue";
import ModalAIAnalysis from "../components/ModalAIAnalysis.vue";
import ModalUploadImage from "../components/ModalUploadImage.vue";

// Import PNG Icons
import PatientIcon from "@/assets/admin/patient.png";
import DoctorIcon from "@/assets/admin/doctor.png";
import ImageIcon from "@/assets/admin/image.png";
import WaitingIcon from "@/assets/admin/waiting.png";
import EditIcon from "@/assets/admin/edit.png";
import DeleteIcon from "@/assets/admin/delete.png";

const patientList = ref([]);
const searchQuery = ref("");
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isAIModalOpen = ref(false);
const isUploadModalOpen = ref(false);
const selectedPatient = ref(null);
const isLoading = ref(true);
const errorMessage = ref("");

const toast = useToast();

const fetchPatients = async () => {
  isLoading.value = true;
  try {
    patientList.value = await dataService.getPatients();
  } catch (error) {
    console.error("Error fetching patients:", error);
    errorMessage.value = "Failed to load patients.";
    toast.error("Failed to load patients");
  } finally {
    isLoading.value = false;
  }
};

const filteredPatientList = computed(() => {
  if (!searchQuery.value) return patientList.value;
  const lowerQuery = searchQuery.value.toLowerCase();
  return patientList.value.filter(
    (patient) =>
      patient.name.toLowerCase().includes(lowerQuery) ||
      String(patient.id).includes(lowerQuery) ||
      (patient.phone && patient.phone.includes(lowerQuery))
  );
});

const openAddModal = () => {
  isAddModalOpen.value = true;
};

const openEditModal = (patient) => {
  selectedPatient.value = patient;
  isEditModalOpen.value = true;
};

const openDeleteModal = (patient) => {
  selectedPatient.value = patient;
  isDeleteModalOpen.value = true;
};

const openAIModal = (patient) => {
  selectedPatient.value = patient;
  isAIModalOpen.value = true;
};

const openUploadModal = (patient) => {
  selectedPatient.value = patient;
  isUploadModalOpen.value = true;
};

const handleAddPatient = async (newPatient) => {
  try {
    await dataService.addPatient(newPatient);
    await fetchPatients();
    isAddModalOpen.value = false;
    toast.success("Patient added successfully");
  } catch (error) {
    console.error("Failed to add patient:", error);
    toast.error("Failed to add patient");
  }
};

const handleEditPatient = async (updatedPatient) => {
  try {
    await dataService.updatePatient(selectedPatient.value.id, updatedPatient);

    if (updatedPatient.rawFile) {
      await dataService.uploadMedicalRecord(
        selectedPatient.value.id,
        updatedPatient.rawFile
      );
    }

    await fetchPatients();
    isEditModalOpen.value = false;
    selectedPatient.value = null;
    toast.success("Patient updated successfully");
  } catch (error) {
    console.error("Failed to update patient:", error);
    toast.error("Failed to update patient");
  }
};

const handleUploadImage = async (file) => {
  try {
    await dataService.uploadMedicalRecord(selectedPatient.value.id, file);
    await fetchPatients();
    isUploadModalOpen.value = false;
    selectedPatient.value = null;
    toast.success("Image uploaded successfully");
  } catch (error) {
    console.error("Failed to upload image:", error);
    toast.error(
      `Upload failed: ${
        error.message || error.error_description || "Unknown error"
      }`
    );
  }
};

const handleDeletePatient = async () => {
  try {
    await dataService.deletePatient(selectedPatient.value.id);
    // Optimistic update
    patientList.value = patientList.value.filter(
      (p) => p.id !== selectedPatient.value.id
    );
    isDeleteModalOpen.value = false;
    selectedPatient.value = null;
    toast.success("Patient deleted successfully");
  } catch (error) {
    console.error("Failed to delete patient:", error);
    toast.error("Failed to delete patient");
  }
};

onMounted(() => {
  fetchPatients();
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
      <h1 class="text-2xl font-bold text-gray-700">Patient Management</h1>

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
          Add Patient
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <Loading text="Loading patients..." />
    </div>
    <div v-else-if="errorMessage" class="text-center py-8 text-red-500">
      {{ errorMessage }}
    </div>

    <template v-else>
      <!-- Table Headers -->
      <div class="hidden md:flex w-full mb-4 px-6 text-gray-500 font-medium">
        <div class="flex-1 text-center">ID</div>
        <div class="flex-1 text-center">Name</div>
        <div class="flex-1 text-center">Phone</div>
        <div class="flex-1 text-center">Review</div>
        <div class="flex-1 text-center">Image</div>
        <div class="flex-1 text-center">Action</div>
      </div>

      <!-- Patient Rows -->
      <div v-if="filteredPatientList.length > 0" class="flex flex-col gap-4">
        <div
          v-for="patient in filteredPatientList"
          :key="patient.id"
          class="w-full bg-gray-100 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between hover:bg-gray-200/80 transition-colors"
        >
          <!-- ID -->
          <div
            class="flex-1 w-full md:w-auto flex justify-between md:justify-center items-center mb-2 md:mb-0"
          >
            <span class="md:hidden font-bold">ID:</span>
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center"
              >
                <!-- Bed icon for patient ID -->
                <img
                  :src="PatientIcon"
                  alt="Patient ID"
                  class="w-8 h-8 object-contain"
                />
              </div>
              <span class="text-gray-700 font-medium whitespace-nowrap"
                >P{{ String(patient.id).padStart(3, "0") }}</span
              >
            </div>
          </div>

          <!-- Name -->
          <div
            class="flex-1 w-full md:w-auto flex justify-between md:justify-center items-center mb-2 md:mb-0"
          >
            <span class="md:hidden font-bold">Name:</span>
            <span class="text-gray-700 font-medium">{{ patient.name }}</span>
          </div>

          <!-- Phone -->
          <div
            class="flex-1 w-full md:w-auto flex justify-between md:justify-center items-center mb-2 md:mb-0"
          >
            <span class="md:hidden font-bold">Phone:</span>
            <span class="text-gray-700">{{ patient.phone }}</span>
          </div>

          <!-- Review Status -->
          <div
            class="flex-1 w-full md:w-auto flex justify-between md:justify-center items-center mb-2 md:mb-0"
          >
            <span class="md:hidden font-bold">Review:</span>
            <span
              v-if="patient.review === 'Done'"
              class="text-green-500 font-bold"
              >Done</span
            >
            <span
              v-else-if="patient.review === 'Not Yet'"
              class="text-[#006699] font-bold"
              >Not Yet</span
            >
            <span v-else class="text-gray-400 font-bold">-</span>
          </div>

          <!-- Image Status -->
          <div
            class="flex-1 w-full md:w-auto flex justify-between md:justify-center items-center mb-2 md:mb-0"
          >
            <span class="md:hidden font-bold">Image:</span>
            <span v-if="patient.image" class="text-green-500 font-bold"
              >Yes</span
            >
            <span v-else class="text-red-500 font-bold">No</span>
          </div>

          <!-- Actions -->
          <div
            class="flex-1 w-full md:w-auto flex justify-center items-center gap-4 mt-2 md:mt-0"
          >
            <!-- Edit Button -->
            <button
              @click="openEditModal(patient)"
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
              @click="openDeleteModal(patient)"
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
        <p class="text-lg font-medium">No patients found</p>
        <p class="text-sm">Try using different keywords</p>
      </div>
    </template>

    <!-- Modals -->
    <ModalAddPatient
      :isOpen="isAddModalOpen"
      @close="isAddModalOpen = false"
      @submit="handleAddPatient"
    />
    <ModalEditPatient
      :isOpen="isEditModalOpen"
      :patient="selectedPatient"
      @close="isEditModalOpen = false"
      @submit="handleEditPatient"
    />
    <ModalDeletePatient
      :isOpen="isDeleteModalOpen"
      :patient="selectedPatient"
      @close="isDeleteModalOpen = false"
      @confirm="handleDeletePatient"
    />
    <ModalAIAnalysis
      :isOpen="isAIModalOpen"
      :patient="selectedPatient"
      @close="isAIModalOpen = false"
    />
    <ModalUploadImage
      :isOpen="isUploadModalOpen"
      :patient="selectedPatient"
      @close="isUploadModalOpen = false"
      @submit="handleUploadImage"
    />
  </div>
</template>
