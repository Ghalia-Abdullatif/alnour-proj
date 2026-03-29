<template>
  <div class="page-container">
    <div class="content-wrapper">
      
      <header class="header-section">
        <h2 class="title">اختيار دور الجلسة</h2>
        <p class="subtitle">يرجى تحديد الدور الوظيفي المناسب للمشاركة في الجلسة الحالية</p>
      </header>
           <div class="cardsAndfavContainer">

      <div class="cards-grid">
        <label 
          v-for="role in roles" 
          :key="role.id"
          :class="['role-card', selectedRole === role.id ? 'active-card' : 'inactive-card']"
        >
          <input 
            type="radio" 
            :value="role.id" 
            v-model="selectedRole" 
            class="sr-only" 
          />
          
          <div class="card-content">
            <div class="text-container">
                 <p :class="['role-icon', selectedRole === role.id ? 'text-primary-medium' : 'text-gray-500']">
             <i :class= role.icon>  </i>  
              </p>
              <p :class="['role-name', selectedRole === role.id ? 'text-primary-dark' : 'text-gray-900']">
                {{ role.name }}
              </p>
             
            </div>
            
            <!-- <div v-show="selectedRole === role.id" class="check-icon">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div> -->
          </div>
        </label>
      </div>
      <div class="favorite-section">
        <input 
          id="favorite" 
          type="checkbox" 
          v-model="isFavorite"
          class="favorite-checkbox"
        />
        <label for="favorite" class="favorite-label">
          تعيين هذا الدور كخيار مفضل للجلسات المستقبلية
        </label>
            </div>

      </div>
         <BaseButton 

        :loading="loading"
        label="تأكيد" 
         :fullWidth=isMobile?true:false 
        @click.prevent="verifyCode" 
        :disabled="!selectedRole"
      />
    </div >
      <!-- <button :disabled="!selectedRole" class="submit-btn"           :fullWidth=false 
>
        تأكيد واختيار الدور
      </button> -->
  </div>
</template>

<script setup>
import { ref,computed,onMounted,onUnmounted } from 'vue';
import BaseButton from '@/components/global/BaseButton.vue'; 
import { useWindowSize } from '@/composable/useWindowSize';
import { useRoute, useRouter } from 'vue-router';

const { isMobile, windowWidth } = useWindowSize();
import { useAuthStore } from "@/stors/acount-store.js";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// حالة المتغيرات التفاعلية (Reactive State)
const loading = ref(false);
const selectedRole = ref(null); // لتخزين معرف الدور المختار
const isFavorite = ref(false);   // لتخزين حالة "المفضل" (صح/خطأ)

const roles=authStore.getEnablesRoles;
console.log(authStore.getEnablesRoles,"prrrmition");


const verifyCode = () => {
   loading.value =true;
  // طباعة الكائن الذي يحتوي على المعرف وحالة التفضيل
  console.log("البيانات المرسلة:", {
    role: selectedRole.value,
    isFavorite: isFavorite.value
  });
  authStore.setCurrentRole(selectedRole.value);
   router.push({
        name: "Dashboard"})
      // التوجيه للمسار التالي (مثلاً الداشبورد)
      // router.push("/ChoseRole");
         loading.value =false;

};


</script>

<style scoped>
@reference "@/css/style.css";

/* تحويل فئات Tailwind إلى فئات CSS مخصصة باستخدام قاعدة @apply */

.page-container {
  /* تنسيق الصفحة لتكون كامل الارتفاع مع توسيط المحتوى */
  @apply  w-screen min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center justify-center;
}

.content-wrapper {
  /* تحديد العرض الأقصى وتنسيق المسافات الرأسية */
  @apply min-w-full space-y-8 flex flex-col items-center justify-center;
}

.header-section {
  @apply text-center;
}

.title {
  /* تنسيق العنوان الرئيسي بوضوح عالي */
  @apply text-2xl font-bold text-gray-900 tracking-tight;
}

.subtitle {
  @apply mt-2 text-sm text-gray-600;
}

.cards-grid {
  /* تنظيم البطاقات في عمود واحد مع مسافات فاصلة */
  @apply w-full  flex flex-col sm:h-48 sm:flex-row gap-4 overflow-x-auto  scroll-smooth items-center justify-center;
}

.role-card {
  /* التنسيق الأساسي للبطاقة مع إضافة تأثيرات الانتقال عند التحويم */
  @apply relative flex  w-full sm:max-w-46 cursor-pointer rounded-xl border bg-white px-2 py-4 shadow-sm duration-300 ease-in-out flex-shrink-0 transition-transform;
}

.active-card {
  /* التنسيق الخاص بالحالة النشطة: لون إطار مختلف وظل طفيف  ring-opacity-30*/
  @apply border-primary sm:scale-110 ring-1 ring-primary ;
}

.inactive-card {
  /* التنسيق الخاص بالحالة غير النشطة */
  @apply  border-gray-200 hover:border-primary hover:shadow-md;
}

.card-content {
  /* توزيع العناصر داخل البطاقة بشكل أفقي متوازن */
  @apply flex w-full items-center  flex-row sm:flex-col md:flex-col justify-start sm:justify-center;
}

.text-container {
  /* ضمان محاذاة النص لليمين (للتوافق مع اللغة العربية) */
  @apply text-right items-center gap-4 flex flex-row sm:flex-col ;
}

.role-name {
  @apply font-bold text-lg block;
}

.role-icon {
  @apply text-4xl mt-1;
}
.cardsAndfavContainer{
    @apply w-full   h-fit flex flex-col items-center justify-center  ;
}

.check-icon {
  /* لون علامة الصح عند الاختيار */
  @apply text-primary ;
}

.favorite-section {
  /* تنسيق قسم التفضيل ليكون متميزاً بصرياً في أسفل الصفحة */
  @apply flex items-center  p-2  rounded-lg  ;
}

.favorite-checkbox {
  /* تخصيص مظهر مربع الاختيار */
  @apply h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary accent-primary cursor-pointer;;
}

.favorite-label {
  @apply mr-3 text-sm text-gray-700 font-medium cursor-pointer;
}

.submit-btn {
  /* تنسيق زر الإجراء النهائي مع مراعاة الحالة المعطلة */
  @apply w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-bold 
         hover:bg-blue-700 transition-all shadow-md disabled:bg-gray-300 
         disabled:cursor-not-allowed disabled:shadow-none ;
}
</style>
<!-- <style scoped>
@reference "@/css/style.css";

/* تحويل فئات Tailwind إلى فئات CSS مخصصة باستخدام قاعدة @apply */

.page-container {
  /* تنسيق الصفحة لتكون كامل الارتفاع مع توسيط المحتوى */
  @apply min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center;
}

.content-wrapper {
  /* تحديد العرض الأقصى وتنسيق المسافات الرأسية */
  @apply max-w-md w-full space-y-8;
}

.header-section {
  @apply text-center;
}

.title {
  /* تنسيق العنوان الرئيسي بوضوح عالي */
  @apply text-2xl font-bold text-gray-900 tracking-tight;
}

.subtitle {
  @apply mt-2 text-sm text-gray-600;
}

.cards-grid {
  /* نستخدم flex-wrap لضمان انسيابية البطاقات عند كثرتها */
  @apply w-full flex flex-col sm:flex-row flex-wrap gap-4 justify-center;
}

.role-card {
  /* flex-1: تجعل جميع البطاقات تتشارك المساحة بالتساوي */
  /* min-w: تضمن أن البطاقة لا تصغر بشكل يشوه المحتوى */
  /* min-h: نحدد حد أدنى للارتفاع لتوحيد شكل البطاقات */
  @apply relative flex cursor-pointer rounded-xl border bg-white px-5 py-6 shadow-sm 
         transition-all duration-300 flex-1 min-w-50 min-h-50 items-center justify-center;
}

.active-card {
  @apply border-blue-600 ring-2 ring-blue-500 bg-blue-50;
}

.inactive-card {
  /* أزلنا w-50 واستبدلناها بـ flex-1 في الكلاس الأساسي */
  @apply border-gray-200 hover:border-blue-300 hover:shadow-md;
}

.card-content {
  /* اجعلنا الاتجاه عمودياً دائماً في الشاشات الكبيرة لتتوسط الأيقونة فوق النص */
  @apply flex w-full items-center flex-col justify-center text-center gap-3;
}

.text-container {
  /* الترتيب العمودي للأيقونة والنص */
  @apply flex flex-col items-center gap-2;
}

.role-name {
  @apply font-bold text-base md:text-lg block text-gray-900;
}

.role-icon {
  /* تكبير الأيقونة قليلاً لتناسب حجم الكارد */
  @apply text-5xl mb-2;
}

.check-icon {
  /* وضع علامة الصح في الزاوية العلوية لكي لا تأخذ حيزاً من المنتصف */
  @apply absolute top-2 left-2 text-blue-600;
}

/* ... بقية الكود ... */
</style> -->