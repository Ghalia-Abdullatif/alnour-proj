// // مصفوفة البيانات: تحتوي على المعلومات الأساسية لكل دور متاح
// export const roles = [
//   { 
//     id: 'super_admin', 
//     name: 'مدير النظام', 
//     description: 'إدارة كاملة للمشاركين والجدول الزمني والتحكم بالإعدادات', 
//     icon: 'fas fa-user-shield' // أيقونة المستخدم مع درع لترمز للحماية والتحكم الكامل
//   },
//   { 
//     id: 'group_supervisor', 
//     name: 'مشرفة المجموعة', 
//     description: 'صلاحية عرض المحتوى ومشاركة الشاشة وإدارة المجموعات الصغيرة', 
//     icon: 'fas fa-users-cog' // أيقونة مجموعة مستخدمين مع ترس ترمز للإشراف التقني
//   },
//   { 
//     id: 'batch_supervisor', 
//     name: 'مشرفة الدفعة', 
//     description: 'المتابعة العامة للدفعة والتفاعل عبر القنوات النصية', 
//     icon: 'fas fa-clipboard-list' // أيقونة لوحة المهام ترمز للمتابعة الإدارية الشاملة
//   },
//   { 
//     id: 'teacher', 
//     name: 'معلمة', 
//     description: 'تقديم الدروس والتفاعل المباشر مع الطالبات في القنوات النصية', 
//     icon: 'fas fa-chalkboard-teacher' // أيقونة المعلمة التقليدية أمام السبورة
//   },
//   { 
//     id: 'student', 
//     name: 'طالبة', 
//     description: 'الاستفادة من المحتوى العلمي والتفاعل مع المعلمات والزميلات', 
//     icon: 'fas fa-user-graduate' // أيقونة الخريجة أو الطالبة بزي التخرج
//   }
// ];
// // قائمة الروابط الكاملة
// export const premitinMenu = [
//   {
//     id:"home",
//     name: "الرئيسية",
//     path: "/Dashboard/admin/home",
//     icon: "fas fa-home",
   
//   },
//   {
//         id:"MangeUsers",

//     name: "المستخدمين",
//     path: "UsersLog",
//     // "/Dashboard/admin/users",
//     icon: "fas fa-users",
  
//   },
//   {
//             id:"MangeRegistration",

//     name: "التسجيل",
//     path: "/Dashboard/admin/registration",
//     icon: "fas fa-user-plus",

//   },
//   {
//                 id:"MangeCourses",

//     name: "المساقات",
//     path: "/Dashboard/admin/courses",
//         icon: "fas fa-book-open",


//   },
//   {
//                     id:"MangeReport",

//     name: "التقارير",
//     path: "/Dashboard/admin/reports",
//     icon: "fas fa-chart-line",
//   },
//   {
//                         id:"MangeBatches",

//     name: "الدفعات",
//     path: "/Dashboard/admin/batches",
//     icon: "fas fa-layer-group",
//   },
//   {
//                             id:"MangeGroups",

//     name: "المجموعات",
//     path: "/Dashboard/admin/groups",
//     icon: "fas fa-users-rectangle",
//   },
//   {
//                                 id:"MangeNotifications",

//     name: "الإشعارات",
//     path: "/Dashboard/admin/notifications",
//     icon: "fas fa-bell",
//   },
//   {
//                                     id:"MangeProfile",

//     name: " الشخصية",
//     path: "/Dashboard/admin/profile",
//     icon: "fas fa-user-circle",
//   },
// ];
// export const Adminpremion = [
//     {
//     id:"MangeProfile",

//     isPrimary:false,
//     },
//     {
//     id:"MangeGroups",
//     isPrimary:false,
//     },
//     {
//     id:"MangeReport",
//     isPrimary:true,
//     },
//      {
//     id:"MangeBatches",
//     isPrimary:true,
//     }, {
//     id:"MangeCourses",
//     isPrimary:true,
//     }, {
//     id:"MangeRegistration",
//     isPrimary:true,
//     }, {
//     id:"MangeUsers",
//     isPrimary:false,
//     },

// ]

// export const GroupSuperVisorpremion = [
//     {
//     id:"MangeProfile",
//     isPrimary:false,
//     },
//     {
//     id:"MangeGroups",
//     isPrimary:false,
//     },
//     {
//     id:"MangeReport",
//     isPrimary:true,
//     },
//      {
//     id:"MangeBatches",
//     isPrimary:true,
//     }, {
//     id:"MangeCourses",
//     isPrimary:true,
//     }, {
//     id:"MangeRegistration",
//     isPrimary:true,
//     },

// ]
// /**
//  * دالة تجلب الصلاحيات الكاملة بناءً على اسم الدور (Role ID)
//  * @param {string} roleId - اسم الدور (مثل: super_admin, batch_supervisor)
//  * @returns {Array} - مصفوفة بكل تفاصيل الروابط المسموحة لهذا الدور
//  */
// export const getMenuByRole = (roleId) => {
//   // 1. خريطة لربط الـ ID بالمصفوفات التي قمتِ بتعريفها
//   const rolePermissionsMap = {
//     'super_admin': Adminpremion,
//     'group_supervisor': GroupSuperVisorpremion,
//     // يمكنك إضافة البقية هنا بنفس النمط
//     'batch_supervisor': [], // مصفوفة صلاحيات مشرفة الدفعة
//     'teacher': [],
//     'student': []
//   };
  

//   const selectedPermissions = rolePermissionsMap[roleId] || [];

//   // 2. دمج البيانات من premitinMenu
//   return selectedPermissions.map(permission => {
//     const details = premitinMenu.find(item => item.id === permission.id);
    
//     // ندمج بيانات القائمة الأصلية مع حالة isPrimary المخصصة لهذا الدور
//     return details ? { ...details, isPrimary: permission.isPrimary } : null;
//   }).filter(item => item !== null); // تنظيف القائمة من أي قيم فارغة
// };
// /**
//  * دالة تجلب بيانات الأدوار كاملة بناءً على مصفوفة من المعرفات
//  * @param {Array} roleIds - مصفوفة معرفات (مثل: ['super_admin', 'group_supervisor'])
//  * @returns {Array} - مصفوفة كائنات الأدوار كاملة التفاصيل
//  */
// export const getRolesDetails = (roleIds) => {
//   // نقوم بفلترة مصفوفة roles الأصلية
//   // ونعيد فقط الأدوار الموجودة داخل مصفوفة roleIds الممررة
//   return roles.filter(role => roleIds.includes(role.id));
// };
// export const getRoleDetails = (roleId) => {
//   // نقوم بفلترة مصفوفة roles الأصلية
//   // ونعيد فقط الأدوار الموجودة داخل مصفوفة roleIds الممررة
//   return roles.find(role => role.id === roleId);
// };
//___________________________________________________________-


/**
 * ==========================================
 * نظام إدارة الصلاحيات والقوائم (نظام مقرأة النور)
 * ==========================================
 * يحتوي هذا الملف على إعدادات الأدوار (Roles)، القائمة الكاملة للروابط (Menu Items)،
 * ومصفوفات الصلاحيات الخاصة بكل دور، بالإضافة إلى دوال الفلترة والربط بالراوتر.
 */

/**
 * @constant {Array<Object>} roles
 * @description مصفوفة البيانات الأساسية المتاحة في النظام.
 * تُستخدم لعرض تفاصيل الأدوار في لوحات التحكم، وتتضمن معرفات فريدة، مسميات، وشروح، وأيقونات توضيحية.
 */
export const roles = [
  { 
    id: 'super_admin', 
    name: 'مدير النظام', 
    description: 'إدارة كاملة للمشاركين والجدول الزمني والتحكم بالإعدادات', 
    icon: 'fas fa-user-shield' // أيقونة درع الحماية للدلالة على الصلاحيات المطلقة
  },
  { 
    id: 'group_supervisor', 
    name: 'مشرفة المجموعة', 
    description: 'صلاحية عرض المحتوى ومشاركة الشاشة وإدارة المجموعات الصغيرة', 
    icon: 'fas fa-users-cog' // أيقونة تروس الإشراف الإداري والتقني للمجموعات
  },
  { 
    id: 'batch_supervisor', 
    name: 'مشرفة الدفعة', 
    description: 'المتابعة العامة للدفعة والتفاعل عبر القنوات النصية', 
    icon: 'fas fa-clipboard-list' // أيقونة لوحة المهام لترمز للمتابعة الشاملة للدفعات
  },
  { 
    id: 'teacher', 
    name: 'معلمة', 
    description: 'تقديم الدروس والتفاعل المباشر مع الطالبات في القنوات النصية', 
    icon: 'fas fa-chalkboard-teacher' // أيقونة المعلمة والسبورة التعليمية
  },
  { 
    id: 'student', 
    name: 'طالبة', 
    description: 'الاستفادة من المحتوى العلمي والتفاعل مع المعلمات والزميلات', 
    icon: 'fas fa-user-graduate' // أيقونة قبعة التخرج لترمز للطالبات والدراسة
  }
];

/**
 * @constant {Array<Object>} premitinMenu
 * @description القائمة الرئيسية الشاملة لجميع روابط النظام (Master Menu).
 * ملاحظة هامة: تم ربط حقل 'nameRouter' بأسماء المسارات (Named Routes) في ملف الراوتر (router/index.js)
 * لضمان عمل نظام الانتقال الديناميكي بنجاح عبر خاصية :to="{ name: item.nameRouter }"
 */
export const premitinMenu = [
  {
    id: "home",
    name: "الرئيسية",
    nameRouter: "Dashboard", // اسم الراوتر المقابل للمسار الرئيسي للداشبورد
    path: "/Dashboard",
    icon: "fas fa-home",
  },
  {
    id: "MangeUsers",
    name: "المستخدمين",
    nameRouter: "UsersLog", // مطابق لـ name: 'UsersLog' المعرف في الراوتر
    path: "/Dashboard/UsersLog",
    icon: "fas fa-users",
  },
  {
    id: "MangeRegistration",
    name: "التسجيل",
    nameRouter: "AdminRegistration", // مطابق لـ name: 'AdminRegistration' المعرف في الراوتر
    path: "/Dashboard/admin/registration",
    icon: "fas fa-user-plus",
  },
  {
    id: "MangeCourses",
    name: "المساقات",
    nameRouter: "AdminCourses", // مطابق لـ name: 'AdminCourses' المعرف في الراوتر
    path: "/Dashboard/admin/courses",
    icon: "fas fa-book-open",
  },
  {
    id: "MangeReport",
    name: "التقارير",
    nameRouter: "AdminReports", // مطابق لـ name: 'AdminReports' المعرف في الراوتر
    path: "/Dashboard/admin/reports",
    icon: "fas fa-chart-line",
  },
  {
    id: "MangeBatches",
    name: "الدفعات",
    nameRouter: "AdminBatches", // مطابق لـ name: 'AdminBatches' المعرف في الراوتر
    path: "/Dashboard/admin/batches",
    icon: "fas fa-layer-group",
  },
  {
    id: "MangeGroups",
    name: "المجموعات",
    nameRouter: "AdminGroups", // مطابق لـ name: 'AdminGroups' المعرف في الراوتر
    path: "/Dashboard/admin/groups",
    icon: "fas fa-users-rectangle",
  },
  {
    id: "MangeNotifications",
    name: "الإشعارات",
    nameRouter: "AdminNotifications", // مطابق لـ name: 'AdminNotifications' المعرف في الراوتر
    path: "/Dashboard/admin/notifications",
    icon: "fas fa-bell",
  },
  {
    id: "MangeProfile",
    name: "الخروج/الرئيسية", 
    nameRouter: "Login", // تم توجيهه مؤقتاً لصفحة تسجيل الدخول لعدم وجود صفحة ملف شخصي مستقلة في الراوتر حالياً
    path: "/auth/login",
    icon: "fas fa-sign-out-alt",
  },
];

/**
 * @constant {Array<Object>} Adminpremion
 * @description جدول صلاحيات مدير النظام (Super Admin).
 * يحدد المعرفات (IDs) المسموح للمدير بالوصول إليها، مع تحديد العناصر الأساسية عبر (isPrimary: true).
 */
export const Adminpremion = [
  { id: "MangeProfile", isPrimary: false },
  { id: "MangeGroups", isPrimary: false },
  { id: "MangeReport", isPrimary: true },
  { id: "MangeBatches", isPrimary: true },
  { id: "MangeCourses", isPrimary: true },
  { id: "MangeRegistration", isPrimary: true },
  { id: "MangeUsers", isPrimary: false },
];

/**
 * @constant {Array<Object>} GroupSuperVisorpremion
 * @description جدول صلاحيات مشرفة المجموعة (Group Supervisor).
 * يحد من بعض الصفحات الحساسة (مثل إدارة مستخدمي النظام بأكمله MangeUsers) مقارنة بصلاحيات الأدمن.
 */
export const GroupSuperVisorpremion = [
  { id: "MangeProfile", isPrimary: false },
  { id: "MangeGroups", isPrimary: false },
  { id: "MangeReport", isPrimary: true },
  { id: "MangeBatches", isPrimary: true },
  { id: "MangeCourses", isPrimary: true },
  { id: "MangeRegistration", isPrimary: true },
];

/**
 * @function getMenuByRole
 * @description دالة ديناميكية تقوم ببناء وتجميع عناصر القائمة المسموحة لدور معين.
 * آلية العمل: تستقبل معرف الدور، تبحث عن مصفوفة الصلاحيات الخاصة به، ثم تقوم بدمج البيانات (مثل الاسم، الأيقونة، والراوتر) من القائمة الرئيسية premitinMenu.
 * 
 * @param {string} roleId - المعرف الفريد للدور المراد جلب قائمته (مثال: 'super_admin')
 * @returns {Array<Object>} مصفوفة كائنات تحتوي على تفاصيل الروابط المسموحة لهذا الدور فقط ومجهزة للـ Vue Template.
 */
export const getMenuByRole = (roleId) => {
  // خريطة (Map) برمجية لربط المعرفات بالمصفوفات المقابلة لها تسهيلاً لعملية البحث
  const rolePermissionsMap = {
    'super_admin': Adminpremion,
    'group_supervisor': GroupSuperVisorpremion,
    'batch_supervisor': [], // مصفوفة صلاحيات مشرفة الدفعة (يمكن إضافتها لاحقاً)
    'teacher': [],          // مصفوفة صلاحيات المعلمة (يمكن إضافتها لاحقاً)
    'student': []           // مصفوفة صلاحيات الطالبة (يمكن إضافتها لاحقاً)
  };
  
  // جلب مصفوفة الصلاحيات المحددة، أو إرجاع مصفوفة فارغة في حال عدم وجود الدور
  const selectedPermissions = rolePermissionsMap[roleId] || [];

  // دمج تفاصيل الروابط الكاملة من القائمة الرئيسية بناءً على المطابقة بـ ID
  return selectedPermissions.map(permission => {
    const details = premitinMenu.find(item => item.id === permission.id);
    
    // إذا وجدت تفاصيل الرابط، نقوم بدمجها مع خاصية isPrimary المخصصة لهذا الدور
    return details ? { ...details, isPrimary: permission.isPrimary } : null;
  }).filter(item => item !== null); // فلترة وتصفية القائمة من أي عناصر فارغة لضمان عدم حدوث أخطاء بالواجهة
};

/**
 * @function getRolesDetails
 * @description دالة لجلب تفاصيل مجموعة من الأدوار دفعة واحدة (Bulk Fetch).
 * تُستخدم عندما يحتاج النظام لعرض بيانات شروحات وأيقونات لأكثر من دور في صفحة واحدة.
 * 
 * @param {Array<string>} roleIds - مصفوفة تحتوي على معرفات الأدوار المطلوبة (مثال: ['teacher', 'student'])
 * @returns {Array<Object>} مصفوفة تحتوي على الكائنات الكاملة للأدوار المطابقة.
 */
export const getRolesDetails = (roleIds) => {
  return roles.filter(role => roleIds.includes(role.id));
};

/**
 * @function getRoleDetails
 * @description دالة لجلب تفاصيل دور واحد محدد بشكل دقيق (Single Fetch).
 * تُستخدم عند حاجة النظام لعرض بيانات الدور النشط حالياً للمستخدم (Active Role).
 * 
 * @param {string} roleId - المعرف الفريد للدور (مثال: 'group_supervisor')
 * @returns {Object|undefined} كائن يحتوي على تفاصيل الدور بالكامل، أو undefined إذا لم يعثر عليه.
 */
export const getRoleDetails = (roleId) => {
  return roles.find(role => role.id === roleId);
};