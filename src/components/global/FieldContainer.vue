<template>
  <div :class="fieldContainerStyle">
    
    <!-- Label -->
 
    <LableItem :forId="forId" :label="label" :required="required" ></LableItem>
     

    <!-- Input Slot -->
      <slot />

    <!-- Error Message -->
    <transition name="fade">
     <p v-if="errors && errors[name]" class="error-text">
  {{ errors[name] }}
</p>
    </transition>

  </div>
</template>

<script setup>
import LableItem from './LableItem.vue';
const props = defineProps({
  label: { type: String, default: "" },//العنوان لحقللا البحث
  errors: { type: [{}], default:'' },//قائمة الاخطاء في المكون الاب
  required: { type: Boolean, default: false },//لتحديد الحقل مطلوب او لا لاضافة النجمه
  forId: { type: String, default: "" },//معرف الحقل لربطه مع العنوان
  name: { type: String, default: "" },//اسم الحقل
  fieldContainerStyle:{ type: String, default: "" }//لتحديد استايل معين
})
</script>
