<template>
  <div v-if="isOpen" class="modal-overlay" dir="rtl">
    <div class="modal-content rtl-dir">
      
      <div class="modal-header">
        <h3 class="text-base font-black text-[var(--color-primary)] flex items-center gap-2">
          <i :class="['fas text-sm', isEditMode ? 'fa-edit text-amber-600' : 'fa-user-plus text-[var(--color-primary)]']"></i>
          {{ isEditMode ? 'تعديل صلاحيات الحساب' : 'إنشاء حساب' }}
        </h3>
        <button @click="$emit('close')" class="close-btn text-gray-400 hover:text-gray-600 transition-colors">&times;</button>
      </div>

      <form @submit.prevent="submitForm" class="p-6 space-y-5">
        
        <div class="form-group">
          <label class="label">البريد الإلكتروني (Email Address) *</label>
          <div class="input-wrapper">
            <i class="fas fa-envelope icon"></i>
            <input 
              v-model="formData.email" 
              type="email" 
              :readonly="!isEditMode && formData.email !== ''" 
              class="input-field text-left font-mono"
              :class="{'bg-gray-100/70 border-gray-100 cursor-not-allowed': !isEditMode && formData.email !== ''}"
              placeholder="example@nour-maqraa.com"
              dir="ltr"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label class="label">الأدوار والوظائف الممنوحة *</label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
            <label v-for="role in availableRoles" :key="role.code" class="role-selector">
              <input 
                type="checkbox" 
                :value="role.code" 
                v-model="formData.role_codes"
                class="hidden-input peer"
              >
              <div class="role-card peer-checked:border-amber-700 peer-checked:bg-amber-50/60 peer-checked:text-amber-900">
                <i :class="['fas ml-1.5 text-xs', role.icon, formData.role_codes.includes(role.code) ? 'text-amber-700' : 'text-gray-400']"></i>
                {{ role.name }}
              </div>
            </label>
          </div>
        </div>

        <div class="form-group" v-if="formData.role_codes.length > 0">
          <label class="label">الدور والواجهة الأساسية (Preferred Role) *</label>
          <div class="relative">
            <select v-model="formData.preferred_role" class="input-field appearance-none select-custom" required>
              <option value="" disabled>اختر لوحة التحكم الافتراضية عند تسجيل الدخول...</option>
              <option v-for="code in formData.role_codes" :key="code" :value="code">
                {{ getRoleArabicName(code) }} ({{ code.toUpperCase() }})
              </option>
            </select>
            <i class="fas fa-chevron-down absolute left-4 top-4 text-gray-400 pointer-events-none"></i>
          </div>
        </div>

        <div class="flex gap-3 pt-4 border-t border-gray-50">
          <button type="button" @click="$emit('close')" class="btn-cancel">إلغاء</button>
          <button 
            type="submit" 
            class="btn-submit" 
            :class="isEditMode ? 'bg-amber-700 shadow-amber-100' : 'bg-[var(--color-primary)] shadow-red-900/10'" 
            :disabled="isLoading"
          >
            <i v-if="isLoading" class="fas fa-spinner fa-spin ml-2"></i>
            {{ isEditMode ? 'حفظ التغييرات' : 'إنشاء الحساب ' }}
          </button>
        </div>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { usePepoleStore } from "@/stors/pepole-store.js";

const pepoleStore = usePepoleStore();

const props = defineProps(['isOpen', 'mode', 'userData']);
const emit = defineEmits(['close', 'refresh']);

const isLoading = ref(false);
const isEditMode = computed(() => props.mode === 'edit');

// القائمة الكاملة للأدوار بالمسميات المطابقة للـ API والنظام بلمسة مؤنثة متناسقة
const availableRoles = [
  { id: 1, name: 'مدير النظام', code: 'super_admin', icon: 'fa-user-shield' },
  { id: 2, name: 'مشرفة الدفعة', code: 'batch_supervisor', icon: 'fa-folder-open' },
  { id: 3, name: 'مشرفة المجموعة', code: 'group_supervisor', icon: 'fa-users-cog' },
  { id: 4, name: 'معلمة', code: 'teacher', icon: 'fa-chalkboard-teacher' },
  { id: 5, name: 'طالبة', code: 'student', icon: 'fa-user-graduate' },
];

const formData = reactive({
  email: '',
  person_id: 0,
  role_codes: [],
  preferred_role: '',
  force_reset_password: true
});

// مساعدة لجلب الاسم العربي للدور المفضل داخل الـ Select
const getRoleArabicName = (code) => {
  const match = availableRoles.find(r => r.code === code);
  return match ? match.name : code;
};

// مراقبة فتح المودال لتعبئة البيانات تلقائياً وبأمان
watch(() => props.isOpen, (val) => {
  if (val && props.userData) {
    formData.person_id = props.userData.id || 0;
    formData.email = props.userData.email || '';
    
    if (isEditMode.value && props.userData.accountDetails) {
      // استخراج الـ codes البرمجية من الكائنات المرجعة من السيرفر
      formData.role_codes = props.userData.accountDetails.roles?.map(r => r.code) || [];
      formData.preferred_role = props.userData.accountDetails.preferred_role || '';
    } else {
      formData.role_codes = [];
      formData.preferred_role = '';
    }
  }
});

// دالة الإرسال مجهزة لإغلاق البوب اب وإرسال إشارة التحديث للصفحة الرئيسية
const submitForm = async () => {
  isLoading.value = true;
  try {
    let result;
    
    if (isEditMode.value) {
      // إذا كان للستور دالة تعديل صلاحيات مخصصة (مثلاً updateAccount)
      if (pepoleStore.updateAccount) {
        result = await pepoleStore.updateAccount(formData);
      } else {
        result = await pepoleStore.createAccount(formData);
      }
    } else {
      // نداء الإنشاء الافتراضي لحساب جديد
      result = await pepoleStore.createAccount(formData);
    }

    // فحص نجاح العملية لإغلاق البوب اب والتحديث الفوري
    if (result && result.success !== false) {
      emit('refresh'); // إرسال إشارة لـ viewUsers لإغلاق المودال وإظهار الـ Toast
    }
  } catch (error) {
    console.error("خطأ أثناء معالجة حساب العضو:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@reference "@/css/style.css";

.modal-overlay { 
  @apply fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4; 
}
.modal-content { 
  @apply bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100; 
}
.modal-header { 
  @apply p-6 border-b border-gray-50 flex justify-between items-center; 
}
.close-btn {
  @apply text-2xl font-light leading-none;
}

.form-group { 
  @apply flex flex-col gap-1.5; 
}
.label { 
  @apply text-[11px] font-black text-gray-400 mb-0.5; 
}

.input-field {
  @apply w-full p-3 rounded-2xl border border-gray-200 bg-[var(--color-background)] outline-none 
         focus:border-amber-700 focus:bg-white transition-all text-sm font-bold text-gray-700 shadow-sm;
}
.input-wrapper { 
  @apply relative; 
}
.icon { 
  @apply absolute right-4 top-4 text-gray-400 text-sm; 
}
/* إزاحة حقل الإدخال ليناسب الأيقونة من اليمين في تصميم الـ RTL */
.rtl-dir .input-field { 
  @apply pr-11; 
}

/* تنسيق بطاقات الأدوار التفاعلية */
.role-selector { 
  @apply cursor-pointer relative block select-none; 
}
.hidden-input { 
  @apply absolute opacity-0 w-0 h-0; 
}
.role-card {
  @apply px-3 py-2.5 rounded-xl border border-gray-200 text-[11px] font-black text-gray-500 
         transition-all flex items-center justify-start bg-gray-50/50 hover:border-amber-200 hover:bg-white;
}

/* أزرار الحفظ والإلغاء */
.btn-submit {
  @apply text-white px-6 py-3 rounded-xl font-black text-xs transition-all 
         hover:opacity-90 active:scale-95 shadow-md disabled:opacity-50 flex-1;
}
.btn-cancel { 
  @apply text-gray-500 bg-gray-50 border border-gray-200 rounded-xl font-bold text-xs hover:bg-gray-100 px-6 py-3 transition-colors flex-1; 
}

.rtl-dir { 
  direction: rtl; 
  text-align: right; 
}
.select-custom { 
  @apply cursor-pointer pl-10; 
}
</style>