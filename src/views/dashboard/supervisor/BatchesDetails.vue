<template>
  <GenericAdminLayout
    :title="`تفاصيل الدفعة: ${currentBatch?.name}`"
    :columns="groupColumns"
    :show-actions="['edit', 'delete']"

    :data="subGroups"
    @row-click="goToGroupDetails"
  >
    <template #top-widgets>
      <div class="bg-blue-600 p-8 rounded-[2.5rem] text-white mb-8 flex justify-between items-center shadow-xl">
        <div>
          <h2 class="text-3xl font-black mb-2">{{ currentBatch?.name }}</h2>
          <p class="opacity-80 font-bold">المشرف المسؤول: {{ currentBatch?.supervisor }}</p>
        </div>
        <button @click="$router.back()" class="bg-white/20 hover:bg-white/30 p-4 rounded-2xl transition-all">العودة للخلف</button>
      </div>
    </template>
  </GenericAdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import GenericAdminLayout from '../admin/GenericAdminLayout.vue';

const route = useRoute();
const router = useRouter();

const currentBatch = ref(null);
const subGroups = ref([]);

const groupColumns = [
  { key: 'name', label: 'اسم المجموعة' },
  { key: 'teacher', label: 'المعلم' }
];

onMounted(() => {
  const batchId = route.params.batchId;
  // جلب بيانات الدفعة والمجموعات التابعة لها من الـ Store بناءً على الـ ID
  // fetchBatchDetails(batchId);
  
  // بيانات تجريبية
  currentBatch.value = { name: 'الدفعة الأولى', supervisor: 'أ. أحمد' };
  subGroups.value = [
    { id: 501, name: 'مجموعة الفجر', teacher: 'أ. علي' },
    { id: 502, name: 'مجموعة النور', teacher: 'أ. عمر' }
  ];
});

const goToGroupDetails = (group) => {
  router.push({
    name: 'GroupDetails',
    params: { groupId: group.id },
    query: { ...route.query }
  });
};
</script>