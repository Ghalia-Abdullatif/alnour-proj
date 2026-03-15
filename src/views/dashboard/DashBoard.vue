<script setup>
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import logoUrl from "/assets/logos/logo.png";

const router = useRouter();
const route = useRoute();
const isMenuOpen = ref(false);

const adminMenu = [
  { name: "الرئيسية", path: "/Dashboard/admin/users", icon: "fas fa-home", primary: true },
  { name: "المستخدمين", path: "/Dashboard/admin/users", icon: "fas fa-users", primary: true },
  { name: "التسجيل", path: "/Dashboard/admin/registration", icon: "fas fa-user-plus", primary: true },
  { name: "المساقات", path: "/Dashboard/admin/courses", icon: "fas fa-book-open", primary: true },
  { name: "التقارير", path: "/Dashboard/admin/reports", icon: "fas fa-chart-line", primary: true },
  { name: "الدفعات", path: "/Dashboard/admin/batches", icon: "fas fa-layer-group", primary: false },
  { name: "المجموعات", path: "/Dashboard/admin/groups", icon: "fas fa-users-rectangle", primary: false },
  { name: "الإشعارات", path: "/Dashboard/admin/notifications", icon: "fas fa-bell", primary: false },
  { name: "الملف الشخصي", path: "/Dashboard/admin/profile", icon: "fas fa-user-circle", primary: false }
];

const primitions = adminMenu;

const primaryMenu = computed(() =>
  adminMenu.filter(item => item.primary)
);

const handleLogout = () => {
  if (confirm("هل أنتِ متأكدة من تسجيل الخروج؟")) {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/register").then(() => window.location.reload());
  }
};

watch(() => route.path, () => {
  console.log(route.path);
});
</script>

<template>

<div class="min-h-screen flex bg-[#f8fafc] font-['Tajawal']" dir="rtl">

  <!-- overlay mobile -->
  <div
    v-if="isMenuOpen"
    @click="isMenuOpen=false"
    class="fixed inset-0 z-40 bg-black/50 lg:hidden">
  </div>

  <!-- SIDEBAR -->
  <aside
    :class="[
      'fixed  inset-y-0 right-0 z-[101] w-64 bg-amber-400 text-white flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 shadow-2xl',
      isMenuOpen ? 'translate-x-0' : 'translate-x-full'
    ]"
  >

    <div class="  p-6 border-b border-white/10 text-center relative">

      <button
        @click="isMenuOpen=false"
        class="lg:hidden absolute left-4 top-4 text-white">
        <i class="fas fa-times text-xl"></i>
      </button>

      <img :src="logoUrl" class="w-16 h-16 mx-auto mb-2"/>
      <h2 class="font-bold text-white">مقرأة النور</h2>

    </div>

    <!-- menu -->
    <nav class="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">

      <router-link
        v-for="item in primitions"
        :key="item.path"
        :to="item.path"
      >

        <button
          @click="isMenuOpen=false"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 mb-1',
            route.path === item.path
              ? 'bg-emerald-600 text-white shadow-md'
              : 'hover:bg-white/10 text-emerald-900 font-medium',
            item.primary ? 'hidden lg:flex' : ''
          ]"
        >

          <i
            :class="[
              item.icon,
              'w-5 text-center',
              route.path === item.path ? 'text-white' : 'text-emerald-800'
            ]">
          </i>

          <span>{{ item.name }}</span>

        </button>

      </router-link>

    </nav>

    <!-- logout -->
    <div class="p-4 border-t border-white/10 bg-[#043d2e]">

      <button
        @click="handleLogout"
        class="w-full py-3 bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
      >
        <i class="fas fa-power-off"></i>
        تسجيل الخروج
      </button>

    </div>

  </aside>

  <!-- MAIN -->
  <main class="flex-1 flex flex-col min-w-0">

    <!-- HEADER -->
    <header
      class="sm:static sticky  top-0 bg-white/80 backdrop-blur-md border-b px-4 lg:px-8 py-4 flex items-center justify-between z-40"
    >

      <div class="flex items-center gap-4">

        <button
          @click="isMenuOpen=true"
          class="lg:hidden p-2 text-[#064e3b] bg-emerald-50 rounded-lg"
        >
          <i class="fas fa-bars-staggered text-xl"></i>
        </button>

        <h1 class="font-black text-gray-800 lg:text-xl">
          {{ primitions.find(m => route.path === m.path)?.name || "الرئيسية" }}
        </h1>

      </div>

    </header>

    <!-- CONTENT SCROLL -->
    <div class="flex-1 overflow-y-auto lg:p-8 bg-[#f8fafc]">

      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>

      <div class="h-20 lg:hidden"></div>

    </div>

  </main>

  <!-- MOBILE NAV -->
  <nav
    class="fixed  bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 flex lg:hidden items-center justify-around z-[100] shadow-[0_-8px_30px_rgba(0,0,0,0.1)] px-2"
  > 
    <router-link
      v-for="item in primaryMenu"
      :key="item.path"
      :to="item.path"
    >

      <div
        :class="[
          'transition-all  flex flex-col items-center justify-center flex-1 py-1 min-w-[60px]',
          route.path === item.path
            ? 'text-emerald-600'
            : 'text-gray-400'
        ]"
      >

        <span
          v-if="route.path === item.path"
          class="absolute top-0 w-8 h-[2px]  bg-emerald-600 rounded-full">
        </span>

        <i :class="[item.icon, 'text-xl mb-1']"></i>
        <span class="text-[9px] font-bold">{{ item.name }}</span>

      </div>

    </router-link>

  </nav>

</div>

</template>

<style scoped>

.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.2s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.2);
  border-radius: 10px;
}

</style>