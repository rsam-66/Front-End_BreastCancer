<script setup>
import { ref } from 'vue';
import MedicalCanvas from './components/MedicalCanvas.vue';
import DiagnosisPanel from './components/DiagnosisPanel.vue';

// State shared between components
const currentTool = ref('brush');
const brushSize = ref(5);
const opacity = ref(0.6);
const drawingData = ref([]);

// Actions
const onSave = (formData) => {
  console.log("Saving to DB:", {
    drawings: drawingData.value,
    ...formData
  });
  alert("Analysis Saved!");
};
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
    
    <div class="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col">
      
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-slate-800">Grad-CAM Visualization</h3>
        <div class="flex gap-2 bg-slate-100 p-1 rounded-lg">
          <button @click="currentTool = 'brush'" :class="['px-3 py-1 rounded-md text-sm font-bold', currentTool === 'brush' ? 'bg-white shadow text-[#0099ff]' : 'text-slate-500']">✏️ Brush</button>
          <button @click="currentTool = 'eraser'" :class="['px-3 py-1 rounded-md text-sm font-bold', currentTool === 'eraser' ? 'bg-white shadow text-[#0099ff]' : 'text-slate-500']">🧹 Eraser</button>
        </div>
      </div>

      <MedicalCanvas 
        baseImageSrc="/src/assets/images/doctor.png"
        heatmapImageSrc="" 
        :opacity="opacity"
        :brushSize="brushSize"
        :tool="currentTool"
        @update:lines="(data) => drawingData = data"
      />

      <div class="mt-4 grid grid-cols-2 gap-8">
        <div>
          <label class="text-xs font-bold text-slate-500 mb-1 block">Heatmap Opacity: {{ opacity }}</label>
          <input type="range" min="0" max="1" step="0.1" v-model.number="opacity" class="w-full accent-[#0099ff]" />
        </div>
        <div>
          <label class="text-xs font-bold text-slate-500 mb-1 block">Brush Size: {{ brushSize }}px</label>
          <input type="range" min="2" max="20" v-model.number="brushSize" class="w-full accent-[#0099ff]" />
        </div>
      </div>
    </div>

    <div class="w-full lg:w-96">
      <DiagnosisPanel @save="onSave" />
    </div>

  </div>
</template>