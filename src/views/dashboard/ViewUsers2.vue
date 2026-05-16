<script setup>
/**
 * @file viewUsers.vue (V3 - Final Theme)
 * @description واجهة إدارة الأعضاء المحدثة بالهوية الحمراء ونظام الصفوف المنفصلة.
 */

import { ref, onMounted, computed } from 'vue';
import GenericAdminLayout from '@/views/dashboard/admin/GenericAdminLayout.vue';
import { usePepoleStore } from "@/stors/pepole-store.js";
import AccountFormModal from '@/views/AccountFormModal.vue'; 
import SelectionModal from '@/components/GenericSelectModal.vue'; // تأكدي من المسار الصحيح
import ConfirmModal from '@/components/confirmAndSucces/ConfirmModal.vue'; 
import SuccessToast from '@/components/confirmAndSucces/SuccessToast.vue';
import AddPerson from "@/views/registration/AddPerson.vue";


// استخدام المتجر (Store) الخاص بالأعضاء
const pepoleStore = usePepoleStore();

// حالات التحكم في الواجهة (UI States)
const isLoading = ref(false);
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const currentUser = ref(null);

// نظام التوست (Toasts) المطور
const toast = ref({ show: false, message: "", type: "success" });

/**
 * دالة إظهار التنبيهات في أعلى الصفحة
 * @param {string} msg - الرسالة
 * @param {string} type - نوع الرسالة (success أو error)
 */
const showToast = (msg, type = "success") => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => (toast.value.show = false), 3000);
};

// جلب البيانات عند تحميل المكون
onMounted(async () => {
  isLoading.value = true;
  await pepoleStore.getPeapleStoreData();;
  isLoading.value = false;
});

/**
 * منطق البحث المتقدم بالاسم
 */
const searchQuery = ref("");
const filteredUsers = computed(() => {
  const users = pepoleStore.getUsersWithRoles;
  if (!searchQuery.value) return users;
  return users.filter(u => u.full_name.includes(searchQuery.value));
});

/**
 * فتح محادثة واتساب مباشرة مع العضو
 */
const openWhatsApp = (phone) => {
  if (!phone) return showToast("رقم الهاتف غير مسجل", "error");
  // تنظيف الرقم من المسافات والرموز الزائدة
  const cleanNumber = phone.replace(/\D/g, '');
  window.open(`https://wa.me/${cleanNumber}`, '_blank');
};

/**
 * إعداد عملية التعديل وتمرير البيانات لـ AddPerson
 */
const handleEdit = (user) => {
  currentUser.value = { ...user }; // تمرير نسخة من البيانات لتجنب التعديل المباشر
  showEditModal.value = true;
};

/**
 * إعداد عملية الحذف
 */
const confirmDelete = (user) => {
  currentUser.value = user;
  showDeleteModal.value = true;
};

const executeDelete = async () => {
  const res = await pepoleStore.deletePerson(currentUser.value.id);
  if (res.success) {
    showToast("تم حذف العضو من النظام بنجاح");
    showDeleteModal.value = false;
  } else {
    showToast(res.message || "فشل إجراء الحذف", "error");
  }
};
</script>

<template>
  <div class="users-view-container relative min-h-screen">
    
    <transition name="toast-slide">
      <div v-if="toast.show" :class="['toast-box', toast.type === 'success' ? 'success' : 'error']">
        <i :class="toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'" class="fas"></i>
        <span>{{ toast.message }}</span>
      </div>
    </transition>

    <GenericAdminLayout
      title="إدارة أعضاء المقرأة"
      description="إدارة شاملة لبيانات المعلمين والطلاب وتخصيص الصلاحيات"
      @add-click="showAddModal = true"
    >
      <template #top-widgets>
        <div class="search-wrapper mb-8">
          <div class="relative max-w-md">
            <i class="fa fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="ابحث عن عضو بالاسم..." 
              class="search-input"
            />
          </div>
        </div>
      </template>

      <div class="table-responsive-wrapper custom-scrollbar">
        <table class="main-table">
          <thead>
            <tr class="text-right text-gray-400 text-xs uppercase tracking-wider">
              <th class="px-6 pb-2">بيانات العضو</th>
              <th class="px-6 pb-2">معلومات التواصل</th>
              <th class="px-6 pb-2 text-center">الأدوار</th>
              <th class="px-6 pb-2 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id" class="table-row">
              <td class="p-4">
                <div class="flex items-center gap-4">
                  <div class="avatar-box">
                    {{ user.full_name.charAt(0) }}
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-gray-800">{{ user.full_name }}</h4>
                    <span class="text-[10px] text-primary bg-primary/5 px-2 py-0.5 rounded-md">
                      {{ user.country || 'السودان' }}
                    </span>
                  </div>
                </div>
              </td>

              <td class="p-4 text-xs text-gray-600">
                <div class="flex flex-col gap-1">
                  <span><i class="fa fa-phone ml-2 text-gray-300"></i>{{ user.phone }}</span>
                  <span class="text-blue-500"><i class="fa-brands fa-telegram ml-2 opacity-40"></i>{{ user.telegram }}</span>
                </div>
              </td>

              <td class="p-4 text-center">
                <div class="flex justify-center flex-wrap gap-1">
                  <span v-for="role in user.roles" :key="role.id" class="role-badge">
                    {{ role.name }}
                  </span>
                </div>
              </td>

              <td class="p-4">
                <div class="flex justify-center gap-2">
                  <button @click="openWhatsApp(user.phone)" class="btn-icon whatsapp" title="واتساب">
                    <i class="fa-brands fa-whatsapp"></i>
                  </button>
                  <button @click="handleEdit(user)" class="btn-icon edit" title="تعديل">
                    <i class="fa fa-pencil-alt"></i>
                  </button>
                  <button @click="confirmDelete(user)" class="btn-icon delete" title="حذف">
                    <i class="fa fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </GenericAdminLayout>

    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="showAddModal = showEditModal = false">
      <div class="modal-content" @click.stop>
        <AddPerson 
          :puttonLabel="showEditModal ? 'تحديث البيانات' : 'إضافة عضو جديد'"
          :initFormData="showEditModal ? currentUser : undefined"
          @cancel="showAddModal = showEditModal = false"
          @submit="onFormSubmit"
        />
      </div>
    </div>

    <ConfirmModal 
      v-if="showDeleteModal"
      title="حذف عضو"
      :message="`هل أنت متأكد من حذف ${currentUser?.full_name}؟ لا يمكن التراجع عن هذا الإجراء.`"
      @confirm="executeDelete"
      @cancel="showDeleteModal = false"
    />

  </div>
</template>

<style scoped>
/* استيراد التنسيقات العامة */
@reference "@/css/style.css";

/* --- تنسيقات الفواصل (Spacing Between Rows) --- */
.main-table { 
  @apply w-full border-separate border-spacing-y-4; 
}

.table-row { 
  @apply bg-white shadow-sm border border-gray-50 transition-all duration-300; 
}

.table-row td:first-child { @apply rounded-r-3xl; }
.table-row td:last-child { @apply rounded-l-3xl; }

/* تحسين السكرول للموبايل */
.table-responsive-wrapper {
  @apply overflow-x-auto pb-4;
}

/* الأيقونات المحدثة */
.btn-icon {
  @apply w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90;
}
.btn-icon.whatsapp { @apply bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white; }
.btn-icon.edit { @apply bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white; }
.btn-icon.delete { @apply bg-red-50 text-red-600 hover:bg-red-600 hover:text-white; }

/* التوست العلوي */
.toast-box {
  @apply fixed top-10 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-3 px-8 py-3 rounded-2xl shadow-2xl min-w-[320px] font-bold text-sm;
}
.toast-box.success { @apply bg-white border border-emerald-100 text-emerald-700; }
.toast-box.error { @apply bg-white border border-red-100 text-red-700; }

.avatar-box {
  @apply w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl border border-primary/5;
}

.role-badge {
  @apply text-[9px] font-bold bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full border border-gray-100;
}

.search-input {
  @apply w-full pr-12 pl-4 py-3 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all;
}

/* أنيميشن التوست */
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-slide-enter-from { opacity: 0; transform: translate(-50%, -40px); }
.toast-slide-leave-to { opacity: 0; transform: translate(-50%, -40px); }
</style>