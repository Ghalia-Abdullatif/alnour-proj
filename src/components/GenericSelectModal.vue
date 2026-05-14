<script setup>
import { ref, reactive, watch } from "vue";
import { useValidation } from "@/utils/useValidation";
import SelectItem from "@/components/global/SelectItem.vue";
import FieldContainer from "@/components/global/FieldContainer.vue";
import BaseButton from "@/components/global/BaseButton.vue";

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, default: "تحديد اختيار" },
  description: { type: String, default: "يرجى تحديد عنصر من القائمة المتاحة" },
  options: { type: Array, required: true,default:[] },
  labelKey: { type: String, default: "name" },
  valueKey: { type: String, default: "id" }, 
  placeholder: { type: String, default: "ابحث واختـر..." },
  confirmText: { type: String, default: "تأكيد الاختيار" },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(["close", "confirm"]);

const { errors, validateForm } = useValidation();
const formRef = ref(null);

const selection = reactive({
  item: null
});

// تصفير الاختيار عند الإغلاق
watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    selection.item = null;
    if (errors.value) errors.value = {}; // تنظيف الأخطاء أيضاً
  }
});

const handleConfirm = () => {
  // 1. التحقق من الصحة
  if (!validateForm(formRef.value)) return;

  if (selection.item) {
    // 2. استخراج القيمة (ID غالباً)
    const selectedValue = selection.item[props.valueKey];
    
    // 3. الإرسال بشكل يتوافق مع ما ينتظره الأب
    // نرسل كائن يحتوي على selected ليطابق (e.selected) في الأب
    emit("confirm", { selected: selectedValue });
  }
};
</script>


<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
      
      <div class="modal-container">
        
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <p class="modal-description">{{ description }}</p>
        </div>

        <form ref="formRef" @submit.prevent="handleConfirm" class="modal-form">
          
          <FieldContainer
            :errors="errors"
            :required="true"
            name="selectionField"
            label="الاختيار المطلوب :"
            fieldContainerStyle="space-y-2 text-right"
          >
            <SelectItem
    :options="options"
    v-model:selected="selection.item"
    :labelKey="labelKey"
    :valueKey="labelKey" 
    name="selectionField"
    :required="true"
    :placeholder="placeholder"
    @error="(e) => (errors[e.name] = e.message)"
  />
          </FieldContainer>
          <div class="modal-actions">
              <BaseButton
          :loading="loading"
          label=" تأكيد  "
          @click.prevent="handleConfirm"
        />
            <!-- <button @click="$emit('confirm')" class="btn-confirm">
              تأكيد 
            </button> -->
            <button v-show="!loading" @click="$emit('close')" class="btn-secondry w-full">
              إلغاء
            </button>
          </div>

          <!-- <div class="modal-actions">
            <button
              type="submit"
              :disabled="loading"
              class="btn-confirm"
            >
              <span v-if="!loading">{{ confirmText }}</span>
              <i v-else class="fa fa-spinner fa-spin"></i>
            </button>

            <button
              type="button"
              @click="emit('close')"
              class="btn-cancel"
            >
              إلغاء
            </button>
          </div> -->
        </form>
      </div>
    </div>
  </transition>
</template>

<style scoped>
@reference "@/css/style.css";

/* إعدادات الخلفية الشفافة (Overlay) */
.modal-overlay {
  @apply fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px];
}

/* حاوية المودال الأساسية */
.modal-container {
  @apply bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-gray-50 relative;
  animation: modal-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* الرأس والنصوص */
.modal-header {
  @apply text-right mb-8 flex flex-col justify-center items-center;
}

.modal-title {
  @apply text-xl font-black text-gray-800 leading-tight;
}

.modal-description {
  @apply text-[11px] text-gray-400 mt-2 font-bold leading-relaxed;
}

/* تنسيق الفورم والأزرار */
.modal-form {
  @apply space-y-8;
}

/* .modal-actions {
  @apply flex flex-col md:flex-row-reverse gap-3 mt-4;
} */

أزرار العمليات

/* تأثيرات الانتقال (Transitions) */
.modal-fade-enter-active, 
.modal-fade-leave-active {
  @apply transition-opacity duration-300;
}

.modal-fade-enter-from, 
.modal-fade-leave-to {
  @apply opacity-0;
}

/* أنيميشن الظهور (Scale & Fade)
@keyframes modal-pop {
  from {
    @apply opacity-0 scale-90 translate-y-4;
  }
  to {
    @apply opacity-100 scale-100 translate-y-0;
  } */
/* } */

/* تخصيص السكرول بار داخل المودال إن وجد */
.modal-container::-webkit-scrollbar {
  @apply w-1.5;
}
.modal-container::-webkit-scrollbar-thumb {
  @apply bg-gray-100 rounded-full;
}
</style>