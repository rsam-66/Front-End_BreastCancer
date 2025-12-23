<script setup>
import BaseModal from '@/components/common/BaseModal.vue'
import { ref } from 'vue'

defineProps({
    isOpen: Boolean
})

const emit = defineEmits(['close', 'submit'])

const form = ref({
    name: '',
    email: '',
    phone: ''
})

const handleSubmit = () => {
    // Basic validation could be added here
    emit('submit', {
        ...form.value,
        image: null,
        review: '-' // Default state for new patient without image/review
    })
    form.value = { name: '', email: '', phone: '' }
}
</script>

<template>
    <BaseModal :isOpen="isOpen" title="Add New Patient" @close="$emit('close')">
        <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Name -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input v-model="form.name" type="text" placeholder="Patient Name"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required />
            </div>

            <!-- Email -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input v-model="form.email" type="email" placeholder="patient@example.com"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required />
            </div>

            <!-- Phone -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input v-model="form.phone" type="tel" placeholder="08123456789"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required />
            </div>
        </form>

        <template #footer>
            <button @click="$emit('close')"
                class="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium">
                Cancel
            </button>
            <button @click="handleSubmit"
                class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-sm hover:shadow">
                Add Patient
            </button>
        </template>
    </BaseModal>
</template>
