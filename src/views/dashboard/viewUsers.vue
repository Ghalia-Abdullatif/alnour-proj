<template>
  <div>
  <GenericAdminLayout
    title="إدارة أعضاء المقرأة"
    description="نظرة عامة  على بيانات الطلاب والمعلمين والمشرفين وحساباتهم  وصلاحياتهم"
    :columns="userColumns"
    showAddButton="إضافة عضو جديد"
    @add-new="openAddPersonModal"
    :data="filteredUsers"
    :filterTabs="roleTabs"
    :activeTab="currentTab"
    v-model:searchQuery="searchKeyword"
    @tab-change="handleTabChange"
    :show-actions="['edit', 'delete']"
  >
    
    <template #top-widgets>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="icon-box"><i class="fa fa-users"></i></div>
          <div>
            <p class="stat-label">إجمالي الأعضاء</p>
            <p class="stat-value">{{ filteredUsers.length }} عضو</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="icon-box"><i class="fa fa-shield"></i></div>
          <div>
            <p class="stat-label">أصحاب الحسابات</p>
            <p class="stat-value">{{ activAcountCount }} حساب نشط</p>
          </div>
        </div>
      </div>
    </template>

    <template #table="{ data }">
      <div class="table-container">
        <div class="overflow-x-auto w-full custom-scrollbar">
          <table class="main-table min-w-[900px]">
            <thead>
              <tr>
                <th class="th-style w-16 text-center">ID</th>
                <th class="th-style min-w-[280px]">البيانات الشخصية والتواصل</th>
                <th class="th-style min-w-[220px]">إدارة الحساب والوصول</th>
                <th class="th-style min-w-[220px]">الأدوار والصلاحيات</th>
                <th class="th-style text-center w-28">الإجراءات</th>
              </tr>
            </thead>
            <tbody v-if="isLoading">
              <tr>
                <td colspan="5" class="py-20 text-center">
                  <div class="loading-wrapper">
                    <div class="loader"></div>
                    <p class="loading-text animate-pulse">جاري جلب بيانات الأعضاء...</p>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr v-for="(user, index) in data" :key="user.id" class="table-row">
                
                <td class="td-style text-center font-mono text-gray-400">#{{ index + 1 }}</td>

                <td class="td-style">
                  <div class="flex items-start gap-4">
                    <div class="avatar-lg">{{ user.fullName?.substring(0, 1) }}</div>
                    
                    <div class="flex flex-col gap-2">
                      <div>
                        <p class="name-text">{{ user.fullName }}</p>
                        <span class="info-subtext">
                          <span> <i class="fa fa-map-marker text-amber-600"></i> {{ user.country?.name }} </span>| 
                          <span> <i class="fa fa-birthday-cake text-rose-500"></i> {{ user.birth_date }}</span>
                        </span>
                      </div>
                      
                      <div class="contact-detail-grid">
                        <a :href="`tel:${user.phone_number}`" class="contact-item-link group">
                          <div class="icon-box-mini phone-bg"><i class="fa fa-phone"></i></div>
                          <span class="contact-text">{{ user.phone_number }}</span>
                        </a>
                        <a :href="`https://t.me/${user.telegram_id?.replace('@', '')}`" target="_blank" class="contact-item-link group">
                          <div class="icon-box-mini telegram-bg"><i class="fa fa-paper-plane"></i></div>
                          <span class="contact-text" dir="rtl">{{ user.telegram_id || '—' }}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </td>

                <td class="td-style">
                  <div v-if="user.accountDetails?.id !== '—'" class="account-control-box">
                    <div class="flex flex-col gap-1 mb-3">
                      <span class="text-[10px] font-black uppercase text-amber-700"> البريد الإلكتروني</span>
                      
                      <a :href="`mailto:${user.accountDetails?.email}`" class="contact-item-link group bg-white p-1 w-full rounded-xl border border-gray-100 shadow-sm">
                        <div class="icon-box-mini email-bg"><i class="fa fa-envelope"></i></div>
                        <span class="contact-text truncate w-32" :title="user.accountDetails?.email">
                          {{ user.accountDetails?.email }}
                        </span>
                      </a>
                    </div>
                    
                    <div class="activation-wrapper">
                      <span :class="['status-label', user.accountDetails?.is_active === 'نشط' ? 'active' : 'inactive']">
                        {{ user.accountDetails?.is_active }}
                      </span>
                      <label class="switch">
                        <input 
                          type="checkbox" 
                          :checked="user.accountDetails?.is_active === 'نشط'"
                          @change="handleStatusToggle(user)"
                        >
                        <span class="slider"></span>
                      </label>
                    </div>
                  </div>

                  <div v-else class="empty-account-zone">
                    <button class="btn-create-account" @click="handleCreateAccount(user)">
                      <i class="fa fa-plus-circle ml-1"></i> إنشاء حساب 
                    </button>
                  </div>
                </td>

                <td class="td-style">
                  <div v-if="user.accountDetails?.id !== '—'" class="roles-manager">
                    <div class="flex justify-between h-full items-start mb-2">
                      <span class="text-[9px] font-black text-gray-400 uppercase">الصلاحيات</span>
                      <button class="btn-add-role" @click="handleAddRoleis(user)"><i class="fa fa-plus"></i></button>
                    </div>
                    <div class="roles-stack">
                      <div v-for="role in user.accountDetails?.roles" :key="role.id" class="role-chip group">
                        <div class="flex items-center gap-2">
                          <div class="role-dot" :class="role.code"></div>
                          <span>{{ role.name }}</span>
                        </div>
                        <button class="remove-role-btn" @click="confirmDeleteRole(user, role)">
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
                    <button class="action-btn delete" @click="confirmDeleteUser(user)" title="حذف"><i class="fa fa-trash"></i></button>
                  </div>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
        
        <AccountFormModal 
          :is-open="isAccountModalOpen"
          :mode="modalMode"
          :user-data="selectedUser"
          @close="isAccountModalOpen = false"
          @refresh="handlAddAcount"
        />

        <ConfirmModal 
          :show="isConfirmOpen"
          :loading="isconfirmLouading"
          :title="confirmData.title"
          :message="confirmData.message"
          @confirm="executeAction"
          @cancel="isConfirmOpen = false"
        />

        <SuccessToast 
          :show="isToastVisible"
          :message="toastMsg"
          @close="isToastVisible = false"
        />

        <SelectionModal
          :is-open="isRoleModalOpen"
          title="منح صلاحية جديدة"
          :description="`اختاري الدور المناسب للمستخدم: ${selectedUser?.fullName}`"
          :options="availableRolesForSelectedUser"
          labelKey="name"    
          valueKey="id"      
          placeholder="ابحثي عن دور (مدير، معلم...)"
          confirmText=" اضافة الدور"
          :loading="isRoleLoading"
          @close="isRoleModalOpen = false"
          @confirm="(e) => handleRoleConfirm(e.selected)"
        />
      </div>
    </template>
  </GenericAdminLayout>

  <div v-if="isPersonModalOpen" class="p-4 fixed inset-0 z-[180] h-screen flex items-center justify-center bg-black/60 backdrop-blur-sm" @click="isPersonModalOpen = false">
    <div class="w-fit flex items-center justify-center h-fit overflow-y-auto custom-scrollbar" @click.stop> 
      <AddPerson 
        puttonLabel="ارسال"
        :initFormData="selectedUser"
        @cancel="isPersonModalOpen = false"
        @supmit="(e) => handlePersonSubmit(e.message)" 
      >
        <template #top>
          <div class="flex justify-cen</div>ter items-center mb-6">
            <h2 class="text-xl font-black text-amber-800">
              {{ personModalMode === 'edit' ? 'تعديل بيانات العضو' : 'إضافة عضو جديد للمقرأة' }}
            </h2>
          </div>
        </template>
      </AddPerson>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import GenericAdminLayout from '@/views/dashboard/admin/GenericAdminLayout.vue';
import { usePepoleStore } from "@/stors/pepole-store.js";

import AccountFormModal from '@/views/AccountFormModal.vue'; 
import SelectionModal from '@/components/GenericSelectModal.vue'; 
import ConfirmModal from '@/components/confirmAndSucces/ConfirmModal.vue'; 
import SuccessToast from '@/components/confirmAndSucces/SuccessToast.vue';
import AddPerson from "@/views/registration/AddPerson.vue";

const pepoleStore = usePepoleStore();

const isLoading = ref(false);          
const isRoleLoading = ref(false);      
const isconfirmLouading = ref(false);  

const isPersonModalOpen = ref(false);
const isAccountModalOpen = ref(false);
const isRoleModalOpen = ref(false);
const isConfirmOpen = ref(false);
const isToastVisible = ref(false);


const modalMode = ref('create');       
const personModalMode = ref('create'); 
const selectedUser = ref(null);        
const toastMsg = ref('');  

const searchKeyword = ref('');         
const currentTab = ref('all');



// تم تحديث التاب وإضافة الأدوار المطلوبة: 'group_supervisor' و 'batch_supervisor'
const roleTabs = [                     
  { label: 'كافة الأعضاء', value: 'all' },
  { label: 'مدراء النظام', value: 'super_admin' },
  { label: 'المعلمين', value: 'teacher' },
  { label: 'مشرفي المجموعات', value: 'group_supervisor' },
  { label: 'مشرفي الدفعات', value: 'batch_supervisor' },
  { label: 'الطلاب', value: 'student' }
];

const availableRolesForSelectedUser = ref([]);

const confirmData = ref({ 
  title: '', 
  message: '', 
  actionType: '', 
  id: null        
});

const userColumns = [
  { label: 'البيانات الشخصية', key: 'fullName' },
  { label: 'إدارة الحساب', key: 'account' },
  { label: 'الصلاحيات', key: 'roles' },
  { label: 'الإجراءات', key: 'actions' }
];

onMounted(async () => {
  await refreshData();
});

const refreshData = async () => {
  isLoading.value = true;
  try {
    await pepoleStore.getPeapleStoreData();
  } catch (error) {
    console.error("خطأ أثناء جلب البيانات:", error);
    showToast("عذراً، فشل تحديث قائمة الأعضاء");
  } finally {
    isLoading.value = false;
  }
};
const activAcountCount = computed(() => {
  return filteredUsers.value.filter(user => 
    user.accountDetails && user.accountDetails.id && user.accountDetails.is_active === 'نشط'
  ).length;
});

const filteredUsers = computed(() => {
  const allUsersList = pepoleStore.getUsersWithRoles || [];
  const query = searchKeyword.value.trim().toLowerCase();

  return allUsersList.filter(user => {
    // الفلترة بالتاب الذكي
    let matchesTab = currentTab.value === 'all';
    if (!matchesTab && user.accountDetails?.roles) {
      matchesTab = user.accountDetails.roles.some(role => role.code === currentTab.value);
    }

    // الفلترة بمحرك البحث المطور
    let matchesSearch = true;
    if (query) {
      const nameMatch = user.fullName?.toLowerCase().includes(query);
      const emailMatch = user.accountDetails?.email?.toLowerCase().includes(query);
      const phoneMatch = user.phone_number?.includes(query);
      
      matchesSearch = nameMatch || emailMatch || phoneMatch;
    }

    return matchesTab && matchesSearch;
  });
});

const activeAccountsCount = computed(() => 
  (pepoleStore.getUsersWithRoles || []).filter(u => u.accountDetails?.is_active === 'نشط').length
);

const handleTabChange = (tabValue) => {
  currentTab.value = tabValue;
};

const confirmDeleteRole = (user, role) => {
  confirmData.value = {
    title: 'سحب صلاحية',
    message: `هل تودين سحب دور (${role.name}) من المستخدم (${user.fullName})؟`,
    actionType: 'DELETE_ROLE',
    id: role.id
  };
  isConfirmOpen.value = true;
};

const confirmDeleteUser = (user) => {
  confirmData.value = {
    title: 'حذف عضو',
    message: `تحذير: سيتم حذف (${user.fullName}) نهائياً من النظام، هل أنتِ متأكدة؟`,
    actionType: 'DELETE_USER',
    id: user.id
  };
  isConfirmOpen.value = true;
};

const openAddPersonModal = () => {
  personModalMode.value = 'create';
  selectedUser.value = null; 
  isPersonModalOpen.value = true;
};

const editUser = (user) => {
  personModalMode.value = 'edit';
  selectedUser.value = {
    id: user.id,
    firstName: user.first_name,
    secondName: user.second_name,
    thirdName: user.third_name,
    fourthName: user.fourth_name,
    birthDate: user.birth_date,
    country: {"id": "SD", "value": "السودان", "icon": "sd", "dialCode": "+249"}, 
    email: user.accountDetails?.email || "",
    phone: user.phone_number,
    telegram: user.telegram_id,
  };
  isPersonModalOpen.value = true;
};

const handlePersonSubmit = async (payload) => {
  const data = payload; 
  const apiData = {
    country_id: 1,
    first_name: data.firstName,
    second_name: data.secondName,
    third_name: data.thirdName,
    fourth_name: data.fourthName,
    birth_date: data.birthDate,
    telegram_id: data.telegram,
    phone_number: data.phone,
    email: data.email
  };

  try {
    let result;
    if (personModalMode.value === 'edit') {
      result = await pepoleStore.updatePerson(selectedUser.value.id, apiData);
    } else {
      result = await pepoleStore.createPerson(apiData);
    }

    if (result && result.success) {
      showToast(personModalMode.value === 'edit' ? "تم تحديث البيانات بنجاح" : "تم إضافة العضو بنجاح");
      isPersonModalOpen.value = false;
      await refreshData(); 
    } else {
      showToast("عذراً، حدث خطأ أثناء معالجة الطلب في السيرفر");
    }
  } catch (error) {
    console.error("خطأ في إضافة/تعديل مستخدم:", error);
    showToast("عذراً، حدث خطأ غير متوقع أثناء العملية");
  }
};
const handlAddAcount = async ()=>{
  isAccountModalOpen.value=false;
        showToast("تم اضافة الحساب بنجاح ");
              await refreshData(); 


}

const executeAction = async () => {
  const { actionType, id } = confirmData.value;
  isconfirmLouading.value = true;

  try {
    let result;
    if (actionType === 'DELETE_ROLE') {
      result = await pepoleStore.deleteAcountRole(id);
      if (result && result.success) {
        showToast("تم سحب الصلاحية بنجاح");
      } else {
        showToast("عذراً، لم نتمكن من سحب الصلاحية من الخادم");
      }
    } else if (actionType === 'DELETE_USER') {
      result = await pepoleStore.deletePerson(id); 
      if (result && result.success) {
        showToast("تم حذف العضو بنجاح");
      } else {
        showToast("عذراً، لم نتمكن من حذف العضو من النظام");
      }
    }
    
    if (result && result.success) {
      await refreshData();
    }
  } catch (error) {
    console.error("حدث خطأ في executeAction:", error);
    showToast("عذراً، فشلت العملية البرمجية بسبب مشكلة في الاتصال");
  } finally {
    isconfirmLouading.value = false;
    isConfirmOpen.value = false;
  }
};

const openAccountModal = (mode, user) => {
  modalMode.value = mode;
  selectedUser.value = user;
  isAccountModalOpen.value = true;
};

const handleRoleConfirm = async (roleId) => {
  isRoleLoading.value = true;
  try {
    const result = await pepoleStore.addRoleToAccount({
      account: selectedUser.value.accountDetails.id,
      role: roleId
    });
    
    if (result && result.success) {
      showToast("تم إضافة الصلاحية بنجاح");
      isRoleModalOpen.value = false;
      await refreshData();
    } else {
      showToast("عذراً، فشلت عملية تخصيص الصلاحية");
    }
  } catch (error) {
    console.error("حدث خطأ أثناء إضافة الصلاحية:", error);
    showToast("عذراً، حدث خطأ غير متوقع في الشبكة");
  } finally {
    isRoleLoading.value = false;
  }
};

const handleStatusToggle = (user) => {
  showToast("جاري تحديث حالة الحساب...");
};

const handleCreateAccount = (user) => {
  openAccountModal('create', user);
};

const handleAddRoleis = (user) => {
  selectedUser.value = user;
  const userRoles = user.accountDetails?.roles || [];

  availableRolesForSelectedUser.value = (pepoleStore.allRoles || []).filter((role) => {
    return !userRoles.some((userRole) => String(userRole.roleId || userRole.id) === String(role.id));
  });

  isRoleModalOpen.value = true;
};

const showToast = (msg) => {
  toastMsg.value = msg;
  isToastVisible.value = true;
};
</script>

<style>
@reference "@/css/style.css";

.table-container { 
  @apply rounded-[2.5rem] shadow-xl border overflow-hidden w-full; 
  background-color: var(--color-card);
  border-color: var(--color-primaryh);
  box-shadow: 0 10px 30px rgba(118, 23, 23, 0.05);
}

.main-table { 
  @apply w-full border-separate border-spacing-y-4 px-4; 
}

.table-row { 
  @apply border transition-all duration-300; 
  background-color: var(--color-card);
  border-color: rgba(118, 23, 23, 0.08);
  box-shadow: 0 4px 14px rgba(0,0,0,0.03);
}

.table-row td:first-child { @apply rounded-r-3xl; }
.table-row td:last-child { @apply rounded-l-3xl; }

.table-row:hover { 
  @apply -translate-y-0.5; 
  background: linear-gradient(180deg, #fffefe 0%, #fcf5f5 100%);
  border-color: rgba(118, 23, 23, 0.15);
  box-shadow: 0 12px 24px rgba(118, 23, 23, 0.08);
}

.th-style { 
  @apply p-5 text-[11px] font-black uppercase tracking-widest text-right; 
  color: var(--color-basicGray); 
}

.td-style { @apply p-5 align-top; }
/* 
.custom-scrollbar::-webkit-scrollbar { height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { 
  background: linear-gradient(180deg, var(--color-primary), #983A3A);
  border-radius: 10px; 
} */

.loading-wrapper { @apply flex flex-col items-center justify-center py-20 gap-4; }
.loader { 
  @apply w-12 h-12 border-4 rounded-full animate-spin; 
  border-color: var(--color-primaryh);
  border-top-color: var(--color-primary);
}
.loading-text { @apply font-tajawal text-sm; color: var(--color-basicGray); }

.stats-grid { @apply grid grid-cols-1 md:grid-cols-2 gap-6 mb-8; }
.stat-card { 
  @apply p-6 rounded-[2rem] border flex items-center gap-5 transition-all duration-300; 
  background-color: var(--color-card);
  border-color: var(--color-primaryh);
  box-shadow: 0 6px 18px rgba(118, 23, 23, 0.05);
}
.stat-card:hover { @apply -translate-y-1; box-shadow: 0 14px 28px rgba(118, 23, 23, 0.08); }
.stat-label { @apply text-[11px] font-black uppercase tracking-wider; color: var(--color-basicGray); }
.stat-value { @apply text-2xl font-black; color: var(--color-primary); }
.icon-box { 
  @apply w-12 h-12 rounded-2xl flex items-center justify-center text-xl; 
  background: linear-gradient(135deg, var(--color-primary), #983A3A);
  color: white;
  box-shadow: 0 8px 18px rgba(118, 23, 23, 0.18);
}

.avatar-lg {
  @apply w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shrink-0;
  background: linear-gradient(135deg, var(--color-primary), #983A3A);
  box-shadow: 0 10px 20px rgba(118, 23, 23, 0.2);
}

.name-text { @apply text-sm leading-tight font-black; color: var(--color-text-black); }
.info-subtext { @apply text-[11px] font-medium flex items-center gap-1 mt-1; color: var(--color-basicGray); }

.contact-detail-grid { @apply flex flex-col gap-1.5 mt-2; }
.contact-item-link { @apply flex items-center gap-2 no-underline transition-all duration-300 hover:translate-x-[-4px] w-fit; }
.icon-box-mini { @apply w-7 h-7 flex items-center justify-center rounded-lg text-[11px] shadow-sm transition-all; }
.contact-text { @apply text-[11px] font-bold transition-colors; color: var(--color-text-gray); }
.contact-item-link:hover .contact-text { color: var(--color-primary); }

.phone-bg { background-color: var(--color-primary-soft); color: var(--color-green-primary); }
.phone-bg:hover { background-color: var(--color-green-primary) !important; color: white !important; }
.telegram-bg { background-color: #eef4ff; color: #2672d8; }
.telegram-bg:hover { background-color: #2672d8 !important; color: white !important; }
.email-bg { background-color: var(--color-golden); color: white !important; }

.account-control-box { @apply p-3 rounded-2xl border flex flex-col gap-1; background-color: #fffdfd; border-color: var(--color-primaryh); }
.activation-wrapper { @apply flex items-center justify-between mt-2 pt-2 border-t; border-color: var(--color-primaryh); }
.status-label { @apply text-[10px] font-black uppercase tracking-wider; }
.status-label.active { color: var(--color-Brown); }
.status-label.inactive { color: var(--color-flag-red); }

.switch { @apply relative inline-block w-10 h-5; }
.switch input { @apply opacity-0 w-0 h-0; }
.slider { @apply absolute cursor-pointer top-0 left-0 right-0 bottom-0 transition-all rounded-full; background-color: #ddd; }
.slider:before { @apply absolute content-[''] h-4 w-4 left-0.5 bottom-0.5 bg-white transition-all rounded-full; }
input:checked + .slider { background-color: var(--color-green-primary); }
input:checked + .slider:before { @apply translate-x-5; }

.btn-create-account { 
  @apply w-full border-2 border-dashed p-3 rounded-2xl text-[11px] font-black transition-all shadow-sm block text-center; 
  color: var(--color-golden); border-color: var(--color-cardCasterd); background-color: #fffdfa;
}
.btn-create-account:hover { background-color: var(--color-golden); color: white !important; border-color: transparent; }

.roles-stack { @apply flex flex-col gap-1.5 items-start w-full; }
.role-chip { 
  @apply flex items-center justify-between border px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all hover:shadow-sm w-full;
  background-color: var(--color-card); border-color: var(--color-primaryh); color: var(--color-text-gray); 
}
.role-chip:hover { background-color: #fcf5f5; }
.role-dot { @apply w-1.5 h-1.5 rounded-full; background-color: var(--color-basicGrayh); }

/* الألوان المخصصة للنقاط التعريفية بناءً على الأكواد المضافة للرولز */
.role-dot.super_admin { background-color: var(--color-primary); box-shadow: 0 0 6px rgba(118, 23, 23, 0.35); }
.role-dot.teacher { background-color: var(--color-golden); }
.role-dot.group_supervisor { background-color: #2672d8; }
.role-dot.batch_supervisor { background-color: #10b981; }
.role-dot.student { background-color: var(--color-Brown); }

.btn-add-role { 
  @apply w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold transition-colors; 
  background-color: var(--color-layer); color: var(--color-primary);
}
.btn-add-role:hover { background-color: var(--color-primary); color: white; }
.remove-role-btn { @apply opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-xs; color: var(--color-flag-red); }

.action-btn { 
  @apply w-8 h-8 rounded-lg flex items-center justify-center shadow-sm border transition-all hover:scale-105; 
  background-color: var(--color-card); border-color: var(--color-primaryh);
}
.action-btn.edit { color: var(--color-golden); }
.action-btn.edit:hover { background-color: var(--color-cardYellow); border-color: transparent; }
.action-btn.delete { color: var(--color-flag-red); }
.action-btn.delete:hover { background-color: #ffecec; border-color: transparent; }

.no-account-text { @apply text-[11px] italic block text-center py-2; color: var(--color-basicGray); }
</style>