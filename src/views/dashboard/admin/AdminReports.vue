<template>
  <div class="p-6 bg-slate-50 min-h-screen text-right" dir="rtl">
    
    <div class="mb-8 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
      
      <div class="flex gap-2 bg-slate-100 p-1 rounded-2xl">
        <button @click="isMonthly = false" :class="!isMonthly ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'" class="px-6 py-2 rounded-xl text-xs font-black transition-all">أسبوعي</button>
        <button @click="isMonthly = true" :class="isMonthly ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'" class="px-6 py-2 rounded-xl text-xs font-black transition-all">شهري</button>
      </div>

      <div v-if="!isMonthly" class="flex items-center gap-4">
        <button @click="changeWeek(1)" class="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
          <span>▶</span> </button>

        <div class="text-center min-w-[200px]">
          <h3 class="font-black text-slate-800 text-sm">{{ formattedCurrentWeek }}</h3>
          <p class="text-[10px] text-slate-400 font-bold">رقم الأسبوع: {{ weekNumber }}</p>
        </div>

        <button @click="changeWeek(-1)" class="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
          <span>◀</span> </button>
      </div>

      <div v-else class="flex items-center gap-2">
         <select v-model="selectedMonth" class="bg-slate-50 border-none rounded-xl font-bold text-xs px-10 py-2.5 focus:ring-2 focus:ring-blue-500">
           <option v-for="month in pastMonths" :key="month" :value="month">{{ month }}</option>
         </select>
      </div>
    </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const isMonthly = ref(false);
const selectedDate = ref(new Date()); // التاريخ المرجعي الحالي
const selectedMonth = ref('مارس 2024');

// قائمة بالأشهر السابقة للتقارير الشهرية
const pastMonths = ['يناير 2024', 'فبراير 2024', 'مارس 2024'];

// 1. وظيفة تغيير الأسبوع
const changeWeek = (direction) => {
  const newDate = new Date(selectedDate.value);
  newDate.setDate(newDate.getDate() + (direction * 7));
  selectedDate.value = newDate;
  
  // هنا نقوم باستدعاء الدالة لجلب البيانات من قاعدة البيانات بناءً على التاريخ الجديد
  // fetchReportsForDate(selectedDate.value);
};

// 2. تنسيق عرض التاريخ (مثلاً: 10 مارس - 16 مارس)
const formattedCurrentWeek = computed(() => {
  const start = new Date(selectedDate.value);
  const end = new Date(selectedDate.value);
  end.setDate(end.getDate() + 6);
  
  const options = { day: 'numeric', month: 'short' };
  return `${start.toLocaleDateString('ar-SA', options)} - ${end.toLocaleDateString('ar-SA', options)}`;
});

// 3. حساب رقم الأسبوع (تقريبي)
const weekNumber = computed(() => {
  const firstDayOfYear = new Date(selectedDate.value.getFullYear(), 0, 1);
  const pastDaysOfYear = (selectedDate.value - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
});

// ملاحظة: عند تغيير التاريخ، الـ Computed Data (الجدول) ستتغير تلقائياً 
// إذا كانت مرتبطة بـ API يرسل selectedDate.value كبارامتر.
</script>