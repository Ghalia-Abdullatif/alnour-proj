<template>
  <div class="p-4 sm:p-6 min-h-screen bg-[var(--color-layer)] text-right animate-fadeIn" dir="rtl">
    
    <div class="mb-6 bg-[var(--color-card)] p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div class="flex items-center gap-1.5 text-[11px] text-[var(--color-basicGrayh)] mb-0.5">
          <span class="cursor-pointer hover:text-[var(--color-primary)] transition-colors" @click="router.push({ name: 'GroupsList' })">المجموعات الدراسية</span>
          <i class="fas fa-chevron-left text-[8px]"></i>
          <span class="font-bold text-gray-700">إدارة الحلقات</span>
        </div>
        <h2 class="text-[var(--color-primary)] font-black text-xl flex items-center gap-2">
          <div class="w-2.5 h-6 bg-[var(--color-primary)] rounded-full"></div>
          {{ currentGroup?.name || 'لوحة التحكم في المجموعات' }}
        </h2>
      </div>

      <div class="flex items-center gap-3 bg-[var(--color-layer)] border border-amber-100/40 px-4 py-2 rounded-xl text-xs">
        <i class="fas fa-layer-group text-[var(--color-golden)] text-sm"></i>
        <div>
          <p class="text-gray-500 font-bold">الحلقات المتاحة</p>
          <p class="text-[var(--color-primary)] font-black mt-0.5 font-mono">{{ filteredGroups.length }} مجموعة</p>
        </div>
      </div>
    </div>

    <div class="mb-6 bg-[var(--color-card)] p-3 rounded-2xl border border-gray-100 shadow-xs">
      <p class="text-[11px] font-black text-[var(--color-basicGrayh)] mb-2.5 flex items-center gap-1">
        <i class="fas fa-filter text-[var(--color-golden)]"></i> تصفية المجموعات بحسب المساق الدراسي الحالي:
      </p>
      <div class="flex flex-wrap gap-1.5">
        <button 
          v-for="course in courses" 
          :key="course.id"
          @click="selectedCourseId = course.id"
          :class="[
            'px-4 py-2 rounded-xl text-xs font-black transition-all border',
            selectedCourseId === course.id 
              ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm' 
              : 'bg-[var(--color-layer)] text-gray-600 border-gray-200/60 hover:bg-gray-100'
          ]"
        >
          <i class="fas fa-book-reader ml-1.5 text-[10px]" :class="selectedCourseId === course.id ? 'text-[var(--color-golden)]' : 'text-gray-400'"></i>
          {{ course.name }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
      
      <div class="xl:col-span-2 space-y-4">
        <div v-if="currentGroup" class="space-y-4 animate-fadeIn">
          
          <div class="bg-[var(--color-card)] p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
            <div class="z-10">
              <span class="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                حلقة نشطة
              </span>
              <h3 class="text-lg font-black text-[var(--color-primary)] mt-2">{{ currentGroup.name }}</h3>
              <p class="text-xs text-gray-400 mt-1 font-medium">التحكم الإداري المباشر، تسكين الطالبات وإدارة سجلات الحلقات</p>
            </div>
            
            <div class="bg-[var(--color-layer)] text-right p-3.5 rounded-xl border border-gray-100 min-w-[190px] z-10 shadow-xs">
              <h4 class="text-[10px] font-black text-[var(--color-basicGrayh)] border-b border-gray-200/50 pb-1.5 mb-2 flex items-center gap-1">
                <i class="fas fa-sliders-h text-[var(--color-golden)]"></i> الإجراءات الإدارية
              </h4>
              
              <div v-if="isBatchSupervisor" class="space-y-1.5">
                <button @click="openEditGroupModal" class="w-full bg-[var(--color-golden)] hover:opacity-90 text-white text-[11px] font-black py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1 shadow-xs">
                  <i class="fas fa-edit text-[9px]"></i> تعديل السعة
                </button>
                <button @click="openAddStudentModal" class="w-full bg-[var(--color-primary)] hover:opacity-95 text-white text-[11px] font-black py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1 shadow-xs">
                  <i class="fas fa-user-plus text-[9px]"></i> تسكين طالبة
                </button>
                <button @click="handleDeleteGroup" class="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-black py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1">
                  <i class="fas fa-trash-alt text-[9px]"></i> حذف المجموعة
                </button>
              </div>
              
              <div v-else class="text-center py-2 text-[10px] text-gray-400 font-bold bg-white rounded-lg border border-dashed">
                <i class="fas fa-lock ml-1 text-[var(--color-golden)]"></i> الصلاحية لمشرفة الدفعة فقط
              </div>
            </div>
          </div>

          <div class="bg-[var(--color-card)] p-1 rounded-xl border border-gray-100 shadow-xs flex gap-1 overflow-x-auto">
            <button 
              v-for="tab in tabs" 
              :key="tab.value"
              @click="activeTab = tab.value"
              :class="[
                'px-5 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap',
                activeTab === tab.value 
                  ? 'bg-[var(--color-primary)] text-white shadow-sm' 
                  : 'text-gray-500 hover:text-[var(--color-primary)] hover:bg-gray-50'
              ]"
            >
              <i  :class="activeTab === tab.value ? 'text-[var(--color-golden)]' : 'text-gray-400'"></i>
              {{ tab.label }}
            </button>
          </div>

          <div v-if="activeTab === 'students'" class="bg-[var(--color-card)] rounded-2xl border border-gray-100 shadow-xs overflow-hidden animate-fadeIn">
            <div class="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h4 class="text-xs font-black text-[var(--color-primary)] flex items-center gap-1.5">
                <div class="w-2 h-4 bg-[var(--color-golden)] rounded-full"></div> كشف الطالبات المقيدات بالحلقة
              </h4>
              <span class="text-[11px] font-mono font-bold bg-amber-50 text-[var(--color-golden)] px-2.5 py-0.5 rounded-full border border-amber-100">
                العدد الحالي: {{ groupStore.groupStudents.length }} طالبة
              </span>
            </div>
            
            <div class="overflow-x-auto w-full custom-scrollbar">
              <table class="w-full text-right border-collapse text-xs">
                <thead>
                  <tr class="bg-gray-50 text-gray-500 font-black border-b border-gray-100">
                    <th class="p-3.5 w-16 text-center">#</th>
                    <th class="p-3.5">اسم الطالبة</th>
                    <th class="p-3.5 text-center">تاريخ التسكين بالحلقة</th>
                    <th class="p-3.5 text-center w-32">الإجراء الإداري</th>
                  </tr>
                </thead>
                <tbody v-if="groupStore.groupStudents.length === 0">
                  <tr>
                    <td colspan="4" class="p-12 text-center text-gray-400 font-bold bg-white">
                      لا يوجد طالبات مسكنات في هذه الحلقة التعليمية حالياً.
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr v-for="(assignment, index) in groupStore.groupStudents" :key="assignment.id" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td class="p-3.5 text-center text-gray-400 font-mono font-bold">#{{ index + 1 }}</td>
                    <td class="p-3.5">
                      <div class="flex items-center gap-2.5">
                        <div class="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-[10px]">
                          {{ assignment.student_name ? assignment.student_name.charAt(0) : 'ط' }}
                        </div>
                        <span class="font-bold text-[var(--color-primary)]">{{ assignment.student_name || `طالبة رقم #${assignment.student}` }}</span>
                      </div>
                    </td>
                    <td class="p-3.5 text-center text-gray-500 font-mono font-bold">{{ formatDate(assignment.joined_at) }}</td>
                    <td class="p-3.5 text-center">
                      <button 
                        v-if="isBatchSupervisor"
                        @click="confirmRemoveStudent(assignment)" 
                        class="border border-red-200 text-red-600 hover:bg-red-600 hover:text-white text-[10px] font-black px-3 py-1 rounded-lg transition-all"
                      >
                        إلغاء التسكين
                      </button>
                      <span v-else class="text-[10px] text-gray-400 font-bold"><i class="fas fa-lock text-[9px] ml-0.5"></i> مقيد</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-else class="bg-[var(--color-card)] p-12 rounded-2xl border border-dashed border-gray-200 text-center text-xs text-gray-400 font-bold animate-fadeIn">
            <i class="fas fa-folder-open text-2xl text-[var(--color-golden)] mb-2 block"></i>
            سيتم عرض دفاتر رصد [ {{ tabs.find(t => t.value === activeTab)?.label }} ] قريباً بالتكامل مع الـ API.
          </div>
        </div>
        
        <div v-else class="bg-[var(--color-card)] rounded-2xl border border-dashed border-gray-300 p-16 text-center text-gray-400 font-bold">
          <i class="fas fa-layer-group text-4xl text-[var(--color-golden)]/40 mb-3 block animate-pulse"></i>
          اضغطي على خيار "عرض التفاصيل الإدارية" لأي حلقة في القائمة الجانبية لإدارة سجلاتها وطالبتها.
        </div>
      </div>

      <div class="space-y-3">
        <h3 class="text-sm font-black text-[var(--color-primary)] flex items-center gap-2 px-1">
          <i class="fas fa-list-ul text-[var(--color-golden)]"></i> الحلقات والمجموعات المتاحة
        </h3>
        
        <div v-if="filteredGroups.length === 0" class="bg-[var(--color-card)] p-8 rounded-2xl text-center border border-gray-100 text-xs text-gray-400 font-bold">
          لا توجد مجموعات مسجلة أو متوافقة مع الصلاحيات والمساق المختار.
        </div>
        
        <div v-else class="space-y-3 max-h-[75vh] overflow-y-auto pr-1 pl-2 custom-scrollbar">
          <div 
            v-for="group in filteredGroups" 
            :key="group.id"
            :class="[
              'bg-[var(--color-card)] p-4 rounded-2xl border transition-all relative overflow-hidden group-card',
              groupId === group.id ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/10 shadow-xs' : 'border-gray-100 hover:shadow-md'
            ]"
          >
            <div class="flex justify-between items-start gap-2">
              <div>
                <h4 class="font-black text-sm text-[var(--color-primary)] group-hover:text-[var(--color-golden)] transition-colors">
                  {{ group.name }}
                </h4>
                <div class="mt-2.5 space-y-1 text-[11px] text-gray-500 font-medium">
                  <p class="text-gray-400"><span class="font-bold text-gray-600">الدفعة:</span> دفعة رقم {{ group.batch_name || group.batch }}</p>
                  <p><i class="fas fa-chalkboard-teacher ml-1 text-gray-400 text-[10px]"></i> <span class="font-bold">المعلمة المقرئة:</span> {{ group.teacher_name || 'لم تحدد بعد' }}</p>
                  <p><i class="fas fa-user-shield ml-1 text-gray-400 text-[10px]"></i> <span class="font-bold">مشرفة الحلقة:</span> {{ group.group_supervisor_name || 'لم يحدد بعد' }}</p>
                </div>
              </div>
              <div class="w-8 h-8 rounded-xl bg-amber-50/50 text-[var(--color-golden)] flex items-center justify-center text-xs"><i class="fas fa-users"></i></div>
            </div>

            <div class="mt-4 pt-2 border-t border-gray-50">
              <div class="flex justify-between text-[10px] text-gray-400 mb-1 font-bold">
                <span>امتلاء الحلقة التعليمية</span>
                <span class="text-[var(--color-primary)] font-mono">{{ group.num_students || 0 }}/{{ group.capacity || 15 }} طالبة</span>
              </div>
              <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-500"
                  :class="getProgressBarClass(group.num_students || 0, group.capacity || 15)"
                  :style="{ width: `${Math.min(((group.num_students || 0) / (group.capacity || 15)) * 100, 100)}%` }"
                ></div>
              </div>
            </div>

            <button 
              @click="loadGroupDetails(group.id)"
              class="w-full mt-3.5 bg-[var(--color-layer)] hover:bg-[var(--color-primary)] text-[var(--color-primary)] hover:text-white border border-gray-200/80 text-xs font-black py-2 rounded-xl transition-all text-center shadow-xs"
            >
              عرض التفاصيل الإدارية
            </button>
          </div>
        </div>
      </div>

    </div>

    <SelectionModal
      :is-open="isStudentModalOpen" 
      title="تسكين طالبة جديدة" 
      description="اختاري إحدى الطالبات المقيدات لإلحاقها وتسكينها بحلقة التحفيظ الحالية مباشرة" 
      :options="availableStudents"
      labelKey="fullName" 
      valueKey="id" 
      placeholder="ابحثي عن اسم الطالبة..." 
      confirmText="تأكيد التسكين في الحلقة" 
      :loading="isModalActionLoading" 
      @close="isStudentModalOpen = false" 
      @confirm="(e) => handleStudentAssignmentConfirm(e.selected)"
    />

    <div v-if="isEditGroupModalOpen" class="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
      <div class="bg-[var(--color-card)] rounded-2xl border border-gray-100 shadow-xl max-w-sm w-full overflow-hidden text-xs">
        <div class="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="font-black text-[var(--color-primary)]">تعديل السعة الاستيعابية للحلقة</h3>
          <button @click="isEditGroupModalOpen = false" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
        </div>
        <form @submit.prevent="submitGroupUpdate" class="p-4 space-y-3">
          <div class="space-y-1">
            <label class="font-bold text-gray-500 block">مسمى المجموعة التعليمية</label>
            <input v-model="editForm.name" type="text" required class="w-full border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[var(--color-primary)] text-right" />
          </div>
          <div class="space-y-1">
            <label class="font-bold text-gray-500 block">السعة الاستيعابية القصوى (عدد الطالبات)</label>
            <input v-model.number="editForm.capacity" type="number" required min="1" class="w-full border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[var(--color-primary)] text-right" />
          </div>
          <div class="pt-2 flex justify-end gap-2">
            <button type="button" @click="isEditGroupModalOpen = false" class="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 font-bold">إلغاء</button>
            <button type="submit" class="px-4 py-1.5 bg-[var(--color-primary)] text-white font-bold rounded-lg hover:opacity-90">حفظ التغييرات</button>
          </div>
        </form>
      </div>
    </div>

    <ConfirmModal :show="isConfirmOpen" :loading="isModalActionLoading" :title="confirmData.title" :message="confirmData.message" @confirm="executeConfirmedAction" @cancel="isConfirmOpen = false" />
    <SuccessToast :show="isToastVisible" :message="toastMsg" @close="isToastVisible = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGroupStore } from "@/stors/groups-store.js";
import { usePepoleStore } from "@/stors/pepole-store.js";
import { useAuthStore } from "@/stors/acount-store.js";

import SelectionModal from '@/components/GenericSelectModal.vue';
import ConfirmModal from '@/components/confirmAndSucces/ConfirmModal.vue';
import SuccessToast from '@/components/confirmAndSucces/SuccessToast.vue';

const route = useRoute();
const router = useRouter();
const groupStore = useGroupStore();
const accountStore = useAuthStore();
const pepoleStore = usePepoleStore();

const courses = ref([
  { id: 'all', name: 'كافة المساقات الدراسية' },
  { id: 1, name: 'مساق حفظ جزء عم وتبارك' },
  { id: 2, name: 'مساق التجويد النظري برواية حفص' },
  { id: 3, name: 'مساق الإجازة واللقاءات القرآنية' }
]);
const selectedCourseId = ref('all');

const tabs = ref([
  { label: 'بيانات الطالبة', value: 'students', icon: 'fas fa-graduation-cap' },
  { label: 'مجمع الطلاب', value: 'student_hub', icon: 'fas fa-users-class' },
  { label: 'بيانات الطلاب', value: 'student_info', icon: 'fas fa-folder' }
]);
const activeTab = ref('students');

const isLoading = ref(false);
const isModalActionLoading = ref(false);
const isStudentModalOpen = ref(false);
const isEditGroupModalOpen = ref(false);
const isConfirmOpen = ref(false);
const isToastVisible = ref(false);
const toastMsg = ref('');

const editForm = ref({ name: '', capacity: 15 });
const confirmData = ref({ title: '', message: '', actionType: '', payload: null });

const groupId = computed(() => {
  const id = route.params.groupId;
  return id ? Number(id) : null;
});

const currentGroup = computed(() => {
  if (!groupId.value) return null;
  return groupStore.groups.find(g => g.id === groupId.value);
});

const filteredGroups = computed(() => {
  let list = groupStore.groups || [];
  if (selectedCourseId.value !== 'all') {
    return list.filter(g => g.course_id === selectedCourseId.value || g.course === selectedCourseId.value);
  }
  return list;
});

const isBatchSupervisor = computed(() => {
  const user = accountStore.user || {};
  const role = accountStore.userRole || user.role || '';
  return role === 'batch_supervisor' || role === 'batch_manager' || user.is_superuser === true;
});

const availableStudents = computed(() => {
  const allPeeps = pepoleStore.getUsersWithRoles || [];
  return allPeeps
    .filter(p => p.accountDetails?.roles?.some(r => r.code === 'student'))
    .filter(p => !groupStore.groupStudents.some(s => s.student === p.id))
    .map(p => ({ id: p.id, fullName: p.fullName }));
});

onMounted(async () => {
  isLoading.value = true;
  try {
    if (groupStore.groups.length === 0) {
      await groupStore.getAllGroups();
    }
    if (groupId.value && !isNaN(groupId.value)) {
      await groupStore.fetchStudentsByGroup(groupId.value);
    }
    if (pepoleStore.getUsersWithRoles.length === 0) {
      await pepoleStore.getPeopleStoreData();
    }
  } catch (err) {
    showToast("حدث خطأ أثناء تحميل بيانات المقرأة");
  } finally {
    isLoading.value = false;
  }
});

const loadGroupDetails = async (id) => {
  router.push({ name: route.name, params: { groupId: id } });
  await groupStore.fetchStudentsByGroup(id);
};

const openAddStudentModal = () => {
  isStudentModalOpen.value = true;
};

const handleStudentAssignmentConfirm = async (studentId) => {
  isModalActionLoading.value = true;
  const res = await groupStore.addStudentToGroup({ group: groupId.value, student: studentId });
  if (res.success) {
    showToast("تم تسكين الطالبة بالحلقة بنجاح");
    isStudentModalOpen.value = false;
    if (currentGroup.value) currentGroup.value.num_students++;
  } else {
    showToast(res.message || "فشلت عملية التسكين");
  }
  isModalActionLoading.value = false;
};

const confirmRemoveStudent = (assignment) => {
  confirmData.value = {
    title: 'إلغاء تسكين طالبة',
    message: `هل أنتِ متأكدة من إخراج وإلغاء تسكين الطالبة (${assignment.student_name}) من كشف هذه الحلقة؟`,
    actionType: 'REMOVE_STUDENT',
    payload: assignment.id
  };
  isConfirmOpen.value = true;
};

const openEditGroupModal = () => {
  if (!currentGroup.value) return;
  editForm.value.name = currentGroup.value.name;
  editForm.value.capacity = currentGroup.value.capacity;
  isEditGroupModalOpen.value = true;
};

const submitGroupUpdate = async () => {
  const res = await groupStore.updateGroup(groupId.value, editForm.value);
  if (res.success) {
    showToast("تم تحديث سعة ومسمى الحلقة");
    isEditGroupModalOpen.value = false;
  } else {
    showToast(res.message || "فشلت عملية التعديل");
  }
};

const handleDeleteGroup = () => {
  confirmData.value = {
    title: 'حذف المجموعة التعليمية',
    message: `تحذير: هل أنتِ متأكدة من حذف حلقة (${currentGroup.value?.name}) بشكل نهائي من قاعدة البيانات؟`,
    actionType: 'DELETE_GROUP',
    payload: groupId.value
  };
  isConfirmOpen.value = true;
};

const executeConfirmedAction = async () => {
  isModalActionLoading.value = true;
  const { actionType, payload } = confirmData.value;

  if (actionType === 'REMOVE_STUDENT') {
    const res = await groupStore.removeStudentFromGroup(payload);
    if (res.success) {
      showToast("تم إلغاء التسكين بنجاح");
      if (currentGroup.value && currentGroup.value.num_students > 0) currentGroup.value.num_students--;
    }
  } else if (actionType === 'DELETE_GROUP') {
    const res = await groupStore.deleteGroup(payload);
    if (res.success) {
      isConfirmOpen.value = false;
      router.push({ name: 'GroupsList' });
      return;
    }
  }
  isConfirmOpen.value = false;
  isModalActionLoading.value = false;
};

const getProgressBarClass = (current, max) => {
  const percentage = (current / max) * 100;
  if (percentage >= 100) return 'bg-red-500';
  if (percentage >= 80) return 'bg-amber-500';
  return 'bg-[var(--color-primary)]';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ar-SA');
};

const showToast = (msg) => {
  toastMsg.value = msg;
  isToastVisible.value = true;
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: var(--color-golden); border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background-color: transparent; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
</style>