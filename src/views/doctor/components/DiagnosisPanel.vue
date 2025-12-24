<script setup>
import { ref } from 'vue';

const diagnosis = ref(null); // 'agree' or 'disagree'
const notes = ref("");

const emit = defineEmits(['save']);

const handleSave = () => {
  emit('save', {
    diagnosis: diagnosis.value,
    notes: notes.value
  });
};
</script>

<template>
  <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
    <h4 class="text-sm uppercase text-slate-400 font-bold mb-4">AI Prediction</h4>
    
    <div class="text-center py-4 bg-slate-50 rounded-lg border border-slate-100 mb-6">
      <div class="text-4xl font-extrabold text-red-500 mb-1">87%</div>
      <div class="text-slate-500 text-xs font-medium uppercase tracking-wide">Malignancy Probability</div>
    </div>

    <div class="space-y-6 flex-1">
      <div>
        <label class="block font-bold text-slate-700 mb-2">Doctor's Diagnosis</label>
        <div class="grid grid-cols-2 gap-3">
          <label 
            :class="[
              'flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all',
              diagnosis === 'agree' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 hover:border-green-300'
            ]"
          >
            <input type="radio" value="agree" v-model="diagnosis" class="hidden" />
            <span class="font-bold">Agree</span>
          </label>
          
          <label 
            :class="[
              'flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all',
              diagnosis === 'disagree' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 hover:border-red-300'
            ]"
          >
            <input type="radio" value="disagree" v-model="diagnosis" class="hidden" />
            <span class="font-bold">Disagree</span>
          </label>
        </div>
      </div>

      <div>
        <label class="block font-bold text-slate-700 mb-2">Clinical Notes</label>
        <textarea 
          v-model="notes"
          class="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0099ff] outline-none h-32 resize-none"
          placeholder="Add specific observations..."
        ></textarea>
      </div>
    </div>

    <button 
      @click="handleSave"
      class="w-full bg-[#0099ff] text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition shadow-lg mt-4"
    >
      Save Diagnosis
    </button>
  </div>
</template>