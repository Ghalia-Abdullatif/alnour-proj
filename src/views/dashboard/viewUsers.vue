<!-- <template>
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
</style> -->





 <!-- <template>
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
      <div class="table-container custom-scrollbar">
        <div v-if="isLoading" class="loading-wrapper">
           <div class="loader"></div>
           <p class="loading-text">جاري جلب بيانات المقرأة...</p>
        </div>

        <table v-else class="main-table border-separate border-spacing-y-4 px-4">
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
            <tr v-for="user in data" :key="user.id" class="table-row group">
              
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
                  <div class="flex flex-col gap-1 mb-3">
                    <span class="text-[10px] font-black text-blue-500 uppercase">بريد المنظومة</span>
                    <a :href="`mailto:${user.accountDetails.email}`" class="contact-item-link group bg-white p-1 w-full rounded-xl border border-gray-100 shadow-sm">
                      <div class="icon-box-mini email-bg"><i class="fa fa-envelope"></i></div>
                      <span class="contact-text truncate w-32" :title="user.accountDetails.email">
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
                      <button class="remove-role-btn" @click="confirmDeleteRole(role.id)">
                        <i class="fa fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <span v-else class="no-account-text">تتطلب إنشاء حساب</span>
              </td>

              <td class="td-style text-center">
                <div class="flex justify-center gap-2">
                  <button class="action-btn edit" @click="handleEditAccount(user)" title="تعديل"><i class="fa fa-pencil"></i></button>
                  <button class="action-btn delete" @click="confirmDeleteUser(user)" title="حذف"><i class="fa fa-trash"></i></button>
                </div>
              </td>

            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </GenericAdminLayout>

  <ConfirmModal 
    :show="isConfirmOpen"
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

  <AccountFormModal 
    :is-open="isAccountModalOpen"
    :mode="modalMode"
    :user-data="selectedUser"
    @close="isAccountModalOpen = false"
    @refresh="refreshData"
  /> -->
  <template>
  <GenericAdminLayout
    title="إدارة أعضاء المقرأة"
    description="نظرة عامة شاملة على بيانات الطلاب والمعلمين وحساباتهم التقنية وصلاحياتهم"
    :columns="userColumns"
    showAddButton="إضافة عضو جديد"
      @add-new="openAddPersonModal"

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
          <tbody v-if="isLoading">
        <tr>
          <td colspan="5" class="py-20 text-center">
            <div class="flex flex-col items-center gap-4">
              <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p class="text-gray-500 font-bold animate-pulse">جاري جلب بيانات الأعضاء...</p>
            </div>
          </td>
        </tr>
      </tbody>
          <tbody v-else>
            <tr  v-for="user in data" :key="user.id" class="table-row">
              
              <td class="td-style text-center font-mono text-gray-400">#{{ user.id }}</td>

              <td class="td-style">
                <div class="flex items-start gap-4">
                  <div class="avatar-lg">{{ user.fullName.substring(0, 1) }}</div>
                  
                  <div class="flex flex-col gap-2">
                    <div>
                      <p class="name-text">{{ user.fullName }}</p>
                      <span class="info-subtext">
                       <span> <i class="fa fa-map-marker text-blue-500"></i> {{ user.country.name }} </span>| 
                      <span>  <i class="fa fa-birthday-cake text-pink-500"></i> {{ user.birth_date }}</span>
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
                    <i class="fa fa-plus-circle mr-1"></i> إنشاء حساب 
                  </button>
                </div>
              </td>

              <td class="td-style">
                <div v-if="user.accountDetails.id !== '—'" class="roles-manager">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-[9px] font-black text-gray-400 uppercase">الصلاحيات</span>
                    <button class="btn-add-role" @click="handleAddRoleis(user)"><i class="fa fa-plus"></i></button>
                  </div>
                  <div class="roles-stack">
                    <div v-for="role in user.accountDetails.roles" :key="role.id" class="role-chip group">
                      <div class="flex items-center gap-2">
                        <div class="role-dot" :class="role.code"></div>
                        <span>{{ role.name }}</span>
                      </div>
                      <button class="remove-role-btn" @click="confirmDeleteRole(user,role)">
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
  <ConfirmModal 
    :show="isConfirmOpen"
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

  <!-- <AccountFormModal 
    :is-open="isAccountModalOpen"
    :mode="modalMode"
    :user-data="selectedUser"
    @close="isAccountModalOpen = false"
    @refresh="refreshData"
  /> -->
  <SelectionModal
  :is-open="isRoleModalOpen"
  title="منح صلاحية جديدة"
  :description="`اختاري الدور المناسب للمستخدم: ${selectedUser?.fullName}`"
  :options="pepoleStore.allRoles"
  labelKey="name"    
  valueKey="id"      
  placeholder="ابحثي عن دور (مدير، معلم...)"
  confirmText=" اضافة الدور"
  :loading="isRoleLoading"
  @close="isRoleModalOpen = false"
  @confirm="(e)=>handleRoleConfirm(e.selected)"
/>
      </div>
    </template>
  </GenericAdminLayout>
   <div  v-if="isPersonModalOpen" class=" p-4 fixed inset-0 z-[180] h-screen flex items-center justify-center bg-black/60 backdrop-blur-sm " @click="isPersonModalOpen = false">
  <div class=" w-fit  flex items-center justify-center  h-fit overflow-y-auto custom-scrollbar"> 
    <!-- <AddPerson 
      :puttonLabel="personModalMode === 'edit' ? 'تحديث البيانات' : 'إضافة عضو'"
      :initFormData="selectedUser"
      @supmit="handlePersonSubmit"
      @cancel="isPersonModalOpen = false"
    > -->
      <AddPerson puttonLabel="ارسال"
        @cancel="isPersonModalOpen = false"
       @supmit="(e)=>handlePersonSubmit(e.message)" 
>

      <template #top>
        <div class="flex justify-between items-center mb-6">
           <h2 class="text-xl font-black text-blue-700">
            {{ personModalMode === 'edit' ? 'تعديل بيانات العضو' : 'إضافة عضو جديد للمقرأة' }}
          </h2>
          <!-- <button @click="isPersonModalOpen = false" class="text-gray-400 hover:text-red-500 transition-colors">
            <i class="fa fa-times-circle text-2xl"></i>
          </button> -->
        </div>
      </template>
    </AddPerson>
  </div>
</div>
</template>
  

<script setup>
/**
 * استيراد المكتبات والمتاجر البرمجية
 */
import { ref, onMounted, computed } from 'vue';
import GenericAdminLayout from '@/views/dashboard/admin/GenericAdminLayout.vue';
import { usePepoleStore } from "@/stors/pepole-store.js";
import AccountFormModal from '@/views/AccountFormModal.vue'; 
import SelectionModal from '@/components/GenericSelectModal.vue'; // تأكدي من المسار الصحيح
import ConfirmModal from '@/components/confirmAndSucces/ConfirmModal.vue'; 
import SuccessToast from '@/components/confirmAndSucces/SuccessToast.vue';
import AddPerson from "@/views/registration/AddPerson.vue";


// --- إدارة الحالة (State Management) ---
const pepoleStore = usePepoleStore();
const isLoading = ref(false);
const isRoleLoading = ref(false);
const isPersonModalOpen = ref(false);
const isAccountModalOpen = ref(false);
const isRoleModalOpen = ref(false);
const isConfirmOpen = ref(false);

const isToastVisible = ref(false);

const modalMode = ref('create'); // 'create' أو 'edit'
const selectedUser = ref(null);
const toastMsg = ref('');
const personModalMode = ref('create');

// إعدادات نافذة التأكيد
const confirmData = ref({ title: '', message: '', actionType: '', id: null });


// تعريف الأعمدة لـ GenericAdminLayout
const userColumns = [
  { label: 'البيانات الشخصية', key: 'fullName' },
  { label: 'إدارة الحساب', key: 'account' },
  { label: 'الصلاحيات', key: 'roles' },
  { label: 'الإجراءات', key: 'actions' }
];

/**
 * عند تحميل المكون: جلب البيانات من السيرفر
 */
onMounted(async () => {
  await refreshData();
});

const refreshData = async () => {
  isLoading.value = true;
  await pepoleStore.getPeapleStoreData();
  isLoading.value = false;
};

// --- الدوال الحسابية (Computed) ---
const allUsers = computed(() => pepoleStore.getUsersWithRoles);
const activeAccountsCount = computed(() => 
  allUsers.value.filter(u => u.accountDetails.is_active === 'نشط').length
);

/**
 * منطق حذف صلاحية (Role) محددة من مستخدم
 */

const confirmDeleteRole = (user,role) => {
  confirmData.value = {
    title: 'سحب صلاحية',
    message: `هل تودين سحب دور (${role.name}) من المستخدم (${user.fullName})؟`,
    actionType: 'DELETE_ROLE',
    id: role.id
  };
  isConfirmOpen.value = true;
};


/**
 * منطق حذف مستخدم بالكامل من النظام
 */
const confirmDeleteUser = (user) => {
  confirmData.value = {
    title: 'حذف عضو',
    message: `تحذير: سيتم حذف (${user.fullName}) نهائياً من النظام، هل أنتِ متأكدة؟`,
    actionType: 'DELETE_USER',
    id: user.id
  };
  isConfirmOpen.value = true;
};

// دالة لفتح المودال للإضافة
const openAddPersonModal = () => {
  personModalMode.value = 'create';
  selectedUser.value = null; // للتأكد من أن الفورم سيبدأ فارغاً
  isPersonModalOpen.value = true;
};

// دالة لفتح المودال للتعديل
const editUser = (user) => {
  personModalMode.value = 'edit';
  // نقوم بتحويل البيانات من شكل الـ API إلى الشكل الذي يتوقعه المكون
  selectedUser.value = {
    id: user.id,
    firstName: user.first_name,
    secondName: user.second_name,
    thirdName: user.third_name,
    fourthName: user.fourth_name,
    birthDate: user.birth_date,
    country: user.country.id, // نرسل الـ ID حسب طلب الـ API
    email: user.accountDetails?.email || "",
    phone: user.phone_number,
    telegram: user.telegram_id,
  };
  isPersonModalOpen.value = true;
};
const handlePersonSubmit = async (payload) => {
  console.log("هاند ادد بيرسون")
  const data = payload; // البيانات القادمة من المكون
  
  // تجهيز الكائن بالشكل الذي يطلبه الـ API (mapping)
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

    if (result) {
      showToast(personModalMode.value === 'edit' ? "تم تحديث البيانات بنجاح" : "تم إضافة العضو بنجاح");
      isPersonModalOpen.value = false;
      await refreshData();
    }
  } catch (error) {
    showToast("عذراً، حدث خطأ أثناء العملية");
  }
};
/**
 * التنفيذ الفعلي للأوامر بعد موافقة المستخدم في نافذة التأكيد
 */
const executeAction = async () => {
  const { actionType, id } = confirmData.value;
  console.log(" functiooooooooon")

 
    if (actionType === 'DELETE_ROLE') {
      console.log(id,"role")
    const result= await pepoleStore.deleteAcountRole(id);
    console.log(result,"result after delete role")
      isConfirmOpen.value = false;

      showToast("تم سحب الصلاحية بنجاح");
    } else if (actionType === 'DELETE_USER') {
      // await pepoleStore.deleteUser(id); // مثال
      showToast("تم حذف العضو بنجاح");
    }
    await refreshData();
  }

/**
 * إدارة الحسابات التقنية (فتح المودال للإنشاء أو التعديل)
 */
const openAccountModal = ( mode) => {
  modalMode.value = mode;
  selectedUser.value = user;
  isAccountModalOpen.value = true;
};
// 4. الدالة التي تُستدعى عند الضغط على "تأكيد الاختيار" داخل المودال
const handleRoleConfirm = async (roleId) => {
  isRoleLoading.value = true;
  console.log(roleId,"roleId","userId",selectedUser.value.accountDetails.id)
    // استدعاء الأكشن من الـ Store لإضافة الدور
    // نفترض أن لديكِ أكشن اسمه addRoleToUser  \"account\": 1,\n    \"role\": 2\n}
  const result = await pepoleStore.addRoleToAccount({
      account: selectedUser.value.accountDetails.id,
      role: roleId
    });
    if(result.success){
      showToast("تم إضافة الصلاحية بنجاح");
          isRoleLoading.value = false;
            isRoleLoading.value = false;
            isRoleModalOpen.value = false;


      await refreshData();
    } else {
      showToast("عذراً، فشلت العملية");
    }

}

const handleStatusToggle = (user) => {
  showToast("جاري تحديث حالة الحساب...");
  // هنا يتم استدعاء الأكشن الخاص بتغيير الحالة في الـ Store
};
// اضافة حساب
const handleCreateAccount = (user) => {
  console.log(user,"useeer selected dataaaaaaaaaaaaaa")
  modalMode.value = 'create';
  selectedUser.value = user; // نمرر بيانات الشخص لربط الإيميل
  isAccountModalOpen.value = true;
};

const handleAddRoleis = (user) => {
  
  selectedUser.value = user;
  console.log(selectedUser)
  isRoleModalOpen.value = true;
  console.log()

  // منطق فتح نافذة اختيار الأدوار
};

const showToast = (msg) => {
  toastMsg.value = msg;
  isToastVisible.value = true;
};
</script>

<style scoped>
@reference "@/css/style.css";

/* --- تنسيقات الفواصل (Spacing Between Rows) --- */
.main-table { @apply w-full border-separate border-spacing-y-4; }
.table-row { @apply bg-white shadow-sm border border-gray-50 transition-all duration-300; }
.table-row td:first-child { @apply rounded-r-3xl; }
.table-row td:last-child { @apply rounded-l-3xl; }
.table-row:hover { @apply -translate-y-1 shadow-md bg-layer/30; }

.td-style { @apply p-5 align-middle; }

/* --- حالة التحميل (Reloading / Loading) --- */
.loading-wrapper { @apply flex flex-col items-center justify-center py-20 gap-4; }
.loader { @apply w-12 h-12 border-4 border-gray-100 border-t-green-primary rounded-full animate-spin; }
.loading-text { @apply font-tajawal text-gray-400 text-sm; }

/* --- استايلاتك المخصصة السابقة --- */
.stats-grid { @apply grid grid-cols-1 md:grid-cols-2 gap-6 mb-8; }
.stat-card { @apply bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5; }
.stat-label { @apply text-[10px] text-gray-400 font-black uppercase; }
.stat-value { @apply text-xl font-black text-gray-800; }
.icon-box { @apply w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-blue-50 text-blue-600 shadow-inner; }

.th-style { @apply px-5 pb-2 text-[10px] font-black text-gray-300 uppercase tracking-widest; }
.avatar-lg { @apply w-12 h-12 rounded-2xl bg-gradient-to-br from-green-primary to-green-hover flex items-center justify-center text-white text-xl font-black shadow-lg; }
.name-text { @apply font-black text-gray-800 text-sm; }
.info-subtext { @apply text-[10px] text-gray-400 flex items-center gap-1 mt-1; }

.contact-detail-grid { @apply flex flex-col gap-1.5 mt-3; }
.contact-item-link { @apply flex items-center gap-2 no-underline hover:translate-x-[-4px] transition-transform w-fit; }
.icon-box-mini { @apply w-7 h-7 flex items-center justify-center rounded-lg text-[10px] shadow-sm; }
.contact-text { @apply text-[11px] font-bold text-gray-500 group-hover:text-green-primary; }

.phone-bg { @apply bg-green-50 text-green-600; }
.telegram-bg { @apply bg-sky-50 text-sky-500; }
.email-bg { @apply bg-blue-50 text-blue-600; }

.account-control-box { @apply bg-black p-3  rounded-2xl border border-gray-100; }
.status-label { @apply text-[10px] font-black uppercase; }
.status-label.active { @apply text-emerald-600; }
.status-label.inactive { @apply text-red-500; }
.activation-row { @apply flex items-center justify-between; }


.switch { @apply relative inline-block w-10 h-5 focus:rounded-none; }
.slider { @apply absolute cursor-pointer inset-0 bg-gray-300 transition-all rounded-full; }
.slider:before { @apply absolute content-[''] h-4 w-4 left-0.5 bottom-0.5 bg-white transition-all rounded-full; }
input:checked + .slider { @apply bg-emerald-500; }
input:checked + .slider:before { @apply translate-x-5; }

.btn-create-account { @apply w-full border-2 border-dashed border-blue-200 text-blue-600 p-3 rounded-2xl text-[11px] font-black hover:bg-green-primary hover:text-white transition-all; }

.role-chip { @apply flex items-center justify-between bg-white border border-gray-100 px-3 py-1.5 rounded-xl text-[11px] font-bold text-gray-600; }
.role-dot { @apply w-1.5 h-1.5 rounded-full bg-gray-300; }
.role-dot.super_admin { @apply bg-purple-500 shadow-[0_0_5px_purple]; }
.role-dot.teacher { @apply bg-emerald-500; }
.role-dot.student { @apply bg-blue-500; }

.action-btn { @apply w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm border border-gray-100 hover:scale-110 transition-transform; }
.action-btn.edit { @apply hover:bg-orange-50 text-orange-500; }
.action-btn.delete { @apply hover:bg-red-50 text-red-500; }

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




<!-- <template>
  <GenericAdminLayout
    title="إدارة أعضاء المقرأة"
    description="لوحة تحكم كاملة لإدارة البيانات، الحسابات التقنية، والأدوار الممنوحة"
    :columns="userColumns"
    showAddButton="إضافة عضو جديد"
    :data="allUsers"
  >
    <template #top-widgets>
      <div class="stats-grid">
        <div class="stat-card blue">
          <div class="icon-box"><i class="fa fa-users"></i></div>
          <div>
            <p class="stat-label">إجمالي الأعضاء</p>
            <p class="stat-value">{{ allUsers.length }} عضو</p>
          </div>
        </div>
        <div class="stat-card emerald">
          <div class="icon-box"><i class="fa fa-shield"></i></div>
          <div>
            <p class="stat-label">الحسابات النشطة</p>
            <p class="stat-value">{{ activeAccountsCount }} حساب</p>
          </div>
        </div>
      </div>
    </template>

    <template #table="{ data }">
      <div class="table-container custom-scrollbar">
        <div v-if="isLoading" class="loading-wrapper">
          <div class="loader"></div>
          <p class="loading-text">جاري مزامنة بيانات الأعضاء...</p>
        </div>

        <table v-else class="main-table">
          <thead>
            <tr>
              <th class="th-style">البيانات الشخصية</th>
              <th class="th-style">الحساب والبريد</th>
              <th class="th-style">الأدوار والصلاحيات</th>
              <th class="th-style text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in data" :key="user.id" class="table-row group">
              
              <td class="td-style">
                <div class="flex items-center gap-4">
                  <div class="avatar-lg">{{ user.fullName.charAt(0) }}</div>
                  <div class="flex flex-col">
                    <p class="name-text">{{ user.fullName }}</p>
                    <span class="info-subtext"><i class="fa fa-globe"></i> {{ user.country.name }}</span>
                    <span class="contact-text">{{ user.phone_number }}</span>
                  </div>
                </div>
              </td>

              <td class="td-style">
                <div v-if="user.accountDetails.id !== '—'" class="account-box">
                  <span class="email-display">{{ user.accountDetails.email }}</span>
                  <div class="activation-row">
                    <span :class="['status-tag', user.accountDetails.is_active === 'نشط' ? 'active' : 'inactive']">
                      {{ user.accountDetails.is_active }}
                    </span>
                    <label class="switch">
                      <input type="checkbox" :checked="user.accountDetails.is_active === 'نشط'" @change="handleStatusToggle(user)">
                      <span class="slider"></span>
                    </label>
                  </div>
                </div>
                <button v-else class="btn-create" @click="openAccountModal(user, 'create')">
                  <i class="fa fa-plus-circle"></i> إنشاء حساب
                </button>
              </td>

              <td class="td-style">
                <div v-if="user.accountDetails.id !== '—'" class="roles-manager">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-[9px] font-black text-gray-400">الصلاحيات الممنوحة</span>
                    <button class="btn-add-role" @click="initiateAddRole(user)" title="إضافة دور">
                      <i class="fa fa-plus"></i>
                    </button>
                  </div>
                  <div class="roles-flex">
                    <div v-for="role in user.accountDetails.roles" :key="role.id" class="role-chip group/role">
                      <span class="flex items-center gap-1">
                        <span class="role-dot" :class="role.code"></span> {{ role.name }}
                      </span>
                      <button class="remove-role-btn" @click="confirmDeleteRole(user, role)">
                        <i class="fa fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <span v-else class="no-data-text">بانتظار إنشاء حساب</span>
              </td>

              <td class="td-style">
                <div class="flex justify-center gap-2">
                  <button class="action-btn edit" @click="openAccountModal(user, 'edit')" title="تعديل الحساب">
                    <i class="fa fa-pencil"></i>
                  </button>
                  <button class="action-btn delete" @click="confirmDeleteUser(user)" title="حذف العضو">
                    <i class="fa fa-trash"></i>
                  </button>
                </div>
              </td>

            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </GenericAdminLayout>

  <ConfirmModal 
    :show="isConfirmOpen"
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

  <AccountFormModal 
    :is-open="isAccountModalOpen"
    :mode="modalMode"
    :user-data="selectedUser"
    @close="isAccountModalOpen = false"
    @refresh="refreshData"
  />
</template>

<script setup>
/**
 * استيراد المكتبات والمتاجر البرمجية
 */
import { ref, onMounted, computed } from 'vue';
import GenericAdminLayout from '@/views/dashboard/admin/GenericAdminLayout.vue';
import { usePepoleStore } from "@/stors/pepole-store.js";
import AccountFormModal from '@/views/AccountFormModal.vue'; 
import ConfirmModal from '@/components/confirmAndSucces/ConfirmModal.vue'; 
import SuccessToast from '@/components/confirmAndSucces/SuccessToast.vue';

// --- إدارة الحالة (State Management) ---
const pepoleStore = usePepoleStore();
const isLoading = ref(true);
const isAccountModalOpen = ref(false);
const isConfirmOpen = ref(false);
const isToastVisible = ref(false);

const modalMode = ref('create'); // 'create' أو 'edit'
const selectedUser = ref(null);
const toastMsg = ref('');

// إعدادات نافذة التأكيد
const confirmData = ref({ title: '', message: '', actionType: '', id: null });

// تعريف الأعمدة لـ GenericAdminLayout
const userColumns = [
  { label: 'البيانات الشخصية', key: 'fullName' },
  { label: 'إدارة الحساب', key: 'account' },
  { label: 'الصلاحيات', key: 'roles' },
  { label: 'الإجراءات', key: 'actions' }
];

/**
 * عند تحميل المكون: جلب البيانات من السيرفر
 */
onMounted(async () => {
  await refreshData();
});

const refreshData = async () => {
  isLoading.value = true;
  await pepoleStore.getPeapleStoreData();
  isLoading.value = false;
};

// --- الدوال الحسابية (Computed) ---
const allUsers = computed(() => pepoleStore.getUsersWithRoles);
const activeAccountsCount = computed(() => 
  allUsers.value.filter(u => u.accountDetails.is_active === 'نشط').length
);

/**
 * منطق حذف صلاحية (Role) محددة من مستخدم
 */
const confirmDeleteRole = (user, role) => {
  confirmData.value = {
    title: 'سحب صلاحية',
    message: `هل تودين سحب دور (${role.name}) من المستخدم (${user.fullName})؟`,
    actionType: 'DELETE_ROLE',
    id: role.id
  };
  isConfirmOpen.value = true;
};

/**
 * منطق حذف مستخدم بالكامل من النظام
 */
const confirmDeleteUser = (user) => {
  confirmData.value = {
    title: 'حذف عضو',
    message: `تحذير: سيتم حذف (${user.fullName}) نهائياً من النظام، هل أنتِ متأكدة؟`,
    actionType: 'DELETE_USER',
    id: user.id
  };
  isConfirmOpen.value = true;
};

/**
 * التنفيذ الفعلي للأوامر بعد موافقة المستخدم في نافذة التأكيد
 */
const executeAction = async () => {
  const { actionType, id } = confirmData.value;
  isConfirmOpen.value = false;

  try {
    if (actionType === 'DELETE_ROLE') {
      await pepoleStore.deleteAcountRole(id);
      showToast("تم سحب الصلاحية بنجاح");
    } else if (actionType === 'DELETE_USER') {
      // await pepoleStore.deleteUser(id); // مثال
      showToast("تم حذف العضو بنجاح");
    }
    await refreshData();
  } catch (error) {
    showToast("عذراً، فشلت العملية");
  }
};

/**
 * إدارة الحسابات التقنية (فتح المودال للإنشاء أو التعديل)
 */
const openAccountModal = (user, mode) => {
  modalMode.value = mode;
  selectedUser.value = user;
  isAccountModalOpen.value = true;
};

const handleStatusToggle = (user) => {
  showToast("جاري تحديث حالة الحساب...");
  // هنا يتم استدعاء الأكشن الخاص بتغيير الحالة في الـ Store
};

const initiateAddRole = (user) => {
  selectedUser.value = user;
  // منطق فتح نافذة اختيار الأدوار
};

const showToast = (msg) => {
  toastMsg.value = msg;
  isToastVisible.value = true;
};
</script>

<style scoped>
@reference "@/css/style.css";

/* --- تنسيقات الجدول المتجاوب والعناصر --- */
.table-container { @apply bg-white rounded-[2.5rem] shadow-xl border border-gray-50 overflow-x-auto; }
.main-table { @apply w-full text-right border-separate border-spacing-y-4 px-4; }

.table-row { @apply bg-white transition-all hover:bg-blue-50/10 hover:shadow-md; }
.td-style { @apply p-4 align-middle border-b border-gray-50/50; }
.th-style { @apply px-4 pb-2 text-[10px] font-black text-gray-300 uppercase; }

/* الهوية والأدوار */
.avatar-lg { @apply w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg; }
.name-text { @apply font-bold text-gray-800 text-sm; }
.info-subtext { @apply text-[10px] text-gray-400 block; }

.roles-flex { @apply flex flex-wrap gap-1; }
.role-chip { @apply flex items-center justify-between bg-gray-50 border border-gray-100 px-3 py-1 rounded-xl text-[11px] font-bold text-gray-600; }
.remove-role-btn { @apply opacity-0 group-hover/role:opacity-100 text-red-400 hover:text-red-600 transition-all ml-2; }
.btn-add-role { @apply w-5 h-5 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center text-[10px] hover:bg-blue-600 hover:text-white; }

/* الحساب والـ Switch */
.account-box { @apply bg-gray-50 p-2 rounded-xl border border-gray-100; }
.email-display { @apply text-[11px] font-medium text-blue-600 block mb-1; }
.activation-row { @apply flex items-center justify-between; }
.status-tag { @apply text-[9px] font-black px-2 py-0.5 rounded-full; }
.status-tag.active { @apply bg-green-100 text-green-600; }
.status-tag.inactive { @apply bg-red-100 text-red-600; }

.switch { @apply relative inline-block w-8 h-4; }
.slider { @apply absolute cursor-pointer inset-0 bg-gray-300 rounded-full transition-all; }
.slider:before { @apply absolute content-[''] h-3 w-3 left-0.5 bottom-0.5 bg-white rounded-full transition-all; }
input:checked + .slider { @apply bg-emerald-500; }
input:checked + .slider:before { @apply translate-x-4; }

/* أزرار العمليات */
.action-btn { @apply w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-gray-100 transition-all hover:scale-110; }
.action-btn.edit { @apply text-orange-500 hover:bg-orange-50; }
.action-btn.delete { @apply text-red-500 hover:bg-red-50; }
.btn-create { @apply text-[11px] font-bold text-blue-600 border border-dashed border-blue-200 p-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all; }

/* حالة التحميل */
.loading-wrapper { @apply flex flex-col items-center py-20 gap-3; }
.loader { @apply w-10 h-10 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin; }
</style> -->