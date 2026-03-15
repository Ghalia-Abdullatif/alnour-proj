<template>
  <GenericAdminLayout
    title="إدارة الدفعات"
    :columns="batchColumns"
    :data="filteredBatches"
    :filterTabs="programTabs"
    :activeTab="activeProgram"
    :show-actions="['edit', 'delete']"
    @tab-change="handleTabChange"
    @row-click="goToBatchDetails"
  >
    <template #top-widgets>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl">📊</div>
          <div>
            <p class="text-[10px] text-gray-400 font-black uppercase">إجمالي الدفعات</p>
            <p class="text-xl font-black text-gray-800">{{ filteredBatches.length }}</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl">👥</div>
          <div>
            <p class="text-[10px] text-gray-400 font-black uppercase">مشرفي الدفعات</p>
            <p class="text-xl font-black text-gray-800">{{ uniqueSupervisors }}</p>
          </div>
        </div>
      </div>
    </template>
  </GenericAdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import GenericAdminLayout from '../admin/GenericAdminLayout.vue';
// نفترض استيراد البيانات من ملف خارجي أو Store
// import { useBatchStore } from '@/stores/batchStore'; 

const route = useRoute();
const router = useRouter();

// الحالة الافتراضية هي 'all' (الكل) تلقائياً
const activeProgram = ref('all');

const programTabs = [
  { label: 'الكل', value: 'all' },
  { label: 'مثاني', value: 'مثاني' },
  { label: 'معارج', value: 'معارج' }
];

const batchColumns = [
  { key: 'name', label: 'الدفعة' },
  { key: 'supervisor', label: 'المشرف' },
  { key: 'program', label: 'المساق' }
];

// بيانات منفصلة تماماً
const allBatches = ref([
  { id: 101, name: 'الدفعة الأولى', program: 'مثاني', supervisor: 'أ. أحمد', studentsCount: 45 },
  { id: 102, name: 'الدفعة الثانية', program: 'معارج', supervisor: 'أ. سارة', studentsCount: 30 }
]);

onMounted(() => {
  // التحقق مما إذا كان هناك برنامج محدد في الرابط، وإلا تظل 'all'
  if (route.query.program) {
    activeProgram.value = route.query.program;
  }
});

const filteredBatches = computed(() => {
  if (activeProgram.value === 'all') return allBatches.value;
  return allBatches.value.filter(b => b.program === activeProgram.value);
});

const uniqueSupervisors = computed(() => 
  new Set(filteredBatches.value.map(b => b.supervisor)).size
);

const handleTabChange = (val) => {
  activeProgram.value = val;
  // تحديث الرابط ليعكس الفلترة الحالية
  router.replace({ query: { ...route.query, program: val } });
};

// الانتقال لصفحة التفاصيل المنفصلة
const goToBatchDetails = (batch) => {
  router.push({
    name: 'BatchDetails', // تأكدي من تسمية المسار في الراوتر
    params: { batchId: batch.id },
    query: { program: activeProgram.value }
  });
};
</script>