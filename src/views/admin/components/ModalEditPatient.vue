<script setup>
import BaseModal from '@/components/common/BaseModal.vue'
import { ref, watch } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    patient: {
        type: Object,
        default: () => ({ name: '', email: '', phone: '', image: null })
    }
})

const emit = defineEmits(['close', 'submit'])

const form = ref({
    name: '',
    email: '',
    phone: '',
    image: null
})

const previewUrl = ref(null)

watch(() => props.patient, (newVal) => {
    if (newVal) {
        form.value = {
            name: newVal.name,
            email: newVal.email || '',
            phone: newVal.phone,
            image: newVal.image
        }
        previewUrl.value = newVal.image
    }
}, { immediate: true })

const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        const url = URL.createObjectURL(file)
        previewUrl.value = url
        form.value.image = url
    }
}

const handleSubmit = () => {
    emit('submit', { ...form.value })
}
</script>

<template>
    <BaseModal :isOpen="isOpen" title="Edit Patient Details" @close="$emit('close')">
        <form @submit.prevent="handleSubmit" class="space-y-4">

            <!-- Medical Image Preview & Upload -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Cancer Scan Image</label>
                <div class="flex items-start gap-4">
                    <!-- Rectangular Preview for Medical Image -->
                    <div
                        class="relative w-32 h-24 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                        <img v-if="previewUrl" :src="previewUrl" class="w-full h-full object-cover" />
                        <div v-else class="text-gray-400 flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-8 h-8 opacity-50">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            <span class="text-[10px] mt-1">No Image</span>
                        </div>
                    </div>

                    <div class="flex-1">
                        <input type="file" accept="image/*" @change="handleFileChange" class="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-xs file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      cursor-pointer
                    " />
                        <p class="text-xs text-gray-500 mt-2">Upload a new scan to replace the current one.</p>
                    </div>
                </div>
            </div>

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

            <!-- Phone -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input v-model="form.phone" type="tel"
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
                Save Changes
            </button>
        </template>
    </BaseModal>
</template>
