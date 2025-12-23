<template>
    <div class="min-h-screen flex items-center justify-center bg-blue-50">
        <div class="text-center">
            <h1 class="text-3xl font-bold text-blue-800 mb-4">Doctor Dashboard</h1>
            <p class="text-gray-600 mb-8">Welcome, Doctor! This is a placeholder for your dashboard.</p>
            <button @click="logout"
                class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors">
                Logout
            </button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
    localStorage.removeItem('userRole')
    router.push('/login')
}
</script>
