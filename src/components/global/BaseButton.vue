<template>
  <button 
    :type="type" 
    :disabled="loading" 
    @click="$emit('click', $event)"
    :class="[
      'btn-primary flex items-center justify-center transition-all bg-primary disabled:bg-gray-300 disabled:text-gray-500',
      fullWidth ? 'w-full' : 'w-fit px-6' // شرط التحكم في العرض
    ]"
  >
    <i v-if="loading" class="fas fa-circle-notch animate-spin ml-2"></i>
    
    <i v-if="icon && !loading" :class="[icon, 'ml-2']"></i> <span>
      <slot>{{ loading ? lodingLable : label }}</slot>
    </span>
  </button>
</template>

<script setup>
defineEmits(['click']);

defineProps({
  label: String,
  loading: Boolean,
  icon: String,
  lodingLable: {
    type: String,
    default: 'جاري التحقق...'
  },
  type: {
    type: String,
    default: 'button'
  },
  // خاصية جديدة للتحكم في العرض
  fullWidth: {
    type: Boolean,
    default: true // القيمة الافتراضية هي "فل" كما طلبتِ
  }
});
</script>