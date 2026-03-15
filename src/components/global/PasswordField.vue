<template>
  <div class="relative w-full max-w-md mx-auto group">
    <div v-if="showIcon" class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
      <i class="fas fa-key text-gray-400  group-focus-within:text-emerald-700 transition-colors"></i>
    </div>

    <input 
      :name="name"
      :class="[showIcon ? 'pr-12' : '', 'w-full']"
      :type="isHidden ? 'password' : 'text'" 
      :required="required"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur', $event)" 
      :placeholder="placeholder"
    >

    <button 
      type="button" 
      @click="isHidden = !isHidden"
      class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 hover:text-emerald-700"
    >
      <i :class="isHidden ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// تعريف الخصائص المستلمة من الأب
defineProps({
  modelValue: { type: String, default: "" },      // القيمة النصية
  name: { type: String, default: "password" },   // اسم الحقل (ضروري للفالديشن)
  placeholder: { type: String, default: "كلمة المرور" },
  showIcon: { type: Boolean, default: false },
  required: { type: Boolean, default: false }
});

// تعريف الأحداث التي يمكن للمكون إرسالها للأب
defineEmits(['update:modelValue', 'blur']);

// حالة داخلية لإدارة ظهور النص
const isHidden = ref(true);
</script>