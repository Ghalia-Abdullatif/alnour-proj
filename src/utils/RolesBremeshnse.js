// مصفوفة البيانات: تحتوي على المعلومات الأساسية لكل دور متاح
export const roles = [
  { 
    id: 'super_admin', 
    name: 'مدير النظام', 
    description: 'إدارة كاملة للمشاركين والجدول الزمني والتحكم بالإعدادات', 
    icon: 'fas fa-user-shield' // أيقونة المستخدم مع درع لترمز للحماية والتحكم الكامل
  },
  { 
    id: 'group_supervisor', 
    name: 'مشرفة المجموعة', 
    description: 'صلاحية عرض المحتوى ومشاركة الشاشة وإدارة المجموعات الصغيرة', 
    icon: 'fas fa-users-cog' // أيقونة مجموعة مستخدمين مع ترس ترمز للإشراف التقني
  },
  { 
    id: 'batch_supervisor', 
    name: 'مشرفة الدفعة', 
    description: 'المتابعة العامة للدفعة والتفاعل عبر القنوات النصية', 
    icon: 'fas fa-clipboard-list' // أيقونة لوحة المهام ترمز للمتابعة الإدارية الشاملة
  },
  { 
    id: 'teacher', 
    name: 'معلمة', 
    description: 'تقديم الدروس والتفاعل المباشر مع الطالبات في القنوات النصية', 
    icon: 'fas fa-chalkboard-teacher' // أيقونة المعلمة التقليدية أمام السبورة
  },
  { 
    id: 'student', 
    name: 'طالبة', 
    description: 'الاستفادة من المحتوى العلمي والتفاعل مع المعلمات والزميلات', 
    icon: 'fas fa-user-graduate' // أيقونة الخريجة أو الطالبة بزي التخرج
  }
];
// قائمة الروابط الكاملة
export const premitinMenu = [
  {
    id:"home",
    name: "الرئيسية",
    path: "/Dashboard/admin/home",
    icon: "fas fa-home",
   
  },
  {
        id:"MangeUsers",

    name: "المستخدمين",
    path: "/Dashboard/admin/users",
    icon: "fas fa-users",
  
  },
  {
            id:"MangeRegistration",

    name: "التسجيل",
    path: "/Dashboard/admin/registration",
    icon: "fas fa-user-plus",

  },
  {
                id:"MangeCourses",

    name: "المساقات",
    path: "/Dashboard/admin/courses",
        icon: "fas fa-book-open",


  },
  {
                    id:"MangeReport",

    name: "التقارير",
    path: "/Dashboard/admin/reports",
    icon: "fas fa-chart-line",
  },
  {
                        id:"MangeBatches",

    name: "الدفعات",
    path: "/Dashboard/admin/batches",
    icon: "fas fa-layer-group",
  },
  {
                            id:"MangeGroups",

    name: "المجموعات",
    path: "/Dashboard/admin/groups",
    icon: "fas fa-users-rectangle",
  },
  {
                                id:"MangeNotifications",

    name: "الإشعارات",
    path: "/Dashboard/admin/notifications",
    icon: "fas fa-bell",
  },
  {
                                    id:"MangeProfile",

    name: "الملف الشخصي",
    path: "/Dashboard/admin/profile",
    icon: "fas fa-user-circle",
  },
];
export const Adminpremion = [
    {
    id:"MangeProfile",

    isPrimary:false,
    },
    {
    id:"MangeGroups",
    isPrimary:false,
    },
    {
    id:"MangeReport",
    isPrimary:true,
    },
     {
    id:"MangeBatches",
    isPrimary:true,
    }, {
    id:"MangeCourses",
    isPrimary:true,
    }, {
    id:"MangeRegistration",
    isPrimary:true,
    }, {
    id:"MangeUsers",
    isPrimary:false,
    },

]

export const GroupSuperVisorpremion = [
    {
    id:"MangeProfile",
    isPrimary:false,
    },
    {
    id:"MangeGroups",
    isPrimary:false,
    },
    {
    id:"MangeReport",
    isPrimary:true,
    },
     {
    id:"MangeBatches",
    isPrimary:true,
    }, {
    id:"MangeCourses",
    isPrimary:true,
    }, {
    id:"MangeRegistration",
    isPrimary:true,
    },

]
/**
 * دالة تجلب الصلاحيات الكاملة بناءً على اسم الدور (Role ID)
 * @param {string} roleId - اسم الدور (مثل: super_admin, batch_supervisor)
 * @returns {Array} - مصفوفة بكل تفاصيل الروابط المسموحة لهذا الدور
 */
export const getMenuByRole = (roleId) => {
  // 1. خريطة لربط الـ ID بالمصفوفات التي قمتِ بتعريفها
  const rolePermissionsMap = {
    'super_admin': Adminpremion,
    'group_supervisor': GroupSuperVisorpremion,
    // يمكنك إضافة البقية هنا بنفس النمط
    'batch_supervisor': [], // مصفوفة صلاحيات مشرفة الدفعة
    'teacher': [],
    'student': []
  };

  const selectedPermissions = rolePermissionsMap[roleId] || [];

  // 2. دمج البيانات من premitinMenu
  return selectedPermissions.map(permission => {
    const details = premitinMenu.find(item => item.id === permission.id);
    
    // ندمج بيانات القائمة الأصلية مع حالة isPrimary المخصصة لهذا الدور
    return details ? { ...details, isPrimary: permission.isPrimary } : null;
  }).filter(item => item !== null); // تنظيف القائمة من أي قيم فارغة
};
/**
 * دالة تجلب بيانات الأدوار كاملة بناءً على مصفوفة من المعرفات
 * @param {Array} roleIds - مصفوفة معرفات (مثل: ['super_admin', 'group_supervisor'])
 * @returns {Array} - مصفوفة كائنات الأدوار كاملة التفاصيل
 */
export const getRolesDetails = (roleIds) => {
  // نقوم بفلترة مصفوفة roles الأصلية
  // ونعيد فقط الأدوار الموجودة داخل مصفوفة roleIds الممررة
  return roles.filter(role => roleIds.includes(role.id));
};
export const getRoleDetails = (roleId) => {
  // نقوم بفلترة مصفوفة roles الأصلية
  // ونعيد فقط الأدوار الموجودة داخل مصفوفة roleIds الممررة
  return roles.find(role => role.id === roleId);
};