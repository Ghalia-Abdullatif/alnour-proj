<template>
  <header class="flex items-center px-4 h-16 bg-white border-b border-gray-100 sticky top-0 z-20" dir="rtl">
    
    <div class="flex items-center gap-3">
      <button @click="$emit('toggleSidebar')" class="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors text-xl">
        <i class="fas fa-bars"></i>
      </button>
      
      <h1 class="text-md font-bold text-slate-700">مقرأة النور الإلكترونية</h1>
    </div>

    <div class="flex-1"></div>

  </header>
</template>

<script setup>
/* تعريف الأحداث (Emits):
  - toggleSidebar: هو الحدث الذي سيستمع إليه ملف AdminHome لإظهار أو إخفاء القائمة الجانبية
*/
defineEmits(['toggleSidebar']);
</script>