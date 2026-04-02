<template>
  <GenericAdminLayout
    title="إدارة أعضاء المقرأة"
    description="نظرة عامة شاملة على بيانات الطلاب والمعلمين وحساباتهم التقنية وصلاحياتهم"
    :columns="userColumns"
    showAddButton="إضافة عضو جديد"
    :data="allUsers"
    :show-actions="['edit', 'delete']"
  >
    
    <template #top-widgets>
      <div class="stats-grid">
        <div class="stat-card blue">
          <div class="icon-box"><i class="fa fa-users"></i></div>
          <div>
            <p class="stat-label">إجمالي الأعضاء</p>
            <p class="stat-value">{{ pepoleStore.getUsersWithRoles.length }} عضو</p>
          </div>
        </div>
        <div class="stat-card emerald">
          <div class="icon-box"><i class="fa fa-shield"></i></div>
          <div>
            <p class="stat-label">أصحاب الحسابات</p>
            <p class="stat-value">{{ pepoleStore.usersHasAcounts.length }} حساب نشط</p>
          </div>
        </div>
      </div>
    </template>

    <template #table="{ data }">
      <div class="table-container">
        <table class="main-table">
          <thead>
            <tr>
              <th class="th-style w-16 text-center">ID</th>
              <th class="th-style">البيانات الشخصية والتواصل</th>
              <th class="th-style">إدارة الحساب والوصول</th>
              <th class="th-style">الأدوار والصلاحيات</th>
              <th class="th-style text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in data" :key="user.id" class="table-row">
              
              <td class="td-style text-center font-mono text-gray-400">#{{ user.id }}</td>

              <td class="td-style">
                <div class="flex items-start gap-4">
                  <div class="avatar-lg">{{ user.fullName.substring(0, 1) }}</div>
                  
                  <div class="flex flex-col gap-2">
                    <div>
                      <p class="name-text">{{ user.fullName }}</p>
                      <span class="info-subtext">
                        <i class="fa fa-map-marker text-blue-500"></i> {{ user.country.name }} | 
                        <i class="fa fa-birthday-cake text-pink-500"></i> {{ user.birth_date }}
                      </span>
                    </div>
                    
                    <div class="contact-detail-grid">
                      <a :href="`tel:${user.phone_number}`" class="contact-item-link group">
                        <div class="icon-box-mini phone-bg"><i class="fa fa-phone"></i></div>
                        <span class="contact-text">{{ user.phone_number }}</span>
                      </a>
                      <a :href="`https://t.me/${user.telegram_id?.replace('@', '')}`" target="_blank" class="contact-item-link group">
                        <div class="icon-box-mini telegram-bg"><i class="fa fa-paper-plane"></i></div>
                        <span class="contact-text dir='rtl'">{{ user.telegram_id || '—' }}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </td>

              <td class="td-style">
                <div v-if="user.accountDetails.id !== '—'" class="account-control-box">
                  <div class="flex flex-col   gap-1 mb-3">
                    <span class="text-[10px] font-black text-blue-500 uppercase">بريد المنظومة</span>
                    
                    <a :href="`mailto:${user.accountDetails.email}`" class="contact-item-link group bg-white p-1 w-full rounded-xl border border-gray-100 shadow-sm">
                      <div class="icon-box-mini email-bg"><i class="fa fa-envelope"></i></div>
                      <span class="contact-text truncate  w-32" :title="user.accountDetails.email">
                        {{ user.accountDetails.email }}
                      </span>
                    </a>
                  </div>
                  
                  <div class="activation-wrapper">
                    <span :class="['status-label', user.accountDetails.is_active === 'نشط' ? 'active' : 'inactive']">
                      {{ user.accountDetails.is_active }}
                    </span>
                    <label class="switch">
                      <input 
                        type="checkbox" 
                        :checked="user.accountDetails.is_active === 'نشط'"
                        @change="handleStatusToggle(user)"
                      >
                      <span class="slider round"></span>
                    </label>
                  </div>
                </div>

                <div v-else class="empty-account-zone">
                  <button class="btn-create-account" @click="handleCreateAccount(user)">
                    <i class="fa fa-plus-circle mr-1"></i> إنشاء حساب تقني
                  </button>
                </div>
              </td>

              <td class="td-style">
                <div v-if="user.accountDetails.id !== '—'" class="roles-manager">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-[9px] font-black text-gray-400 uppercase">الصلاحيات</span>
                    <button class="btn-add-role" @click="addRole(user)"><i class="fa fa-plus"></i></button>
                  </div>
                  <div class="roles-stack">
                    <div v-for="role in user.accountDetails.roles" :key="role.id" class="role-chip group">
                      <div class="flex items-center gap-2">
                        <div class="role-dot" :class="role.code"></div>
                        <span>{{ role.name }}</span>
                      </div>
                      <button class="remove-role-btn" @click="deleteRole(role.id)">
                        <i class="fa fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <span v-else class="no-account-text">تتطلب إنشاء حساب</span>
              </td>

              <td class="td-style text-center">
                <div class="flex justify-center gap-2">
                  <button class="action-btn edit" @click="editUser(user)" title="تعديل"><i class="fa fa-pencil"></i></button>
                  <button class="action-btn delete" @click="deleteUser(user)" title="حذف"><i class="fa fa-trash"></i></button>
                </div>
              </td>

            </tr>
          </tbody>
        </table>
         <AccountFormModal 
    :is-open="isAccountModalOpen"
    :mode="modalMode"
    :user-data="selectedUser"
    @close="isAccountModalOpen = false"
    @refresh="refreshData"
  />
      </div>
    </template>
  </GenericAdminLayout>
   
</template>

<script setup>
import { onMounted, ref,computed} from 'vue';
import GenericAdminLayout from '@/views/dashboard/admin/GenericAdminLayout.vue';
import { usePepoleStore } from "@/stors/pepole-store.js";
import AccountFormModal from '@/views/AccountFormModal.vue'; 


const pepoleStore = usePepoleStore();


onMounted(async () => {
  await pepoleStore.getPeapleStoreData();
});
// 1. استيراد المكون (تأكدي من المسار الصحيح للملف)

// 2. متغيرات التحكم في الحالة (Reactive State)
const isAccountModalOpen = ref(false); // هل النافذة مفتوحة؟
const modalMode = ref('create');       // نوع العملية: 'create' أو 'edit'
const selectedUser = ref(null);   
const allUsers = computed(() => pepoleStore.getUsersWithRoles);     // بيانات المستخدم الذي نجرِي عليه العملية

// 3. دالة لفتح المودال للإضافة (Create)
const handleCreateAccount = (user) => {
  console.log(user,"useeer selected dataaaaaaaaaaaaaa")
  modalMode.value = 'create';
  selectedUser.value = user; // نمرر بيانات الشخص لربط الإيميل
  isAccountModalOpen.value = true;
};

// 4. دالة لفتح المودال للتعديل (Edit)
const handleEditAccount = (user) => {
  modalMode.value = 'edit';
  selectedUser.value = user; // نمرر بيانات الشخص الحالية لتعبئة الحقول
  isAccountModalOpen.value = true;
};

// 5. دالة تحديث البيانات بعد النجاح
const refreshData = () => {
  console.log("تم تحديث الحساب بنجاح، جاري إعادة جلب البيانات من السيرفر...");
  // هنا تستدعين دالة جلب البيانات من الـ Store
  // pepoleStore.getPeapleStoreData();
};

/**
 * منطق تبديل حالة الحساب (نشط/غير نشط)
 */
const handleStatusToggle = async (user) => {
  console.log("تغيير حالة الحساب للمستخدم:", user.id);
  // نداء الـ API عبر الـ Store يتم هنا
};

const addRole = (user) => {
  console.log("إضافة دور جديد لـ:", user.fullName);
};

const deleteRole = ( roleId) => {
  pepoleStore.deleteAcountRole(roleId)

  console.log("حذف الدور:", roleId, "من المستخدم:");
};

const openCreateAccountModal = (user) => {
  console.log("فتح نافذة إنشاء حساب لـ:", user.fullName);
};
</script>

<style scoped>
@reference "@/css/style.css";

/* --- تنسيقات الهيكل العلوي --- */
.stats-grid { @apply grid grid-cols-1 md:grid-cols-2 gap-6 mb-8; }
.stat-card { @apply bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5; }
.stat-label { @apply text-[10px] text-gray-400 font-black uppercase; }
.stat-value { @apply text-xl font-black text-gray-800; }
.icon-box { @apply w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-blue-50 text-blue-600 shadow-inner; }

/* --- تنسيقات الجدول الأساسية --- */
.table-container { @apply bg-white rounded-[2.5rem] shadow-xl border border-gray-50 overflow-hidden; }
.main-table { @apply w-full text-right border-collapse; }
.th-style { @apply p-5 text-[10px] font-black text-gray-400 bg-gray-50/50 uppercase tracking-widest; }
.td-style { @apply p-5 border-b border-gray-50 align-top transition-all  mt-4; }
.table-row { @apply hover:bg-blue-50/20 transition-colors; }

/* --- البيانات الشخصية والأفاتار --- */
.avatar-lg { @apply w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-100; }
.name-text { @apply font-black text-gray-800 text-sm leading-tight; }
.info-subtext { @apply text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-1; }

/* --- روابط التواصل التفاعلية --- */
.contact-detail-grid { @apply flex flex-col gap-1.5 mt-3; }
.contact-item-link { @apply flex items-center gap-2 no-underline transition-all duration-300 hover:translate-x-[-4px] w-fit; }
.icon-box-mini { @apply w-7 h-7 flex items-center justify-center rounded-lg text-[10px] shadow-sm transition-all; }
.contact-text { @apply text-[11px] font-bold text-gray-500 group-hover:text-blue-700 transition-colors; }

/* ألوان أيقونات التواصل */
.phone-bg { @apply bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white; }
.telegram-bg { @apply bg-sky-50 text-sky-500 group-hover:bg-sky-500 group-hover:text-white; }
.email-bg { @apply bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white; }

/* --- إدارة الحساب والـ Switch --- */
.account-control-box { @apply bg-gray-50/50 p-3 rounded-2xl border border-gray-100 flex flex-col gap-1; }
.activation-wrapper { @apply flex items-center justify-between mt-2 pt-2 border-t border-gray-200/50; }
.status-label { @apply text-[10px] font-black uppercase; }
.status-label.active { @apply text-emerald-600; }
.status-label.inactive { @apply text-red-500; }

.switch { @apply relative inline-block w-10 h-5; }
.switch input { @apply opacity-0 w-0 h-0; }
.slider { @apply absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 transition-all rounded-full; }
.slider:before { @apply absolute content-[''] h-4 w-4 left-0.5 bottom-0.5 bg-white transition-all rounded-full; }
input:checked + .slider { @apply bg-emerald-500; }
input:checked + .slider:before { @apply translate-x-5; }

/* زر إنشاء حساب جديد */
.btn-create-account { @apply w-full border-2 border-dashed border-blue-200 text-blue-600 p-3 rounded-2xl text-[11px] font-black hover:bg-blue-600 hover:text-white transition-all hover:border-transparent shadow-sm; }

/* --- إدارة الأدوار --- */
.roles-stack { @apply flex flex-col gap-1.5; }
.role-chip { @apply flex items-center justify-between bg-white border border-gray-100 px-3 py-1.5 rounded-xl text-[11px] font-bold text-gray-600 transition-all hover:shadow-sm; }
.role-dot { @apply w-1.5 h-1.5 rounded-full bg-gray-300; }
.role-dot.super_admin { @apply bg-purple-500 shadow-[0_0_5px_purple]; }
.role-dot.teacher { @apply bg-emerald-500; }
.role-dot.student { @apply bg-blue-500; }
.btn-add-role { @apply w-5 h-5 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center text-[10px] font-bold hover:bg-blue-600 hover:text-white; }
.remove-role-btn { @apply opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all cursor-pointer; }

/* --- أزرار العمليات العامة --- */
.action-btn { @apply w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all; }
.action-btn.edit { @apply hover:bg-orange-50 text-orange-500; }
.action-btn.delete { @apply hover:bg-red-50 text-red-500; }
.no-account-text { @apply text-[10px] text-gray-300 italic block text-center py-4; }
</style>