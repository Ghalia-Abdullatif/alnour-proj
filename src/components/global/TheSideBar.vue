<template>
  <div v-if="isOpen" @click="$emit('close')" class="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"></div>

  <aside :class="[
    'fixed lg:relative top-0 right-0 h-screen bg-[#064e3b] text-white w-72 z-50 transition-all duration-300 shadow-2xl flex flex-col shrink-0', 
    isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
  ]" dir="rtl">
    
    <div class="p-8 flex flex-col items-center border-b border-emerald-800/50">
      <div class="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-4 border border-white/5 shadow-inner">
        <img src="@/assets/logo.png" alt="لوجو" class="w-16 h-16 object-contain" />
      </div>
      <h2 class="text-lg font-bold text-emerald-50 font-['Tajawal']">مقرأة النور الإلكترونية</h2>
    </div>

    <nav class="flex-1 p-4 space-y-3 font-['Tajawal']">
      
      <router-link to="/" class="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-800/50 transition-all group no-underline text-white">
        <div class="w-8 h-8 rounded-lg bg-emerald-900/50 flex items-center justify-center">
          <i class="fas fa-home text-emerald-400"></i>
        </div>
        <span>الرئيسية</span>
      </router-link>

      <button @click="$emit('openAbout')" class="w-full flex items-center gap-3 p-3 rounded-xl bg-emerald-700/30 border-r-4 border-emerald-500 hover:bg-emerald-700/50 transition-all">
        <div class="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
          <i class="fas fa-book-open text-white"></i>
        </div>
        <span class="font-bold text-emerald-50 text-right">تعريف بمثاني ومعارج</span>
      </button>
    </nav>

    <div class="p-6 border-t border-emerald-800/50 text-center">
      <p class="text-[11px] text-emerald-400/70 leading-relaxed font-['Tajawal']">
        جميع الحقوق محفوظة <br>
        <span class="text-emerald-500 font-bold text-xs">@ مقرأة النور 2026</span>
      </p>
    </div>
  </aside>
</template>

<script setup>
/* الخصائص (Props):
  - isOpen: لاستقبال حالة السايدبار (مفتوح/مغلق) من الأب.
  
  الأحداث (Emits):
  - close: لإغلاق السايدبار عند الضغط على الخلفية.
  - openAbout: لفتح نافذة التعريف بالبرامج عند الضغط على الزر.
*/
defineProps({ isOpen: Boolean });
defineEmits(['close', 'openAbout']);
</script>