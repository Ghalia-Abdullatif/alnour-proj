<template>
  <div class="flex flex-col items-stretch sm:items-center justify-center 
  min-h-screen
   bg-[url('/assets/images/loginbg.jpg')] bg-cover bg-center 
   sm:p-4">
    
    <div class="auth-card ">
      
      <div class="flex flex-col items-center justify-center mb-8">
        <div class="w-24 h-24 rounded-full shadow-lg flex items-center justify-center mb-4 bg-background">
          <img src="/assets/logos/logo.png" alt="Logo" class="w-20 h-20 object-contain" />
        </div>
        <h2 class="text-2xl font-bold text-green-primary font-droid text-center">مقرأة النور الإلكترونية</h2>
        <p class="text-gray-500 text-sm mt-2 text-center">يرجى إدخال بياناتك للوصول إلى لوحة التحكم</p>
      </div>

      <form ref="loginForm" @submit.prevent="handleLogin" class="space-y-6" novalidate>
        
        <div class="relative group">
          <FieldContainer :errors="errors" :required="true" name="username">
            <input 
              name="username"
              v-model="form.username"
              type="text" 
              placeholder="معرف الحساب أو البريد"
              class="w-full"
              required
              @blur="validateField($event.target)" 
            /></FieldContainer>
        </div>

        <div class="relative group">
          <FieldContainer :errors="errors" :required="true" name="password">
            <PasswordField 
              name="password"
              v-model="form.password" 
              :required="true" 
              placeholder="كلمة المرور" 
              @blur="validateField($event.target)"
            /></FieldContainer>
        </div>

        <BaseButton
          :loading="loading" 
          label="تسجيل الدخول" 
          icon="fas fa-sign-in-alt" 
          @click.prevent="handleLogin" 
        />
      </form>

      <div class="mt-8 pt-6 border-t border-gray-100 text-center">
        <p class="text-sm text-gray-600">
          نسيت كلمة المرور ؟
          <router-link to="/register" class="text-amber-700 font-bold hover:text-amber-600 transition-colors">إعادة تعيين</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import PasswordField from '../../components/global/PasswordField.vue';
import FieldContainer from '../../components/global/FieldContainer.vue';
import BaseButton from '../../components/global/BaseButton.vue';
import { useValidation } from '../../utils/useValidation';

/**
 * استخدام الفالديشن:
 * - errors: كائن يحتوي على رسائل الخطأ لكل حقل.
 * - validateField: دالة تفحص حقل واحد (تستدعى عند الـ Blur).
 * - validateForm: دالة تفحص الفورم بالكامل (تستدعى عند الـ Submit).
 */
const { errors, validateField, validateForm } = useValidation();

// مرجع عنصر الفورم للوصول إليه برمجياً
const loginForm = ref(null);
const loading = ref(false);

// البيانات التفاعلية
const form = reactive({
  username: '',
  password: ''
});

/**
 * دالة تسجيل الدخول:
 * تقوم بالتحقق من صحة البيانات أولاً، ثم تفعيل حالة التحميل.
 */
const handleLogin = async () => {
  // فحص الفورم بالكامل قبل البدء
  const isValid = validateForm(loginForm.value);
  
  if (!isValid || loading.value) return; 
  
  loading.value = true;
  
  try {
    // محاكاة طلب API لمدة ثانيتين
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("نجاح التحقق، البيانات المرسلة:", form);
    // هنا يتم التوجيه للمسار التالي
  } catch (error) {
    console.error("حدث خطأ في عملية تسجيل الدخول");
  } finally {
    loading.value = false;
  }
};
</script>