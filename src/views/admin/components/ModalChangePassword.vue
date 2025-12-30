<script setup>
import BaseModal from '@/components/common/BaseModal.vue'
import { ref } from 'vue'

const props = defineProps({
    isOpen: Boolean
})

const emit = defineEmits(['close'])

const step = ref('form') // 'form' or 'success'

const form = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const handleSubmit = () => {
    // Basic validation logic logic here
    // Verify passwords match etc.
    if (form.value.newPassword !== form.value.confirmPassword) {
        alert("New passwords do not match!")
        return
    }

    // Simulate API call
    console.log("Changing password...", form.value)

    // Show success state
    step.value = 'success'
}

const handleClose = () => {
    emit('close')
    // Reset state after transition
    setTimeout(() => {
        step.value = 'form'
        form.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    }, 300)
}
</script>

<template>
    <BaseModal :isOpen="isOpen" :title="step === 'form' ? 'Change Password' : ''" @close="handleClose"
        :showCloseButton="false" :centerTitle="true">

        <!-- Form State -->
        <div v-if="step === 'form'" class="space-y-6 px-2">

            <!-- Current Password -->
            <div class="flex items-center gap-4">
                <label class="w-32 text-sm font-semibold text-gray-600">Current</label>
                <input v-model="form.currentPassword" type="password"
                    class="flex-1 px-4 py-2.5 bg-gray-100 rounded-lg outline-none text-gray-700" required />
            </div>

            <!-- New Password -->
            <div class="flex items-center gap-4">
                <label class="w-32 text-sm font-semibold text-gray-600">New</label>
                <input v-model="form.newPassword" type="password"
                    class="flex-1 px-4 py-2.5 bg-gray-100 rounded-lg outline-none text-gray-700" required />
            </div>

            <!-- Confirm Password (Make Sure) -->
            <div class="flex items-center gap-4">
                <label class="w-32 text-sm font-semibold text-gray-600">Make Sure</label>
                <input v-model="form.confirmPassword" type="password"
                    class="flex-1 px-4 py-2.5 bg-gray-100 rounded-lg outline-none text-gray-700" required />
            </div>

            <!-- Action Button -->
            <div class="pt-4">
                <button @click="handleSubmit"
                    class="w-full py-3 bg-[#0099ff] hover:bg-blue-600 text-white rounded-full font-bold text-lg transition-colors shadow-lg shadow-blue-200">
                    Change
                </button>
            </div>
        </div>

        <!-- Success State -->
        <div v-else class="flex flex-col items-center justify-center py-10 space-y-4">
            <h2 class="text-xl font-bold text-gray-600 text-center">Password Changed</h2>
        </div>

        <template #footer>
            <div class="hidden"></div>
        </template>
    </BaseModal>
</template>
