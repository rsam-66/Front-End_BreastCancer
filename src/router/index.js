import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import PublicLayout from '@/layouts/PublicLayout.vue'

// Views (Only HomeView is active for now)
import HomeView from '@/views/public/HomeView.vue'

// Placeholder imports (Commented out until we build them)
// import LoginView from '@/views/auth/LoginView.vue'
// import DoctorDashboard from '@/views/doctor/DoctorDashboard.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // 1. Public Routes (Homepage) - THIS WILL WORK
        {
            path: '/',
            component: PublicLayout,
            children: [
                {
                    path: '',
                    name: 'home',
                    component: HomeView
                }
            ]
        },

        // 2. Auth Route (Disabled for now)
        /*
        {
          path: '/login',
          name: 'login',
          component: LoginView
        },
        */

        // 3. Doctor Dashboard (Disabled for now)
        /*
        {
          path: '/dashboard',
          name: 'dashboard',
          component: DoctorDashboard
        }
        */
    ]
})

export default router