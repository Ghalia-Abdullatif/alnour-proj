import { createRouter, createWebHistory } from 'vue-router'
//صفحات تسجيل الدخول 
import AuthLayout from'../views/auth/AuthLayout.vue'
import LoginPage from "../views/auth/LoginPage.vue";
import TowFactor from'@/views/auth/TowFactor.vue'
import ChoseRole from'@/views/auth/ChoseRole.vue'

// المكونات الرئيسية
import Dashboard from '../views/dashboard/DashBoard.vue'
import AdminLayout from '../views/dashboard/admin/AdminHome.vue'
import AdminRegistration from '../views/dashboard/admin/AdminRegistration.vue'

// صفحات الداشبورد
import UsersLog from'@/views/dashboard/ViewUsers.vue'
import selectProgram from '@/views/registration/ProgramSelection.vue'
import RegisterPage from '@/views/registration/RegisterPage.vue'
import courses from '@/views/ViewCourses.vue'

import groups from '../views/dashboard/supervisor/ViewGroups.vue'
import NotFound from '../views/NotFound.vue'
import successPage from '@/views/registration/RegistrationSuccess.vue'

const routes = [
  //2 تسجيل الدخول واعادة كلمة المرور واختيار دور الجلسة والتحقق المزدوج للادمن
  {
    // المسار الرئيسي لعمليات المصادقة
    path: '/auth',
    component: AuthLayout,
    // 'redirect' تضمن توجه المستخدم لصفحة الدخول تلقائياً عند زيارة /auth
    redirect: '/auth/login',
    
    // المسارات الأبناء (الأطفال) التي ستظهر داخل <router-view> الخاص بـ AuthLayout
    children: [
      {
        // مسار تسجيل الدخول الأساسي
        path: 'login',
        name: 'Login',
        component: LoginPage,
        meta: { title: 'تسجيل الدخول - مقرأة النور' }
      },
       {
        // مسار تسجيل التحقق بخطوتين
        path: 'TowFactor',
        name: 'TowFactor',
        component: TowFactor,
       props: (route) => ({
    codeLength: Number(route.query.codeLength) || 6,
    nextPageUrl: route.query.nextPageName
  }),//لاستقبال البينات بالراوتر
        meta: { title: 'تسجيل الدخول - مقرأة النور' }
      },
       {
        // مسار تسجيل الدخول الأساسي
        path: 'ChoseRole',
        name: 'ChoseRole',
        component: ChoseRole,
        meta: { title: 'اختيار الدور - مقرأة النور' }
      },
  
  
    ]
  },
  
  {
    path: '/',
    redirect: '/auth/login'

  },
  {
    path: '/Dashboard',
    name: 'Dashboard',
    component: Dashboard,
    children: [
       {
            path: 'UsersLog',
            name: 'UsersLog',
            component: () =>UsersLog,
            meta: { roles: ['admin', 'superadmin'] }
          },
      // لوحة التحكم للادمن
      {
        path: 'admin',
        redirect: '/Dashboard/admin/courses',

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
            component: courses,
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
            component: () => import('../views/dashboard/AdminNotifications.vue'),
            meta: { roles: ['admin'] }
          },
          {
            path: 'notifications',
            name: 'AdminNotifications',
            component: () => import('../views/dashboard/AdminNotifications.vue'),
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
      },
    {
  path: 'supervisor',
  // component: () => import('../views/dashboard/supervisor/SupervisorLayout.vue'),
  meta: { roles: ['admin', 'supervisor'] },
  children: [
    // 1. عرض المساقات
    {
      path: 'courses',
      name: 'SupervisorCourses',
      component: () => import('../views/dashboard/supervisor/ViewCourses.vue')
    },
    // 2. عرض دفعات مساق معين (تستخدم كجدول دفعات مع فلترة)
    {
      path: 'courses/:courseId/batches',
      name: 'SupervisorBatches',
      component: () => import('../views/dashboard/supervisor/ViewBatches.vue')
    },
    // 3. تفاصيل الدفعة (تعرض كروت الدفعة + جدول المجموعات التابعة لها)
    {
      path: 'batches/:batchId', 
      name: 'BatchDetails',
      component: () => import('../views/dashboard/supervisor/BatchesDetails.vue')
    },
    // 4. تفاصيل المجموعة (تعرض كروت المجموعة + جدول الطلاب)
    {
      path: 'batches/:batchId/groups/:groupId',
      name: 'GroupDetails',
      component: () => import('../views/dashboard/supervisor/ViewGroups.vue')
    }
  ]
}
    ]
  },

  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },
   {
      path: '/SelectProgram',
      name: 'ProgramSelection',
      component:selectProgram
    },
    
     {
      path: '/SuccesRegester',
      name: 'SuccesRegester',
      component:successPage
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