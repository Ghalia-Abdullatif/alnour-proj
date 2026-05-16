<template>
  <input
    ref="input"
    :id="Id"
    type="text"
    :name="name"
    :required="required && !optional"
    dir="rtl"
  />
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue"
import flatpickr from "flatpickr"
import "flatpickr/dist/flatpickr.min.css"
import { Arabic } from "flatpickr/dist/l10n/ar.js"

/* ================= props ================= */
const props = defineProps({
    Id: { type: Number, default: 20 },
  name: { type: String, required: true },
  modelValue: { type: String, default: "" },
  minAge: { type: Number, default: 1 },   // السماح من عمر سنة
  maxAge: { type: Number, default: 100 }, // السماح حتى عمر 100 سنة
  optional: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  localerror: { type: Boolean, default: false }

})

/* ================= emits ================= */
const emit = defineEmits(["update:modelValue", "error"])

/* ================= refs ================= */
const input = ref(null)
let fpInstance = null

/* ================= validation ================= */
const validateField = (value) => {
  if (!value && props.required && !props.optional) {
    emit("error", {
      name: props.name,
      message: "هذا الحقل مطلوب"
    })
  } else {
    emit("error", {
      name: props.name,
      message: ""
    })
  }
}

/* ================= flatpickr ================= */
onMounted(() => {
  const currentYear = new Date().getFullYear()
  const minDate = new Date(currentYear - props.maxAge, 0, 1)
  const maxDate = new Date(currentYear - props.minAge, 11, 31)

  fpInstance = flatpickr(input.value, {
    locale: Arabic,
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "d - m - Y",
    defaultDate: props.modelValue || null,
    minDate,
    maxDate,
    allowInput: false,

    onChange: (_, dateStr) => {
      emit("update:modelValue", dateStr)
      validateField(dateStr)
    },

    onClose: (_, dateStr) => {
      validateField(dateStr)
    }
  })

  updateBorder()
})

/* ================= watch model ================= */
watch(
  () => props.modelValue,
  (val) => {
    if (fpInstance && val) {
      fpInstance.setDate(val, false)
    }
  }
)

/* ================= watch error (border) ================= */
const updateBorder = () => {
  if (!fpInstance?.altInput) return

  fpInstance.altInput.classList.toggle(
    "input-invalid",
    props.localerror
  )
  fpInstance.altInput.classList.toggle(
    "border-gray-400",
    !props.localerror
  )
}

watch(
  () => props.localerror,
  () => updateBorder(),
  { immediate: true }
)

/* ================= cleanup ================= */
onBeforeUnmount(() => {
  if (fpInstance) fpInstance.destroy()
})
</script>
<style>
/* 1. الحاوية الرئيسية للتقويم */
.flatpickr-day.flatpickr-disabled, 
.flatpickr-day.flatpickr-disabled:hover,
.flatpickr-day.prevMonthDay, 
.flatpickr-day.nextMonthDay,
.flatpickr-day.notAllowed {
    color: rgba(0, 0, 0, 0.15) !important; /* لون باهت جداً */
    background: transparent !important;
    border-color: transparent !important;
    cursor: not-allowed !important;
}
.flatpickr-calendar {
    background: #ffffff !important;
    border-radius: 1rem !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
    font-family: var(--font-tajawal), sans-serif !important;
    width: 310px !important;
}

/* 2. الهيدر (الشهر والسنة) - حل مشكلة التداخل والاختفاء */
.flatpickr-month {
      background: var(--color-green-primary) !important;

}
.flatpickr-months {
    border-bottom: 1px solid rgba(223, 240, 224, 0.05) !important;

    background: var(--color-green-primary) !important;
    border-radius: 1rem 1rem 0 0 !important;
    padding: 10px 0 !important;
}

.flatpickr-current-month {

    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 5px !important;
    color: #ffffff !important;
    padding: 0 !important;
}

/* حل تداخل القائمة المنسدلة للشهر مع حقل السنة */
.flatpickr-monthDropdown-months {
    background: transparent !important;
    color: #ffffff !important;
    font-weight: bold !important;
    padding: 2px 5px !important;
    cursor: pointer !important;
}

.cur-year {
    font-weight: bold !important;
    color: #ffffff !important;
}

/* 3. أسهم التنقل (السابق والتالي) */
.flatpickr-prev-month, .flatpickr-next-month {
    color: #ffffff !important;
    fill: #ffffff !important;
top: 40%; /* ينزل العنصر ليبدأ من منتصف المسافة */
    transform: translateY(43%);}

.flatpickr-prev-month:hover svg, .flatpickr-next-month:hover svg {
    fill: var(--color-golden) !important; /* لمسة جمالية عند التمرير */
}

/* 4. أسماء أيام الأسبوع */
.flatpickr-weekdays {
    background: var(--color-green-primary) !important;
    padding: 5px 0 !important;
}

span.flatpickr-weekday {
    color: var(--color-layer) !important; /* لون فاتح متناسق مع الثيم */
    font-weight: 600 !important;
}
.flatpickr-weekday{
      background: var(--color-green-primary) !important;

}

/* 5. تنسيق الأيام */
.flatpickr-day {

    border-radius: 100% !important;
    color: var(--color-text-black) !important;
}

/* اليوم المختار */
.flatpickr-day.selected {
    background: var(--color-green-primary) !important;
    border-color: var(--color-green-primary) !important;
    color: #ffffff !important;
}

/* اليوم الحالي */
.flatpickr-day.today {
    border-color: var(--color-green-primary) !important;
    color: var(--color-green-primary) !important;
}

/* تأثير التمرير Hover */
.flatpickr-day:hover {
    background: var(--color-layer) !important;
    color: var(--color-green-primary) !important;
}

/* السهم الصغير في الأعلى */
.flatpickr-calendar.arrowTop:before { border-bottom-color: var(--color-green-primary) !important; }
.flatpickr-calendar.arrowTop:after { border-bottom-color: var(--color-green-primary) !important; }

/* 6. تحسين مظهر أسهم السنة الصغيرة */
.numInputWrapper span.arrowUp:after { border-bottom-color: white !important; }
.numInputWrapper span.arrowDown:after { border-top-color: white !important; }
</style>