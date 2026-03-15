<template>
  <button 
    :type="type" 
    :disabled="loading" 
    @click="$emit('click', $event)"
    class="btn-primary w-full flex items-center justify-center transition-all bg-primary"
  >
    <i v-if="loading" class="fas fa-circle-notch animate-spin ml-2"></i>
    

    <span>
      <slot>{{ loading ?lodingLable  : label }}</slot>
    </span>
  </button>
</template>

<script setup>
// تعريف الأحداث التي يصدرها المكون
defineEmits(['click']);

defineProps({
  label: String,
  loading: Boolean,
  icon: String,
  lodingLable:  {
    type: String,
    default: 'جاري التحقق...' // جعلناه submit افتراضياً ليقوم بتفعيل الفورم
  },
  type: {
    type: String,
    default: 'button' // جعلناه submit افتراضياً ليقوم بتفعيل الفورم
  }
});
</script>