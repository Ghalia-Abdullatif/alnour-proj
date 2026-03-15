<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import logoUrl from "/assets/logos/logo.png"; // مسار اللوجو

const router = useRouter();
const route = useRoute();

// حالة Sidebar (مفتوح/مغلق)
const isSidebarOpen = ref(false);

// القائمة الكاملة لجميع العناصر
const adminMenu = [
  { name: "لوحة التحكم", path: "/admin", icon: "fas fa-home", primary: true },
  { name: "إدارة المستخدمين", path: "/admin/users", icon: "fas fa-users-cog", primary: true },
  { name: "إدارة المساقات", path: "/admin/courses", icon: "fas fa-book-open", primary: true },
  { name: "إدارة الدفعات", path: "/admin/batches", icon: "fas fa-layer-group", primary: true },
  { name: "توزيع المجموعات", path: "/admin/groups", icon: "fas fa-users-rectangle", primary: true },
  { name: "إدارة التسجيل", path: "/admin/registration", icon: "fas fa-user-plus", primary: false },
  { name: "إدارة التقارير", path: "/admin/reports", icon: "fas fa-chart-line", primary: false },
  { name: "الإشعارات", path: "/admin/notifications", icon: "fas fa-bell", primary: false },
];

// العناصر الأساسية التي تظهر في Bottom Nav (الهاتف)
const primaryMenu = computed(() => adminMenu.filter(item => item.primary));

// العناصر الإدارية التي تظهر في Sidebar فقط
const adminOnlyMenu = computed(() => adminMenu.filter(item => !item.primary));

// دالة التنقل للروابط وإغلاق الـ Sidebar تلقائياً عند الهاتف
const navigateTo = (path) => {
  router.push(path);
  isSidebarOpen.value = false;
};

// دالة تسجيل الخروج ومسح بيانات الجلسة
const handleLogout = () => {
  if (confirm("هل أنتِ متأكدة من تسجيل الخروج؟")) {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/register").then(() => window.location.reload());
  }
};
</script>

<template>
<div class="h-screen flex bg-[#f8fafc] font-['Tajawal'] overflow-hidden" dir="rtl">

  <!-- الخلفية الداكنة تظهر عند فتح Sidebar في الهاتف -->
  <div 
    v-if="isSidebarOpen" 
    @click.self="isSidebarOpen = false" 
    class="fixed inset-0 z-40 bg-black/50 lg:hidden"
  ></div>

  <!-- Sidebar للهاتف والديسكتوب -->
  <aside 
    class="fixed inset-y-0 right-0 z-50 w-64 bg-amber-300 text-white flex flex-col transition-transform lg:static lg:translate-x-0"
    :class="isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'"
  >
    <!-- رأس الـ Sidebar مع اللوجو واسم اللوحة -->
    <div class="p-6 border-b border-white/10 text-center">
      <img :src="logoUrl" class="w-16 h-16 mx-auto mb-2"/>
      <h2 class="font-bold uppercase text-xs tracking-widest text-emerald-300">مقرأة النور</h2>
    </div>

    <!-- عنوان الإدارة فقط للعناصر غير الأساسية -->
    <div v-if="adminOnlyMenu.length" class="px-4 py-2 text-emerald-300 font-bold text-sm border-b border-white/10">إدارة</div>

    <!-- قائمة Sidebar -->
    <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
      <button 
        v-for="item in adminOnlyMenu" 
        :key="item.path" 
        @click="navigateTo(item.path)"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition hover:bg-white/10 text-emerald-100"
      >
        <i :class="item.icon"></i>
        <span>{{ item.name }}</span>
      </button>
        <!-- Bottom Nav للهاتف -->
  <Teleport to="body">
    <nav 
      class=" fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 flex items-center justify-around z-[100] shadow-[0_-5px_20px_rgba(0,0,0,0.05)]"
    >
      <button
        v-for="item in primaryMenu" 
        :key="item.path"
        @click="navigateTo(item.path)"
        class="flex flex-col items-center justify-center flex-1 relative transition-all"
        :class="route.path === item.path ? 'text-emerald-600' : 'text-gray-400'"
      >
        <i :class="[item.icon, 'text-xl']"></i>
        <span class="text-[10px] mt-1 font-bold">{{ item.name }}</span>
        <div v-if="route.path === item.path" class="absolute top-0 w-10 h-0.5 bg-emerald-600"></div>
      </button>
    </nav>
  </Teleport>
    </nav>

    <!-- زر تسجيل الخروج -->
    <div class="p-4 border-t border-white/10">
      <button @click="handleLogout" class="w-full py-3 bg-rose-500 rounded-lg">تسجيل خروج</button>
    </div>
  </aside>

  <!-- المحتوى الرئيسي -->
  <main class="flex-1 flex flex-col min-w-0 relative">

    <!-- الهيدر ثابت أعلى الصفحة -->
    <header class="bg-white border-b px-6 py-4 flex items-center justify-between z-40 flex-shrink-0">
      <!-- زر فتح Sidebar في الهاتف -->
      <button @click="isSidebarOpen = true" class="lg:hidden text-[#064e3b]">
        <i class="fas fa-bars-staggered"></i>
      </button>

      <!-- عنوان الصفحة حسب الرابط -->
      <h1 class="font-bold text-gray-800">{{ adminMenu.find(m => m.path === route.path)?.name || "الرئيسية" }}</h1>

      <!-- أيقونة المستخدم/الحساب -->
      <div class="w-9 h-9 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-bold">م</div>
    </header>

    <!-- المنطقة القابلة للسكرول بين الهيدر وBottom Nav -->
    <div class="flex-1 overflow-y-auto p-4 lg:p-8 pb-20">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

  </main>



</div>
</template>

<style scoped>
/* أنيميشن الانتقال بين الصفحات */
.page-fade-enter-active, .page-fade-leave-active { transition: all 0.25s ease-out; }
.page-fade-enter-from { opacity: 0; transform: translateY(10px); }
.page-fade-leave-to { opacity: 0; transform: translateY(-10px); }

/* تحسين شكل السكرول بار للـ Sidebar */
aside::-webkit-scrollbar { width: 6px; }
aside::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
</style>