// const baseurl="api/"

// export const  endpoint={

//   getcrtf:{
//     url: ` ${baseurl}../csrf/`,
//       method: "GET"
//   },
//   users: {
//     getUsers: {
//       url: `${baseurl}people/Person/`,
//       method: "GET"
//     },},
//     programs: {
//     regester: {
//       url: `../components/json/programs.json`,
//       method: "GET"
//     },},
//      Auth: {
//     Login: {
//       url: `${baseurl}accounts/auth/login/`,
//       method: "POST"
//     },
//     Verify2FA: {
//       url: `${baseurl}accounts/auth/login/verify-2fa/`,
//       method: "POST"
//     // accounts/me/

//   },
//    refershToken: {
//       url: `${baseurl}accounts/auth/login/token/refresh/`,
//       method: "POST"
//     // accounts/me/

//   },
//    setPreferedRole: {
//       url: `${baseurl}/accounts/preferred-roles/`,
//       method: "POST"
//     // accounts/me/

//   },
//   logout:{
//      url: `${baseurl}accounts/auth/logout/`,
//       method: "POST"
//   },
//    getCurrentUser:{
//      url: `${baseurl}accounts/me/`,
//       method: "GET"
//   }
// },

//  pepole: {
//   getAllusers:{
//      url: `${baseurl}people/persons/`,
//       method: "GET"

//   },
//    getAllusersHasAcounts:{
//      url: `${baseurl}users/all/`,
//       method: "GET"

//   },
//    getAllAcountsRoles:{
//      url: `${baseurl}accounts/account-roles/`,
//       method: "GET"

//   },
//    getAllRoles:{
//      url: `${baseurl}accounts/roles/`,
//       method: "GET"

//   },
//     getpersonInfo: {
//       url: `${baseurl}people/persons/`,
//       method: "GET"
//     },
//    createAccount: {
//       url: `${baseurl}accounts/register/`,
//       method: "POST"

//   },
//   },
//     ///accounts/register/

// }
const baseurl = "api/";

export const endpoint = {
  // --- روابط الحماية العامة ---
  getcrtf: {
    url: `${baseurl}../csrf/`, // الحصول على توكن الحماية CSRF لمنع الهجمات
    method: "GET",
  },

  // --- روابط إدارة الأشخاص (البيانات الشخصية) ---
  users: {
    getUsers: {
      url: `${baseurl}people/Person/`, // جلب قائمة الأشخاص الأساسية
      method: "GET",
    },
  },

  // --- روابط البرامج والملفات الخارجية ---
  programs: {
    regester: {
      url: `../components/json/programs.json`, // جلب بيانات البرامج من ملف JSON محلي
      method: "GET",
    },
  },

  // --- روابط المصادقة والتحقق (Authentication) ---
  Auth: {
    Login: {
      url: `${baseurl}accounts/auth/login/`, // تسجيل الدخول الأساسي
      method: "POST",
    },
    Verify2FA: {
      url: `${baseurl}accounts/auth/login/verify-2fa/`, // التحقق من رمز الأمان (العامل الثنائي)
      method: "POST",
    },
    refershToken: {
      url: `${baseurl}accounts/auth/login/token/refresh/`, // تجديد توكن الدخول عند انتهائه
      method: "POST",
    },
    setPreferedRole: {
      url: `${baseurl}/accounts/preferred-roles/`, // تحديد الدور المفضل للمستخدم (مدير، معلم، إلخ)
      method: "POST",
    },
    logout: {
      url: `${baseurl}accounts/auth/logout/`, // تسجيل الخروج من النظام
      method: "POST",
    },
    getCurrentUser: {
      url: `${baseurl}accounts/me/`, // جلب بيانات المستخدم المسجل دخوله حالياً
      method: "GET",
    },
  },

  // --- روابط إدارة الحسابات والأدوار (People & Accounts) ---
  pepole: {
    getAllusers: {
      url: `${baseurl}people/persons/`, // جلب جميع الأشخاص المسجلين في النظام
      method: "GET",
    },
    getAllusersHasAcounts: {
      url: `${baseurl}users/all/`, // جلب قائمة الأشخاص الذين يمتلكون حسابات دخول فقط
      method: "GET",
    },
    getAllAcountsRoles: {
      url: `${baseurl}accounts/account-roles/`, // جلب سجلات ربط الحسابات بالأدوار (أي حساب يملك أي دور)
      method: "GET",
    },
    getAllRoles: {
      url: `${baseurl}accounts/roles/`, // جلب جميع الأدوار المتاحة في النظام (Admin, Teacher, etc)
      method: "GET",
    },
    getpersonInfo: {
      url: `${baseurl}people/persons/`, // جلب بيانات تفصيلية لشخص محدد (يتم إضافة ID يدوياً)
      method: "GET",
    },
    creatPerson: {
      url: `${baseurl}people/persons/`, // إنشاء شخص جديد في النظام (بياناته الشخصية فقط، بدون حساب دخول)
      method: "POST",
    },
     updatePerson: {
      url: `${baseurl}people/persons/`, // تعديل بيانات شخص  في النظام (بياناته الشخصية فقط، بدون حساب دخول)
      method:  "PUT",
    },//DELETE
    deletePerson: {
      url: `${baseurl}people/persons/`, // تعديل بيانات شخص  في النظام (بياناته الشخصية فقط، بدون حساب دخول)
      method:  "DELETE",
    },

    createAccount: {
      url: `${baseurl}accounts/register/`, // إنشاء حساب مستخدم جديد وربطه بشخص موجود
      method: "POST",
    },
    activateAccount: {
      url: `${baseurl}accounts/activate/`, // تفعيل الحساب بعد التسجيل
      method: "POST",
    },
    deleteAccountRole: {
      url: `${baseurl}accounts/account-roles/`, //    ازالة دور من حساب  مستخدم
      method: "DELETE",
    },
    addAccountRole: {
      url: `${baseurl}accounts/account-roles/`, //    ازالة دور من حساب  مستخدم
      method: "POST",
    },
    ///accounts/account-roles/:id/  accounts/account-roles/                          "method": "DELETE",

    ///accounts/activate/
  }, //end pepole
  notifications:{
     getAllNotifications: {
      url: `${baseurl}notifications/`, //    ازالة دور من حساب  مستخدم
      method: "GET",
    },
     creatNotifications: {
      url: `${baseurl}notifications/`, //    ازالة دور من حساب  مستخدم
      method: "POST",
    },// "method": "PUT",
     updateNotification: {
      url: `${baseurl}notifications/`, //    ازالة دور من حساب  مستخدم
      method: "PUT",
    },
     deleteNotification: {
      url: `${baseurl}notifications/`, //    ازالة دور من حساب  مستخدم
      method: "DELETE",
    }
  },
  //////////
  
  // ... بقية الأقسام الأخرى (notifications, people...)
  
  programs: {
    getAllPrograms: {
      url: `${baseurl}programs/programs/`,
      method: "GET",
    },
    createProgram: {
      url: `${baseurl}rograms/programs/`,
      method: "POST",
    },
    updateProgram: {
      url: `${baseurl}programs/programs/`, // سيتم إلحاق الـ ID برمجياً في الـ Store
      method: "PUT",
    },
    deleteProgram: {
      url: `${baseurl}programs/programs/`, // سيتم إلحاق الـ ID برمجياً في الـ Store
      method: "DELETE",
    }
  },
  batches: {
    // روابط الدفعات الأساسية
    getAllBatches: {
      url: `${baseurl}batches/`,
      method: "GET",
    },
    createBatch: {
      url: `${baseurl}batches/`,
      method: "POST",
    },
    updateBatch: {
      url: `${baseurl}batches/`, // سيتم إلحاق الـ ID برمجياً في الـ Store
      method: "PUT",
    },
    deleteBatch: {
      url: `${baseurl}batches/`, // سيتم إلحاق الـ ID برمجياً في الـ Store
      method: "DELETE",
    },
    getStatus:{
      url:`${baseurl}batches/batch-statuses/`,
      method:"GET"
    },
    addStatus:{
      url:`${baseurl}batches/batch-statuses/`,
      method:"PUT"
    },
    deleteStatus:{
      url:`${baseurl}batches/batch-statuses/{id}`,
      method:"DELETE"
    },
     updateStatus:{
      url:`${baseurl}batches/batch-statuses/{id}`,
      method:"PUT"
    },

  },
  // --- روابط إدارة المجموعات والطلاب التابعين لها (Groups & Group Students) ---
  groups: {
    // جلب كافة المجموعات أو إنشائها
    getAllGroups: {
      url: `${baseurl}groups/`,
      method: "GET",
    },
    createGroup: {
      url: `${baseurl}groups/`,
      method: "POST",
    },
    // العمليات المعتمدة على معرّف المجموعة المحددة (id)
    getGroupById: {
      url: `${baseurl}groups/`, // سيتم إلحاق الـ id/ برمجياً في الـ Store
      method: "GET",
    },
    updateGroup: {
      url: `${baseurl}groups/`, // سيتم إلحاق الـ id/ برمجياً في الـ Store
      method: "PUT",
    },
    patchGroup: {
      url: `${baseurl}groups/`, // سيتم إلحاق الـ id/ برمجياً في الـ Store
      method: "PATCH",
    },
    deleteGroup: {
      url: `${baseurl}groups/`, // سيتم إلحاق الـ id/ برمجياً في الـ Store
      method: "DELETE",
    },

    // --- تسكين وإدارة الطالبات داخل المجموعات (Group-Student Assignments) ---
    getGroupStudents: {
      url: `${baseurl}groups/group-students/`, // جلب سجلات توزيع الطالبات على المجموعات
      method: "GET",
    },
    addStudentToGroup: {
      url: `${baseurl}groups/group-students/`, // ربط طالبة بمجموعة محددة
      method: "POST",
    },
    // العمليات التفصيلية على طالبة معينة داخل مجموعة بواسطة معرف السجل (id)
    getGroupStudentDetail: {
      url: `${baseurl}groups/group-students/`, // سيتم إلحاق الـ id/ برمجياً
      method: "GET",
    },
    updateGroupStudent: {
      url: `${baseurl}groups/group-students/`, // سيتم إلحاق الـ id/ برمجياً
      method: "PUT",
    },
    removeStudentFromGroup: {
      url: `${baseurl}groups/group-students/`, // سيتم إلحاق الـ id/ برمجياً لحذف السجل
      method: "DELETE",
    }
  },
  // --- روابط نظام التقارير الديناميكي وسير العمل (Dynamic Reports Workflow) ---
  reports: {
    // ========================================================
    // [الصفحة 1]: خاصة بالأدمن (إنشاء وإدارة القوالب والأسئلة وتوجيهها)
    // ========================================================
    
    // إدارة قوالب التقارير الهيكلية (إنشاء / جلب)
    getAllTemplates: {
      url: `${baseurl}reports/report-templates/`,
      method: "GET",
    },
    createTemplate: {
      url: `${baseurl}reports/report-templates/`,
      method: "POST",
    },

    // بناء وهيكلة الأسئلة التابعة للقوالب
    createTemplateQuestion: {
      url: `${baseurl}reports/template-questions/`,
      method: "POST",
    },

    // إضافة الخيارات المتاحة للأسئلة الاختيارية (مثل: ممتاز، جيد، ضعيف)
    createQuestionChoice: {
      url: `${baseurl}reports/question-choices/`,
      method: "POST",
    },

    // توجيه وإنشاء نسخة تقرير فعلية مربوطة بمجموعة وتاريخ محدد
    createGroupReportInstance: {
      url: `${baseurl}reports/reports/`,
      method: "POST",
    },

    // تعيين وإرسال التقرير لمستلمين محددين (مشرفي المجموعات أو الدفعات)
    sendReportToRecipients: {
      url: `${baseurl}reports/send_report/`,
      method: "POST",
    },

    // ========================================================
    // [الصفحة 2]: خاصة بالمشرف (استعراض التقارير الموجهة إليه وتعبئتها)
    // ========================================================
    
    // جلب التقارير الموجهة للمستخدم الحالي ليتولى تعبئتها بناءً على دوره
    getAssignedReports: {
      url: `${baseurl}reports/reports/`, // يمكن للـ Store تصفيتها أو تمرير كويري بارامترز
      method: "GET",
    },

    // إرسال وحفظ إجابات المشرف على أسئلة التقرير بشكل نهائي بالسيرفر
    submitReportAnswers: {
      url: `${baseurl}reports/submit_answers/`,
      method: "POST",
    },

    // ========================================================
    // [الصفحة 3]: شاشة العرض العام واستعراض البيانات الفعلية والأحداث
    // ========================================================
    
    // جلب تفاصيل تقرير معين مع الأسئلة والإجابات الملحقة به برمجياً عبر الـ ID
    getReportDetails: {
      url: `${baseurl}reports/reports/`, // سيتم إلحاق الـ ${reportId}/ ديناميكياً بالـ Store
      method: "GET",
    },

    // جلب سجل الأحداث والتنبيهات التاريخية الخاصة بالتقارير (Logs / Events)
    getReportEvents: {
      url: `${baseurl}reports/report-events/`,
      method: "GET",
    }
  },
  
  };


