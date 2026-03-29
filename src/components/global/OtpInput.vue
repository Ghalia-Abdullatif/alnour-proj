<template>
  <div class="flex justify-center gap-3 direction-ltr">
    <input
      v-for="(digit, index) in length"
      :key="index"
      :ref="el => { if (el) inputRefs[index] = el }"
      v-model="digits[index]"
      type="number"
      maxlength="1"
      class="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:border-cardYellow focus:ring-0 outline-none transition-all"
      @input="handleInput($event, index)"
      @keydown.delete="handleDelete(index)"
      @paste="handlePaste"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';

const props = defineProps({
  length: { type: Number, default: 6 } // عدد الخانات ديناميكي
});

const emit = defineEmits(['update:modelValue', 'complete']);

const digits = reactive(Array(props.length).fill(''));
const inputRefs = ref([]);

// التنقل للأمام عند الإدخال
const handleInput = (event, index) => {
  const value = event.target.value;
  if (value && index < props.length - 1) {
    inputRefs.value[index + 1].focus();
  }
  updateValue();
};

// التنقل للخلف عند الحذف
const handleDelete = (index) => {
  if (!digits[index] && index > 0) {
    inputRefs.value[index - 1].focus();
  }
  updateValue();
};

// دعم خاصية اللصق (Paste) لـ 6 أرقام دفعة واحدة
const handlePaste = (event) => {
  const pasteData = event.clipboardData.getData('text').slice(0, props.length);
  if (/^\d+$/.test(pasteData)) {
    pasteData.split('').forEach((char, i) => {
      digits[i] = char;
    });
    inputRefs.value[props.length - 1].focus();
    updateValue();
  }
};

const updateValue = () => {
  const code = digits.join('');
  emit('update:modelValue', code);
  if (code.length === props.length) {
    emit('complete', code); // إرسال حدث عند اكتمال الرمز
  }
};
</script>

<style scoped>
.direction-ltr {
  direction: ltr; /* لضمان ترتيب المربعات من اليسار لليمين حتى في المواقع العربية */
}
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>