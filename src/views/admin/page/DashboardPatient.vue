<script setup>
import { ref, onMounted } from "vue";
import { dataService } from "@/services/dataService.js";
import { useToast } from "@/composables/useToast";
import Loading from "@/components/common/Loading.vue";
import ModalAddPatient from "../components/ModalAddPatient.vue";
import ModalEditPatient from "../components/ModalEditPatient.vue";
import ModalDeletePatient from "../components/ModalDeletePatient.vue";
import ModalAIAnalysis from "../components/ModalAIAnalysis.vue";
import ModalUploadImage from "../components/ModalUploadImage.vue";
import ModalAnalyzing from "../components/ModalAnalyzing.vue";
import InfoCard from "../components/InfoCard.vue";

// Import Icons
import PatientIcon from "@/assets/admin/patient.png";
import DoctorIcon from "@/assets/admin/doctor.png";
import ImageIcon from "@/assets/admin/image.png";
import WaitingIcon from "@/assets/admin/waiting.png";

const patientList = ref([]);
const stats = ref([]);
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
    const [patients, statsData] = await Promise.all([
      dataService.getPatients(),
      dataService.getDashboardStats()
    ]);
    patientList.value = patients;
    stats.value = statsData;
  } catch (error) {
    console.error("Error fetching data:", error);
    errorMessage.value = "Failed to load data.";
    toast.error("Failed to load data");
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
    const createdPatient = await dataService.addPatient(newPatient);

    if (newPatient.rawFile && createdPatient?.id) {
      isAddModalOpen.value = false;
      isAnalyzing.value = true;

      await dataService.uploadMedicalRecord(
        createdPatient.id,
        newPatient.rawFile
      );
      await fetchPatients();

      const freshPatient = patientList.value.find(
        (p) => p.id === createdPatient.id
      );
      if (freshPatient) {
        selectedPatient.value = freshPatient;
        isAIModalOpen.value = true;
      }

      toast.success("Patient added & Image Analyzed!");
    } else {
      await fetchPatients();
      isAddModalOpen.value = false;
      toast.success("Patient added successfully");
    }
  } catch (error) {
    console.error("Failed to add patient:", error);
    toast.error("Failed to add patient");
  } finally {
    isAnalyzing.value = false;
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

      await fetchPatients();

      const freshPatient = patientList.value.find(
        (p) => p.id === selectedPatient.value.id
      );
      if (freshPatient) {
        selectedPatient.value = freshPatient;
        isAIModalOpen.value = true;
      }

      toast.success("Patient updated & Image Analyzed!");
    } else {
      isEditModalOpen.value = false;
      selectedPatient.value = null;
      await fetchPatients();
      toast.success("Patient updated successfully");
    }
  } catch (error) {
    console.error("Failed to update patient:", error);
    toast.error("Failed to update patient");
  } finally {
    isAnalyzing.value = false;
  }
};

const handleUploadImage = async (file) => {
  const currentId = selectedPatient.value.id;
  isUploadModalOpen.value = false;
  isAnalyzing.value = true;
  try {
    await dataService.uploadMedicalRecord(currentId, file);
    await fetchPatients();

    const freshPatient = patientList.value.find((p) => p.id === currentId);
    if (freshPatient) {
      selectedPatient.value = freshPatient;
      isAIModalOpen.value = true;
    } else {
      selectedPatient.value = null;
    }

    toast.success("Image uploaded & Analysis complete!");
  } catch (error) {
    console.error("Failed to upload image:", error);
    toast.error(
      `Upload failed: ${error.message || error.error_description || "Unknown error"
      }`
    );
    selectedPatient.value = null;
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

  const currentId = selectedPatient.value.id;
  isAIModalOpen.value = false;
  isAnalyzing.value = true;

  try {
    await dataService.reAnalyzePatient(currentId);
    await fetchPatients();

    const freshPatient = patientList.value.find((p) => p.id === currentId);
    if (freshPatient) {
      selectedPatient.value = freshPatient;
      isAIModalOpen.value = true;
    }

    toast.success("Re-Analysis Complete!");
  } catch (error) {
    console.error("Re-analysis failed:", error);
    toast.error("Re-analysis failed.");
    selectedPatient.value = null;
  } finally {
    isAnalyzing.value = false;
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
        <InfoCard title="Total Patient" :value="stats[0]?.value || 0" :icon="PatientIcon" theme="blue" />
        <InfoCard title="Total Doctor" :value="stats[1]?.value || 0" :icon="DoctorIcon" theme="dark-blue" />
        <InfoCard title="Image Uploaded" :value="stats[2]?.value || 0" :icon="ImageIcon" theme="green" />
        <InfoCard title="Waiting For Review" :value="stats[3]?.value || 0" :icon="WaitingIcon" theme="red" />
      </div>

      <div class="w-full flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Patients Management</h1>
        <button @click="openAddModal" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-[12px]">
          Add Patient
        </button>
      </div>

      <div class="w-full flex p-3 bg-white border rounded-[12px] text-gray-500 font-medium mb-2">
        <div class="flex-[0.5] h-10 flex items-center justify-center">ID</div>
        <div class="flex-1 h-10 flex items-center justify-center">Name</div>
        <div class="flex-1 h-10 flex items-center justify-center">Email</div>
        <div class="flex-1 h-10 flex items-center justify-center">Phone</div>
        <div class="flex-1 h-10 flex items-center justify-center">Review</div>
        <div class="flex-1 h-10 flex items-center justify-center">Image</div>
        <div class="flex-1 h-10 flex items-center justify-center">Actions</div>
      </div>

      <div class="w-full flex p-3 my-3 bg-gray-100 items-center rounded-[12px]" v-for="patient in patientList"
        :key="patient.id">
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
          <span v-if="patient.review === 'Done'"
            class="bg-green-100 text-green-600 py-1 px-3 rounded-full text-xs font-bold border border-green-200">
            Done
          </span>
          <span v-else-if="patient.review === 'Not Yet'"
            class="bg-yellow-100 text-yellow-600 py-1 px-3 rounded-full text-xs font-bold border border-yellow-200">
            Not Yet
          </span>
          <span v-else class="text-gray-400 font-bold"> - </span>
        </div>
        <div class="flex-1 h-10 flex items-center justify-center">
          <button @click="openUploadModal(patient)" v-if="!patient.image"
            class="bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors border border-blue-200">
            + Add Image
          </button>
          <button @click="openAIModal(patient)" v-else
            class="bg-green-50 text-green-600 hover:bg-green-100 text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors border border-green-200">
            See Image
          </button>
        </div>
        <div class="flex-1 h-10 flex items-center justify-center">
          <div class="gap-2 flex">
            <button @click="openEditModal(patient)"
              class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-[12px]">
              Edit
            </button>
            <button @click="openDeleteModal(patient)"
              class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-[12px]">
              Delete
            </button>
          </div>
        </div>
      </div>

      <ModalAddPatient :isOpen="isAddModalOpen" @close="isAddModalOpen = false" @submit="handleAddPatient" />
      <ModalEditPatient :isOpen="isEditModalOpen" :patient="selectedPatient" @close="isEditModalOpen = false"
        @submit="handleEditPatient" />
      <ModalDeletePatient :isOpen="isDeleteModalOpen" :patient="selectedPatient" @close="isDeleteModalOpen = false"
        @confirm="handleDeletePatient" />
      <ModalAIAnalysis :isOpen="isAIModalOpen" :patient="selectedPatient" @close="isAIModalOpen = false"
        @reanalyze="handleReAnalysis" />
      <ModalUploadImage :isOpen="isUploadModalOpen" :patient="selectedPatient" @close="isUploadModalOpen = false"
        @submit="handleUploadImage" />
      <ModalAnalyzing :isOpen="isAnalyzing" />
    </div>
  </div>
</template>
