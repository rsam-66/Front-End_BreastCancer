<script setup>
import { ref, onMounted } from "vue";
import { stats } from "../data/dashboardData.js";
import { dataService } from "@/services/dataService.js";
import { useToast } from "@/composables/useToast";
import Loading from "@/components/common/Loading.vue";
import ModalAddPatient from "../components/ModalAddPatient.vue";
import ModalEditPatient from "../components/ModalEditPatient.vue";
import ModalDeletePatient from "../components/ModalDeletePatient.vue";
import ModalAIAnalysis from "../components/ModalAIAnalysis.vue";
import ModalUploadImage from "../components/ModalUploadImage.vue";
import ModalAnalyzing from "../components/ModalAnalyzing.vue";

const patientList = ref([]);
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isAIModalOpen = ref(false);
const isUploadModalOpen = ref(false);
const isAnalyzing = ref(false);
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

onMounted(() => {
  fetchPatients();
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
      isEditModalOpen.value = false;
      isAnalyzing.value = true;

      await dataService.uploadMedicalRecord(
        selectedPatient.value.id,
        updatedPatient.rawFile
      );
      toast.success("Patient updated & Image Analyzed!");
    } else {
      isEditModalOpen.value = false;
      selectedPatient.value = null;
      toast.success("Patient updated successfully");
    }

    await fetchPatients();
  } catch (error) {
    console.error("Failed to update patient:", error);
    toast.error("Failed to update patient");
  } finally {
    isAnalyzing.value = false;
  }
};

const handleUploadImage = async (file) => {
  isUploadModalOpen.value = false;
  isAnalyzing.value = true;
  try {
    await dataService.uploadMedicalRecord(selectedPatient.value.id, file);
    await fetchPatients();
    selectedPatient.value = null;
    toast.success("Image uploaded & Analysis complete!");
  } catch (error) {
    console.error("Failed to upload image:", error);
    toast.error(
      `Upload failed: ${
        error.message || error.error_description || "Unknown error"
      }`
    );
  } finally {
    isAnalyzing.value = false;
  }
};

const handleDeletePatient = async () => {
  try {
    await dataService.deletePatient(selectedPatient.value.id);
    await fetchPatients();
    isDeleteModalOpen.value = false;
    selectedPatient.value = null;
    toast.success("Patient deleted successfully");
  } catch (error) {
    console.error("Failed to delete patient:", error);
    toast.error("Failed to delete patient");
  }
};
const handleReAnalysis = async () => {
  if (!selectedPatient.value) return;

  isAIModalOpen.value = false;
  isAnalyzing.value = true;

  try {
    await dataService.reAnalyzePatient(selectedPatient.value.id);
    await fetchPatients();
    toast.success("Re-Analysis Complete!");
  } catch (error) {
    console.error("Re-analysis failed:", error);
    toast.error("Re-analysis failed.");
  } finally {
    isAnalyzing.value = false;
    selectedPatient.value = null;
  }
};
</script>

<template>
  <div>
    <div class="text-center mb-8">
      <h2 class="text-gray-500 font-medium text-lg">
        Leading-edge technology for better diagnosis
      </h2>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <Loading text="Loading patients..." />
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

          <div
            class="absolute bottom-2 right-4 text-4xl font-bold"
            :class="stat.color === 'red' ? 'text-red-500' : 'text-[#0099ff]'"
          >
            {{ stat.value }}
          </div>
        </div>
      </div>

      <div class="w-full flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Patients Management</h1>
        <button
          @click="openAddModal"
          class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-[12px]"
        >
          Add Patient
        </button>
      </div>

      <div
        class="w-full flex p-3 bg-white border rounded-[12px] text-gray-500 font-medium mb-2"
      >
        <div class="flex-[0.5] h-10 flex items-center justify-center">ID</div>
        <div class="flex-1 h-10 flex items-center justify-center">Name</div>
        <div class="flex-1 h-10 flex items-center justify-center">Email</div>
        <div class="flex-1 h-10 flex items-center justify-center">Phone</div>
        <div class="flex-1 h-10 flex items-center justify-center">Review</div>
        <div class="flex-1 h-10 flex items-center justify-center">Image</div>
        <div class="flex-1 h-10 flex items-center justify-center">Actions</div>
      </div>

      <div
        class="w-full flex p-3 my-3 bg-gray-100 items-center rounded-[12px]"
        v-for="patient in patientList"
        :key="patient.id"
      >
        <div class="flex-[0.5] h-10 flex items-center justify-center">
          <div>{{ patient.id }}</div>
        </div>
        <div class="flex-1 h-10 flex items-center justify-center">
          <div>{{ patient.name }}</div>
        </div>
        <div class="flex-1 h-10 flex items-center justify-center">
          <div class="text-sm text-gray-600">{{ patient.email }}</div>
        </div>
        <div class="flex-1 h-10 flex items-center justify-center">
          <div>{{ patient.phone }}</div>
        </div>
        <div class="flex-1 h-10 flex items-center justify-center px-2">
          <span
            v-if="patient.review === 'Done'"
            class="bg-green-100 text-green-600 py-1 px-3 rounded-full text-xs font-bold border border-green-200"
          >
            Done
          </span>
          <span
            v-else-if="patient.review === 'Not Yet'"
            class="bg-yellow-100 text-yellow-600 py-1 px-3 rounded-full text-xs font-bold border border-yellow-200"
          >
            Not Yet
          </span>
          <span v-else class="text-gray-400 font-bold"> - </span>
        </div>
        <div class="flex-1 h-10 flex items-center justify-center">
          <button
            @click="openUploadModal(patient)"
            v-if="!patient.image"
            class="bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors border border-blue-200"
          >
            + Add Image
          </button>
          <button
            @click="openAIModal(patient)"
            v-else
            class="bg-green-50 text-green-600 hover:bg-green-100 text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors border border-green-200"
          >
            See Image
          </button>
        </div>
        <div class="flex-1 h-10 flex items-center justify-center">
          <div class="gap-2 flex">
            <button
              @click="openEditModal(patient)"
              class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-[12px]"
            >
              Edit
            </button>
            <button
              @click="openDeleteModal(patient)"
              class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-[12px]"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

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
        @reanalyze="handleReAnalysis"
      />
      <ModalUploadImage
        :isOpen="isUploadModalOpen"
        :patient="selectedPatient"
        @close="isUploadModalOpen = false"
        @submit="handleUploadImage"
      />
      <ModalAnalyzing :isOpen="isAnalyzing" />
    </div>
  </div>
</template>
