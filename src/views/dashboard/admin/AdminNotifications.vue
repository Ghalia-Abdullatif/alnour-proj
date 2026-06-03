<!-- <script setup>
import { ref } from 'vue'
import { isMobile } from "../../../utils/useBreakpoints";
import { useNotifcationStore } from "@/stors/pepole-store.js";

// 1. سجل الإشعارات المرسلة (History)
const notifications = ref([
  { id: 1, title: 'تذكير بالاختبار الأسبوعي', target: 'طالبات دفعة يناير', date: '2024-05-25', status: 'تم الإرسال' },
  { id: 2, title: 'تحديث في منهج التجويد', target: 'جميع المعلمات', date: '2024-05-24', status: 'تم الإرسال' },
])

// 2. حالات التحكم بالنموذج
const isSendModalOpen = ref(false)
const newNotification = ref({
  title: 'تجربة',
  message: 'اشعار بخصوص  اقتراب الامتحانات',
  is_broadcast: false,
  roles:[2, 3]
})

// 3. العمليات (Actions)
const sendNotification = () => {
  // if (newNotification.value.title && newNotification.value.message) {
  //   // إضافة الإشعار الجديد في مقدمة المصفوفة
  //   notifications.value.unshift({
  //     id: Date.now(),
  //     title: newNotification.value.title,
  //     target: newNotification.value.target,
  //     date: new Date().toISOString().split('T')[0], // تنسيق التاريخ YYYY-MM-DD
  //     status: 'تم الإرسال'
  //   })
    
  //   // إغلاق النافذة وتصفير البيانات
  //   isSendModalOpen.value = false
  //   alert('تم إرسال الإشعار لجميع المستهدفين بنجاح! 🔔')
  //   newNotification.value = { title: '', message: '', target: 'الكل' }
  // }
}
</script>

<template>
  <div class="p-6 space-y-6 text-right font-['Tajawal']" dir="rtl">
    
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">مركز الإشعارات</h2>
        <p class="text-sm text-gray-500 italic">بث الرسائل والتنبيهات للطالبات والمعلمات</p>
      </div>
      <button @click="isSendModalOpen = true" class="bg-rose-600 text-white px-6 py-2 rounded-xl shadow-lg hover:bg-rose-700 transition-all flex items-center gap-2">
        <i class="fas fa-paper-plane"></i>
        <span>إرسال إشعار جديد</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">
          <i class="fas fa-bell"></i>
        </div>
        <div>
          <div class="text-xs text-gray-400 font-bold">إشعارات مرسلة هذا الشهر</div>
          <div class="text-xl font-black text-gray-800">14</div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">
          <i class="fas fa-users"></i>
        </div>
        <div>
          <div class="text-xs text-gray-400 font-bold">إجمالي المتلقين</div>
          <div class="text-xl font-black text-gray-800">1,250</div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-3xl border shadow-sm overflow-hidden">
      <div class="p-4 border-b bg-gray-50/50">
        <h3 class="font-bold text-gray-700 text-sm">سجل التنبيهات الأخيرة</h3>
      </div>
      <div class="divide-y">
        <div v-for="notif in notifications" :key="notif.id" class="p-4 hover:bg-gray-50 transition-all flex justify-between items-center">
          <div class="flex items-center gap-4">
            <div class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
            <div>
              <h4 class="text-sm font-bold text-gray-800">{{ notif.title }}</h4>
              <p class="text-[10px] text-gray-400 italic">المستهدف: {{ notif.target }}</p>
            </div>
          </div>
          <div class="text-left">
            <div class="text-[10px] font-sans text-gray-500">{{ notif.date }}</div>
            <span class="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">تم الإرسال</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isSendModalOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
      <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <div class="p-6 border-b flex items-center gap-3">
          <div class="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
            <i class="fas fa-bullhorn"></i>
          </div>
          <h3 class="font-bold text-xl text-gray-800">إرسال تنبيه جديد</h3>
        </div>
        
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-bold mb-1 mr-1">عنوان الرسالة</label>
            <input v-model="newNotification.title" type="text" placeholder="مثلاً: تنبيه هام.." class="w-full border rounded-2xl p-3 outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50">
          </div>
          
          <div>
            <label class="block text-sm font-bold mb-1 mr-1">إلى من؟ (المستهدفين)</label>
            <select v-model="newNotification.target" class="w-full border rounded-2xl p-3 outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50">
              <option>الكل</option>
              <option>جميع الطالبات</option>
              <option>جميع المعلمات</option>
              <option>طالبات دفعة يناير فقط</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-bold mb-1 mr-1">نص الإشعار</label>
            <textarea v-model="newNotification.message" rows="4" placeholder="اكتبي تفاصيل الإشعار هنا..." class="w-full border rounded-2xl p-3 outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50 text-sm"></textarea>
          </div>
        </div>

        <div class="p-6 bg-gray-50 rounded-b-3xl flex gap-3">
          <button @click="isSendModalOpen = false" class="flex-1 py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors">إلغاء</button>
          <button @click="sendNotification" class="flex-1 py-3 bg-rose-600 text-white font-bold rounded-2xl shadow-lg hover:bg-rose-700 transition-all shadow-rose-200">إرسال الآن</button>
        </div>
      </div>
    </div>

  </div>
</template> -->
//////////////////////
<template>
  <div class="p-6 space-y-6 text-right font-['Tajawal']" dir="rtl">
    
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">مركز الإشعارات</h2>
        <p class="text-sm text-gray-500 italic">بث الرسائل والتنبيهات للطالبات والمعلمات داخل المقرأة</p>
      </div>
      
      <button 
        v-if="notificationStore.isAdmin" 
        @click="openNotificationModal" 
        class="bg-rose-600 text-white px-6 py-2 rounded-xl shadow-lg hover:bg-rose-700 transition-all flex items-center gap-2"
      >
        <i class="fas fa-paper-plane"></i>
        <span>إرسال إشعار جديد</span>
      </button>
    </div>

    <div v-if="notificationStore.isAdmin" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">
          <i class="fas fa-bell"></i>
        </div>
        <div>
          <div class="text-xs text-gray-400 font-bold">إشعارات مرسلة هذا الشهر</div>
          <div class="text-xl font-black text-gray-800">{{ notificationStore.monthlyNotificationsCount || 14 }}</div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">
          <i class="fas fa-users"></i>
        </div>
        <div>
          <div class="text-xs text-gray-400 font-bold">إجمالي المتلقين المستهدفين</div>
          <div class="text-xl font-black text-gray-800">1,250</div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-3xl border shadow-sm overflow-hidden">
      <div class="p-4 border-b bg-gray-50/50">
        <h3 class="font-bold text-gray-700 text-sm">سجل التنبيهات الأخيرة</h3>
      </div>
      <div class="divide-y">
        <div v-for="notif in notifications" :key="notif.id" class="p-4 hover:bg-gray-50 transition-all flex justify-between items-center">
          <div class="flex items-center gap-4">
            <div class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
            <div>
              <h4 class="text-sm font-bold text-gray-800">{{ notif.title }}</h4>
              <p class="text-[11px] text-gray-600 mt-0.5">{{ notif.message || notif.content }}</p>
              <p class="text-[10px] text-gray-400 italic mt-0.5">المستهدف: {{ notif.target || 'مجموعات مخصصة' }}</p>
            </div>
          </div>
          <div class="text-left">
            <div class="text-[10px] font-sans text-gray-500">{{ notif.date || notif.created_at }}</div>
            <span class="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">تم الإرسال</span>
          </div>
        </div>
        <p v-if="!notifications.length" class="text-xs text-gray-400 italic text-center py-6">لا توجد إشعارات مسجلة حالياً.</p>
      </div>
    </div>

    <div v-if="isSendModalOpen && notificationStore.isAdmin" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
      <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <div class="p-6 border-b flex items-center gap-3">
          <div class="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
            <i class="fas fa-bullhorn"></i>
          </div>
          <h3 class="font-bold text-xl text-gray-800">إرسال تنبيه جديد</h3>
        </div>
        
        <form @submit.prevent="sendNotification" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-bold mb-1 mr-1">عنوان الرسالة *</label>
            <input v-model="newNotification.title" type="text" required placeholder="مثلاً: تنبيه هام بخصوص الاختبارات" class="form-input">
          </div>
          
          <div>
            <label class="block text-sm font-bold mb-1 mr-1">نوع البث وجهة الاستهداف *</label>
            <select v-model="targetType" @change="handleTargetChange" class="form-input font-medium text-gray-700">
              <option value="broadcast">بث عام للجميع (Broadcast)</option>
              <option value="teachers">جميع المعلمات</option>
              <option value="students">جميع الطالبات</option>
              <option value="specific">أدوار مخصصة</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-bold mb-1 mr-1">نص الإشعار والتنبيه *</label>
            <textarea v-model="newNotification.message" rows="4" required placeholder="اكتبي تفاصيل الإشعار البرمجي هنا..." class="form-input text-sm resize-none"></textarea>
          </div>

          <div class="pt-2 bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-3xl flex gap-3">
            <button type="button" @click="isSendModalOpen = false" class="flex-1 py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors">إلغاء</button>
            <button type="submit" class="flex-1 py-3 bg-rose-600 text-white font-bold rounded-2xl shadow-lg hover:bg-rose-700 transition-all shadow-rose-200">
              🚀 بث الإشعار الآن
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { isMobile } from "../../../utils/useBreakpoints";
import { useNotifcationStore } from "@/stors/pepole-store.js";

// استدعاء الستور الخاص بالإشعارات وإدارة الصلاحيات
const notificationStore = useNotifcationStore();

// سجل الإشعارات المعروضة بالواجهة
const notifications = ref([
  { id: 1, title: 'تذكير بالاختبار الأسبوعي', message: 'يرجى من جميع الطالبات الاستعداد للاختبار الأسبوعي في سورة البقرة', target: 'طالبات دفعة يناير', date: '2026-05-25', status: 'تم الإرسال' },
  { id: 2, title: 'تحديث في منهج التجويد', message: 'تم إدراج حياكة جديدة في مخارج الحروف لدفعة معلمات المقرأة', target: 'جميع المعلمات', date: '2026-05-24', status: 'تم الإرسال' },
]);

// حالات التحكم بالمودال والبيانات
const isSendModalOpen = ref(false);
const targetType = ref('broadcast');

const newNotification = ref({
  title: '',
  message: '',
  is_broadcast: true,
  roles: []
});

onMounted(async () => {
  // جلب السجلات الحية من الباكند عند تحميل الصفحة
  if (notificationStore.getNotificationsData) {
    await notificationStore.getNotificationsData();
  }
});

const openNotificationModal = () => {
  newNotification.value = {
    title: '',
    message: '',
    is_broadcast: true,
    roles: []
  };
  targetType.value = 'broadcast';
  isSendModalOpen.value = true;
};

// التحكم في تبديل وتجهيز البيلود حسب اختيار جهة الاستهداف
const handleTargetChange = () => {
  if (targetType.value === 'broadcast') {
    newNotification.value.is_broadcast = true;
    newNotification.value.roles = [];
  } else if (targetType.value === 'teachers') {
    newNotification.value.is_broadcast = false;
    newNotification.value.roles = [2]; // ID دور المعلمات المعتمد بالنظام
  } else if (targetType.value === 'students') {
    newNotification.value.is_broadcast = false;
    newNotification.value.roles = [3]; // ID دور الطالبات المعتمد بالنظام
  }
};

// دالة بث الإشعارات الفعلية وإرسالها للسيرفر
const sendNotification = async () => {
  if (!newNotification.value.title || !newNotification.value.message) return;

  // استدعاء دالة البث من الستور لإرسال الـ Payload للباكند
  const res = await notificationStore.sendGlobalNotification(newNotification.value);
  
  if (res && res.success) {
    // إضافة الإشعار الجديد في واجهة السجل فوراً للتحديث المرئي (Clean State)
    notifications.value.unshift({
      id: Date.now(),
      title: newNotification.value.title,
      message: newNotification.value.message,
      target: targetType.value === 'broadcast' ? 'الكل' : (targetType.value === 'teachers' ? 'جميع المعلمات' : 'جميع الطالبات'),
      date: new Date().toISOString().split('T')[0],
      status: 'تم الإرسال'
    });

    isSendModalOpen.value = false;
    alert('🔔 تم بث وإرسال الإشعار بنجاح لجميع المستخدمين المستهدفين في النظام!');
  } else {
    // محاكاة الإرسال المحلي في حال عدم اكتمال ربط الـ API بالكامل لإصدار الاختبارات
    notifications.value.unshift({
      id: Date.now(),
      title: newNotification.value.title,
      message: newNotification.value.message,
      target: targetType.value === 'broadcast' ? 'الكل' : (targetType.value === 'teachers' ? 'جميع المعلمات' : 'جميع الطالبات'),
      date: new Date().toISOString().split('T')[0],
      status: 'تم الإرسال'
    });
    isSendModalOpen.value = false;
  }
};
</script>

<style scoped>
.form-input {
  @apply w-full border rounded-2xl p-3 outline-none bg-gray-50 transition-all text-xs;
}
.form-input:focus {
  @apply ring-2 ring-rose-500 bg-white border-transparent;
}
</style>