<template>
  <div class="p-4 md:p-8 space-y-8 text-right font-['Tajawal',_sans-serif] bg-gray-50/50 min-h-screen" dir="rtl">
    
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
      <div>
        <h2 class="text-2xl md:text-3xl font-black text-[#802c2c] tracking-tight flex items-center gap-3">
          <span class="w-2.5 h-6 bg-[#802c2c] rounded-full inline-block"></span>
          مركز بث الإشعارات
        </h2>
        <p class="text-xs md:text-sm text-gray-500 font-medium mt-1">بث الرسائل، التنبيهات والتوجيهات الفورية عبر النظام</p>
      </div>
      <button 
        @click="openCreateModal" 
        class="bg-[#802c2c] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-red-900/10 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
      >
        <i class="fas fa-paper-plane text-xs"></i>
        <span>بث إشعار جديد</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
        <div class="flex items-center gap-5">
          <div class="w-14 h-14 bg-red-50 text-[#802c2c] rounded-2xl flex items-center justify-center text-xl shadow-inner">
            <i class="fas fa-bell"></i>
          </div>
          <div>
            <div class="text-xs text-gray-400 font-bold">إشعارات بُثت هذا الشهر</div>
            <div class="text-2xl font-black text-gray-800 mt-1">
              14 <span class="text-xs font-normal text-gray-400">تنبيه</span>
            </div>
          </div>
        </div>
        <div class="text-gray-300 text-lg"><i class="fas fa-arrow-left"></i></div>
      </div>

      <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
        <div class="flex items-center gap-5">
          <div class="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">
            <i class="fas fa-users"></i>
          </div>
          <div>
            <div class="text-xs text-gray-400 font-bold">النطاق الإجمالي للمتلقين</div>
            <div class="text-2xl font-black text-gray-800 mt-1">
              1,250 <span class="text-xs font-normal text-gray-400">مستفيد</span>
            </div>
          </div>
        </div>
        <div class="text-gray-300 text-lg"><i class="fas fa-arrow-left"></i></div>
      </div>
    </div>

    <div class="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
      <div class="p-5 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
        <h3 class="font-black text-gray-700 text-sm flex items-center gap-2">
          <i class="fas fa-history text-gray-400"></i>
          أرشيف التنبيهات الأخيرة
        </h3>
        <span class="text-xs bg-red-50 text-[#802c2c] font-bold px-3 py-1 rounded-full">
          {{ totalCount }} تنبيه محفوظ
        </span>
      </div>
      
      <div v-if="notifications.length > 0" class="divide-y divide-gray-50">
        <div 
          v-for="notif in notifications" 
          :key="notif.id" 
          class="p-6 hover:bg-gray-50/40 transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
        >
          <div class="flex items-start gap-4 flex-1">
            <div class="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shadow-sm"></div>
            <div class="space-y-1">
              <h4 class="text-sm font-black text-gray-800">{{ notif.title }}</h4>
              <p class="text-xs text-gray-500 leading-relaxed">{{ notif.message }}</p>
              <div class="flex items-center gap-2 pt-1">
                <span class="text-[10px] bg-amber-50 text-amber-700 font-black px-2 py-0.5 rounded-md">
                  المستهدف: {{ formatTargetName(notif) }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0">
            <div class="text-[11px] text-gray-400 font-medium flex items-center gap-1.5">
              <i class="far fa-calendar-alt"></i> 
              <span>{{ notif.created_at || '2026-05-16' }}</span>
              <span class="text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded text-[10px]">● تم الإرسال</span>
            </div>
            
            <div class="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button 
                @click="openEditModal(notif)" 
                title="تعديل الإشعار" 
                class="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center text-xs"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button 
                @click="deleteNotification(notif.id)" 
                title="حذف نهائي" 
                class="w-8 h-8 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors flex items-center justify-center text-xs"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="p-16 text-center text-gray-400">
        <i class="fas fa-bullhorn text-3xl mb-3 block text-gray-200"></i>
        <p class="text-sm font-medium">لا توجد إشعارات مسجلة في الأرشيف حالياً.</p>
      </div>
    </div>

    <div v-if="isSendModalOpen" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
      <div class="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 transform transition-all">
        
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-red-50 text-[#802c2c] rounded-xl flex items-center justify-center">
              <i class="fas fa-bullhorn text-sm"></i>
            </div>
            <div>
              <h3 class="font-black text-lg text-gray-800">{{ isEditing ? 'تعديل وتحديث التنبيه' : 'بث تنبيه جديد' }}</h3>
              <p class="text-[11px] text-gray-400 mt-0.5">سيتم تسجيل البيانات في قاعدة البيانات وبثها فوراً</p>
            </div>
          </div>
          <button @click="handleCloseModal" class="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="p-6 space-y-5">
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1.5 mr-1">عنوان الرسالة التنبيهية</label>
            <input 
              v-model="newNotification.title" 
              type="text" 
              placeholder="مثلاً: تنبيه هام بخصوص المقرأة.." 
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#802c2c]/20 focus:border-[#802c2c] transition-all"
              :class="{ 'border-red-500 bg-red-50/30': errors.title }"
              @input="errors.title = ''"
            >
            <span v-if="errors.title" class="text-rose-600 text-xs mt-1 block pr-1">{{ errors.title }}</span>
          </div>
          
          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1.5 mr-1">تحديد الشريحة المستهدفة</label>
            <div class="relative">
              <select 
                v-model="newNotification.target" 
                class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#802c2c]/20 focus:border-[#802c2c] appearance-none cursor-pointer font-bold text-gray-600"
              >
                <option v-for="option in targetOptions" :key="option" :value="option">{{ option }}</option>
              </select>
              <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <i class="fas fa-chevron-down text-xs"></i>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 mb-1.5 mr-1">تفاصيل ونص الإشعار</label>
            <textarea 
              v-model="newNotification.message" 
              rows="4" 
              placeholder="اكتبي تفاصيل ونصوص التوجيهات هنا بكل وضوح..." 
              class="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#802c2c]/20 focus:border-[#802c2c] transition-all resize-none"
              :class="{ 'border-red-500 bg-red-50/30': errors.message }"
              @input="errors.message = ''"
            ></textarea>
            <span v-if="errors.message" class="text-rose-600 text-xs mt-1 block pr-1">{{ errors.message }}</span>
          </div>
        </div>

        <div class="p-4 bg-gray-50/50 border-t border-gray-100 flex gap-3 justify-end">
          <button 
            @click="handleCloseModal" 
            class="bg-white border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all"
          >
            إلغاء الأمر
          </button>
          <button 
            @click="sendNotification" 
            class="bg-[#802c2c] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#6b2525] transition-all shadow-md shadow-red-900/10"
          >
            {{ isEditing ? 'حفظ وتحديث السجل' : `بث الآن لـ ${newNotification.target}` }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
/**
 * استيراد المكتبات والمتاجر البرمجية
 */
import { ref, onMounted, computed ,reactive} from 'vue';
import GenericAdminLayout from '@/views/dashboard/admin/GenericAdminLayout.vue';
import { useNotifcationStore } from "@/stors/notification-store.js";
import AccountFormModal from '@/views/AccountFormModal.vue'; 
import SelectionModal from '@/components/GenericSelectModal.vue'; // تأكدي من المسار الصحيح
import ConfirmModal from '@/components/confirmAndSucces/ConfirmModal.vue'; 
import SuccessToast from '@/components/confirmAndSucces/SuccessToast.vue';
import AddPerson from "@/views/registration/AddPerson.vue";

const notificationStore = useNotifcationStore();

// // إعداد بيئة الدومين والتوكن الخاص بحماية دجانجو (CSRF)
// const baseUrl = 'http://127.0.0.1:8000' 

// const getCsrfToken = () => {
//   const match = document.cookie.match(/csrftoken=([^;]+)/)
//   return match ? match[1] : ''
// }

/* ============================================================
   الحالة والمصفوفات (State Layer)
   ============================================================ */
const notifications = ref([])
const isSendModalOpen = ref(false)
const isEditing = ref(false)
const currentNotificationId = ref(null)

const newNotification = reactive({
  title: 'التجربه الولى',
  message: 'لا توجد اشعارات هذه تجربة فقط',
  is_broadcast: false,
  roles:[2,3]
})

const errors = reactive({
  title: '',
  message: ''
})

// خريطة الربط بين الاختيارات والـ Payloads الخاصة بالـ API
const targetMapping = {
  'الكل': { is_broadcast: true, role_codes: [] },
  'جميع الطالبات': { is_broadcast: false, role_codes: ['student'] },
  'جميع المعلمات': { is_broadcast: false, role_codes: ['teacher'] }
}

const targetOptions = Object.keys(targetMapping)

/* ============================================================
   معالجة واجهات الـ API لعمليات الـ CRUD الكاملة
   ============================================================ */

// 1. [READ] جلب كافة السجلات لعرضها في الأرشيف
// const fetchNotifications = async () => {
//   try {
//     const response = await axios.get(`${baseUrl}/notifications/`)
//     notifications.value = response.data
//   } catch (error) {
//     console.error('خطأ أثناء مزامنة الإشعارات من السيرفر:', error)
//   }
// }

onMounted(async() => {
await notificationStore.getAllnotifcations()
 getAllRoles()
notifications.value=notificationStore.getnotfications;
console.log(notifications.value)

})

// // التحقق من المدخلات قبل الإرسال
// const validateFields = () => {
//   let isValid = true
//   if (!newNotification.title.trim()) { errors.title = 'عذراً، لا يمكن ترك عنوان الرسالة فارغاً.'; isValid = false }
//   if (!newNotification.message.trim()) { errors.message = 'عذراً، يجب كتابة تفاصيل ونص الإشعار قبل البث.'; isValid = false }
//   return isValid
// }

// 2. [CREATE & UPDATE] معالجة البث الفوري والتحديث الكامل
const sendNotification = async () => {
  // if (!validateFields()) return

  // const targetConfig = targetMapping[newNotification.target]
  // const payload = {
  //   title: newNotification.title,
  //   message: newNotification.message,
  //   is_broadcast: targetConfig.is_broadcast
  // }
  
  // // إلحاق الأكواد في حال كان الإشعار موجه لشريحة محددة
  // if (!targetConfig.is_broadcast) {
  //   payload.role_codes = targetConfig.role_codes
  // }

  // const config = {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'X-CSRFToken': getCsrfToken()
  //   }
  }

  // try {
  //   if (isEditing.value) {
  //     // تنفيذ تحديث كامل بالـ API باستخدام معرف العنصر (PUT)
  //     await axios.put(`${baseUrl}/notifications/${currentNotificationId.value}/`, payload, config)
  //   } else {
  //     // إنشاء وبث إشعار جديد بالـ API باستخدام (POST)
  //     await axios.post(`${baseUrl}/notifications/`, payload, config)
  //   }
    
  //   handleCloseModal()
  //   await fetchNotifications() // ريفريش لحظي لقائمة الأرشيف
  // } catch (error) {
  //   console.error('حدث خطأ أثناء معالجة الطلب بالسيرفر:', error)
  //   alert('فشلت العملية، يرجى التحقق من اتصال السيرفر والبيانات المرسلة.')
  // }


// فتح المودال في وضع الإنشاء العادي
 const openCreateModal = async () => {
  console.log ("begiiiin")
  await notificationStore.createNotifcation(newNotification)
  console.log("enddddddddddddd")

  resetForm()
  isSendModalOpen.value = true
}

// فتح المودال في وضع التعديل (تعبئة الحقول ببيانات السيرفر الحالية)
// const openEditModal = (notif) => {
//   isEditing.value = true
//   currentNotificationId.value = notif.id
//   newNotification.title = notif.title
//   newNotification.message = notif.message
  
//   // مطابقة الـ Target بناءً على رد السيرفر المرجعي
//   if (notif.is_broadcast) {
//     newNotification.target = 'الكل'
//   } else if (notif.role_codes && notif.role_codes.includes('student')) {
//     newNotification.target = 'جميع الطالبات'
//   } else if (notif.role_codes && notif.role_codes.includes('teacher')) {
//     newNotification.target = 'جميع المعلمات'
//   } else {
//     newNotification.target = 'الكل'
//   }
  
//   isSendModalOpen.value = true
// }

// 3. [DELETE] حذف السجل نهائياً من قاعدة البيانات
const deleteNotification = async (id) => {
  if (!confirm('هل أنتِ متأكدة من حذف هذا التنبيه نهائياً من أرشيف المنصة والسيرفر؟')) return

  try {
    await axios.delete(`${baseUrl}/notifications/${id}/`, {
      headers: { 'X-CSRFToken': getCsrfToken() }
    })
    await fetchNotifications() // تحديث الأرشيف بعد الحذف مباشرة
  } catch (error) {
    console.error('خطأ أثناء معالجة حذف الإشعار:', error)
    alert('تعذر حذف السجل من السيرفر، يرجى مراجعة الصلاحيات.')
  }
}

// دالة مساعدة لعرض نص الشريحة المستهدفة بشكل مفهوم في بطاقات الأرشيف
const formatTargetName = (notif) => {
  if (notif.is_broadcast) return 'الكل (بث عام)'
  if (notif.role_codes && notif.role_codes.includes('student')) return 'جميع الطالبات'
  if (notif.role_codes && notif.role_codes.includes('teacher')) return 'جميع المعلمات'
  return 'فئة مخصصة'
}

const resetForm = () => {
  newNotification.title = ''
  newNotification.message = ''
  newNotification.target = 'الكل'
  errors.title = ''
  errors.message = ''
  isEditing.value = false
  currentNotificationId.value = null
}

const handleCloseModal = () => {
  isSendModalOpen.value = false
  resetForm()
}

const totalCount = computed(() => notifications.value.length)
</script>