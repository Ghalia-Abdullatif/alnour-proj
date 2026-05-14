<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-[100] font-['Tajawal']" dir="rtl">
      
      <TransitionChild
        as="template"
        enter="duration-700 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-500 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-[#042f24]/60 backdrop-blur-xl" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)"
            enter-from="opacity-0 scale-50 rotate-3 translate-y-20"
            enter-to="opacity-100 scale-100 rotate-0 translate-y-0"
            leave="duration-500 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-[4rem] bg-white p-8 md:p-14 text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-[6px] border-emerald-50/50 relative group">
              
              <div class="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
              <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-50 rounded-full blur-3xl opacity-60"></div>

              <div 
                v-motion
                :initial="{ scale: 0, rotate: -180 }"
                :enter="{ scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 260, damping: 20, delay: 300 } }"
                class="relative w-28 h-28 mx-auto mb-10"
              >
                <div class="absolute inset-0 bg-emerald-600 rounded-[2.5rem] rotate-12 opacity-20 animate-pulse"></div>
                <div class="relative w-full h-full bg-gradient-to-br from-[#1e5d4e] to-[#0d2e27] rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-900/40 border-4 border-white">
                  <CheckIcon class="text-white w-14 h-14 stroke-[3px]" />
                </div>
              </div>

              <DialogTitle as="h2" class="text-4xl md:text-5xl font-[900] text-[#1e5d4e] mb-6 tracking-tight">
                تم القبول بنجاح!
              </DialogTitle>

              <p class="text-gray-500 font-bold leading-relaxed mb-10 px-2 text-xl">
                هنيئاً لكِ هذا الاصطفاء في 
                <span class="text-[#d97706] font-[900] relative inline-block px-2">
                  مقرأة النور
                  <svg class="absolute -bottom-1 left-0 w-full h-2 fill-orange-200/50" viewBox="0 0 100 10">
                    <path d="M0 5 Q 25 0, 50 5 T 100 5 L 100 10 L 0 10 Z" />
                  </svg>
                </span>
                <br>
                <span class="text-sm font-medium text-gray-400 mt-2 block">حيث يشرق نور القرآن في القلوب</span>
              </p>

              <div 
                v-motion
                :initial="{ opacity: 0, y: 30 }"
                :enter="{ opacity: 1, y: 0, transition: { delay: 600 } }"
                class="bg-gradient-to-r from-emerald-50/80 to-orange-50/80 backdrop-blur-sm border border-white rounded-[3rem] p-8 mb-10 text-right group/card hover:scale-[1.02] transition-transform duration-500"
              >
                <div class="flex items-center gap-4 mb-3">
                  <div class="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-700">
                    <MailIcon class="w-5 h-5" />
                  </div>
                  <h4 class="font-[900] text-[#1e5d4e] text-lg">الخطوة القادمة</h4>
                </div>
                <p class="text-emerald-900/70 text-base leading-relaxed font-bold pr-2 border-r-4 border-orange-400">
                  راجعي بريدك الإلكتروني (بما في ذلك الرسائل غير المرغوب فيها) لتجدين 
                  <span class="text-emerald-700 underline decoration-wavy decoration-emerald-200">رابط الانضمام للمجموعة</span>.
                </p>
              </div>

              <button
                @click="$emit('close')"
                class="group relative w-full overflow-hidden bg-[#1e5d4e] p-1 rounded-[2.2rem] transition-all duration-300 active:scale-95 shadow-2xl shadow-emerald-900/20"
              >
                <div class="relative bg-white/10 backdrop-blur-md py-5 rounded-[2.1rem] flex items-center justify-center gap-3">
                  <span class="text-white font-black text-xl tracking-wide">العودة للرئيسية</span>
                  <ArrowLeftIcon class="w-6 h-6 text-white transition-transform group-hover:-translate-x-2" />
                </div>
              </button>

              <div v-if="registrationCode" class="mt-10 pt-8 border-t border-emerald-50">
                <div class="inline-flex flex-col items-center">
                   <span class="text-[10px] text-emerald-400 font-black uppercase tracking-[0.3em] mb-2">رقم القيد الرسمي</span>
                   <div class="px-6 py-3 bg-emerald-50 rounded-2xl border-2 border-white shadow-inner">
                      <span class="font-mono text-[#1e5d4e] font-[900] text-lg tracking-widest">{{ registrationCode }}</span>
                   </div>
                </div>
              </div>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { 
  TransitionRoot, 
  TransitionChild, 
  Dialog, 
  DialogPanel, 
  DialogTitle 
} from '@headlessui/vue';
import { 
  CheckIcon, 
  MailIcon, // استبدلت Info بـ Mail لأنها أنسب للخطوة القادمة
  ArrowLeftIcon 
} from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
  registrationCode: { type: String, default: 'MQ-2026-NUR' }
});

defineEmits(['close']);
</script>

<style scoped>
/* إضافة لمسة فنية للخط */
h2, h4, span, button {
  text-shadow: 0 2px 10px rgba(0,0,0,0.02);
}

/* حركة Pulse خفيفة للأيقونة */
@keyframes soft-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.animate-soft-pulse {
  animation: soft-pulse 3s infinite ease-in-out;
}
</style>