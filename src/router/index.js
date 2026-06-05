// import { createRouter, createWebHistory } from 'vue-router'
// //صفحات تسجيل الدخول 
// import AuthLayout from'../views/auth/AuthLayout.vue'
// import LoginPage from "../views/auth/LoginPage.vue";
// import TowFactor from'@/views/auth/TowFactor.vue'
// import ChoseRole from'@/views/auth/ChoseRole.vue'

// // المكونات الرئيسية
// import Dashboard from '../views/dashboard/DashBoard.vue'
// import AdminLayout from '../views/dashboard/admin/AdminHome.vue'
// import AdminRegistration from '../views/dashboard/admin/AdminRegistration.vue'

// // صفحات الداشبورد
// import UsersLog from'@/views/dashboard/ViewUsers.vue'
// import selectProgram from '@/views/registration/ProgramSelection.vue'
// import RegisterPage from '@/views/registration/RegisterPage.vue'
// import courses from '@/views/ViewCourses.vue'

// import groups from '@/views/dashboard/ViewGroups.vue'
// import NotFound from '../views/NotFound.vue'
// import successPage from '@/views/registration/RegistrationSuccess.vue'

// const routes = [
//   //2 تسجيل الدخول واعادة كلمة المرور واختيار دور الجلسة والتحقق المزدوج للادمن
//   {
//     // المسار الرئيسي لعمليات المصادقة
//     path: '/auth',
//     component: AuthLayout,
//     // 'redirect' تضمن توجه المستخدم لصفحة الدخول تلقائياً عند زيارة /auth
//     redirect: '/auth/login',
    
//     // المسارات الأبناء (الأطفال) التي ستظهر داخل <router-view> الخاص بـ AuthLayout
//     children: [
//       {
//         // مسار تسجيل الدخول الأساسي
//         path: 'login',
//         name: 'Login',
//         component: LoginPage,
//         meta: { title: 'تسجيل الدخول - مقرأة النور' }
//       },
//        {
//         // مسار تسجيل التحقق بخطوتين
//         path: 'TowFactor',
//         name: 'TowFactor',
//         component: TowFactor,
//        props: (route) => ({
//     codeLength: Number(route.query.codeLength) || 6,
//     nextPageUrl: route.query.nextPageName
//   }),//لاستقبال البينات بالراوتر
//         meta: { title: 'تسجيل الدخول - مقرأة النور' }
//       },
//        {
//         // مسار تسجيل الدخول الأساسي
//         path: 'ChoseRole',
//         name: 'ChoseRole',
//         component: ChoseRole,
//         meta: { title: 'اختيار الدور - مقرأة النور' }
//       },
  
  
//     ]
//   },
  
//   {
//     path: '/',
//     redirect: '/auth/login'

//   },
//   {
//     path: '/Dashboard',
//     name: 'Dashboard',
//     component: Dashboard,
//     children: [
//        {
//             path: 'UsersLog',
//             name: 'UsersLog',
//             component: () =>UsersLog,
//             meta: { roles: ['admin', 'superadmin'] }
//           },
//       // لوحة التحكم للادمن
//       {
//         path: 'admin',
//         redirect: '/Dashboard/admin/courses',

//         meta: { roles: ['admin', 'superadmin'] }, // أدوار مسموحة
//         children: [
//           { path: '', redirect: 'users' },
//           {
//             path: 'users',
//             name: 'AdminUsers',
//             component: () => import('../views/dashboard/admin/AdminUsers.vue'),
//             meta: { roles: ['admin', 'superadmin'] }
//           },
//           {
//             path: 'courses',
//             name: 'AdminCourses',
//             component: courses,
//             meta: { roles: ['admin', 'superadmin'] }
//           },
//           {
//             path: 'batches',
//             name: 'AdminBatches',
//             component: () => import('../views/dashboard/admin/AdminBatches.vue'),
//             meta: { roles: ['admin'] }
//           },
//           {
//             path: 'registration',
//             name: 'AdminRegistration',
//             component: AdminRegistration,
//             meta: { roles: ['admin', 'superadmin'] }
//           },
//           {
//             path: 'reports',
//             name: 'AdminReports',
//             component: () => import('../views/dashboard/admin/AdminReports.vue'),
//             meta: { roles: ['admin', 'superadmin'] }
//           },
//           {
//             path: 'groups',
//             name: 'AdminGroups',
//             component: () => groups,
//             meta: { roles: ['admin'] }
//           },
//           {
//             path: 'notifications',
//             name: 'AdminNotifications',
//             component: () => import('../views/dashboard/AdminNotifications.vue'),
//             meta: { roles: ['admin', 'superadmin'] }
//           }
//         ]
//       },
//       // لوحة تحكم المشرف
//       //  {
//       //   path: 'supervisor',
//       //   redirect: '/Dashboard/supervisor/groups.vue',

//       //   meta: { roles: ['admin', 'superadmin'] }, // أدوار مسموحة
//       //   children: [
//       //     { path: '', redirect: 'groups' },
//       //     {
//       //       path: 'groups',
//       //       name: 'groups',
//       //       component: groups,
//       //       meta: { roles: ['admin', 'superadmin'] }
//       //     },
      
//       //   ]
//       // }
      
//       // داخل مصفوفة أطفال الـ Dashboard لقسم الـ supervisor:
// {
//   path: 'supervisor',
//   meta: { roles: ['admin', 'supervisor', 'superadmin'] },
//   children: [
//     // 1. عرض المساقات
//     {
//       path: 'courses',
//       name: 'SupervisorCourses',
//       component: () => import('../views/dashboard/supervisor/ViewCourses.vue')
//     },
//     // 2. تعديل هنا: جعل الـ courseId اختيارياً بوضع علامة (?)
//     {
//       path: 'courses/:courseId?/batches',
//       name: 'SupervisorBatches',
//       component: () => import('../views/dashboard/supervisor/ViewBatches.vue'),
//       props: true // تمرير البارامتر كـ prop للصفحة
//     },
//     // 3. تفاصيل الدفعة
//     {
//       path: 'batches/:batchId', 
//       name: 'BatchDetails',
//       component: () => import('../views/dashboard/supervisor/BatchesDetails.vue')
//     },
//     // 4. تفاصيل المجموعة
//     {
//       path: 'batches/:batchId/groups/:groupId',
//       name: 'GroupDetails',
//       component: groups
//     }
//   ]
// },

//       // مثال للـ Student Dashboard
//       {
//         path: 'student',
//         name: 'StudentDashboard',
//         component: () => import('../views/dashboard/student/StudentDashboardView.vue'),
//         meta: { roles: ['student'] }
//       },
//     {
//   path: 'supervisor',
//   // component: () => import('../views/dashboard/supervisor/SupervisorLayout.vue'),
//   meta: { roles: ['admin', 'supervisor'] },
//   children: [
//     // 1. عرض المساقات
//     {
//       path: 'courses',
//       name: 'SupervisorCourses',
//       component: () => import('../views/dashboard/supervisor/ViewCourses.vue')
//     },
//     // 2. عرض دفعات مساق معين (تستخدم كجدول دفعات مع فلترة)
//     {
//       path: 'courses/:courseId?/batches',
//       name: 'SupervisorBatches',
//       component: () => import('../views/dashboard/supervisor/ViewBatches.vue')
//     },
//     // 3. تفاصيل الدفعة (تعرض كروت الدفعة + جدول المجموعات التابعة لها)
//     {
//       path: 'batches/:batchId', 
//       name: 'BatchDetails',
//       component: () => import('../views/dashboard/supervisor/BatchesDetails.vue')
//     },
//     // 4. تفاصيل المجموعة (تعرض كروت المجموعة + جدول الطلاب)
//     {
//       path: 'batches/:batchId/groups/:groupId',
//       name: 'GroupDetails',
//       component: () => import('../views/dashboard/supervisor/ViewGroups.vue')
//     }
//   ]
// }
//     ]
//   },

//   {
//     path: '/register',
//     name: 'Register',
//     component: RegisterPage
//   },
//    {
//       path: '/SelectProgram',
//       name: 'ProgramSelection',
//       component:selectProgram
//     },
    
//      {
//       path: '/SuccesRegester',
//       name: 'SuccesRegester',
//       component:successPage
//     },
//   {
//     path: '/:pathMatch(.*)*',
//     name: 'NotFound',
//     component: NotFound
//   }
// ]

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// })

// // Route Guard للتحقق من الأدوار
// // router.beforeEach((to, from, next) => {
// //   const userRole = localStorage.getItem('userRole') || 'guest' // مثال تخزين الدور
// //   if (to.meta.roles && !to.meta.roles.includes(userRole)) {
// //     console.log("ydv ghjhh")
// //     return next('/Dashboard') // إعادة التوجيه إذا الدور غير مسموح
// //   }
// //   next()
// // })

// export default router
////////////////////////////////////////////////////////////////////////////////////////////////////////



import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stors/acount-store.js" // تأكدي من صحة مسار ملف الستور لديكِ

// صفحات تسجيل الدخول والمصادقة
import AuthLayout from '../views/auth/AuthLayout.vue'
import LoginPage from "../views/auth/LoginPage.vue"
import TowFactor from '@/views/auth/TowFactor.vue'
import ChoseRole from '@/views/auth/ChoseRole.vue'

// المكونات الرئيسية بلوحة التحكم
import Dashboard from '../views/dashboard/DashBoard.vue'
import AdminRegistration from '../views/dashboard/admin/AdminRegistration.vue'

// صفحات الإدارة العامة والتسجيل المباشر
import UsersLog from'@/views/dashboard/viewUsers.vue'


import selectProgram from '@/views/registration/ProgramSelection.vue'
import RegisterPage from '@/views/registration/RegisterPage.vue'
import courses from '@/views/ViewCourses.vue' 
import groups from '@/views/dashboard/supervisor/GroupsList.vue' 
import successPage from '@/views/registration/RegistrationSuccess.vue'
import NotFound from '../views/NotFound.vue'
//reports
import AdminReportTemplates from '@/views/dashboard/admin/AdminReportTemplates.vue'
// import FillGroupReport from '@/views/dashboard/supervisor/FillGroupReport.vue'
// import ViewReportDetails from '@/views/dashboard/ViewReportDetails.vue'

const routes = [
  // 1. مسارات عمليات المصادقة وتسجيل الدخول
  {
    path: '/auth',
    component: AuthLayout,
    redirect: '/auth/login',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: LoginPage,
        meta: { title: 'تسجيل الدخول - مقرأة النور' }
      },
      {
        path: 'TowFactor',
        name: 'TowFactor',
        component: TowFactor,
        props: (route) => ({
          codeLength: Number(route.query.codeLength) || 6,
          nextPageUrl: route.query.nextPageName
        }),
        meta: { title: 'التحقق الثنائي - مقرأة النور' }
      },
      {
        path: 'ChoseRole',
        name: 'ChoseRole',
        component: ChoseRole,
        meta: { title: 'اختيار الدور - مقرأة النور' }
      }
    ]
  },
  
  {
    path: '/',
    redirect: '/auth/login'
  },

  // 2. المسار الرئيسي للوحة التحكم (Dashboard)
  {
    path: '/Dashboard',
    name: 'Dashboard',
    component: Dashboard,
    children: [
      
      // إدارة مستخدمي وأعضاء النظام
      {
        path: 'UsersLog',
        name: 'UsersLog',
        component: () => UsersLog,
        meta: { roles: ['super_admin','batch_supervisor', 'admin'] } 
      },
      // {
//   path: '/groups',
//   name: 'GroupsList',
//   component: () => import('@/views/GroupsListManager.vue') // شاشة عرض المجموعات الإجمالية
// },
// {
//   path: '/groups/:groupId',
//   name: 'GroupDetails',
//   component: () => import('@/views/GroupDetailsManager.vue') // الشاشة الداخلية التي بالأسفل
// },

      // [الصفحة 1]: بناء القوالب والأسئلة (خاص بالأدمن فقط)
    {
      path: 'admin/reports/templates',
      name: 'AdminReportTemplates',
      component: AdminReportTemplates,
      meta: { roles: ['super_admin', 'admin'] } // حماية المسار
    },

    // // [الصفحة 2]: شاشة تعبئة التقارير (خاص بمشرف المجموعة والدفعة)
    // {
    //   path: 'supervisor/reports/fill/:id', // يمرر معرف نسخة التقرير المطلوب تعبئته ديناميكياً
    //   name: 'FillGroupReport',
    //   component: FillGroupReport,
    //   meta: { roles: ['group_supervisor', 'batch_supervisor'] }
    // },

    // // [الصفحة 3]: استعراض التقرير الفعلي المكتمل (متاح للمشرفين والأدمن للاطلاع)
    // {
    //   path: 'reports/view/:id', // يمرر معرف التقرير لاستعراض الأجوبة والشارات
    //   name: 'ViewReportDetails',
    //   component: ViewReportDetails,
    //   meta: { roles: ['super_admin', 'admin', 'group_supervisor', 'batch_supervisor'] }
    // },

      // ==========================================
      // أولاً: قسم الإدارة والتحكم لمدراء النظام
      // ==========================================
      {
        path: 'admin',
        redirect: '/Dashboard/admin/courses',
        meta: { roles: ['super_admin', 'admin'] }, 
        children: [
          {
            path: 'courses',
            name: 'AdminCourses',
            component: courses,
            meta: { roles: ['super_admin', 'admin'] }
          },
          {
            path: 'groups',
            name: 'AdminGroups',
            component: () => groups,
            meta: { roles: ['super_admin', 'admin'] }
          },
          {
            path: 'reports',
            name: 'AdminReports',
            component: () => import('../views/dashboard/admin/AdminReportTemplates.vue'),
            meta: { roles: ['super_admin', 'group_supervisor'
,'admin'] }
          },
          {
            path: 'registration',
            name: 'AdminRegistration',
            component: AdminRegistration,
            meta: { roles: ['super_admin', 'admin'] }
          },
          {
            path: 'notifications',
            name: 'AdminNotifications',
            component: () => import('../views/dashboard/AdminNotifications.vue'),
            meta: { roles: ['super_admin','batch_supervisor' ,'teacher','group_supervisor','admin'] }
          }
        ]
      },

      // ==========================================
      // ثانياً: قسم الإشراف الشامل (الخطة الحقيقية)
      // ==========================================
      {
        path: 'supervisor',
        meta: { roles: ['super_admin', 'batch_supervisor', 'group_supervisor', 'admin'] },
        children: [
          {
            path: 'courses/:courseId?/batches',
            name: 'SupervisorBatches',
            component: () => import('../views/dashboard/supervisor/ViewBatches.vue'),
            props: true
          },
          {
            path: 'batches/:batchId', 
            name: 'BatchDetails',
            component: () => import('../views/dashboard/supervisor/BatchesDetails.vue')
          },
          // [الصفحة 1]: استعراض خطة كروت المجموعات
          {
            path: 'groupsList',
            name: 'GroupsList',
            component: () => import('../views/dashboard/supervisor/GroupsList.vue'),
            meta: { roles: ['super_admin', 'batch_supervisor', 'group_supervisor'] }
          },
          // [الصفحة 2]: إدارة الطالبات داخل المجموعة المحددة
          {
            path: 'groups/:groupId/students',
            name: 'GroupStudents',
            component: () => import('../views/dashboard/supervisor/GroupStudents.vue'),
            props: true,
            meta: { roles: ['super_admin', 'batch_supervisor', 'group_supervisor'] }
          }
        ]
      },

      // ==========================================
      // ثالثاً: لوحة تحكم الطالبات
      // ==========================================
      {
        path: 'student',
        name: 'StudentDashboard',
        component: () => import('../views/dashboard/student/StudentDashboardView.vue'),
        meta: { roles: ['student'] }
      }
    ]
  },

  // 3. مسارات التسجيل والصفحات العامة
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },
  {
    path: '/SelectProgram',
    name: 'ProgramSelection',
    component: selectProgram
  },
  {
    path: '/SuccesRegester',
    name: 'SuccesRegester',
    component: successPage
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

// ========================================================
// 🛡️ Route Guard المحدث ليعمل بنظام أدوار الجلسة الحقيقي 
// ========================================================
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore();

//   // 1. التحقق هل المستخدم مسجل دخول أم لا للمسارات المحمية
//   const isAuthRoute = to.path.startsWith('/auth');
//   const isPublicRoute = ['Register', 'ProgramSelection', 'SuccesRegester', 'NotFound'].includes(to.name);

//   if (!authStore.isLoggedIn && !isAuthRoute && !isPublicRoute) {
//     console.warn("🔒 مستخدم غير مسجل، يتم توجيهه لصفحة الدخول");
//     return next({ name: 'Login' });
//   }

//   // 2. فحص الدور الحالي المفعل للجلسة (sessionRole) ومطابقته مع الـ meta.roles
//   if (to.meta.roles) {
//     const currentActiveRole = authStore.sessionRole; // الجلب المباشر من الـ State الحقيقي

//     if (!to.meta.roles.includes(currentActiveRole)) {
//       console.error(`⚠️ صلاحية غير كافية! دورك الحالي (${currentActiveRole}) لا يملك حق الوصول إلى: ${to.path}`);
      
//       // التوجيه التلقائي إلى واجهة اختيار الأدوار لو عنده أدوار متعددة ولم يحدد، أو إبقاؤه في الداشبورد
//       if (authStore.roles.length > 1 && !currentActiveRole) {
//         return next({ name: 'ChoseRole' });
//       }
//       return next('/Dashboard');
//     }
//   }

//   next();
// });

export default router