<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

// Sub-Components
import DiagnosisPanel from './components/DiagnosisPanel.vue';
import VisualReviewCard from './components/VisualDiagnosisCard.vue';
import DoctorDiagnosisForm from './components/DoctorDiagnosisForm.vue';
import ResultSummaryCard from './components/ResultSummaryCard.vue';

const route = useRoute();
const patientId = route.params.id || 'P001';

// --- DATA STATE ---
const currentImage = ref("https://densebreast-info.org/wp-content/uploads/2020/09/Ultrasound-of-a-simple-cyst.jpg");
const doctorDrawings = ref([]);
const doctorNote = ref("");
const doctorAgreement = ref(null);
const isSaved = ref(false);

// --- HANDLERS ---
const handleSave = () => {
  if (!doctorAgreement.value) {
    alert("Please select if you Agree or Disagree with the diagnosis.");
    return;
  }
  isSaved.value = true;
  // Smooth scroll to bottom
  setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-8 pb-32">
    <div class="text-center mb-10">
      <h1 class="text-2xl font-medium text-slate-600">Welcome Dr Bachtiar!</h1>
    </div>

    <div class="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">

      <div class="flex-1">

        <VisualReviewCard v-model:image="currentImage" @update:drawings="(data) => doctorDrawings = data" />

        <button @click="handleSave"
          class="w-full bg-[#0099ff] hover:bg-blue-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all active:scale-[0.99] mb-8">
          Save
        </button>

        <DoctorDiagnosisForm v-model:agreement="doctorAgreement" v-model:note="doctorNote" />

        <ResultSummaryCard v-if="isSaved" :imageSrc="currentImage" :agreement="doctorAgreement" :note="doctorNote"
          aiClassification="Benign" />
      </div>

      <div class="w-full lg:w-80 shrink-0">
        <DiagnosisPanel :patientId="patientId" prediction="Malignant"
          @update:diagnosis="(val) => console.log('Doctor selected:', val)"
          @update:agreement="(val) => doctorAgreement = val" />
      </div>

    </div>
  </div>
</template>