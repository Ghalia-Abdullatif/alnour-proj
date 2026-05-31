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
      
      <template #top-widgets>
        <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-[11px] font-black text-gray-400 mb-1.5">حالة الدفعة</label>
            <select v-model="filterStatus" class="w-full p-2.5 bg-[var(--color-background)] border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-amber-700 transition-all">
              <option value="">كل حالات الدفعات</option>
              <option v-for="st in statusOptions" :key="st.id" :value="st.id">{{ st.name }}</option>
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-black text-gray-400 mb-1.5">المستوى الدراسي</label>
            <select v-model="filterLevel" class="w-full p-2.5 bg-[var(--color-background)] border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-amber-700 transition-all">
              <option value="">كل المستويات الدراسية</option>
              <option value="المستوى الأول">المستوى الأول</option>
              <option value="المستوى الثاني">المستوى الثاني</option>
              <option value="المستوى الثالث">المستوى الثالث</option>
            </select>
          </div>
        </div>
      </template>

      <template #table="{ data }">
        <div v-if="isLoading || isPeopleLoading" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div class="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-[var(--color-primary)]"></div>
          <p class="text-basicGray text-sm mt-4 font-bold">جاري مزامنة مخازن الدفعات والأدوار من خادم النظام ...</p>
        </div>

        <div v-else-if="!data || data.length === 0" class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <i class="fas fa-folder-open text-gray-300 text-4xl mb-3"></i>
          <p class="text-basicGray text-sm font-medium">لا توجد دفعات تعليمية مطابقة لشروط الفلترة أو مصفوفة المساقات المحددة حالياً.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="batch in data" :key="batch.id" class="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm border-t-4 border-t-[var(--color-primary)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div>
              <div class="flex justify-between items-start gap-2 mb-3">
                <h3 class="text-sm font-black text-gray-800 line-clamp-1" :title="batch.name">{{ batch.name || 'دفعة بدون اسم' }}</h3>
                <span class="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-xl text-xs font-mono font-black border border-amber-100/50">
                  {{ batch.code || '—' }}
                </span>
              </div>
              
              <p class="text-xs text-gray-400 font-bold mb-4">
                <i class="fas fa-circle-notch text-[9px] text-amber-600 ml-1"></i> المستهدف الحالي: {{ batch.num_group || 0 }} حلقة تعليمية
              </p>
              
              <div class="space-y-3 border-t border-b border-gray-50 py-4 my-4 text-xs text-text-gray">
                <div class="flex justify-between items-center">
                  <span class="text-gray-400 font-medium"><i class="fas fa-user-shield ml-1.5 text-xs text-gray-400"></i> المشرفة المسؤولة:</span>
                  <span class="font-black text-gray-700">{{ getSupervisorName(batch.batch_supervisor) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-400 font-medium"><i class="fas fa-layer-group ml-1.5 text-xs text-gray-400"></i> المستوى الدراسي:</span>
                  <span class="font-bold bg-gray-50 px-2.5 py-1 rounded-xl text-gray-600 border border-gray-100">{{ batch.current_level || 'غير محدد' }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-400 font-medium"><i class="fas fa-toggle-on ml-1.5 text-xs text-gray-400"></i> حالة الدفعة الحالية:</span>
                  <span class="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {{ batch.statusName }}
                  </span>
                </div>
                <div class="flex justify-between text-[11px] text-gray-400 pt-2 border-t border-dashed border-gray-100 font-medium">
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
                <button @click="handleDeleteBatch(batch.id)" class="flex-1 text-xs bg-red-50 text-[var(--color-flag-red)] rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors" title="حذف الدفعة"><i class="fas fa-trash-alt"></i></button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </GenericAdminLayout>

    <!-- مودال الإنشاء والتعديل -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4 text-right" dir="rtl">
      <div class="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-gray-50 overflow-hidden p-6 space-y-4">
        <div class="flex justify-between items-center border-b border-gray-50 pb-3">
          <h3 class="text-base font-black text-[var(--color-primary)]">
            {{ isEditMode ? 'تعديل بيانات الدفعة الحالية' : 'إنشاء دفعة تعليمية جديدة' }}
          </h3>
          <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times text-sm"></i></button>
        </div>
        
        <p v-if="modalValidationError" class="bg-rose-50 p-3 rounded-xl border border-rose-100 font-bold text-xs text-[var(--color-flag-red)] flex items-center gap-2">
          <i class="fas fa-info-circle"></i> {{ modalValidationError }}
        </p>

        <div class="space-y-1">
          <label class="text-xs font-black text-gray-500">اسم الدفعة التعليمية *</label>
          <input v-model="formData.name" type="text" placeholder="مثال: الدفعة الثالثة" class="w-full p-2.5 border border-gray-200 rounded-xl outline-none text-sm font-bold focus:border-amber-700 transition-all">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-xs font-black text-gray-500">الرمز الفني (الكود) *</label>
            <input v-model="formData.code" type="text" placeholder="BTCH-03" class="w-full p-2.5 border border-gray-200 rounded-xl outline-none font-mono text-sm font-bold focus:border-amber-700 transition-all">
          </div>
          <div class="space-y-1">
            <label class="text-xs font-black text-gray-500">معرف المساق الدراسي *</label>
            <input v-model="formData.program" type="number" class="w-full p-2.5 border border-gray-200 rounded-xl outline-none text-sm font-bold focus:border-amber-700 transition-all">
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-black text-gray-500">مشرفة الدفعة المسؤولة *</label>
          <select v-model="formData.batch_supervisor" class="w-full p-2.5 border border-gray-200 rounded-xl outline-none text-sm font-bold focus:border-amber-700 transition-all">
            <option :value="null" disabled>اختر المشرفة من النظام...</option>
            <option v-for="superv in systemSupervisors" :key="superv.id" :value="superv.id">{{ superv.fullName }}</option>
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
              <option value="المستوى الأول">المستوى الأول</option>
              <option value="المستوى الثاني">المستوى الثاني</option>
              <option value="المستوى الثالث">المستوى الثالث</option>
            </select>
          </div>

          <div class="space-y-1">
            <div class="flex justify-between items-center mb-1">
              <label class="text-xs font-black text-gray-500">حالة الدفعة *</label>
              <button type="button" @click="isCustomStatusMode = !isCustomStatusMode" class="text-[10px] text-[var(--color-primary)] underline font-black">
                {{ isCustomStatusMode ? 'إلغاء' : '➕ حالة جديدة' }}
              </button>
            </div>

            <select v-if="!isCustomStatusMode" v-model="formData.status" class="w-full p-2.5 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-amber-700 transition-all">
              <option :value="null" disabled>حددي حالة من القائمة...</option>
              <option v-for="st in statusOptions" :key="st.id" :value="st.id">{{ st.name }}</option>
            </select>

            <input v-else v-model="customStatusText" type="text" placeholder="اكتبي اسم الحالة الفخرية..." class="w-full p-2.5 border border-amber-500 rounded-xl outline-none text-sm font-bold focus:ring-1 focus:ring-amber-500 transition-all">
          </div>
        </div>

        <div class="flex gap-3 pt-3 border-t border-gray-50">
          <button @click="isModalOpen = false" class="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-black text-gray-500 hover:bg-gray-50 flex-1">إلغاء</button>
          <button @click="submitForm" class="px-4 py-2.5 rounded-xl bg-amber-800 text-white text-xs font-black hover:bg-amber-900 shadow-sm flex-1">حفظ الدفعة</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import GenericAdminLayout from '@/views/dashboard/admin/GenericAdminLayout.vue';
import { useBatchStore } from '@/stors/batch-store.js'
import { usePepoleStore } from '@/stors/pepole-store.js'

const props = defineProps({
  selectedPrograms: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()
const batchStore = useBatchStore()
const pepoleStore = usePepoleStore()

const searchQuery = ref('')
const filterStatus = ref('')
const filterLevel = ref('')
const currentProgramTab = ref('all')

const isModalOpen = ref(false)
const isEditMode = ref(false)
const modalValidationError = ref('')
const selectedBatchId = ref(null)
const isPeopleLoading = ref(false)

const isCustomStatusMode = ref(false)
const customStatusText = ref('')

const formData = ref({
  name: '',
  code: '',
  program: null,
  batch_supervisor: null,
  start_date: '',
  end_date: '',
  current_level: 'المستوى الأول',
  num_group: 1,
  status: null
})

const isAdmin = ref(true)

// ربط مباشر مع حالة التحميل الخاصة بـ الـ Batch Store
const isLoading = computed(() => batchStore.loading)

const batchColumns = [
  { label: 'بيانات الدفعة', key: 'name' }
]

const programTabs = computed(() => {
  return [{ label: 'كافة المساقات الدراسية', value: 'all' }]
})

const statusOptions = computed(() => batchStore.getStatusOptions || [])

// جلب المشرفات بناءً على أدوارهن التفصيلية من مصفوفة الـ Users المفلترة
const systemSupervisors = computed(() => {
  const allUsersWithRoles = pepoleStore.getUsersWithRoles || []
  return allUsersWithRoles.filter(user => {
    const roles = user?.accountDetails?.roles || []
    return roles.some(role => role?.code === 'batch_supervisor' || role?.roleId === 2)
  })
})

// تصفية وعرض الدفعات الذكي بالاعتماد التام على جلب البيانات الـ Processed المُهيأة بالتواريخ والحالات
const filteredAndSearchedBatches = computed(() => {
  let list = batchStore.getProcessedBatches || []

  if (searchQuery.value && searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    list = list.filter(b => 
      (b?.name && b.name.toLowerCase().includes(query)) || 
      (b?.code && b.code.toLowerCase().includes(query))
    )
  }

  if (filterStatus.value) {
    list = list.filter(b => String(b?.statusId) === String(filterStatus.value))
  }
  
  if (filterLevel.value) {
    list = list.filter(b => b?.current_level === filterLevel.value)
  }

  return list
})

const handleProgramTabChange = (tabValue) => {
  currentProgramTab.value = 'all'
}

// تعديل المزامنة لتعمل بالتوازي مع الاستورين بشكل آمن ومطابق للـ Pepole Store
const loadData = async () => {
  isPeopleLoading.value = true
  try {
    // استدعاء مباشر وصريح مع await لكل مخزن لضمان ملء المصفوفات بالترتيب
    if (batchStore.getBatchStoreData) {
      await batchStore.getBatchStoreData()
    }
    if (pepoleStore.getPeapleStoreData) {
      await pepoleStore.getPeapleStoreData()
    }
    
    console.log("تم تحديث مخازن الدفعات والمشرفات بنجاح:", batchStore.batches)
  } catch (err) {
    console.error("خطأ أثناء جلب المزامنة المباشرة:", err)
  } finally {
    isPeopleLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

// تحديث ذكي لجلب الاسم الكامل للمشرفة من مصفوفة الأشخاص باستخدام الـ id المعالج
const getSupervisorName = (id) => {
  if (!id) return 'لم يحدد بعد'
  // محاولة البحث أولاً في قائمة المستخدمين ذوي الأدوار لاستخلاص الـ fullName
  const allUsersWithRoles = pepoleStore.getUsersWithRoles || []
  let supervisor = allUsersWithRoles.find(s => s?.id === id)
  
  if (supervisor && supervisor.fullName) {
    return supervisor.fullName
  }

  // خطة بديلة (Fallback) للبحث في مصفوفة الحسابات الإجمالية بالستور
  const allUsers = pepoleStore.getUsers || []
  supervisor = allUsers.find(s => s?.id === id)
  return supervisor ? (supervisor.fullName || supervisor.name) : 'لم يحدد بعد'
}

const openAddModal = () => {
  isEditMode.value = false
  isCustomStatusMode.value = false
  customStatusText.value = ''
  modalValidationError.value = ''

  formData.value = {
    name: '',
    code: '',
    program: 1,
    batch_supervisor: null,
    start_date: '',
    end_date: '',
    current_level: 'المستوى الأول',
    num_group: 1,
    status: statusOptions.value[0]?.id || null
  }
  isModalOpen.value = true
}

const openEditModal = (batch) => {
  if (!batch) return
  isEditMode.value = true
  isCustomStatusMode.value = false
  customStatusText.value = ''
  modalValidationError.value = ''
  selectedBatchId.value = batch.id
  
  formData.value = {
    name: batch.name || '',
    code: batch.code || '',
    program: batch.program || 1,
    batch_supervisor: batch.batch_supervisor || null,
    start_date: batch.raw_start_date || '',
    end_date: batch.raw_end_date || '',
    current_level: batch.current_level || 'المستوى الأول',
    num_group: batch.num_group || 1,
    status: batch.statusId ? (isNaN(batch.statusId) ? batch.statusId : Number(batch.statusId)) : null
  }
  isModalOpen.value = true
}

const submitForm = async () => {
  if (!formData.value.name || !formData.value.code || !formData.value.batch_supervisor || !formData.value.start_date || !formData.value.end_date) {
    modalValidationError.value = 'يرجى تعبئة كافة الحقول الإلزامية لنموذج الدفعة.'
    return
  }

  if (isCustomStatusMode.value) {
    if (!customStatusText.value.trim()) {
      modalValidationError.value = 'الرجاء إدخال اسم الحالة المستحدثة لتسجيلها.'
      return
    }
    try {
      const statusResult = await batchStore.createBatchStatus({ name: customStatusText.value.trim() })
      if (statusResult && statusResult.success && statusResult.data) {
        formData.value.status = statusResult.data.id
      } else {
        formData.value.status = statusOptions.value[0]?.id || null
      }
    } catch (e) {
      formData.value.status = statusOptions.value[0]?.id || null
    }
  }

  const finalPayload = {
    ...formData.value,
    status_id: formData.value.status,
    status: formData.value.status
  }

  try {
    let result = isEditMode.value
      ? await batchStore.updateBatch(selectedBatchId.value, finalPayload)
      : await batchStore.createBatch(finalPayload)

    if (result && result.success) {
      isModalOpen.value = false
      if (batchStore.getAllBatches) await batchStore.getAllBatches()
    } else {
      modalValidationError.value = typeof result?.message === 'object' ? JSON.stringify(result.message) : (result?.message || 'خطأ غير معروف من خادم النظام')
    }
  } catch (err) {
    modalValidationError.value = 'حدث خطأ غير متوقع في الاتصال بالسيرفر أثناء الحفظ.'
  }
}

const handleDeleteBatch = async (id) => {
  if (!id) return
  if (confirm('هل أنتِ متأكدة من حذف هذه الدفعة نهائياً من سجلات المقرأة؟')) {
    const result = await batchStore.deleteBatch(id)
    if (result?.success && batchStore.getAllBatches) await batchStore.getAllBatches()
  }
}

const viewBatchDetails = (batchId) => {
  if (batchId) router.push({ name: 'BatchGroups', params: { batchId: batchId } })
}
</script>