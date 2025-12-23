<script setup>
import BaseModal from '@/components/common/BaseModal.vue'
import { ref, watch } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    doctor: {
        type: Object,
        default: () => ({ name: '', email: '', status: '' })
    }
})

const emit = defineEmits(['close', 'submit'])

const form = ref({
    name: '',
    email: '',
    status: 'Active'
})

// Watch for changes in the doctor prop to update the form
watch(() => props.doctor, (newVal) => {
    if (newVal) {
        form.value = { ...newVal }
    }
}, { immediate: true })

const handleSubmit = () => {
    emit('submit', { ...form.value })
}
</script>

<template>
    <BaseModal :isOpen="isOpen" title="Edit Doctor" @close="$emit('close')">
        <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Name -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input v-model="form.name" type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required />
            </div>

            <!-- Email -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input v-model="form.email" type="email"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required />
            </div>

            <!-- Status -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select v-model="form.status"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
        </form>

        <template #footer>
            <button @click="$emit('close')"
                class="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium">
                Cancel
            </button>
            <button @click="handleSubmit"
                class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-sm hover:shadow">
                Save Changes
            </button>
        </template>
    </BaseModal>
</template>
