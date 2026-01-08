<script setup>
import BaseModal from "@/components/common/BaseModal.vue";
import Loading from "@/components/common/Loading.vue";

defineProps({
  isOpen: Boolean,
});
</script>

<template>
  <BaseModal :isOpen="isOpen" title="AI Processing" :hideCloseButton="true">
    <div class="py-12">
      <Loading text="Menganalisis Gambar dengan AI..." />
      <p class="text-center text-sm text-gray-400 mt-2">
        Tolong tunggu sebentar sementara kami mengklasifikasikan gambar.
      </p>
    </div>
  </BaseModal>
</template>
