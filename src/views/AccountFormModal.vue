<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content ltr-dir">
      
      <div class="modal-header">
        <h3 class="text-lg font-black text-gray-800">
          <i :class="['fa mr-2', isEditMode ? 'fa-pencil text-orange-500' : 'fa-user-plus text-blue-600']"></i>
          {{ isEditMode ? 'تعديل حساب نشط' : 'إنشاء حساب جديد' }}
        </h3>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>

      <form @submit.prevent="submitForm" class="p-6 space-y-5">
        
        <div class="form-group">
          <label class="label">البريد الإلكتروني (Email Address)</label>
          <div class="input-wrapper">
            <i class="fa fa-envelope icon"></i>
            <input 
              v-model="formData.email" 
              type="email" 
              :readonly="!isEditMode && formData.email !== ''" 
              class="input-field"
              :class="{'bg-gray-50': !isEditMode}"
              placeholder="example@system.com"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label class="label">الأدوار الممنوحة (Role Codes)</label>
          <div class="flex flex-wrap gap-2 mt-1">
            <label v-for="role in availableRoles" :key="role.code" class="role-selector">
              <input 
                type="checkbox" 
                :value="role.code" 
                v-model="formData.role_codes"
                class="hidden-input peer"
              >
              <div class="role-card peer-checked:border-blue-600 peer-checked:bg-blue-50">
                <i :class="['fa mr-1.5', role.icon]"></i>
                {{ role.name }}
              </div>
            </label>
          </div>
        </div>

        <div class="form-group" v-if="formData.role_codes.length > 0">
          <label class="label">الدور الأساسي (Preferred Role)</label>
          <div class="relative">
            <select v-model="formData.preferred_role" class="input-field appearance-none select-custom" required>
              <option value="" disabled>اختر الدور المفضل للمستخدم</option>
              <option v-for="code in formData.role_codes" :key="code" :value="code">
                {{ code.toUpperCase() }}
              </option>
            </select>
            <i class="fa fa-chevron-down absolute right-4 top-4 text-gray-400 pointer-events-none"></i>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-8">
          <button type="button" @click="$emit('close')" class="btn-cancel">إلغاء</button>
          <button type="button" @click="submitForm" class="btn-submit" :class="isEditMode ? 'bg-orange-500 shadow-orange-100' : 'bg-blue-600 shadow-blue-100'" :disabled="isLoading">
            <i v-if="isLoading" class="fa fa-spinner fa-spin mr-2"></i>
            {{ isEditMode ? 'حفظ التغييرات' : 'إنشاء الحساب الآن' }}
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

const availableRoles = [
  { name: 'مدير', code: 'super_admin', icon: 'fa-shield' },
  { name: 'معلم', code: 'teacher', icon: 'fa-graduation-cap' },
  { name: 'مشرف', code: 'batch_supervisor', icon: 'fa-eye' },
  { name: 'طالب', code: 'student', icon: 'fa-book' },
];

const formData = reactive({
                              // "raw": "{\n  
                                // \"person_id\": 1,\n  
                                
                                // \"role_codes\": [\"student\"],\n  
                                  // \"preferred_role\": \"student\",\n   
                                  //  \"force_reset_password\": true\n}"

    //      "raw": "{\n    \"email\": \"newuser@example.com\",\n   
    //  \"role_codes\": [\"teacher\"],\n  
    //   \"preferred_role\": \"teacher\"\n}"
  email:'',
  person_id: 0,
  role_codes: [],
  preferred_role: '',
  force_reset_password: true
});

// تعبئة البيانات عند فتح المودال
watch(() => props.isOpen, (val) => {
  if (val && props.userData) {
    formData.person_id = props.userData.id || 0;
    formData.email = props.userData.email || '';
    if (isEditMode.value) {
      formData.role_codes = props.userData.accountDetails?.roles.map(r => r.code) || [];
      formData.preferred_role = props.userData.accountDetails?.preferred_role || '';
    } else {
      formData.role_codes = [];
      formData.preferred_role = '';
    }
  }
});

const submitForm = async () => {
    console.log("addd acountttttttttttt")
  isLoading.value = true;
  await pepoleStore.createAccount(formData);
    isLoading.value = false;

//   try {
//     // محاكاة الطلب (هنا تضعين نداء Axios الخاص بكِ)
//     console.log("Payload المرسل:", JSON.stringify(formData, null, 2));
    
//     // إشعار نجاح
//     setTimeout(() => {
//       isLoading.value = false;
//       emit('refresh');
//       emit('close');
//     }, 8000);
//   } catch (error) {
//     isLoading.value = false;
//     alert("حدث خطأ أثناء معالجة الطلب");
//   }
};
</script>

<style scoped>
@reference "@/css/style.css";

.modal-overlay { @apply fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4; }
.modal-content { @apply bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-white/20; }
.modal-header { @apply p-8 border-b border-gray-50 flex justify-between items-center; }

.form-group { @apply flex flex-col gap-2; }
.label { @apply text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1; }

.input-field {
  @apply w-full p-4 rounded-3xl border-2 border-gray-50 bg-gray-50/30 outline-none 
         focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-gray-700;
}
.input-wrapper { @apply relative; }
.icon { @apply absolute left-5 top-5 text-gray-300 text-sm; }
.input-field { @apply pl-12; }

/* تنسيق اختيار الأدوار كبطاقات */
.role-selector { @apply cursor-pointer relative; }
.hidden-input { @apply absolute opacity-0 w-0 h-0; }
.role-card {
  @apply px-4 py-3 rounded-2xl border-2 border-gray-100 text-[11px] font-black text-gray-500 
         transition-all flex items-center hover:border-blue-200;
}

.btn-submit {
  @apply text-white px-10 py-4 rounded-[2rem] font-black text-sm transition-all 
         hover:scale-105 active:scale-95 shadow-xl disabled:opacity-50;
}
.btn-cancel { @apply text-gray-400 font-bold text-sm hover:text-red-500 px-4 transition-colors; }

.ltr-dir { direction: ltr; text-align: left; }
.select-custom { @apply cursor-pointer pr-10; }
</style>