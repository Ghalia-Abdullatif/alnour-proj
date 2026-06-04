<template>
  <div class="view-batches-wrapper">
    
    <GenericAdminLayout
      title="إدارة الدفعات التعليمية"
      description="متابعة وتنظيم الدفعات والمجموعات داخل المقرأة وتصفيتها حسب المساقات الحالية"
      :columns="batchColumns"
      :showAddButton="isAdmin ? 'إضافة دفعة جديدة' : false"
      @add-new="openAddModal"
      :data="filteredAndSearchedBatches"
      :filterTabs="programTabs"
      :activeTab="currentProgramTab"
      v-model:searchQuery="searchQuery"
      @tab-change="handleProgramTabChange"
    >

      <template #table="{ data }">
        <div v-if="isLoading || isPeopleLoading || programStore.loading" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm w-full col-span-full">
          <div class="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-[var(--color-primary)]"></div>
          <p class="text-basicGray text-sm mt-4 font-bold">جاري مزامنة مخازن الدفعات والمساقات من خادم النظام ...</p>
        </div>

        <div v-else-if="!data || data.length === 0" class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 w-full col-span-full">
          <i class="fas fa-folder-open text-gray-300 text-4xl mb-3"></i>
          <p class="text-basicGray text-sm font-medium">لا توجد دفعات تعليمية مطابقة لصلاحياتك أو شروط الفلترة الحالية.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full col-span-full">
          <div v-for="batch in data" :key="batch.id" class="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm border-t-4 border-t-[var(--color-primary)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div>
              <div class="flex justify-between items-start gap-2 mb-3">
                <h3 class="text-base font-black text-gray-800 line-clamp-1">
                  مساق {{ batch.program_name || getProgramNameFromStore(batch.program) }}
                </h3>
                <span class="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-xl text-xs font-mono font-black border border-amber-100/50">
                  ID: {{ batch.id }}
                </span>
              </div>
              
              <div class="space-y-3 border-t border-b border-gray-50 py-4 my-4 text-xs text-gray-500">
                <div class="flex justify-between items-center">
                  <span class="text-gray-400 font-medium"><i class="fas fa-user-shield ml-1.5 text-xs text-gray-400"></i> المشرفة المسؤولة:</span>
                  <span class="font-black text-gray-700">{{ getSupervisorName(batch.batch_supervisor) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-400 font-medium"><i class="fas fa-layer-group ml-1.5 text-xs text-gray-400"></i> المستوى الدراسي:</span>
                  <span class="font-bold bg-gray-50 px-2.5 py-1 rounded-xl text-gray-600 border border-gray-100">
                    {{ getLevelNameFromStore(batch.current_level) }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-400 font-medium"><i class="fas fa-circle-notch ml-1.5 text-xs text-gray-400"></i> الحلقات المستهدفة:</span>
                  <span class="font-bold text-gray-700">{{ batch.num_group || 0 }} حلقة</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-400 font-medium"><i class="fas fa-toggle-on ml-1.5 text-xs text-gray-400"></i> حالة الدفعة:</span>
                  <span class="px-3 py-1 rounded-full text-[11px] font-black" :class="Number(batch.status) === 1 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-gray-50 text-gray-600 border border-gray-100'">
                    {{ batch.status_name || 'نشطة' }}
                  </span>
                </div>
                
                <div class="flex justify-between text-[11px] text-gray-400 pt-2 border-t border-dashed border-gray-100 font-medium" dir="rtl">
                  <span>البدء: {{ batch.formattedStartDate || 'غير محدد' }}</span>
                  <span>الانتهاء: {{ batch.formattedEndDate || 'غير محدد' }}</span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 pt-2">
              <button @click="viewBatchDetails(batch.id)" class="col-span-2 text-xs bg-[var(--color-primary-light)] text-[var(--color-primary)] py-3 rounded-xl font-black flex items-center justify-center gap-1.5 transition-all hover:opacity-90">
                <i class="fas fa-eye text-[11px]"></i> عرض الحلقات التابعة
              </button>
              <div class="flex gap-1.5" v-if="isAdmin">
                <button @click="openEditModal(batch)" class="flex-1 text-xs bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors" title="تعديل الدفعة"><i class="fas fa-edit"></i></button>
                <button @click="openDeleteConfirm(batch)" class="flex-1 text-xs bg-red-50 text-[var(--color-flag-red)] rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors" title="حذف الدفعة"><i class="fas fa-trash-alt"></i></button>
              </div>
            </div>
          </div>
        </div>

        <ConfirmModal 
          :show="isConfirmOpen"
          :loading="isConfirmLoading"
          :title="confirmData.title"
          :message="confirmData.message"
          @confirm="executeAction"
          @cancel="isConfirmOpen = false"
        />

        <SuccessToast 
          :show="isToastVisible"
          :message="toastMsg"
          @close="isToastVisible = false"
        />
      </template>
    </GenericAdminLayout>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4 text-right" dir="rtl">
      <div class="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-gray-50 overflow-hidden p-6 space-y-4">
        <div class="flex justify-between items-center border-b border-gray-50 pb-3">
          <h3 class="text-base font-black text-[var(--color-primary)]">
            {{ isEditMode ? 'تعديل بيانات الدفعة' : 'إنشاء دفعة تعليمية جديدة' }}
          </h3>
          <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-sm"></i></button>
        </div>
        
        <p v-if="modalValidationError" class="bg-rose-50 p-3 rounded-xl border border-rose-100 font-bold text-xs text-[var(--color-flag-red)] flex items-center gap-2">
          <i class="fas fa-info-circle"></i> {{ modalValidationError }}
        </p>

        <div class="grid grid-cols-1 gap-3">
          <div class="space-y-1">
            <label class="text-xs font-black text-gray-500">المساق الدراسي التابع له *</label>
            <select v-model="formData.program" class="w-full p-2.5 border border-gray-200 rounded-xl outline-none text-sm font-bold focus:border-amber-700 transition-all">
              <option :value="null" disabled>اختر المساق الدراسي...</option>
              <option v-for="prog in programStore.programs" :key="prog.id" :value="Number(prog.id)">{{ prog.name }}</option>
            </select>
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-black text-gray-500">مشرفة الدفعة المسؤولة *</label>
          <select v-model="formData.batch_supervisor" class="w-full p-2.5 border border-gray-200 rounded-xl outline-none text-sm font-bold focus:border-amber-700 transition-all">
            <option :value="null" disabled>اختر المشرفة من النظام...</option>
            <option v-for="superv in systemSupervisors" :key="superv.id" :value="Number(superv.accountDetails?.id || superv.id)">{{ superv.fullName }}</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-xs font-black text-gray-500">تاريخ البدء *</label>
            <input v-model="formData.start_date" type="date" class="w-full p-2.5 border border-gray-200 rounded-xl outline-none text-sm font-bold focus:border-amber-700 transition-all">
          </div>
          <div class="space-y-1">
            <label class="text-xs font-black text-gray-500">تاريخ الانتهاء *</label>
            <input v-model="formData.end_date" type="date" class="w-full p-2.5 border border-gray-200 rounded-xl outline-none text-sm font-bold focus:border-amber-700 transition-all">
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-xs font-black text-gray-500">المستوى الحالي للدفعة *</label>
            <select v-model="formData.current_level" class="w-full p-2.5 border border-gray-200 rounded-xl outline-none text-sm font-bold focus:border-amber-700 transition-all">
              <option :value="null" disabled>اختر المستوى الدراسي...</option>
              <option v-for="lvl in programStore.levels" :key="lvl.id" :value="lvl.id">
                {{ lvl.name || lvl.title || `المستوى ${lvl.id}` }}
              </option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-black text-gray-500">حالة الدفعة *</label>
            <select v-model="formData.status" class="w-full p-2.5 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-amber-700 transition-all">
              <option :value="null" disabled>حدد الحالة...</option>
              <option v-for="st in statusOptions" :key="st.id" :value="Number(st.id)">{{ st.name }}</option>
            </select>
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-black text-gray-500">عدد الحلقات المستهدفة *</label>
          <input v-model.number="formData.num_group" type="number" min="1" class="w-full p-2.5 border border-gray-200 rounded-xl outline-none text-sm font-bold focus:border-amber-700 transition-all">
        </div>

        <div class="flex gap-3 pt-3 border-t border-gray-50">
          <button @click="isModalOpen = false" class="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-black text-gray-500 hover:bg-gray-50 flex-1">إلغاء</button>
          <button @click="submitForm" class="px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-black hover:opacity-90 shadow-sm flex-1">حفظ الدفعة</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router' 
import GenericAdminLayout from '@/views/dashboard/admin/GenericAdminLayout.vue';
import { useBatchStore } from '@/stors/batch-store.js'
import { usePepoleStore } from '@/stors/pepole-store.js'
import { useProgramStore } from "@/stors/program-stor.js"; 
import { useAuthStore } from "@/stors/acount-store.js"; 

import ConfirmModal from '@/components/confirmAndSucces/ConfirmModal.vue'; 
import SuccessToast from '@/components/confirmAndSucces/SuccessToast.vue';

const props = defineProps({
  courseId: { type: String, default: null }
})

const router = useRouter()
const route = useRoute() 
const batchStore = useBatchStore()
const pepoleStore = usePepoleStore()
const programStore = useProgramStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const filterStatus = ref('')

// تأمين تبويب المساق الحالي بشكل ديناميكي مرن ومبدئي على 'all'
const currentProgramTab = ref('all')

const isModalOpen = ref(false)
const isEditMode = ref(false)
const modalValidationError = ref('')
const selectedBatchId = ref(null)
const isPeopleLoading = ref(false)
const isConfirmLoading = ref(false)
const isConfirmOpen = ref(false)
const isToastVisible = ref(false)
const toastMsg = ref('')

// مراقبة ديناميكية للرابط وجلب معرّف المساق الفعلي المختار
const currentCourseId = computed(() => {
  return route.params.courseId || props.courseId || null
})

watch(currentCourseId, (newId) => {
  // إذا كان الرابط لا يحتوي على معرّف رقمي مخصص (مثل حالة الدخول الافتراضية لمدير النظام)، يفتح تبويب الكل فوراً
  if (newId && newId !== 'batches' && newId !== 'courses') {
    currentProgramTab.value = String(newId)
  } else {
    currentProgramTab.value = 'all'
  }
}, { immediate: true })

// 💡 تعديل حوكمة الصلاحيات: المطابقة الدقيقة لـ super_admin القادمة من الستور
const isAdmin = computed(() => {
  const roleId = authStore.getCurrentRole?.id || '';
  const roleCode = authStore.getCurrentRole?.code || '';
  return roleId === 'super_admin' || roleId === 'admin' || roleCode === 'super-admin' || roleCode === 'admin';
})

// معرّف الحساب الحالي لتصفية دفعات المشرفين
const currentUserId = computed(() => authStore.userId || authStore.user?.id || null);

const formData = ref({
  program: null,
  batch_supervisor: null,
  start_date: '',
  end_date: '',
  current_level: null,
  num_group: 15, 
  status: null        
})

const confirmData = ref({ title: '', message: '', id: null })

const isLoading = computed(() => batchStore.loading)
const batchColumns = [{ label: 'بيانات الدفعة', key: 'program_name' }]

// بناء التبويبات العلوية بشكل سليم من الستور
const programTabs = computed(() => {
  const tabs = [{ label: 'الكل', value: 'all' }]
  if (programStore.programs && programStore.programs.length > 0) {
    programStore.programs.forEach(prog => {
      tabs.push({ label: prog.name, value: String(prog.id) })
    })
  }
  return tabs
})

const statusOptions = computed(() => batchStore.getStatusOptions || [])

const systemSupervisors = computed(() => {
  const allUsersWithRoles = pepoleStore.getUsersWithRoles || []
  return allUsersWithRoles.filter(user => {
    const roles = user?.accountDetails?.roles || []
    return roles.some(role => role?.code === 'batch_supervisor' || role?.roleId === 2)
  })
})

// 💡 دالة الفلترة الفولاذية والمحسنة لضمان عرض الدفعات الـ 5 بناءً على صلاحياتك كـ super_admin
const filteredAndSearchedBatches = computed(() => {
  let list = batchStore.getProcessedBatches || []

  // 1. حوكمة الصلاحيات: إذا لم يكن أدمن أو مدير نظام، يرى فقط الدفعات التابعة له كمشرف
  if (!isAdmin.value && currentUserId.value) {
    const allUsersWithRoles = pepoleStore.getUsersWithRoles || []
    const currentSupervisorObj = allUsersWithRoles.find(s => 
      Number(s?.id) === Number(currentUserId.value) || 
      Number(s?.accountDetails?.id) === Number(currentUserId.value)
    )

    const allowedUserIds = [
      Number(currentUserId.value),
      Number(currentSupervisorObj?.id || 0),
      Number(currentSupervisorObj?.accountDetails?.id || 0)
    ]

    list = list.filter(b => b.batch_supervisor && allowedUserIds.includes(Number(b.batch_supervisor)))
  }

  // 2. الفلترة حسب التبويبات الذكية (Tabs): تدعم الفرز بـ ID المساق أو باسمه النصي (معارج / مثاني) لمنع السقوط
  if (currentProgramTab.value && currentProgramTab.value !== 'all' && currentProgramTab.value !== 'batches') {
    const tabVal = String(currentProgramTab.value).trim().toLowerCase()
    
    list = list.filter(b => {
      const programId = b.program ? String(b.program).trim().toLowerCase() : ''
      const programName = b.program_name ? String(b.program_name).trim().toLowerCase() : ''
      return programId === tabVal || programName === tabVal
    })
  }

  // 3. الفلترة بحقل البحث
  if (searchQuery.value && searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    list = list.filter(b => {
      const name = b?.program_name || getProgramNameFromStore(b?.program)
      return name.toLowerCase().includes(query)
    })
  }

  // 4. الفلترة بحالة الدفعة
  if (filterStatus.value) {
    list = list.filter(b => b.status && String(b.status) === String(filterStatus.value))
  }

  return list
})

const handleProgramTabChange = (tabValue) => {
  currentProgramTab.value = tabValue
  if (tabValue === 'all') {
    router.push({ name: 'SupervisorBatches' });
  } else {
    router.push({ name: 'SupervisorBatches', params: { courseId: String(tabValue) } });
  }
}

const getProgramNameFromStore = (programId) => {
  if (!programId) return 'غير محدد'
  const match = programStore.programs.find(p => String(p.id) === String(programId))
  return match ? match.name : 'مساق تعليمي'
}

const getLevelNameFromStore = (levelId) => {
  if (!levelId) return 'غير محدد'
  const match = programStore.levels.find(l => String(l.id) === String(levelId))
  return match ? (match.name || match.title || `المستوى ${levelId}`) : `المستوى ${levelId}`
}

// دالة جلب البيانات الفردية الآمنة لمنع الـ TypeError
const loadData = async () => {
  isPeopleLoading.value = true
  try {
    if (batchStore.getBatchStoreData) {
      await batchStore.getBatchStoreData()
    }
    if (pepoleStore.getPeapleStoreData) {
      await pepoleStore.getPeapleStoreData()
    }
    if (programStore.getAllPrograms) await programStore.getAllPrograms()
    if (programStore.getAllLevels) await programStore.getAllLevels()
  } catch (err) {
    console.error("خطأ أثناء جلب المزامنة المباشرة:", err)
  } finally {
    isPeopleLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

const getSupervisorName = (userId) => {
  if (!userId) return 'لم يحدد بعد'
  const allUsersWithRoles = pepoleStore.getUsersWithRoles || []
  let supervisor = allUsersWithRoles.find(s => Number(s?.accountDetails?.id) === Number(userId))
  if (supervisor && supervisor.fullName) return supervisor.fullName

  const allUsers = pepoleStore.getUsers || []
  supervisor = allUsers.find(s => Number(s?.id) === Number(userId) || Number(s?.accountDetails?.id) === Number(userId))
  return supervisor ? (supervisor.fullName || supervisor.name) : 'لم يحدد بعد'
}

const openAddModal = () => {
  isEditMode.value = false
  modalValidationError.value = ''

  formData.value = {
    program: currentProgramTab.value !== 'all' ? Number(currentProgramTab.value) : (programStore.programs[0]?.id || null),
    batch_supervisor: null,
    start_date: '',
    end_date: '',
    current_level: null, 
    num_group: 15,
    status: null        
  }
  isModalOpen.value = true
}

const openEditModal = (batch) => {
  if (!batch) return
  isEditMode.value = true
  modalValidationError.value = ''
  selectedBatchId.value = batch.id

  formData.value = {
    program: batch.program ? Number(batch.program) : null,
    batch_supervisor: batch.batch_supervisor ? Number(batch.batch_supervisor) : null,
    start_date: batch.start_date || '',
    end_date: batch.end_date || '',
    current_level: batch.current_level || null,
    num_group: batch.num_group || 15,
    status: batch.status ? Number(batch.status) : null
  }
  isModalOpen.value = true
}

const submitForm = async () => {
  if (!formData.value.program || !formData.value.batch_supervisor || !formData.value.start_date || !formData.value.end_date || !formData.value.num_group || !formData.value.current_level || !formData.value.status) {
    modalValidationError.value = 'يرجى تعبئة كافة الحقول الإلزامية وتحديد المستوى والحالة للدفعة.'
    return
  }

  const finalPayload = {
    program: formData.value.program,
    batch_supervisor: formData.value.batch_supervisor,
    start_date: formData.value.start_date,
    end_date: formData.value.end_date,
    current_level: formData.value.current_level,
    num_group: formData.value.num_group,
    status: formData.value.status
  }

  try {
    let result = isEditMode.value
      ? await batchStore.updateBatch(selectedBatchId.value, finalPayload)
      : await batchStore.createBatch(finalPayload)

    if (result && result.success) {
      isModalOpen.value = false
      showToast(isEditMode.value ? "تم تحديث بيانات الدفعة بنجاح" : "تم إضافة الدفعة التعليمية الجديدة بنجاح")
      if (batchStore.getAllBatches) await batchStore.getAllBatches()
    } else {
      modalValidationError.value = typeof result?.message === 'object' ? JSON.stringify(result.message) : (result?.message || 'خطأ من خادم النظام')
    }
  } catch (err) {
    modalValidationError.value = 'حدث خطأ غير متوقع في الاتصال بالسيرفر أثناء الحفظ.'
  }
}

const openDeleteConfirm = (batch) => {
  if (!batch) return
  confirmData.value = {
    title: 'حذف دفعة تعليمية',
    message: `تحذير: هل أنتِ متأكدة من حذف دفعة مساق (${batch.program_name || batch.id}) نهائياً من سجلات المقرأة؟`,
    id: batch.id
  }
  isConfirmOpen.value = true
}

const executeAction = async () => {
  const id = confirmData.value.id
  if (!id) return

  isConfirmLoading.value = true
  try {
    const result = await batchStore.deleteBatch(id)
    if (result?.success) {
      showToast("تم حذف الدفعة بنجاح من المنظومة")
      if (batchStore.getAllBatches) await batchStore.getAllBatches()
    } else {
      showToast("عذراً، فشلت عملية الحذف من السيرفر")
    }
  } catch (error) {
    console.error("حدث خطأ في executeAction:", error)
    showToast("عذراً، فشلت العملية البرمجية بسبب مشكلة في الاتصال")
  } finally {
    isConfirmLoading.value = false
    isConfirmOpen.value = false
  }
}

const showToast = (msg) => {
  toastMsg.value = msg
  isToastVisible.value = true
}

const viewBatchDetails = (batchId) => {
  if (batchId) router.push({ name: 'BatchGroups', params: { batchId: batchId } })
}
</script>