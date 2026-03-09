<script setup>
import { ref } from 'vue'

// UC061: متابعة التمام اليومي - حالة الواجهة
const isAttendanceModalOpen = ref(false)
const selectedWeek = ref('الكل') // امكانية التصفية حسب الاسبوع

// UC062: عرض درجات الاختبار - البيانات
const testResults = ref([
  { id: 1, type: 'شهري', name: 'اختبار يناير', score: '18/20' },
  { id: 2, type: 'تكميلي', name: 'تجويد', score: '14.5/15' }
])

// UC063: اداء الاختبار الالكتروني - رابط الاختبار
const openExternalExam = () => {
  // التدفق الأساسي خطوة 4: ينقل الطالب الى موقع الإختبار 
  const examUrl = "https://google.forms/exam123" 
  window.open(examUrl, '_blank')
}
</script>

<template>
  <div class="space-y-6 font-['Tajawal']" dir="rtl">
    
    <header class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-[#064e3b]">لوحة تحكم الطالبة</h1>
        <p class="text-sm text-gray-500">مرحباً بكِ في مقرأة النور</p>
      </div>
    </header>

    <section class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-bold text-lg">التمام والواجبات اليومية 📖</h2>
        <select v-model="selectedWeek" class="text-xs border rounded-lg p-1">
          <option>الاسبوع الحالي</option>
          <option>الاسبوع الماضي</option>
        </select>
      </div>
      <button @click="isAttendanceModalOpen = true" class="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all">
        اضافة تمام اليوم +
      </button>
    </section>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <section class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 class="font-bold text-lg mb-4">نتائج الاختبارات 📊</h2>
        <div class="space-y-3">
          <div v-for="test in testResults" :key="test.id" class="flex justify-between border-b pb-2">
            <div>
              <p class="font-medium">{{ test.name }}</p>
              <span class="text-[10px] bg-gray-100 px-2 py-0.5 rounded">{{ test.type }}</span>
            </div>
            <span class="font-bold text-emerald-600">{{ test.score }}</span>
          </div>
        </div>
      </section>

      <section class="bg-[#fef3c7] p-6 rounded-2xl border border-amber-200">
        <h2 class="font-bold text-amber-900 mb-2 text-lg">الاختبارات المتاحة 📝</h2>
        <p class="text-xs text-amber-700 mb-4">اضغطي على الرابط لفتح نموذج الاختبار الإلكتروني</p>
        <button @click="openExternalExam" class="flex items-center gap-2 text-amber-900 font-bold hover:underline">
          <span>🔗 رابط اختبار سورة البقرة</span>
          <i class="fas fa-external-link-alt text-sm"></i>
        </button>
      </section>
    </div>

    <div v-if="isAttendanceModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div class="bg-white w-full max-w-md rounded-2xl p-6">
        <h3 class="font-bold text-xl mb-4 text-center">تأكيد واجبات اليوم</h3>
        <div class="space-y-4">
          <label class="flex items-center gap-3 p-3 border rounded-xl">
            <input type="checkbox" class="w-5 h-5 accent-emerald-600">
            <span>تم أداء ورد الحفظ اليومي</span>
          </label>
          <label class="flex items-center gap-3 p-3 border rounded-xl">
            <input type="checkbox" class="w-5 h-5 accent-emerald-600">
            <span>تم أداء ورد المراجعة</span>
          </label>
        </div>
        <div class="flex gap-3 mt-6">
          <button @click="isAttendanceModalOpen = false" class="flex-1 py-2 bg-gray-100 rounded-lg">إلغاء</button>
          <button @click="isAttendanceModalOpen = false" class="flex-1 py-2 bg-emerald-600 text-white rounded-lg">حفظ التمام</button>
        </div>
      </div>
    </div>

  </div>
</template>