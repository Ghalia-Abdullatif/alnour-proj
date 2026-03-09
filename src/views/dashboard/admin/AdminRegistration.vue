<script setup>
import { ref, computed } from 'vue'
import { isMobile } from "../../../utils/useBreakpoints";

// 1. بيانات طلبات التسجيل (بيانات تجريبية)
const registrationRequests = ref([
  { id: 1, name: 'آمال حسن', email: 'amal@test.com', phone: '0912345678', date: '2024-05-24', status: 'قيد الانتظار' },
  { id: 2, name: 'سعاد إبراهيم', email: 'suad@test.com', phone: '0123456789', date: '2024-05-23', status: 'قيد الانتظار' },
  { id: 3, name: 'خديجة عثمان', email: 'khadija@test.com', phone: '0998877665', date: '2024-05-22', status: 'مرفوض' },
  { id: 4, name: 'فاطمة أحمد', email: 'fatima@test.com', phone: '0911223344', date: '2024-05-21', status: 'تم القبول' },
])

// 2. متغيرات البحث والتصفية
const searchQuery = ref('')
const statusFilter = ref('الكل')

// 3. العمليات (Actions)
const approveRequest = (request) => {
  if (confirm(`هل أنتِ متأكدة من قبول الطالبة ${request.name}؟`)) {
    request.status = 'تم القبول'
    // تنفيذ متطلبات الحالة UC076.1
    alert('تم قبول الطالبة بنجاح وسيتم إنشاء حساب لها في النظام.')
  }
}

const rejectRequest = (id) => {
  const req = registrationRequests.value.find(r => r.id === id)
  if (confirm(`هل تريدين رفض طلب ${req.name}؟`)) {
    req.status = 'مرفوض'
  }
}

// 4. تصفية الطلبات (المنطق البرمجي للبحث والتصفية)
const filteredRequests = computed(() => {
  return registrationRequests.value.filter(req => {
    const matchesName = req.name.includes(searchQuery.value)
    const matchesStatus = statusFilter.value === 'الكل' || req.status === statusFilter.value
    return matchesName && matchesStatus
  })
})

const pendingCount = computed(() => {
  return registrationRequests.value.filter(r => r.status === 'قيد الانتظار').length
})
</script>

<template>
  <div class="p-4 lg:p-6 space-y-6 text-right font-['Tajawal']" dir="rtl">
    
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 class="text-2xl font-black text-gray-800">إدارة طلبات التسجيل</h2>
        <p class="text-sm text-gray-500 italic">مراجعة طلبات الانضمام الجديدة للمنصة</p>
      </div>
      <div class="bg-amber-50 border border-amber-200 text-amber-700 px-5 py-2.5 rounded-2xl text-sm font-bold shadow-sm">
        يوجد {{ pendingCount }} طلبات جديدة قيد الانتظار
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div class="md:col-span-2 relative">
        <i class="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="ابحثي عن اسم الطالبة..." 
          class="w-full bg-white border border-gray-100 rounded-2xl pr-11 pl-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
        >
      </div>
      <select v-model="statusFilter" class="bg-white border border-gray-100 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm font-bold text-gray-600">
        <option value="الكل">كل الحالات</option>
        <option value="قيد الانتظار">قيد الانتظار</option>
        <option value="تم القبول">تم القبول</option>
        <option value="مرفوض">مرفوض</option>
      </select>
    </div>

    <div class="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-right border-collapse">
          <thead>
            <tr class="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-wider font-bold">
              <th class="p-5 border-b border-gray-100">اسم الطالبة</th>
              <th class="p-5 border-b border-gray-100">بيانات التواصل</th>
              <th class="p-5 border-b border-gray-100 text-center">تاريخ الطلب</th>
              <th class="p-5 border-b border-gray-100">الحالة</th>
              <th class="p-5 border-b border-gray-100 text-center">الإجراء</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="req in filteredRequests" :key="req.id" class="hover:bg-emerald-50/30 transition-all group">
              <td class="p-5">
                <div class="font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">{{ req.name }}</div>
              </td>
              <td class="p-5">
                <div class="flex flex-col">
                  <span class="text-xs text-blue-600 font-medium mb-0.5">{{ req.email }}</span>
                  <span class="text-[10px] text-gray-400 font-sans tracking-tighter">{{ req.phone }}</span>
                </div>
              </td>
              <td class="p-5 text-center">
                <span class="text-xs text-gray-500 font-sans bg-gray-100 px-2 py-1 rounded-lg">{{ req.date }}</span>
              </td>
              <td class="p-5">
                <span :class="{
                  'bg-amber-100 text-amber-700': req.status === 'قيد الانتظار',
                  'bg-emerald-100 text-emerald-700': req.status === 'تم القبول',
                  'bg-rose-100 text-rose-700': req.status === 'مرفوض'
                }" class="px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm inline-block min-w-[80px] text-center">
                  {{ req.status }}
                </span>
              </td>
              <td class="p-5">
                <div v-if="req.status === 'قيد الانتظار'" class="flex justify-center gap-2">
                  <button @click="approveRequest(req)" class="bg-emerald-600 text-white w-9 h-9 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center">
                    <i class="fas fa-check text-xs"></i>
                  </button>
                  <button @click="rejectRequest(req.id)" class="bg-white text-rose-500 w-9 h-9 rounded-xl hover:bg-rose-50 transition-all border border-rose-100 flex items-center justify-center">
                    <i class="fas fa-times text-xs"></i>
                  </button>
                </div>
                <div v-else class="text-[10px] text-gray-400 text-center font-bold italic">
                  تمت المعالجة
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="filteredRequests.length === 0" class="p-20 text-center">
        <i class="fas fa-user-slash text-4xl text-gray-200 mb-4"></i>
        <p class="text-gray-400 font-bold">لا توجد طلبات تطابق بحثك</p>
      </div>
    </div>

    <div class="bg-[#064e3b] p-5 rounded-[2rem] text-white flex items-center gap-4 shadow-xl shadow-emerald-900/10">
      <div class="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
        <i class="fas fa-lightbulb text-emerald-300 text-xl"></i>
      </div>
      <p class="text-xs leading-relaxed opacity-90">
        <strong>تنبيه الإدارة:</strong> عند الضغط على زر القبول، سيقوم النظام آلياً بتحويل بيانات الطالبة إلى قسم "إدارة المستخدمين" وإرسال بيانات الدخول لبريدها الإلكتروني.
      </p>
    </div>

  </div>
</template>