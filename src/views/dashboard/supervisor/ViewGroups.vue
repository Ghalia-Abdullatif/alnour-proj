<template>
  <GenericAdminLayout
    :title="`مجموعة: ${groupData?.name || ''}`"
    :columns="studentColumns"
    :data="groupData?.students || []"
    :show-actions="['edit', 'delete']"
  >
    <template #top-widgets>
      <div class="flex flex-col gap-6 mb-8">
        <div class="flex items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <button @click="$router.back()" class="w-12 h-12 bg-gray-50 hover:bg-blue-600 hover:text-white rounded-2xl transition-all flex items-center justify-center text-xl">→</button>
          <div>
            <h2 class="text-2xl font-black text-gray-800">{{ groupData?.name }}</h2>
            <p class="text-blue-600 font-bold text-xs uppercase">برنامج {{ groupData?.program }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
          <div v-for="card in infoCards" :key="card.label" class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p class="text-[10px] text-gray-400 font-black mb-1 uppercase">{{ card.label }}</p>
            <p class="text-lg font-black text-gray-800">{{ card.value }}</p>
          </div>
        </div>
      </div>
    </template>
  </GenericAdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import GenericAdminLayout from '../admin/GenericAdminLayout.vue';

const route = useRoute();
const groupData = ref(null);

const studentColumns = [
  { key: 'id', label: 'المعرف' },
  { key: 'name', label: 'اسم الطالب' },
  { key: 'status', label: 'الحالة' }
];

const infoCards = computed(() => [
  { label: 'المعلم المسؤول', value: groupData.value?.teacher || '...' },
  { label: 'مشرف المجموعة', value: groupData.value?.supervisor || '...' },
  { label: 'عدد الطلاب', value: `${groupData.value?.students?.length || 0} طالب` }
]);

onMounted(() => {
  const groupId = route.params.groupId;
  // هنا يتم جلب بيانات المجموعة والطلاب من الـ Store بناءً على الـ ID
  // fetchGroupDetails(groupId);

  // بيانات تجريبية (تستبدل لاحقاً ببيانات الـ Store)
  groupData.value = {
    id: groupId,
    name: 'مجموعة الفجر',
    program: 'مثاني',
    teacher: 'أ. علي الحسن',
    supervisor: 'أ. عمر فاروق',
    students: [
      { id: '1001', name: 'أحمد محمد صالح', status: 'منتظم' },
      { id: '1002', name: 'ياسر القحطاني', status: 'منتظم' }
    ]
  };
});
</script>