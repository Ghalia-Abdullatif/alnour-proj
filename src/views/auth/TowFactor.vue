<template>
  <div v-if="requires2FA" class="otp-container">
    <div class="message-otp">
      <h2>تم ارسال رمز تحقق الى بريدك الالكتروني</h2>
      <h4>يرجى ادخال الرمز المكون من {{ codeLength }} أرقام الذي تم ارساله</h4>
    </div>

    <form class="form-otp">
      <OtpInput :length="codeLength" v-model="otpCode" @complete="onOtpComplete" />

      <BaseButton 
        :loading="loading"
        label="تحقق" 
        :fullWidth=false
        @click.prevent="verifyCode" 
        :disabled="otpCode.length < codeLength || loading"
      />
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import OtpInput from '@/components/global/OtpInput.vue';
import BaseButton from '@/components/global/BaseButton.vue'; 
import { useAuthStore } from "@/stors/acount-store.js";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// تعريف البروبس
const props = defineProps({
  codeLength: {
    type: Number,
    default: 6
  },
  // استلام الـ challenge_id كـ prop إذا تم تمريره عبر الراوتر
  challenge_id: {
    type: String,
    required: false
  }
});

const requires2FA = ref(true);
const otpCode = ref('');
const loading = ref(false);

const onOtpComplete = (code) => {
  console.log("الرمز اكتمل تلقائياً:", code);
  // اختياري: يمكنك تفعيل التحقق التلقائي هنا
  // verifyCode(); 
};

const verifyCode = async () => {
  // جلب الـ ID من البروبس أو من عنوان URL (Query) كخيار احتياطي
  const challengeId = props.challenge_id || route.query.challenge_id;

  if (!challengeId) {
    console.error("خطأ: challenge_id غير موجود.");
    return;
  }

  loading.value = true;
  
  try {
    // إرسال الكود والـ ID للستور
    const result = await authStore.verify2FA(otpCode.value, challengeId);

    if (result.success) {
      console.log( authStore.handleLoginNavigation(result),"✅hndle nav تم التحقق بنجاح!");
      
      router.replace(authStore.handleLoginNavigation(result));

      // router.replace({ name: 'Dashboard' }); // التوجيه للداشبورد
    } else {
      console.error("❌ فشل التحقق:", result.message);
      // يمكنك هنا إظهار رسالة خطأ للمستخدم
    }
  } catch (err) {
    console.error("حدث خطأ غير متوقع:", err);
  } finally {
    loading.value = false;
  }
};
</script>
<style>
@reference "@/css/style.css";
.otp-container {
  @apply w-full h-screen flex flex-col mb-auto justify-center items-center bg-background font-tajawal gap-12;
}
.message-otp {
  @apply text-center space-y-6 font-droid;
}
.message-otp h2 {
  @apply  text-basicBlack;
}
.message-otp h4 {
  @apply  text-basicGray;}
.form-otp {
    @apply w-full h-fit flex flex-col  justify-center items-center bg-background font-tajawal gap-12;
}
</style>

