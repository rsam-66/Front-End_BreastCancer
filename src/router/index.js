import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import PublicLayout from '@/layouts/PublicLayout.vue'

// Models
import AdminLayout from '@/layouts/AdminLayout.vue'

// Views (Admin)
import DashboardHome from '@/views/admin/DashboardHome.vue'

// Views (Public)
import HomeView from '@/views/public/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'

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

        // 2. Auth Route
        {
          path: '/login',
          name: 'login',
          component: LoginView
        },

        // 3. Admin Dashboard
        {
          path: '/admin',
          component: AdminLayout,
          children: [
            {
              path: '',
              name: 'admin-dashboard',
              component: DashboardHome
            },
            {
              path: 'doctors',
              name: 'admin-doctors',
              component: { template: '<div class="p-10"><h2 class="text-2xl font-bold mb-4">Doctors Management</h2><p>List of doctors will go here.</p></div>' }
            },
            {
              path: 'patients',
              name: 'admin-patients',
              component: { template: '<div class="p-10"><h2 class="text-2xl font-bold mb-4">Patient Records</h2><p>List of patients will go here.</p></div>' }
            }
          ]
        },
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