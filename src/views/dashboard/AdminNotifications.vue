<!-- تتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتت -->

<!-- تتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتت -->

<template>
  <div class="p-4 md:p-8 space-y-8 text-right font-['Tajawal',_sans-serif] bg-gray-50/50 min-h-screen" dir="rtl">
    
    <!-- الهيدر الرئيسي -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
      <div>
        <h2 class="text-2xl md:text-3xl font-black text-[#802c2c] tracking-tight flex items-center gap-3">
          <span class="w-2.5 h-6 bg-[#802c2c] rounded-full inline-block"></span>
          مركز بث الإشعارات
        </h2>
        <p class=" pr-6 text-xs md:text-sm text-gray-500 font-medium mt-1">بث التنبيهات والتوجيهات عبر النظام</p>
      </div>
      
      <!-- زر البث: يظهر للأدمن المسؤول عن الجلسة فقط -->
      <button 
        v-if="isAdmin"
        @click="openCreateModal" 
        class="bg-[#802c2c] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-red-900/10 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
      >
        <i class="fas fa-paper-plane text-xs"></i>
        <span>بث إشعار جديد</span>
      </button>
    </div>

    <!-- الإحصائيات: تظهر للأدمن فقط لتأمين بيانات لوحة التحكم -->
    <div v-if="isAdmin" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
        <div class="flex items-center gap-5">
          <div class="w-14 h-14 bg-red-50 text-[#802c2c] rounded-2xl flex items-center justify-center text-xl shadow-inner">
            <i class="fas fa-bell"></i>
          </div>
          <div>
            <div class="text-xs text-gray-400 font-bold">إشعارات بُثت هذا الشهر</div>
            <div class="text-2xl font-black text-gray-800 mt-1">
              {{ totalCount }} <span class="text-xs font-normal text-gray-400">تنبيه</span>
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
             {{ totalUsersInSystem }} <span class="text-xs font-normal text-gray-400">مستفيد</span>
            </div>
          </div>
        </div>
        <div class="text-gray-300 text-lg"><i class="fas fa-arrow-left"></i></div>
      </div>
    </div>

    <!-- أرشيف التنبيهات -->
    <div class="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
      <div class="p-5 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
        <h3 class="font-black text-gray-700 text-sm flex items-center gap-2">
          <i class="fas fa-history text-gray-400"></i>
          أرشيف التنبيهات الأخيرة
        </h3>
        <span class="text-xs bg-red-50 text-[#802c2c] font-bold px-3 py-1 rounded-full">
          {{ totalCount }} تنبيه متاح لكِ
        </span>
      </div>

      <!-- مؤشر التحميل والتغذية الراجعة (Feedback Loading) -->
      <div v-if="isLoading" class="p-12 text-center">
        <div class="w-10 h-10 border-4 border-[#802c2c] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p class="text-xs text-gray-500 font-medium animate-pulse">جاري مزامنة وجلب التنبيهات من الأرشيف...</p>
      </div>
      
      <div v-else-if="notifications.length > 0" class="divide-y divide-gray-50">
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
              
              <!-- حجب معلومات الاستهداف التفصيلية وعرضها للأدمن فقط حماية للخصوصية -->
              <div v-if="isAdmin" class="flex items-center gap-2 pt-1">
                <span class="text-[10px] bg-amber-50 text-amber-700 font-black px-2 py-0.5 rounded-md">
                  المستهدف: 
                  <span v-if="notif.is_broadcast">|الكل|</span>
                  <span v-else v-for="role in notif.notification_roles" :key="role.role_id">
                 |{{ role.role_name }} |
                  </span>
                </span>
              </div>
            </div>
          </div>
          
          <div class="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0">
            <div class="text-[11px] text-gray-400 font-medium flex items-center gap-1.5">
              <span v-if="isAdmin" class="text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded text-[10px]">● تم الإرسال</span>
                            <span v-else class="text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded text-[10px]">● تم التسليم</span>

            </div>
            
            <!-- أزرار الإجراءات (Actions): تظهر حصرياً للأدمن المسؤول عن النظام -->
            <div v-if="isAdmin" class="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button 
                @click="openEditModal(notif)" 
                title="تعديل الإشعار" 
                class="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center text-xs"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button 
                @click="confirmDelete(notif.id)" 
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

    <!-- مودال البث والتعديل: مقيد للأدمن كخط دفاعي إضافي لمنع الاستدعاء غير المصرح به -->
    <div v-if="isSendModalOpen && isAdmin" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[150] p-4 overflow-y-auto">
      <div class="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 transform transition-all my-auto">
        
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-red-50 text-[#802c2c] rounded-xl flex items-center justify-center">
              <i class="fas fa-bullhorn text-sm"></i>
            </div>
            <div>
              <h3 class="font-black text-lg text-gray-800">{{ isEditing ? 'تعديل وتحديث التنبيه' : 'بث تنبيه جديد' }}</h3>
              <p class="text-[11px] text-gray-400 mt-0.5">سيتم تسجيل البيانات في قاعدة البيانات وبثها </p>
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
            <label class="block text-xs font-bold text-gray-500 mb-2 mr-1">تحديد الشريحة المستهدفة (يمكن اختيار خيارات متعددة)</label>
            
            <div class="max-h-40 overflow-y-auto bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1 scrollbar-thin">
              
              <label class="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors select-none">
                <input 
                  type="checkbox" 
                  value="all"
                  v-model="newNotification.targets"
                  @change="handleAllCheckboxChange"
                  class="w-4 h-4 accent-[#802c2c] rounded border-gray-300 focus:ring-[#802c2c]"
                >
                <span class="text-xs font-bold text-[#802c2c]">الكل (بث عام للجميع)</span>
              </label>

              <hr class="border-gray-200/60 my-1">
         
              <label 
                v-for="role in availableRoles" 
                :key="role.id"
                class="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors select-none"
              >
                <input 
                  type="checkbox" 
                  :value="role.code"
                  v-model="newNotification.targets"
                  @change="handleSpecificCheckboxChange"
                  class="w-4 h-4 accent-[#802c2c] rounded border-gray-300 focus:ring-[#802c2c]"
                >
                <span class="text-xs font-bold text-gray-700">{{ role.name }}</span>
              </label>
            </div> 
            <span v-if="errors.targets" class="text-rose-600 text-xs mt-1 block pr-1">{{ errors.targets }}</span>
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
            {{ isEditing ? 'حفظ وتحديث السجل' : 'بث الإشعار الآن' }}
          </button>
        </div>
      </div>
    </div>

    <!-- مكونات التغذية الراجعة التفاعلية -->
    <ConfirmModal 
      :show="isConfirmOpen"
      :loading="isconfirmLouading"
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

  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useNotifcationStore } from "@/stors/notification-store.js";
import { usePepoleStore } from "@/stors/pepole-store.js";
import { useAuthStore } from "@/stors/acount-store.js"; //[cite: 1] استيراد ستور المصادقة الجديد للربط بالجلسة
import ConfirmModal from '@/components/confirmAndSucces/ConfirmModal.vue'; 
import SuccessToast from '@/components/confirmAndSucces/SuccessToast.vue';

const notificationStore = useNotifcationStore();
const pepoleStore = usePepoleStore();
const authStore = useAuthStore(); //[cite: 1] تفعيل ستور المصادقة لاستخراج بيانات الجلسة الحالية

// Feedback & Modals State
const isConfirmOpen = ref(false);
const confirmData = ref({ title: '', message: '', actionType: '', id: null });
const isToastVisible = ref(false);
const toastMsg = ref('');

const notifications = ref([]);
const isconfirmLouading = ref(false);
const availableRoles = ref([]); 
const isSendModalOpen = ref(false);
const isEditing = ref(false);
const currentNotificationId = ref(null);
const isLoading = ref(false);

const newNotification = reactive({
  title: '',
  message: '',
  targets: []
});

const errors = reactive({
  title: '',
  message: '',
  targets: ''
});

//[cite: 1] فحص الصلاحيات الإدارية للجلسة الحالية الحية بناءً على المتجر الجديد
const isAdmin = computed(() => {
  const currentRoleDetails = authStore.getCrrentRoleDetails; //[cite: 1] جلب تفاصيل الدور الفعلي المختار حالياً
  if (currentRoleDetails && currentRoleDetails.code) {
    return currentRoleDetails.code === 'admin' || currentRoleDetails.code === 'super_admin';
  }
  // كخيار احتياطي إذا لم تكن التفاصيل جاهزة بعد من الـ Getters
  return authStore.sessionRole === 'admin' || authStore.sessionRole === 'super_admin'; //[cite: 1]
});

//[cite: 1] جلب الـ ID الخاص بدور الجلسة الحالية لفلترة إشعارات المستفيدين
const currentUserRoleId = computed(() => {
  return authStore.sessionRole; //[cite: 1] يمثل المعرف الرقمي أو الكود المعتمد لدور المستخدم الحالي
});

const totalCount = computed(() => notifications.value.length); 
const totalUsersInSystem = computed(() => pepoleStore.getTotalUsersCount || 0);

const showToast = (msg) => {
  toastMsg.value = msg;
  isToastVisible.value = true;
  setTimeout(() => {
    isToastVisible.value = false;
  }, 3000);
};

// جلب وتحديث البيانات ومزامنتها حسب الصلاحيات والدور الفعلي للجلسة الحالية[cite: 1]
const refreshData = async () => {
  isLoading.value = true;
  
  // استدعاء جلب كامل سجلات الإشعارات من السيرفر
  await notificationStore.getAllnotifcations();
  
  if (isAdmin.value) {
    // الإدارة ترى كامل السجلات التاريخية دون قيود للتحكم والمراقبة
    notifications.value = notificationStore.getnotfications;
  } else {
    // الطالبات والمعلمات يتم تصفية وعرض التنبيهات العامة أو التي تطابق دورهن الحالي فقط[cite: 1]
    if (notificationStore.getNotificationsByRole) {
      console.log(currentUserRoleId.value,"curreint rolle")
      notifications.value = notificationStore.getNotificationsByRole(currentUserRoleId.value); //[cite: 1]
    } else {
      notifications.value = notificationStore.getnotfications;
    }
  }
  
  isLoading.value = false;
};

onMounted(async () => {
  isLoading.value = true;
  if(isAdmin.value){
  usePepoleStore.getPeapleStoreData;
  await pepoleStore.getAllRoles();

}// جلب بيانات الأشخاص لتحديث الأدوار والإحصائيات
  
  // تصفية وحفظ الأدوار المتاحة داخل الـ ref بشكل صحيح لخيارات بث الإدارة
  if (pepoleStore.getRoles) {
    availableRoles.value = pepoleStore.getRoles.filter(
      role => role.code !== "super_admin"
    );
  }
  
  // مزامنة وعرض البيانات فوراً بناءً على الدور الحالي في الجلسة[cite: 1]
  await refreshData();
});

/* ============================================================
   منطق تفاعل الـ Checkboxes
-[;o]   ============================================================ */
const handleAllCheckboxChange = () => {
  if (newNotification.targets.includes('all')) {
    newNotification.targets = ['all', ...availableRoles.value.map(role => role.code)];
  } else {
    newNotification.targets = [];
  }
  errors.targets = '';
};

const handleSpecificCheckboxChange = () => {
  if (newNotification.targets.includes('all')) {
    const hasAllRoles = availableRoles.value.every(role => newNotification.targets.includes(role.code));
    if (!hasAllRoles) {
      newNotification.targets = newNotification.targets.filter(t => t !== 'all');
    }
  }
  
  const hasAllRolesSelected = availableRoles.value.every(role => newNotification.targets.includes(role.code));
  if (hasAllRolesSelected && !newNotification.targets.includes('all')) {
    newNotification.targets.push('all');
  }
  errors.targets = '';
};

/* ============================================================
   التحقق وعمليات الـ API (CRUD)
   ============================================================ */
const validateFields = () => {
  let isValid = true;
  if (!newNotification.title.trim()) { errors.title = 'عذراً، لا يمكن ترك عنوان الرسالة فارغاً.'; isValid = false; }
  if (!newNotification.message.trim()) { errors.message = 'عذراً، يجب كتابة تفاصيل ونص الإشعار قبل البث.'; isValid = false; }
  if (newNotification.targets.length === 0) { errors.targets = 'يرجى تحديد شريحة مستهدفة واحدة على الأقل للبث.'; isValid = false; }
  return isValid;
};

const sendNotification = async () => {
  if (!validateFields()) return;

  const isBroadcast = newNotification.targets.includes('all') || availableRoles.value.every(role => newNotification.targets.includes(role.code));
  
  const notification_roles = newNotification.targets
    .filter(target => target !== 'all')
    .map(target => availableRoles.value.find(r => r.code === target)?.id)
    .filter(Boolean);

  const payload = {
    title: newNotification.title,
    message: newNotification.message,
    is_broadcast: isBroadcast,
    roles: notification_roles
  };

  isLoading.value = true;
  let result;
  if (isEditing.value) {
    result = await notificationStore.updatenotifcation(currentNotificationId.value, payload);
    if (result && result.success) {
      showToast("تم تحديث وتعديل التنبيه بنجاح!");
      handleCloseModal();
      await refreshData();
    }
  } else {
    if (!isBroadcast) {
      result = await notificationStore.createNotifcation(payload);
    } else {
      const payloadBroadcast = {
        title: newNotification.title,
        message: newNotification.message,
        is_broadcast: true,
        roles: []
      };
      result = await notificationStore.createNotifcation(payloadBroadcast);
    }
    
    if (result && result.success) {
      showToast("تم بث وإرسال التنبيه بنجاح!");
      handleCloseModal();
      await refreshData();
    }
  }
  isLoading.value = false;
};

const openCreateModal = () => {
  resetForm();
  isSendModalOpen.value = true;
};

const openEditModal = (notif) => {
  isEditing.value = true;
  currentNotificationId.value = notif.id;
  newNotification.title = notif.title;
  newNotification.message = notif.message;
  
  newNotification.targets = [];
  const rolesCodes = availableRoles.value.map(r => r.code);

  if (notif.is_broadcast) {
    newNotification.targets = ['all', ...rolesCodes];
  } else if (notif.notification_roles && notif.notification_roles.length > 0) {
    const savedCodes = notif.notification_roles.map(role => role.role_code || role.code).filter(Boolean);
    newNotification.targets = [...savedCodes];
    
    if (newNotification.targets.length === availableRoles.value.length) {
      newNotification.targets.push('all');
    }
  }

  isSendModalOpen.value = true;
};

const confirmDelete = (id) => {
  confirmData.value = {
    title: 'حذف الإشعار نهائياً',
    message: 'هل أنتِ متأكدة من حذف هذا التنبيه نهائياً من أرشيف المنصة والسيرفر؟ لا يمكن التراجع عن هذا الإجراء.',
    actionType: 'delete',
    id: id
  };
  isConfirmOpen.value = true;
};

const executeAction = async () => {
  if (confirmData.value.actionType === 'delete') {
    isconfirmLouading.value = true;
    const result = await notificationStore.deletenotifcation(confirmData.value.id);
    
    if (result && result.success) {
      isconfirmLouading.value = false;
      showToast("تم حذف التنبيه بنجاح!");
      isConfirmOpen.value = false;
      await refreshData(); 
    } else {
      showToast(result.error || "عذراً، فشل حذف الإشعار.");
      isConfirmOpen.value = false;
    }
  }
};

const resetForm = () => {
  newNotification.title = '';
  newNotification.message = '';
  newNotification.targets = [];
  errors.title = '';
  errors.message = '';
  errors.targets = '';
  isEditing.value = false;
  currentNotificationId.value = null;
};

const handleCloseModal = () => {
  isSendModalOpen.value = false;
  resetForm();
};
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 5px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
<!-- تتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتتت -->