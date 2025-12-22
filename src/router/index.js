import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import PublicLayout from '@/layouts/PublicLayout.vue'

// Models
import AdminLayout from '@/layouts/AdminLayout.vue'

// Views (Admin)
import DashboardHome from '@/views/admin/page/DashboardHome.vue'
import DashboardDoctor from '@/views/admin/page/DashboardDoctor.vue'
import DashboardPatient from '@/views/admin/page/DashboardPatient.vue'

// Views (Public)
import HomeView from '@/views/public/HomeView.vue'

// Views (Doctor)
import DoctorDashboardHome from '@/views/doctor/DashboardHome.vue'

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

        // 2. Admin Dashboard
        {
          path: '/admin',
          component: AdminLayout,
          meta: { requiresAuth: true, role: 'admin' },
          children: [
            {
              path: '',
              name: 'admin-dashboard',
              component: DashboardHome
            },
            {
              path: '/admin/doctors',
              name: 'admin-doctors',
              component: DashboardDoctor
            },
            {
              path: '/admin/patients',
              name: 'admin-patients',
              component: DashboardPatient
            }
          ]
        },

        // 3. Doctor Dashboard
        {
          path: '/doctor',
          name: 'doctor-dashboard',
          component: DoctorDashboardHome,
          meta: { requiresAuth: true, role: 'doctor' }
        }
    ]
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('userRole')
  
  if (to.meta.requiresAuth) {
    // Check if user is logged in
    if (!userRole) {
      next('/') // Redirect to home if not logged in
      return
    }

    // Check if user has correct role
    if (to.meta.role && to.meta.role !== userRole) {
      alert('Unauthorized access!')
      // Redirect to their appropriate dashboard if they try to access wrong one
      if (userRole === 'admin') next('/admin')
      else if (userRole === 'doctor') next('/doctor')
      else next('/')
      return
    }
  }

  // No specific login page to guard against anymore, since it's a modal on PublicLayout
  // But if we had other public auth pages, we'd check them here.

  next()
})

export default router