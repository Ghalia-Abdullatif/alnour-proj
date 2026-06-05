<template>
  <div class="p-4 sm:p-6 min-h-screen bg-gray-50/40 text-right" dir="rtl">
    
    <div class="mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-primary font-black text-2xl flex items-center gap-2">
          <i class="fas fa-users text-primary/80"></i>
          المجموعات التعليمية (الحلقات)
        </h2>
        <p class="text-basicGray text-sm mt-1">
          تنظيم الطالبات، توزيع المعلمات والمشرفات، ومتابعة الطاقة الاستيعابية لكل حلقة.
        </p>
      </div>
      
      <div v-if="canManage">
        <button @click="openCreateModal" class="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-sm transition-all duration-200 flex items-center gap-2">
          <i class="fas fa-plus text-[10px]"></i>
          إضافة مجموعة جديدة
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-primary"></div>
      <p class="text-basicBlack font-bold mt-4 text-sm">جاري تحميل المجموعات الدراسية...</p>
    </div>

    <div v-else-if="errorMessage" class="text-center py-12 bg-white border border-gray-100 rounded-2xl max-w-md mx-auto shadow-sm p-6">
      <div class="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h4 class="text-basicBlack font-bold text-base mb-1">فشل تحميل البيانات</h4>
      <p class="text-red-600 text-xs px-4 mb-4">{{ errorMessage }}</p>
      <button @click="fetchGroups" class="btn-primary !py-2 !px-5 text-xs shadow-sm flex items-center gap-2 mx-auto">
        <i class="fas fa-sync-alt text-[10px]"></i>
        إعادة المحاولة
      </button>
    </div>

    <div v-else-if="groupsList.length === 0" class="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-xl mx-auto p-8">
      <div class="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-users-slash text-2xl"></i>
      </div>
      <h3 class="text-basicBlack font-bold text-base mb-1">لا توجد مجموعات مضافة</h3>
      <p class="text-basicGray text-sm">لم يتم إنشاء أي مجموعات أو حلقات تعليمية تابعة لهذه الدفعة حتى الآن.</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div 
          v-for="group in groupsList" 
          :key="group.id" 
          class="bg-white rounded-2xl border border-gray-100 hover:border-primary/20 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <div class="p-6 space-y-5">
            
            <div class="flex justify-between items-start gap-4 border-b border-gray-50 pb-3">
              <div>
                <h3 class="font-black text-basicBlack text-lg leading-snug flex items-center gap-2">
                  <span class="w-2.5 h-2.5 bg-purple-600 rounded-full"></span>
                  {{ group.name }}
                </h3>
                <span class="text-[10px] text-basicGray block mt-0.5">
                  الدفعة المرجعية: <strong class="text-gray-600">{{ group.batch_name || 'الدفعة الحالية' }}</strong>
                </span>
              </div>

              <div v-if="canManage" class="flex items-center gap-1">
                <button @click="editGroup(group)" class="p-1.5 text-gray-400 hover:text-primary transition-colors text-xs" title="تعديل">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="confirmDelete(group.id)" class="p-1.5 text-gray-400 hover:text-red-500 transition-colors text-xs" title="حذف">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center gap-3 bg-gray-50/50 p-2.5 rounded-xl border border-gray-50 text-xs">
                <div class="w-7 h-7 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-xs shrink-0">
                  <i class="fas fa-chalkboard-teacher"></i>
                </div>
                <div>
                  <p class="text-[9px] text-gray-400 font-medium">المعلمة المقرئة</p>
                  <p class="font-bold text-basicBlack">{{ group.teacher_name || 'لم تحدد بعد' }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 bg-gray-50/50 p-2.5 rounded-xl border border-gray-50 text-xs">
                <div class="w-7 h-7 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center text-xs shrink-0">
                  <i class="fas fa-user-shield"></i>
                </div>
                <div>
                  <p class="text-[9px] text-gray-400 font-medium">مشرف الحلقة الإداري</p>
                  <p class="font-bold text-basicBlack">{{ group.group_supervisor_name || 'لم يحدد بعد' }}</p>
                </div>
              </div>
            </div>

            <div class="space-y-1.5 pt-2">
              <div class="flex justify-between items-center text-[11px]">
                <span class="text-basicGray font-medium">مؤشر الامتلاء والتسكين</span>
                <span class="font-bold text-basicBlack">
                  {{ group.num_students }} من {{ group.capacity }} طالبة
                </span>
              </div>
              <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-500"
                  :class="getProgressBarClass(group.num_students, group.capacity)"
                  :style="{ width: `${Math.min((group.num_students / group.capacity) * 100, 100)}%` }"
                ></div>
              </div>
            </div>

          </div>

          <div class="px-6 pb-6 pt-0 mt-auto">
            <button 
              @click="viewGroupStudents(group.id)" 
              class="w-full bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white font-bold py-2.5 rounded-xl text-xs transition-all duration-200 flex items-center justify-center gap-1.5 group border border-purple-100/50"
            >
              <span>عرض سجل قائمة طالبات الحلقة</span>
              <i class="fas fa-arrow-left text-[10px] group-hover:-translate-x-1 transition-transform"></i>
            </button>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGroupStore } from "@/stors/groups-store.js";
// افترضي وجود استور الصلاحيات لقراءة دور المستخدم الحالي، عدلي المسار حسب مشروعك
import { useAuthStore } from "@/stors/auth-store.js"; 

const route = useRoute();
const router = useRouter();
const groupStore = useGroupStore();
const authStore = useAuthStore();

// التقاط المعامِل الديناميكي للدفعة في حال الانتقال من صفحة الدفعات
const batchId = computed(() => route.params.batchId);

// ربط تفاعلي مباشر مع الـ Store للمجموعات
const groupsList = computed(() => groupStore.groups || []);
const isLoading = computed(() => groupStore.loading);
const errorMessage = computed(() => groupStore.error);

/**
 * فحص الصلاحيات (Role Checking)
 * التعديل والإضافة محصور فقط بالـ (الأدمن + مشرف الدفعة)
 */
const canManage = computed(() => {
  const role = authStore.userRole; // القيمة المتوقعة مثلاً: 'admin', 'batch_supervisor', 'teacher'
  return role === 'admin' || role === 'batch_supervisor';
});

// دالة جلب البيانات الذكية (تفلتر حسب الدفعة إن وجدت)
const fetchGroups = async () => {
  if (batchId.value) {
    await groupStore.getGroupsByBatch(batchId.value);
  } else {
    await groupStore.getAllGroups();
  }
};

onMounted(() => {
  fetchGroups();
});

/**
 * حساب لون شريط التقدم للامتلاء بناءً على الكثافة الحالية لقاعة الطالبات
 */
const getProgressBarClass = (current, max) => {
  const percentage = (current / max) * 100;
  if (percentage >= 100) return 'bg-red-500'; // ممتلئة تماماً
  if (percentage >= 80) return 'bg-amber-500'; // اقتربت من الامتلاء
  return 'bg-purple-600'; // وضع آمن وممتاز باللون البنفسجي
};

// دوال توجيهية للأحداث
const viewGroupStudents = (groupId) => {
  router.push({ name: 'GroupStudentsList', params: { groupId: String(groupId) } });
};

const openCreateModal = () => {
  console.log("فتح مودال إضافة مجموعة جديدة");
};

const editGroup = (group) => {
  console.log("تعديل بيانات المجموعة", group);
};

const confirmDelete = async (groupId) => {
  if (confirm("هل أنتِ متأكدة من حذف هذه المجموعة نهائياً؟")) {
    await groupStore.deleteGroup(groupId);
  }
};
</script>