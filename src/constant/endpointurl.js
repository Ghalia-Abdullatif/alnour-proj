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
};
