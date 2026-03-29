<template>
  <GenericAdminLayout
    title="إدارة المساقات الدراسية"
    description="نظرة عامة على البرامج التعليمية المتاحة (مثاني ومعارج)"
    :columns="courseColumns"
    :showAddButton=true
    :data="allCourses"
    :show-actions="['edit', 'delete']"  
  @row-click="goToBatches"
  >
    <template #top-widgets>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
          <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl">📚</div>
          <div>
            <p class="text-[10px] text-gray-400 font-black uppercase mb-1">إجمالي المساقات</p>
            <p class="text-xl font-black text-gray-800">{{ allCourses.length }} مساق</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
          <div class="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl">📦</div>
          <div>
            <p class="text-[10px] text-gray-400 font-black uppercase mb-1">الدفعات النشطة</p>
            <p class="text-xl font-black text-gray-800">12 دفعة</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
          <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl">👥</div>
          <div>
            <p class="text-[10px] text-gray-400 font-black uppercase mb-1">المجموعات التعليمية</p>
            <p class="text-xl font-black text-gray-800">48 مجموعة</p>
          </div>
        </div>
      </div>
    </template>

    <template #cell-name="{ value }">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
          {{ value.substring(0, 1) }}
        </div>
        <span class="font-bold text-gray-800 underline decoration-blue-100 underline-offset-4">{{ value }}</span>
      </div>
    </template>
  </GenericAdminLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import GenericAdminLayout from '../admin/GenericAdminLayout.vue';

const router = useRouter();

const courseColumns = [
  { key: 'name', label: 'اسم المساق' },
  { key: 'code', label: 'الرمز الفني' },
  { key: 'totalBatches', label: 'عدد الدفعات' }
];

const allCourses = ref([
  { id: 'mathani', name: 'مساق مثاني', code: 'MTH-01', totalBatches: 7 },
  { id: 'maarej', name: 'مساق معارج', code: 'MRJ-02', totalBatches: 5 }
]);

const goToBatches = (course) => {
  // الانتقال لصفحة الدفعات مع تمرير اسم المساق للفلترة
  router.push({ 
    name: 'SupervisorBatches', 
    params: { courseId: course.id },
    query: { program: course.name } // نرسل الاسم للفلترة التلقائية
  });
};
</script>