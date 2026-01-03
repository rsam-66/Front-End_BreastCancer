<script setup>
import BaseModal from "@/components/common/BaseModal.vue";
import { getPublicImageUrl } from "@/services/storageService";

const props = defineProps({
  isOpen: Boolean,
  patient: Object,
});

const emit = defineEmits(["close"]);

import { watch } from "vue";
import { dataService } from "@/services/dataService.js";

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.patient) {
      dataService.logAIAnalysis(props.patient.id, "Benign (98.5%)");
    }
  }
);
</script>

<template>
  <BaseModal
    :isOpen="isOpen"
    title="AI Analysis Result"
    maxWidth="max-w-lg"
    @close="$emit('close')"
  >
    <div v-if="patient" class="space-y-4">
      <div
        class="flex items-center gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100"
      >
        <img
          :src="patient.image || 'https://via.placeholder.com/150'"
          class="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
          alt="Patient"
        />
        <div>
          <h4 class="font-bold text-gray-800">{{ patient.name }}</h4>
          <p class="text-sm text-gray-500">{{ patient.phone }}</p>
        </div>
      </div>

      <div>
        <h5 class="font-semibold text-gray-700 mb-2">Analysis Findings</h5>
        <div class="bg-gray-100 rounded-xl p-4 text-sm text-gray-600 space-y-2">
          <div class="flex justify-between items-center">
            <span>Diagnosis Prediction:</span>
            <span
              class="font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded"
              >Benign (Jinak)</span
            >
          </div>
          <div class="flex justify-between items-center">
            <span>Confidence Score:</span>
            <span class="font-bold text-gray-800">98.5%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              class="bg-green-500 h-2.5 rounded-full"
              style="width: 98.5%"
            ></div>
          </div>
          <p class="pt-2 text-xs italic">
            *This is an AI-generated analysis. Please consult with a specialist
            for final diagnosis.
          </p>
        </div>
      </div>

      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p class="text-xs text-yellow-700">
          <strong>Note:</strong> The uploaded mammogram shows clear margins with
          no signs of microcalcifications.
        </p>
      </div>
    </div>
    <div v-else class="text-center py-8 text-gray-400">
      No patient selected.
    </div>

    <template #footer>
      <button
        @click="$emit('close')"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm hover:shadow"
      >
        Run Re-Analysis
      </button>
      <button
        @click="$emit('close')"
        class="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
      >
        Close
      </button>
    </template>
  </BaseModal>
</template>
