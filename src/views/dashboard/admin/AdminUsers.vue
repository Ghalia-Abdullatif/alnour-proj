<script setup>

import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../../../stors/users-store";

const userStore = useUserStore();

 onMounted(async() => {
  userStore.getUsers();
  await console.log(userStore.users )

});

// 1. البيانات (Data)
const users = ref([
  { id: 1, name: 'أحمد محمد', email: 'ahmed@test.com', role: 'طالب', status: 'نشط' },
  { id: 2, name: 'سارة علي', email: 'sara@test.com', role: 'معلمة', status: 'نشط' },
  { id: 3, name: 'مروة يوسف', email: 'marwa@test.com', role: 'مشرفة دفعة', status: 'نشط' },
])

// 2. حالات التحكم (States)
const isAddModalOpen = ref(false)
const isEditModalOpen = ref(false) // حالة نافذة التعديل
const isDeleteModalOpen = ref(false)
const selectedUser = ref(null)
const filterRole = ref('الكل')
const searchQuery = ref('')

// بيانات الفورم
const newUser = ref({ name: '', email: '', role: 'طالب' })
const userToEdit = ref({ id: null, name: '', email: '', role: '' }) // بيانات المستخدم الجاري تعديله

// 3. التصفية والبحث (UC072)
const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchesRole = filterRole.value === 'الكل' || u.role === filterRole.value
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesRole && matchesSearch
  })
})

// 4. العمليات (Actions)

// إضافة (UC072.1)
const saveUser = () => {
  if (newUser.value.name && newUser.value.email) {
    users.value.push({ id: Date.now(), ...newUser.value, status: 'نشط' })
    newUser.value = { name: '', email: '', role: 'طالب' }
    isAddModalOpen.value = false
  }
}

// تعديل (UC072.3)
const openEditModal = (user) => {
  userToEdit.value = { ...user } // نأخذ نسخة من البيانات عشان ما نعدل في الجدول مباشرة إلا بعد الحفظ
  isEditModalOpen.value = true
}

const updateUser = () => {
  const index = users.value.findIndex(u => u.id === userToEdit.value.id)
  if (index !== -1) {
    users.value[index] = { ...userToEdit.value }
    isEditModalOpen.value = false
  }
}

// حذف (UC072.2)
const confirmDelete = (user) => {
  selectedUser.value = user
  isDeleteModalOpen.value = true
}
const deleteUser = () => {
  users.value = users.value.filter(u => u.id !== selectedUser.value.id)
  isDeleteModalOpen.value = false
}
</script>

<template>
  <div class="p-6 space-y-6 animate-fade-in text-right" dir="rtl">
    
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">إدارة المستخدمين</h2>
        <p class="text-sm text-gray-500">التحكم الكامل في صلاحيات ومستخدمي النظام</p>
      </div>
      <button @click="isAddModalOpen = true" class="bg-emerald-600 text-white px-6 py-2 rounded-xl shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2">
        <i class="fas fa-plus"></i>
        <span>إضافة مستخدم</span>
      </button>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border flex flex-wrap gap-4 items-center">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium">تصفية حسب:</span>
        <select v-model="filterRole" class="border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
          <option>الكل</option>
          <option>طالب</option>
          <option>معلمة</option>
          <option>مشرفة دفعة</option>
          <option>مشرفة مجموعة</option>
        </select>
      </div>
      <div class="flex-1 relative">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="بحث باسم المستخدم أو البريد..." 
          class="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        >
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <table class="w-full text-right border-collapse">
        <thead class="bg-gray-50 text-gray-600 text-sm">
          <tr>
            <th class="p-4 border-b">المستخدم</th>
            <th class="p-4 border-b">الدور</th>
            <th class="p-4 border-b">الحالة</th>
            <th class="p-4 border-b text-center">العمليات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" class="border-b last:border-0 hover:bg-gray-50 transition-colors">
            <td class="p-4 italic">
              <div class="font-bold text-gray-800">{{ user.name }}</div>
              <div class="text-xs text-gray-400 font-sans">{{ user.email }}</div>
            </td>
            <td class="p-4 font-medium text-sm text-blue-700">{{ user.role }}</td>
            <td class="p-4">
              <span class="text-emerald-600 text-xs flex items-center gap-1 font-bold">
                <span class="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span> نشط
              </span>
            </td>
            <td class="p-4 text-center">
              <div class="flex justify-center gap-2">
                <button @click="openEditModal(user)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><i class="fas fa-edit"></i></button>
                <button @click="confirmDelete(user)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg"><i class="fas fa-trash"></i></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isEditModalOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in duration-200">
        <div class="p-6 border-b flex justify-between items-center bg-blue-50 rounded-t-2xl">
          <h3 class="text-xl font-bold text-blue-900">تعديل بيانات المستخدم</h3>
          <button @click="isEditModalOpen = false" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
        </div>
        <div class="p-6 space-y-4">
          <input v-model="userToEdit.name" type="text" class="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500">
          <input v-model="userToEdit.email" type="email" class="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 text-left font-sans">
          <select v-model="userToEdit.role" class="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500">
            <option>طالب</option>
            <option>معلمة</option>
            <option>مشرفة دفعة</option>
            <option>مشرفة مجموعة</option>
          </select>
        </div>
        <div class="p-6 bg-gray-50 flex gap-3 rounded-b-2xl">
          <button @click="isEditModalOpen = false" class="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-200 rounded-xl">إلغاء</button>
          <button @click="updateUser" class="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg">حفظ التغييرات</button>
        </div>
      </div>
    </div>

    <div v-if="isAddModalOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in duration-200">
        <div class="p-6 border-b flex justify-between items-center">
          <h3 class="text-xl font-bold text-gray-800">إضافة مستخدم جديد</h3>
          <button @click="isAddModalOpen = false" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
        </div>
        <div class="p-6 space-y-4">
          <input v-model="newUser.name" type="text" placeholder="الاسم الكامل" class="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500">
          <input v-model="newUser.email" type="email" placeholder="البريد الإلكتروني" class="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 text-left font-sans">
          <select v-model="newUser.role" class="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500">
            <option>طالب</option>
            <option>معلمة</option>
            <option>مشرفة دفعة</option>
            <option>مشرفة مجموعة</option>
          </select>
        </div>
        <div class="p-6 bg-gray-50 flex gap-3 rounded-b-2xl">
          <button @click="isAddModalOpen = false" class="flex-1 py-3 text-gray-500 hover:bg-gray-200 rounded-xl">إلغاء</button>
          <button @click="saveUser" class="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg">حفظ البيانات</button>
        </div>
      </div>
    </div>

    <div v-if="isDeleteModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
      <div class="bg-white w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl">
        <div class="text-red-500 text-4xl mb-4"><i class="fas fa-exclamation-circle"></i></div>
        <h3 class="text-xl font-bold mb-2">تأكيد الحذف</h3>
        <p class="text-sm text-gray-500 mb-6 font-medium">هل أنتِ متأكدة من حذف <span class="text-red-600 font-bold underline">{{ selectedUser?.name }}</span>؟</p>
        <div class="flex gap-2">
          <button @click="isDeleteModalOpen = false" class="flex-1 py-2 bg-gray-100 rounded-lg font-bold">إلغاء</button>
          <button @click="deleteUser" class="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold">حذف نهائي</button>
        </div>
      </div>
    </div>

  </div>
</template>