<script setup>
import { ref } from 'vue'

// --- البيانات (Data) ---
// مصفوفة تحتوي على قائمة الدفعات المسجلة حالياً
const batches = ref([
  { id: 1, name: 'دفعة يناير 2024', status: 'نشطة', studentsCount: 150, startDate: '2024-01-01' },
  { id: 2, name: 'دفعة فبراير 2024', status: 'قيد التسجيل', studentsCount: 85, startDate: '2024-02-01' },
])

// --- متغيرات التحكم بالواجهة (UI State) ---
const isAddBatchOpen = ref(false) // للتحكم في فتح وإغلاق النافذة المنبثقة (Modal)
const isEditing = ref(false)      // لتحديد ما إذا كنا نقوم بعملية "تعديل" أم "إضافة جديدة"
const currentBatchId = ref(null)  // لتخزين معرف الدفعة التي يتم تعديلها حالياً
const newBatch = ref({ name: '', startDate: '', status: 'قيد التسجيل' }) // كائن لتخزين بيانات النموذج

// --- العمليات (Actions) ---

// 1. وظيفة الحذف: تبحث عن المعرف وتزيل الدفعة من المصفوفة بعد تأكيد المستخدم
const deleteBatch = (id) => {
  if (confirm('هل أنتِ متأكدة من حذف هذه الدفعة؟')) {
    batches.value = batches.value.filter(batch => batch.id !== id)
  }
}

// 2. فتح نافذة التعديل: تملأ النموذج ببيانات الدفعة المختارة
const openEditModal = (batch) => {
  isEditing.value = true
  currentBatchId.value = batch.id
  newBatch.value = { ...batch } // "..." تستخدم لأخذ نسخة (Copy) وليس مرجعاً لتجنب التعديل المباشر قبل الحفظ
  isAddBatchOpen.value = true
}

// 3. وظيفة الحفظ: تميز بين الإضافة الجديدة وتحديث البيانات الموجودة
const saveBatch = () => {
  if (isEditing.value) {
    // تحديث الدفعة: نبحث عن مكانها في المصفوفة ونستبدلها بالبيانات الجديدة
    const index = batches.value.findIndex(b => b.id === currentBatchId.value)
    if (index !== -1) {
      batches.value[index] = { ...newBatch.value }
    }
  } else {
    // إضافة دفعة: ننشئ معرفاً جديداً باستخدام التاريخ الحالي ونضيفها للقائمة
    batches.value.push({
      id: Date.now(),
      ...newBatch.value,
      studentsCount: 0 // الدفعة الجديدة تبدأ بصفر طالبات
    })
  }
  closeModal() // إغلاق النافذة بعد الانتهاء
}

// 4. إعادة ضبط النموذج: لتنظيف الحقول بعد الإغلاق
const closeModal = () => {
  isAddBatchOpen.value = false
  isEditing.value = false
  newBatch.value = { name: '', startDate: '', status: 'قيد التسجيل' }
}
</script>

<template>
  <div class="p-2 lg:p-6 space-y-4 font-['Tajawal'] text-right" dir="rtl">
    
    <div class="flex justify-between items-center bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
      <div>
        <h2 class="text-lg font-bold text-gray-800">إدارة الدفعات</h2>
        <p class="text-[10px] text-gray-400">تنظيم المواعيد والدفعات الجديدة</p>
      </div>
      <button @click="isAddBatchOpen = true" class="bg-emerald-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-colors">
        <i class="fas fa-plus"></i>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <div v-for="batch in batches" :key="batch.id" class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all">
        
        <div class="flex justify-between items-start mb-3">
          <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <i class="fas fa-layer-group"></i>
          </div>
          <span :class="batch.status === 'نشطة' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'" 
                class="text-[10px] px-2 py-1 rounded-lg font-bold">
            {{ batch.status }}
          </span>
        </div>

        <h3 class="font-bold text-gray-800 mb-1 text-sm">{{ batch.name }}</h3>
        
        <div class="flex justify-between items-center text-[11px] text-gray-500 bg-gray-50 p-2 rounded-xl">
          <div class="flex flex-col">
            <span class="text-gray-400">البداية</span>
            <span class="font-bold">{{ batch.startDate }}</span>
          </div>
          <div class="flex flex-col text-left">
            <span class="text-gray-400">الطالبات</span>
            <span class="font-bold text-emerald-600">{{ batch.studentsCount }}</span>
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <button @click="openEditModal(batch)" class="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl text-[11px] font-bold hover:bg-gray-200 transition-colors">تعديل</button>
          <button @click="deleteBatch(batch.id)" class="flex-1 py-2 bg-rose-50 text-rose-500 rounded-xl text-[11px] font-bold hover:bg-rose-100 transition-colors">حذف</button>
        </div>
      </div>
    </div>

    <div v-if="isAddBatchOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end lg:items-center justify-center">
      <div class="bg-white w-full lg:max-w-md rounded-t-[32px] lg:rounded-[32px] p-6 animate-in slide-in-from-bottom duration-300">
        <h3 class="font-bold text-lg mb-4 text-gray-800">{{ isEditing ? 'تعديل الدفعة' : 'إضافة دفعة جديدة' }}</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold mb-1 mr-1 text-gray-500">اسم الدفعة</label>
            <input v-model="newBatch.name" type="text" placeholder="مثلاً: دفعة رمضان" class="w-full border-0 bg-gray-50 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
          </div>
          <div>
            <label class="block text-xs font-bold mb-1 mr-1 text-gray-500">تاريخ البدء</label>
            <input v-model="newBatch.startDate" type="date" class="w-full border-0 bg-gray-50 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
          </div>
          <div v-if="isEditing">
            <label class="block text-xs font-bold mb-1 mr-1 text-gray-500">الحالة</label>
            <select v-model="newBatch.status" class="w-full border-0 bg-gray-50 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="نشطة">نشطة</option>
              <option value="قيد التسجيل">قيد التسجيل</option>
              <option value="مكتملة">مكتملة</option>
            </select>
          </div>
        </div>

        <div class="flex gap-3 mt-8">
          <button @click="closeModal" class="flex-1 py-4 text-gray-400 font-bold text-sm">إلغاء</button>
          <button @click="saveBatch" class="flex-1 py-4 bg-[#064e3b] text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-900/20">
            {{ isEditing ? 'حفظ التعديلات' : 'حفظ الدفعة' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>