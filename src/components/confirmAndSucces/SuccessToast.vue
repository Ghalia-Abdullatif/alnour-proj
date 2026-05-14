<template>
  <Teleport to="body">
    <Transition name="slide">
      <div v-if="show" class="toast-wrapper">
        <div class="toast-content">
          <i class="fas fa-check-circle text-lg"></i>
          <span class="toast-text">{{ message }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue';

const props = defineProps({
  show: Boolean,
  message: { type: String, default: 'تمت العملية بنجاح' }
});

const emit = defineEmits(['close']);

// إغلاق تلقائي بعد 3 ثوانٍ
watch(() => props.show, (newVal) => {
  if (newVal) {
    setTimeout(() => emit('close'), 3000);
  }
});
</script>

<style scoped>
@reference "@/css/style.css";

.toast-wrapper {
  @apply fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] px-4;
}

.toast-content {
  @apply flex items-center gap-3 px-8 py-4 bg-[#f9fbf8] border border-[#193402] text-[#193402] 
         rounded-2xl shadow-xl backdrop-blur-md min-w-[300px] justify-center;
}

.toast-text {
  @apply font-bold text-sm;
}

/* أنيميشن السحب من الأسفل */
.slide-enter-active, .slide-leave-active { @apply transition-all duration-400 ease-out; }
.slide-enter-from { @apply opacity-0 translate-y-10; }
.slide-leave-to { @apply opacity-0 -translate-y-5; }
</style>