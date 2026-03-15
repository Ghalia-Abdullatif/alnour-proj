<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-[2.5rem] max-w-md w-full overflow-hidden shadow-2xl transform transition-all text-right" dir="rtl">
        
        <div class="bg-emerald-50 p-8 text-center">
          <div class="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
            <span class="text-white text-4xl">✓</span>
          </div>
          <h2 class="text-2xl font-black text-emerald-900">تم تسجيل طلبك بنجاح!</h2>
          <p class="text-emerald-700/80 font-medium mt-2">مرحباً بك في مقرأتنا المباركة</p>
        </div>

        <div class="p-8">
          <div class="mb-8">
            <label class="block text-gray-400 text-xs font-black mb-2 italic">رقم استمارة التسجيل</label>
            <div class="flex items-center gap-2 bg-gray-50 border-2 border-dashed border-gray-200 p-4 rounded-2xl group">
              <span class="text-2xl font-mono font-black text-blue-600 flex-grow text-center tracking-widest">
                {{ registrationCode }}
              </span>
              <button 
                @click="copyCode" 
                class="bg-white p-2 rounded-xl shadow-sm border border-gray-100 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95"
                title="نسخ الرمز"
              >
                <span v-if="!copied">📋</span>
                <span v-else class="text-emerald-500 text-xs font-bold">تم النسخ!</span>
              </button>
            </div>
          </div>

          <div class="bg-blue-50 p-5 rounded-[2rem] border border-blue-100 relative overflow-hidden">
            <div class="relative z-10 flex items-center gap-4">
              <div class="bg-blue-500 text-white p-3 rounded-2xl shadow-md">
                ✈️
              </div>
              <div>
                <h4 class="font-black text-blue-900 text-sm">مجموعة المتابعة (تلجرام)</h4>
                <p class="text-blue-700/70 text-xs mt-1">يجب الانضمام لمتابعة حالة القبول والجدول</p>
              </div>
            </div>
            <a 
              href="https://t.me/your_channel" 
              target="_blank"
              class="mt-4 block text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
            >
              انضم للمجموعة الآن
            </a>
          </div>

          <button 
            @click="$emit('close')" 
            class="w-full mt-6 text-gray-400 hover:text-gray-600 font-bold text-sm transition-colors"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  registrationCode: { type: String, default: 'REQ-2024-88' }
});

const emit = defineEmits(['close']);
const copied = ref(false);

const copyCode = () => {
  navigator.clipboard.writeText(props.registrationCode);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>