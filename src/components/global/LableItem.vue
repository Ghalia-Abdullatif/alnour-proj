<template>
  <label
    v-if="label"
    :for="forId"
    :class="[
      'block text-right mb-2 font-medium transition-all duration-300',
      /* التحكم في الظهور البصري: 
         sr-only: يخفي العنصر عن العين ويبقيه لقارئات الشاشة (للوصول الأفضل).
      */
      hideLabel ? 'sr-only' : 'text-text-black '
    ]"
  >
    {{ label }}

    <span 
      v-if="required" 
      class="text-red-600 mr-1 font-bold" 
      aria-hidden="true"
    >
      *
    </span>
  </label>
</template>

<script setup>
/**
 * تعريف الخصائص المستلمة (Props) للمكون:
 * label: النص الذي سيظهر كعنوان للحقل.
 * required: قيمة منطقية لتحديد ما إذا كان الحقل إلزامياً.
 * forId: المعرف الفريد (ID) للحقل المرتبط بهذا العنوان.
 * hideLabel: خيار إخفاء العنوان بصرياً مع الحفاظ على أهميته البرمجية.
 */
const props = defineProps({
  label: { 
    type: String, 
    default: "" 
  },
  required: { 
    type: Boolean, 
    default: false 
  },
  forId: { 
    type: String, 
    default: "" 
  },
  hideLabel: { 
    type: Boolean, 
    default: false 
  }
})
</script>

<style scoped>
/* ملاحظة: تم الاعتماد كلياً على Tailwind CSS لتسهيل الصيانة، 
   ويمكن إضافة تنسيقات مخصصة هنا إذا دعت الحاجة مستقبلاً.
*/
</style>