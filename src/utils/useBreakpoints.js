import { ref } from "vue";

// مرجع عالمي ثابت لا يتأثر بهدم المكونات
export const isMobile = ref(window.innerWidth < 1024);

// دالة التحديث
const update = () => {
  isMobile.value = window.innerWidth < 1024;
  console.log("Global Resize Check:", isMobile.value);
};

// تشغيل المستمع فوراً بمجرد استيراد الملف (خارج أي lifecycle)
if (typeof window !== 'undefined') {
  window.addEventListener("resize", update);
  // تنفيذ أولي لضمان دقة القيمة عند تحميل التطبيق
  update();
}

// تصدير دالة فارغة فقط إذا كنتِ تريدين استدعاءها في App.vue للتوثيق
export function initBreakpointListener() {
  update(); 
}