<template>
  <div class="p-6">
    <div class="flex items-center gap-4 mb-8">
      <button @click="$router.back()" class="text-basicGray hover:text-primary transition-colors">
        ← عودة
      </button>
      <div>
        <h2 class="text-primary font-bold text-xl">
          إدارة مجموعة: <span class="text-basicBlack">{{ groupName }}</span>
        </h2>
        <p class="text-basicGray text-sm">عرض الطالبات، إضافة أعضاء، ومتابعة المستوى الأكاديمي</p>
      </div>
    </div>

    <div class="custom-card shadow-sm border border-gray-100">
      <table class="w-full text-right border-collapse">
        <thead>
          <tr class="text-basicGray border-b border-gray-100 bg-gray-50/50">
            <th class="py-4 px-6">اسم الطالبة</th>
            <th class="py-4 px-6">المستوى الأكاديمي</th>
            <th class="py-4 px-6 text-left">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id" 
              class="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
            <td class="py-4 px-6 font-bold text-basicBlack">{{ student.name }}</td>
            <td class="py-4 px-6">
              <span class="text-primary font-bold text-sm bg-primaryh px-2 py-1 rounded">
                {{ student.level }}
              </span>
            </td>
            <td class="py-4 px-6 text-left">
              <div class="flex gap-3 justify-end">
                <button @click="editStudent(student)" class="text-blue-600 hover:underline text-xs font-semibold">تعديل</button>
                <button @click="deleteStudent(student)" class="text-red-600 hover:underline text-xs font-semibold">حذف</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-8 border-t border-gray-100 pt-6">
        <button @click="openAddModal" class="btn-primary w-full py-3 !bg-primary hover:opacity-90">
          + إضافة طالبة جديدة للمجموعة
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const groupId = computed(() => route.params.groupId);

// متغير لتخزين اسم المجموعة
const groupName = ref('جارٍ التحميل...');

// البيانات التجريبية
const students = ref([
  { id: 1, name: 'سارة أحمد', level: 'ممتاز' },
  { id: 2, name: 'مريم محمود', level: 'جيد جداً' }
]);

// محاكاة جلب اسم المجموعة (في الحقيقة ستجلبينه من API أو من Store)
onMounted(() => {
  // هنا يمكنك إضافة منطق لجلب اسم المجموعة بناءً على الـ groupId
  // مثال: 
  groupName.value = 'مجموعة الفجر'; 
});

// 1. حذف عضو (UC033)
const deleteStudent = (student) => {
  if (!confirm(`تنبيه: هل أنتِ متأكدة من حذف الطالبة ${student.name}؟`)) return;
  students.value = students.value.filter(s => s.id !== student.id);
};

// 2. تعديل طالبة
const editStudent = (student) => {
  const newName = prompt("تعديل اسم الطالبة:", student.name);
  if (newName?.trim()) {
    student.name = newName;
  }
};

// 3. إضافة طالبة (UC032)
const openAddModal = () => {
  const name = prompt("أدخلي اسم الطالبة الجديدة:");
  if (name?.trim()) {
    students.value.push({ id: Date.now(), name: name, level: 'جديدة' });
  }
};
</script>