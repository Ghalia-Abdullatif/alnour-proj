import { createRouter, createWebHistory } from 'vue-router'

// المكونات الرئيسية
import Dashboard from '../views/dashboard/DashBoard.vue'
import AdminLayout from '../views/dashboard/admin/AdminHome.vue'
import AdminRegistration from '../views/dashboard/admin/AdminRegistration.vue'

// صفحات عامة
import RegisterPage from '../views/registration/RegisterPage.vue'
import groups from '../views/dashboard/supervisor/ViewGroups.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    redirect: '/Dashboard'
  },
  {
    path: '/Dashboard',
    name: 'Dashboard',
    component: Dashboard,
    children: [
      // لوحة التحكم للادمن
      {
        path: 'admin',
        redirect: '/Dashboard/admin/AdminCourses.vue',

        meta: { roles: ['admin', 'superadmin'] }, // أدوار مسموحة
        children: [
          { path: '', redirect: 'users' },
          {
            path: 'users',
            name: 'AdminUsers',
            component: () => import('../views/dashboard/admin/AdminUsers.vue'),
            meta: { roles: ['admin', 'superadmin'] }
          },
          {
            path: 'courses',
            name: 'AdminCourses',
            component: () => import('../views/dashboard/admin/AdminCourses.vue'),
            meta: { roles: ['admin', 'superadmin'] }
          },
          {
            path: 'batches',
            name: 'AdminBatches',
            component: () => import('../views/dashboard/admin/AdminBatches.vue'),
            meta: { roles: ['admin'] }
          },
          {
            path: 'registration',
            name: 'AdminRegistration',
            component: AdminRegistration,
            meta: { roles: ['admin', 'superadmin'] }
          },
          {
            path: 'reports',
            name: 'AdminReports',
            component: () => import('../views/dashboard/admin/AdminReports.vue'),
            meta: { roles: ['admin', 'superadmin'] }
          },
          {
            path: 'groups',
            name: 'AdminGroups',
            component: () => import('../views/dashboard/admin/AdminGroups.vue'),
            meta: { roles: ['admin'] }
          },
          {
            path: 'notifications',
            name: 'AdminNotifications',
            component: () => import('../views/dashboard/admin/AdminNotifications.vue'),
            meta: { roles: ['admin', 'superadmin'] }
          }
        ]
      },
      // لوحة تحكم المشرف
       {
        path: 'supervisor',
        redirect: '/Dashboard/supervisor/groups.vue',

        meta: { roles: ['admin', 'superadmin'] }, // أدوار مسموحة
        children: [
          { path: '', redirect: 'groups' },
          {
            path: 'groups',
            name: 'groups',
            component: groups,
            meta: { roles: ['admin', 'superadmin'] }
          },
      
        ]
      },

      // مثال للـ Student Dashboard
      {
        path: 'student',
        name: 'StudentDashboard',
        component: () => import('../views/dashboard/student/StudentDashboardView.vue'),
        meta: { roles: ['student'] }
      }
    ]
  },

  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route Guard للتحقق من الأدوار
// router.beforeEach((to, from, next) => {
//   const userRole = localStorage.getItem('userRole') || 'guest' // مثال تخزين الدور
//   if (to.meta.roles && !to.meta.roles.includes(userRole)) {
//     console.log("ydv ghjhh")
//     return next('/Dashboard') // إعادة التوجيه إذا الدور غير مسموح
//   }
//   next()
// })

export default router