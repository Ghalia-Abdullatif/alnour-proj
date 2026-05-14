<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="modal-overlay" @click="$emit('cancel')">
        
        <div class="modal-card" @click.stop>
          
          <div class="modal-icon-box">
            <i class="fas fa-question text-2xl"></i>
          </div>
          
          <h3 class="modal-title">{{ title }}</h3>
          <p class="modal-description">{{ message }}</p>

          <div class="modal-actions">
              <BaseButton
          :loading="loading"
          label=" تأكيد  "
          @click.prevent="handleConfirm"
        />
            <!-- <button @click="$emit('confirm')" class="btn-confirm">
              تأكيد 
            </button> -->
            <button v-show="!loading" @click="$emit('cancel')" class="btn-secondry w-full">
              الغاء
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<!-- <script setup>
const loading=ref(false)
co


</script > -->
<script setup>
import { ref } from 'vue'; 
import BaseButton from "../../components/global/BaseButton.vue";


defineProps({
  show: Boolean,
  title: { type: String, default: '' },
  message: { type: String, default: 'هل أنتِ متأكدة من الاستمرار في هذه العملية؟' }
});

const emit = defineEmits(['confirm', 'cancel']);

const loading = ref(false);

const handleConfirm = () => {
  loading.value = true;
  emit('confirm'); 
};
</script>
<style scoped>
@reference "@/css/style.css";

/* التنسيقات باستخدام Tailwind @apply */
.modal-overlay {
  @apply fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm;
}

.modal-card {
  @apply bg-white w-full max-w-md p-8 rounded-[40px] text-center shadow-2xl border border-gray-100;
  animation: scaleIn 0.3s ease-out;
}

.modal-icon-box {
  @apply w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4;
}

.modal-title {
  @apply text-xl font-bold text-gray-900 mb-2;
}

.modal-description {
  @apply text-gray-500 font-light mb-8 leading-relaxed;
}



/* .btn-confirm {
  @apply flex-1 py-3 bg-[#761717] text-white rounded-2xl font-bold hover:bg-[#8b1c1c] transition-all transform hover:-translate-y-0.5;
}

.btn-cancel {
  @apply flex-1 py-3 bg-gray-50 text-[#761717] border border-[#761717] rounded-2xl font-bold hover:bg-gray-100 transition-all;
} */

/* أنيميشن */
.fade-enter-active, .fade-leave-active { @apply transition-opacity duration-300; }
.fade-enter-from, .fade-leave-to { @apply opacity-0; }

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>