<template>
  <div class="p-4 sm:p-6 space-y-6 text-right" dir="rtl">
    
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-800">
          {{ isSingleCourseMode ? 'دفعات المساق الدراسي' : 'إدارة الدفعات الشاملة' }}
        </h2>
        <p class="text-xs sm:text-sm text-gray-500 mt-1">
          {{ isSingleCourseMode ? 'عرض وتحديث الدفعات التابعة للمساق المحدد' : 'إضافة وتعديل الدفعات وإدارة صلاحيات النظام' }}
        </p>
      </div>
      
      <button 
        v-if="isAdmin" 
        @click="openAddModal" 
        class="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm font-bold"
      >
        <i class="fas fa-plus text-xs"></i> 
        إضافة دفعة جديدة
      </button>
    </div>

    <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
      <div class="relative w-full">
        <span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
          <i class="fas fa-search"></i>
        </span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="ابحث عن اسم الدفعة أو الرمز الفني..." 
          class="w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
        >
      </div>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      <p class="text-gray-500 text-sm mt-4">جاري تحميل بيانات الدفعات من المقرأة...</p>
    </div>

    <div v-else-if="errorMessage" class="text-center py-12 bg-red-50 border border-red-100 rounded-2xl max-w-xl mx-auto p-6">
      <i class="fas fa-exclamation-triangle text-red-500 text-3xl mb-3"></i>
      <p class="text-red-700 font-bold text-sm">{{ errorMessage }}</p>
      <button @click="loadData" class="bg-red-600 text-white text-xs px-4 py-2 rounded-lg mt-4 font-bold shadow">
        إعادة محاولة الاتصال
      </button>
    </div>

    <div v-else-if="renderedBatches.length === 0" class="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
      <i class="fas fa-folder-open text-gray-300 text-4xl mb-3"></i>
      <p class="text-gray-500 text-sm">لا توجد أي دفعات مسجلة تطابق مدخلاتكِ حالياً.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div 
        v-for="batch in renderedBatches" 
        :key="batch.id" 
        class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div>
          <div class="flex justify-between items-start gap-2 mb-2">
            <h3 class="text-base font-bold text-gray-800 line-clamp-1">{{ batch.name }}</h3>
            <span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-mono font-bold whitespace-nowrap">
              {{ batch.code || '—' }}
            </span>
          </div>
          <p class="text-xs text-gray-400 mb-4">المساق التابع: {{ batch.program_name || 'مساق معتمد' }}</p>
          
          <div class="space-y-2 border-t border-b border-gray-50 py-3 my-3 text-xs text-gray-600">
            <div class="flex justify-between">
              <span class="text-gray-400"><i class="far fa-calendar-alt ml-1"></i> تاريخ البدء:</span>
              <span class="font-medium">{{ batch.formattedStartDate }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400"><i class="far fa-calendar-check ml-1"></i> تاريخ الانتهاء:</span>
              <span class="font-medium">{{ batch.formattedEndDate }}</span>
            </div>
          </div>
        </div>

        <div class="grid gap-2 pt-2" :class="isAdmin ? 'grid-cols-2' : 'grid-cols-1'">
          <button 
            @click="viewBatchDetails(batch.id)" 
            class="text-xs bg-emerald-50 text-emerald-700 py-2.5 rounded-xl font-bold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1"
          >
            <i class="fas fa-eye text-[10px]"></i> عرض الحلقات
          </button>
          
          <div v-if="isAdmin" class="flex gap-2">
            <button 
              @click="openEditModal(batch)" 
              class="flex-1 text-xs bg-blue-50 text-blue-600 py-2.5 rounded-xl font-bold hover:bg-blue-100 transition-colors flex items-center justify-center"
              title="تعديل"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button 
              @click="handleDeleteBatch(batch.id)" 
              class="flex-1 text-xs bg-red-50 text-red-600 py-2.5 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center"
              title="حذف"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
      <div class="bg-white w-full max-w-md rounded-2xl shadow-xl animate-in zoom-in duration-150 overflow-hidden text-right">
        <div class="p-5 border-b border-gray-100 font-bold text-lg text-gray-800 flex justify-between items-center">
          <span>{{ isEditMode ? 'تعديل بيانات الدفعة' : 'إنشاء دفعة تعليمية جديدة' }}</span>
          <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
        </div>
        
        <div class="p-5 space-y-4">
          <p v-if="modalValidationError" class="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 font-bold">
            {{ modalValidationError }}
          </p>

          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-600">اسم الدفعة *</label>
            <input v-model="formData.name" type="text" placeholder="مثال: الدفعة الخامسة - طالبات" class="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-600">الرمز الفني (كود الدفعة)</label>
            <input v-model="formData.code" type="text" placeholder="مثال: BTCH-05" class="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono">
          </div>

          <div v-if="!isEditMode && !isSingleCourseMode" class="space-y-1">
            <label class="text-xs font-bold text-gray-600">المساق الدراسي التابع له *</label>
            <input v-model="formData.program" type="number" placeholder="رقم معرّف المساق (ID)" class="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-600">تاريخ البدء</label>
              <input v-model="formData.start_date" type="date" class="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-600">تاريخ الانتهاء</label>
              <input v-model="formData.end_date" type="date" class="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
            </div>
          </div>
        </div>

        <div class="p-5 bg-gray-50 flex gap-3 border-t border-gray-100">
          <button @click="isModalOpen = false" class="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-100 transition-colors">إلغاء</button>
          <button @click="submitForm" class="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700 transition-colors shadow">
            {{ isEditMode ? 'تحديث البيانات' : 'حفظ الدفعة' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBatchStore } from '@/stors/batch-store.js'

const route = useRoute()
const router = useRouter()
const batchStore = useBatchStore()

// أزرار الحالات والتحكم بالواجهة
const searchQuery = ref('')
const isModalOpen = ref(false)
const isEditMode = ref(false)
const modalValidationError = ref('')
const selectedBatchId = ref(null)

// الفرم الأساسي لإضافة وتعديل الدفعات المتزامن مع قاعدة البيانات
const formData = ref({
  name: '',
  code: '',
  program: null,
  start_date: '',
  end_date: ''
})

// فحص وجود تصفية ممررة لـ CourseId من مسار الراوتر (مثل /courses/5/batches)
const courseIdFromRoute = computed(() => route.params.courseId || null)
const isSingleCourseMode = computed(() => !!courseIdFromRoute.value)

// رتبة الصلاحية: استبدليها بحقل الصلاحيات الفعلي للمستخدم في نظامكِ (مثال: true للمدير)
const isAdmin = ref(true) 

// ربط تفاعلي مباشر مع بيانات الـ Store للـ Loading والـ Error
const isLoading = computed(() => batchStore.loading)
const errorMessage = computed(() => batchStore.error)

// استهلاك الـ Getter المعالج للبحث والفلترة الذي أسسناه في الـ Store
const renderedBatches = computed(() => {
  return batchStore.getFilteredBatches(courseIdFromRoute.value, searchQuery.value)
})

// دالة تحميل وتحديث البيانات الاستباقية
const loadData = async () => {
  await batchStore.getAllBatches()
}

onMounted(() => {
  loadData()
})

// فتح مودال الإضافة مع مراعاة ملء الـ Program ID تلقائياً إن وُجد في الرابط
const openAddModal = () => {
  isEditMode.value = false
  modalValidationError.value = ''
  formData.value = {
    name: '',
    code: '',
    program: courseIdFromRoute.value ? Number(courseIdFromRoute.value) : null,
    start_date: '',
    end_date: ''
  }
  isModalOpen.value = true
}

// فتح مودال التعديل وملء البيانات الحالية للدفعة المحددة
const openEditModal = (batch) => {
  isEditMode.value = true
  modalValidationError.value = ''
  selectedBatchId.value = batch.id
  formData.value = {
    name: batch.name,
    code: batch.code,
    program: batch.program || batch.program_id,
    start_date: batch.start_date || '',
    end_date: batch.end_date || ''
  }
  isModalOpen.value = true
}

// دالة إرسال الفرم وعمل الـ Validation المزدوج قبل الحفظ في دجانغو
const submitForm = async () => {
  if (!formData.value.name) {
    modalValidationError.value = 'يرجى إدخال اسم الدفعة أولاً.'
    return
  }
  if (!formData.value.program) {
    modalValidationError.value = 'يجب ربط الدفعة بمساق دراسي معتمد.'
    return
  }

  let result
  if (isEditMode.value) {
    result = await batchStore.updateBatch(selectedBatchId.value, formData.value)
  } else {
    result = await batchStore.createBatch(formData.value)
  }

  if (result.success) {
    isModalOpen.value = false
  } else {
    modalValidationError.value = result.message || 'حدث خطأ أثناء معالجة الطلب.'
  }
}

// دالة حذف الدفعة مع نافذة تأكيد للمستخدم لحماية قاعدة البيانات
const handleDeleteBatch = async (id) => {
  if (confirm('هل أنتِ متأكدة تماماً من رغبتكِ في حذف هذه الدفعة نهائياً من المقرأة؟')) {
    await batchStore.deleteBatch(id)
  }
}

// الانتقال لصفحة الحلقات التابعة للدفعة الحالية وتمرير المعرّف
const viewBatchDetails = (batchId) => {
  router.push({
    name: 'BatchGroups', // استبدليه باسم ممر الراوتر المعتمد لديكِ للحلقات
    params: { batchId: batchId }
  })
}
</script>