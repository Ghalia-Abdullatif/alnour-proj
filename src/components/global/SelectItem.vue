<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Validator from '../../utils/validaion'
import { useValidation } from '../../utils/useValidation'

import CountryFlag from 'vue-country-flag-next'
import DropDown from './DropDown.vue'

// Emits
const emit = defineEmits(['update:selected', 'error'])

// Props
const props = defineProps({
  ariaLabel: { type: String, default: 'قائمة اختيار' },
  labelKey: String,
  valueKey: String,
  iconKey: String,
  options: { type: Array, default: () => [] },
  name: String,
  required: { type: Boolean, default: false },
  customClass: { type: Array, default: '' },
  underselect: { type: Boolean, default: true },
 
})

// Models
const selected = defineModel('selected', { default: null })
const open = defineModel('open', { type: Boolean, default: false })
const localError = defineModel('localError', {type: Boolean, default: false })


// Click Outside
const selectWrapper = ref(null)
const fieldIn= ref()
const handleClickOutside = (event) => {
  if (open.value && selectWrapper.value && !selectWrapper.value.contains(event.target)) {
    open.value = false
  }
}

const validate = () => {
      // useValidation.validateField(fieldIn.value)

  if (props.required && !selected.value) {
console.log("vvvv")
   localError.value = true
    emit('error', { name: props.name, message: 'هذا الحقل مطلوب' })
  } else {
   localError.value  = false
   console.log(localError.value)

    emit('error', { name: props.name, message: '' })
  }
}

// Watch لإغلاق القائمة بدون اختيار
watch(open, (newVal, oldVal) => {
  if (oldVal && !newVal) {
    validate()
  }
})
defineExpose({ validate })


onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
<div :class="['w-full ', underselect ? 'relative' : '']" dir="rtl">
  <button
    type="button"
    :aria-label="ariaLabel"
    ref="selectWrapper"
    @click="open = !open"
    :class="[
      'grid grid-cols-10  w-full px-2 select bg-white text-[2vw] select border cursor-pointer transition-all',
      customClass ? customClass : 'rounded-xl',
      localError ? 'input-invalid': ''
    ]"
  >
    <div :class="['flex w-11/12 overflow-hidden gap-1 items-center justify-between col-span-7 min-w-0']">
      <CountryFlag
        v-if="selected && iconKey && !Validator.isImage(selected[iconKey])"
        class="w-fit"
        :country="selected[iconKey]"
        size="small"
      />
      <span :class="['text-sm h-fit overflow-hidden block whitespace-nowrap' ,selected ? 'text-text-black':'text-gray-600']">
        <input
        ref="fieldIn"
          type="hidden"
          :name="name"
          :required="required"
          readonly 
          class="pointer-events-none"
          :value="selected ? selected[valueKey] : ''"
        />
        {{ selected ? selected[valueKey] : 'اختر...' }}
      </span>
    </div>

    <div class="flex justify-end items-center w-full col-span-3 h-full">
      <img
        src="../../assets/icons/select.svg"
        :class="['w-6 h-6 transition-transform', open ? 'rotate-180' : '']"
      />
    </div>
  </button>

  <DropDown
    :options="options"
    v-model:selected="selected"
    v-model:open="open"
    :labelKey="labelKey"
    :valueKey="valueKey"
    :iconKey="iconKey"
  />
</div>
</template>