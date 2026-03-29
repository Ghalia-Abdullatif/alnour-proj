<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import logoUrl from "/assets/logos/logo.png";
import { useAuthStore } from "@/stors/acount-store.js";

const authStore = useAuthStore();

const router = useRouter();
const route = useRoute();
const isMenuOpen = ref(false);
const windowWidth = ref(window.innerWidth);

// مراقبة حجم الشاشة لتحديد وضع الجوال/الديسكتوب
const updateWidth = () => {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value >= 1024) isMenuOpen.value = false;
};

onMounted(() => window.addEventListener("resize", updateWidth));
onUnmounted(() => window.removeEventListener("resize", updateWidth));

const isMobile = computed(() => windowWidth.value < 1024);

// بيانات المستخدم
const userData = ref({
  name: authStore.getUserName,
  role:  authStore.getCurrentRole.name,
});

// قائمة الروابط الكاملة
const dashMenu = computed(() => authStore.getEnableBremetion);
  

// تصفية القوائم بناءً على حجم الشاشة
const sidebarMenu = computed(() => {
  return isMobile.value ? dashMenu.value.filter((item) => !item.isPrimary) : dashMenu.value;
});

const bottomNavMenu = computed(() => dashMenu.value.filter((item) => item.isPrimary));

const currentRouteName = computed(
  () => dashMenu.value.find((m) => route.path === m.path)?.name || "لوحة التحكم",
);
const switchRole=()=>{
   router.push({ name: "ChoseRole" });
}

const handleLogout = async () => {
  // 1. تأكيد الخروج من المستخدم
  if (confirm("هل أنتِ متأكدة من تسجيل الخروج؟")) {
    try {
      // 2. استدعاء ميثود الستور (التي ستقوم بطلب السيرفر والتوجيه)
   const result = await authStore.logoutUser() 
if(result.success){
      router.replace({ name: 'Login' }); // التوجيه لصفحة تسجيل الدخول

}
      
      // 3. تنظيف أي بيانات إضافية في المتصفح احتياطياً
     
      
      console.log("✅ تمت عملية تسجيل الخروج بنجاح");
    } catch (error) {
      console.error("❌ فشل تسجيل الخروج:", error);
    }
  }
};

// const handleLogout = () => {
//   if (confirm("هل أنتِ متأكدة من تسجيل الخروج؟")) {
// const result= authStore.logoutUser();
//     localStorage.clear();
//     sessionStorage.clear();
//     if(result.success){
    
//   }
// };
</script>

<template>
  <div class="layout-wrapper " dir="rtl">
    <transition name="fade">
      <div
        v-if="isMenuOpen"
        @click="isMenuOpen = false"
        class="mobile-overlay"
      ></div>
    </transition>

    <aside
      :class="[
        'sidebar-container',
        isMenuOpen ? 'translate-x-0' : 'translate-x-full',
      ]"
    >
      <div class="sidebar-header">
        <!-- <div class="flex items-center flex-row justify-between mb-4">
          <img :src="logoUrl" class="w-10 h-10 contain" />
          <p>لوحة تحكم المدير التقني</p>
          <p></p>
        </div> -->

        <div class="user-card">
          <div class="user-avatar"><i :class= authStore.getCurrentRole.icon></i></div>
          <div class="overflow-hidden">
            <p class="user-name">{{ userData.name }}</p>

            <p class="user-role">{{ userData.role }}</p>
          </div>
          <button v-if="authStore.getEnablesRoles.length>1" class="switch-role" @click="switchRole">تبديل الدور</button>

          <!-- <i class="fas fa-shuffle text-xs text-cardCasterd"></i>         -->
        </div>
      </div>

      <nav class="sidebar-nav custom-scrollbar m-1">
        <div class="menu-label">الإعدادات</div>
        <router-link
          v-for="item in sidebarMenu"
          :key="item.path"
          :to="item.path"
          @click="isMenuOpen = false"
        >
          <div
            :class="[
              'nav-item',
              route.path === item.path
                ? 'nav-item-active'
                : 'nav-item-inactive',
            ]"
          >
            <i :class="[item.icon, 'icon']"></i>
            <span class="text-sm font-bold">{{ item.name }}</span>
          </div>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button @click="handleLogout" class="btn-logout">
          <i class="fas fa-power-off"></i> تسجيل الخروج
        </button>
      </div>
    </aside>

    <main class="main-layout ">
      <header class="top-header">
        <div class="flex items-center gap-4">
          <button
            @click="isMenuOpen = true"
            class="lg:hidden p-1 hover:scale-110 transition-transform"
          >
                     <img :src="logoUrl" class="w-6 h-6 contain " />

            <!-- <i class="fas fa-bars-staggered text-primary text-xl"></i> fas fa-bell -->
          </button>
           <img  :src="logoUrl" class="w-6 h-6 contain hidden lg:block" />

          <h2>{{ currentRouteName }}</h2>
        </div>
        <div class="flex items-center gap-3"><i class="fa fa-bell icon text-cardCasterd  text-xl"></i>
</div>
      </header>

      <div class="content-scroll-area  m-1 overflow-y-auto custom-scrollbar">
        <div class="max-w-[1600px] mx-auto w-full">
          <router-view v-slot="{ Component }">
            <transition name="page-fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
        <div class="h-24 lg:hidden"></div>
      </div>
    </main>

    <nav class="bottom-nav">
      <router-link
        v-for="item in bottomNavMenu"
        :key="item.path"
        :to="item.path"
        class="bottom-nav-link"
      >
        <div
          :class="[
            'nav-content',
            route.path === item.path ? 'text-primary' : 'text-gray-400',
          ]"
        >
          <i :class="[item.icon, 'icon mb-1']"></i>
          <span class="text-[10px] font-bold">{{ item.name }}</span>
        </div>
        <div v-if="route.path === item.path" class="nav-indicator"></div>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
@reference "@/css/style.css";

/* الهيكل الرئيسي وتثبيت الشاشة */
.layout-wrapper {
  @apply h-screen w-full flex overflow-y-auto bg-background font-tajawal;
}

/* السايدبار بتصميم ثابت */
.sidebar-container {
  @apply fixed h-full inset-y-0 right-0 z-[120] w-72 bg-background flex flex-col 
         transition-all duration-300 lg:static lg:translate-x-0 border-l border-primary/10 shadow-2xl lg:shadow-none;
}
.sidebar-header {
  @apply p-6 shrink-0 bg-white/10;
}
.sidebar-nav {
  @apply flex-1 p-4 space-y-1 overflow-y-auto;
}
.sidebar-footer {
  @apply p-4 border-t border-primary/10 shrink-0 bg-white/5;
}

/* المحتوى الرئيسي وسكرول الصفحة */
.main-layout {
  @apply flex-1 flex flex-col h-full min-w-0 overflow-y-auto relative;
}
.top-header {
  @apply bg-background border-b shadow-2xs border-primary/10 h-16 backdrop-blur-md  flex items-center justify-between px-6 shrink-0;
}

.content-scroll-area {
  @apply flex-1 overflow-y-auto p-4 lg:p-8;
}

/* بطاقة المستخدم والعناصر */
.user-card {
  @apply bg-white/40 p-3 rounded-2xl flex items-center gap-3 border border-primary/5 shadow-sm;
}
.user-avatar {
  @apply w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white shrink-0;
}
.user-name {
  @apply font-bold text-primary text-xs truncate;
}
.user-role {
  @apply text-[9px] text-Brown/60 block;
}
.switch-role {
  @apply bg-cardCasterd text-[9px] text-basicBlack p-2 my-2 rounded-xl hover:bg-primary hover:text-white;
}

.menu-label {
  @apply px-4 mb-2 text-[10px] font-bold text-Brown/40 uppercase tracking-widest mt-4;
}

.nav-item {
  @apply flex items-center  gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer;
}
.nav-item-active {
  @apply bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02];
}
.nav-item-inactive {
  @apply hover:bg-primary/5 text-basicBlack;
}


.btn-logout {
  @apply w-full py-3 bg-primary text-white rounded-xl text-xs font-bold 
         flex items-center justify-center gap-2 hover:bg-Brown transition-all active:scale-95;
}

/* الناف بار السفلي للجوال */
.bottom-nav {
  @apply fixed bottom-0 left-0 right-0 h-16 bg-background border-t flex lg:hidden 
         items-center justify-around z-[100] shadow-[0_-5px_20px_rgba(0,0,0,0.03)] px-2 pb-1 shadow-2xs border-primary/10 ;
}
.bottom-nav-link {
  @apply relative flex flex-col h-full items-center justify-center flex-1;
}
.nav-content {
  @apply flex flex-col items-center transition-colors duration-300;
}
.nav-indicator {
  @apply absolute -top-[1px] w-10 h-[3px] bg-primary rounded-full;
}

.mobile-overlay {
  @apply fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm lg:hidden;
}

/* السكرول بار */
/* .custom-scrollbar::-webkit-scrollbar {
  width: 4px;
 
}
.custom-scrollbar::-webkit-scrollbar-track {
  @apply mx-2 h-8 w-4 sm:bg-basicGrayh bg-transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply mx-2 h-8 w-4 bg-primary rounded-full hover:bg-primary/30;
} */

/* الأنيميشن */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.25s ease-out;
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
