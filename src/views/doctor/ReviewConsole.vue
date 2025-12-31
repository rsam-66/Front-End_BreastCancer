<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import MedicalCanvas from './components/MedicalCanvas.vue';
import DiagnosisPanel from './components/DiagnosisPanel.vue';

// --- FIX STARTS HERE ---
// Change '@' to relative path '../../' so Vite can find the file without config
import ImageInputModal from '../../components/common/ImageInputModal.vue';
import defaultCystImage from '../../assets/images/cyst-ultrasound.jpg';
// --- FIX ENDS HERE ---

const route = useRoute();

// --- STATE ---
const showGradCam = ref(false);
const gradCamOpacity = ref(0.6);
const doctorDrawings = ref([]);
const doctorNote = ref("");
const doctorAgreement = ref(null);
const isSaved = ref(false);

// Snapshot state
const savedDiagnosis = ref({ agreement: null, note: null });
const showImageModal = ref(false);

// --- USE THE IMPORTED IMAGE VARIABLE ---
const currentImageSrc = ref(defaultCystImage);

const handleImageUpdate = (newSrc) => {
  currentImageSrc.value = newSrc;
  doctorDrawings.value = [];
};

const handleSave = () => {
  if (!doctorAgreement.value) {
    alert("Please select if you Agree or Disagree with the diagnosis.");
    return;
  }

  savedDiagnosis.value = {
    agreement: doctorAgreement.value,
    note: doctorNote.value
  };

  isSaved.value = true;

  const container = document.getElementById('workspace-container');
  if (container) {
    setTimeout(() => container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' }), 100);
  }
};
</script>

<template>
  <div class="h-full w-full bg-slate-50 flex flex-col overflow-hidden relative">

    <div id="workspace-container" class="flex-1 overflow-y-auto p-8 pb-32">

      <div class="text-center mb-8">
        <h1 class="text-2xl font-medium text-slate-600">Welcome Dr Bachtiar!</h1>
      </div>

      <div class="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">

        <div class="flex-1 min-w-0">
          <div class="bg-gray-100 rounded-3xl p-8 mb-6 shadow-sm border border-slate-200 relative">

            <div class="flex justify-between items-center mb-6">
              <h2 class="font-bold text-slate-700 text-lg">Visual Review</h2>

              <button @click="showImageModal = true"
                class="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-bold hover:border-[#0099ff] hover:text-[#0099ff] transition-all shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                Change Image
              </button>
            </div>

            <MedicalCanvas :baseImageSrc="currentImageSrc" :showGradCam="showGradCam" :gradCamOpacity="gradCamOpacity"
              @update:drawings="(data) => doctorDrawings = data" />

            <div class="mt-8 flex items-center gap-6 px-4">
              <label class="flex items-center gap-3 cursor-pointer select-none">
                <div class="relative flex items-center">
                  <input type="checkbox" v-model="showGradCam" class="peer sr-only">
                  <div
                    class="w-6 h-6 bg-white border-2 border-slate-400 rounded peer-checked:bg-[#0099ff] peer-checked:border-[#0099ff] transition-all">
                  </div>
                  <svg class="absolute w-4 h-4 text-white left-1 opacity-0 peer-checked:opacity-100" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"></path>
                  </svg>
                </div>
                <span class="font-bold text-slate-600">Grad-Cam</span>
              </label>

              <div class="flex-1 flex items-center gap-3">
                <input type="range" min="0" max="1" step="0.05" v-model.number="gradCamOpacity"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0099ff]">
              </div>
            </div>
          </div>

          <button @click="handleSave"
            class="w-full bg-[#0099ff] hover:bg-blue-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all active:scale-[0.99] mb-8">
            Save
          </button>

          <div class="bg-gray-100 rounded-xl p-6 border border-slate-200 flex flex-col md:flex-row gap-6">
            <div class="flex-1">
              <h3 class="font-bold text-slate-700 mb-4 text-lg">Doctor's Diagnosis</h3>
              <div class="flex items-center gap-4 text-sm font-bold text-slate-500">
                <span>Agree With AI Diagnosis?</span>
                <label class="flex items-center gap-2 cursor-pointer select-none">
                  <input type="radio" value="agree" v-model="doctorAgreement" class="accent-green-500 w-5 h-5">
                  <span :class="doctorAgreement === 'agree' ? 'text-green-600' : ''">Agree</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer select-none">
                  <input type="radio" value="disagree" v-model="doctorAgreement" class="accent-red-500 w-5 h-5">
                  <span :class="doctorAgreement === 'disagree' ? 'text-red-600' : ''">Disagree</span>
                </label>
              </div>
            </div>
            <div class="flex-[2] flex gap-4">
              <label class="font-bold text-slate-700 whitespace-nowrap mt-2">Add Note</label>
              <textarea v-model="doctorNote"
                class="w-full h-24 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0099ff] outline-none resize-none bg-white"
                placeholder="Type Here.."></textarea>
            </div>
          </div>

          <div v-if="isSaved" class="mt-10 animate-fade-in-up">
            <h2 class="text-2xl font-bold text-slate-700 mb-6">Result By Doctor</h2>
            <div class="bg-gray-100 rounded-3xl p-8 border border-slate-200 flex flex-col md:flex-row gap-8">

              <div
                class="w-64 h-64 bg-black rounded-xl overflow-hidden border-4 border-white shadow-sm shrink-0 relative">
                <img :src="currentImageSrc" class="w-full h-full object-cover opacity-80" />
              </div>

              <div class="flex-1 space-y-4">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-slate-600">Agree With AI Diagnosis?</span>
                  <span class="font-bold"
                    :class="savedDiagnosis.agreement === 'agree' ? 'text-green-500' : 'text-red-500'">
                    {{ savedDiagnosis.agreement === 'agree' ? 'Agree' : 'Disagree' }}
                  </span>
                </div>

                <div>
                  <span class="font-bold text-slate-600">Note:</span>
                  <p class="text-slate-500 text-sm mt-1 leading-relaxed">{{ savedDiagnosis.note || "No notes added." }}
                  </p>
                </div>

                <div>
                  <p class="font-bold text-slate-600 mb-2">Classification Result By AI</p>
                  <span class="bg-yellow-400 text-white px-6 py-2 rounded-lg font-bold shadow-md inline-block">
                    Benign
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="w-full lg:w-80 shrink-0">
          <DiagnosisPanel :patientId="patientId" prediction="Malignant"
            @update:diagnosis="(val) => console.log('Doctor selected:', val)"
            @update:agreement="(val) => doctorAgreement = val" />
        </div>

      </div>
    </div>

    <ImageInputModal :isOpen="showImageModal" @close="showImageModal = false" @confirm="handleImageUpdate" />

  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>