<template>
  <div class="p-4 sm:p-6">
    <div class="mb-6 sm:mb-8 text-right">
      <h2 class="text-primary font-bold text-xl sm:text-2xl">المساقات الدراسية</h2>
      <p class="text-basicGray text-sm sm:text-base">اختاري المساق لعرض الدفعات التابعة له</p>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p class="text-basicGray mt-4 text-sm">جاري تحميل المساقات الدراسية...</p>
    </div>

    <div v-else-if="errorMessage" class="text-center py-8 bg-red-50 border border-red-100 rounded-lg max-w-md mx-auto">
      <p class="text-red-600 font-bold text-sm px-4">{{ errorMessage }}</p>
      <button @click="fetchCourses" class="btn-primary !py-1.5 !px-4 text-xs mt-3">
        إعادة المحاولة
      </button>
    </div>

    <div v-else-if="coursesList.length === 0" class="text-center py-12 custom-card shadow-sm">
      <p class="text-basicGray text-sm">لا توجد مساقات دراسية مضافة في النظام حالياً.</p>
    </div>

    <div v-else>
      <div class="block md:hidden space-y-4">
        <div v-for="course in coursesList" :key="course.id" 
             class="custom-card shadow-sm border border-gray-100 p-4 rounded-lg bg-white text-right space-y-3">
          <div class="flex justify-between items-center border-b border-gray-50 pb-2">
            <span class="font-bold text-basicBlack text-base">{{ course.name }}</span>
            <span class="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-basicGray">
              {{ course.code || '—' }}
            </span>
          </div>
          <div class="flex justify-between items-center text-xs text-basicGray">
            <span>تاريخ الإنشاء:</span>
            <span>{{ course.formattedDate }}</span>
          </div>
          <div class="pt-1">
            <button @click="goToBatches(course.id)" class="btn-primary w-full !py-2 text-xs shadow-sm">
              عرض الدفعات
            </button>
          </div>
        </div>
      </div>

      <div class="hidden md:block custom-card shadow-sm border border-gray-100 overflow-x-auto">
        <table class="w-full text-right border-collapse">
          <thead>
            <tr class="text-basicGray border-b border-gray-100">
              <th class="pb-4 px-4 whitespace-nowrap">اسم المساق</th>
              <th class="pb-4 px-4 whitespace-nowrap">الرمز الفني</th>
              <th class="pb-4 px-4 whitespace-nowrap">تاريخ الإنشاء</th>
              <th class="pb-4 px-4 whitespace-nowrap">الإجراء</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in coursesList" :key="course.id" 
                class="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
              <td class="py-4 px-4 font-bold text-basicBlack">{{ course.name }}</td>
              <td class="py-4 px-4 text-basicGray">
                <span class="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                  {{ course.code || '—' }}
                </span>
              </td>
              <td class="py-4 px-4 text-basicGray text-sm whitespace-nowrap">{{ course.formattedDate }}</td>
              <td class="py-4 px-4 whitespace-nowrap">
                <button @click="goToBatches(course.id)" class="btn-primary !py-1 !px-3 text-xs shadow-sm">
                  عرض الدفعات
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
// استيراد الـ Store الخاص بالبرامج
import { useProgramStore } from "@/stors/program-stor.js"; 

const router = useRouter();
const programStore = useProgramStore();

// استخدام الـ Getters والـ State التفاعلية من الـ Store
const coursesList = computed(() => programStore.getProgramsList);
const isLoading = computed(() => programStore.loading);
const errorMessage = computed(() => programStore.error);

// دالة جلب البيانات من السيرفر
const fetchCourses = async () => {
  await programStore.getAllPrograms();
};

// جلب البيانات فور تحميل المكون (Component) في المتصفح
onMounted(() => {
  fetchCourses();
});

// الانتقال لصفحة الدفعات ممررين الـ ID الخاص بالبرنامج من قاعدة البيانات
const goToBatches = (courseId) => {
  router.push({ 
    name: 'SupervisorBatches', 
    params: { courseId: courseId } 
  });
};
</script>