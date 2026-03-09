<script setup>
import { ref } from 'vue'

// 1. البيانات الأساسية (Data)
// مصفوفة المجموعات: كل مجموعة تحتوي على مصفوفة داخلية للطالبات (students)
const groups = ref([
  { 
    id: 1, 
    name: 'مجموعة الفردوس', 
    teacher: 'أ. سارة علي', 
    batch: 'دفعة يناير', 
    level: 'المستوى الأول',
    students: [
      { id: 1, name: 'فاطمة أحمد' },
      { id: 2, name: 'خديجة محمد' }
    ]
  },
  { 
    id: 2, 
    name: 'مجموعة الهدى', 
    teacher: 'أ. ليلى أحمد', 
    batch: 'دفعة يناير', 
    level: 'المستوى الأول',
    students: []
  },
])

// قائمة الطالبات اللواتي لم يتم توزيعهن على أي مجموعة بعد
const allAvailableStudents = ref([
  { id: 10, name: 'زينب يوسف' },
  { id: 11, name: 'مريم إبراهيم' },
  { id: 12, name: 'سعاد علي' },
  { id: 13, name: 'آلاء مكي' }
])

// قوائم ثابتة لتعبئة خيارات النموذج (Dropdowns)
const teachers = ['أ. سارة علي', 'أ. ليلى أحمد', 'أ. مريم يوسف']
const batches = ['دفعة يناير', 'دفعة فبراير', 'دفعة التفسير']

// 2. حالات التحكم بالواجهة (State)
const isAddModalOpen = ref(false)      // نافذة إنشاء مجموعة
const isViewStudentsOpen = ref(false)  // نافذة إدارة طالبات مجموعة محددة
const selectedGroup = ref(null)        // المجموعة التي يتم العمل عليها حالياً

const newGroup = ref({
  name: '',
  teacher: '',
  batch: '',
  level: 'المستوى الأول'
})

// 3. العمليات (Functions)

// حفظ مجموعة جديدة وإضافتها للقائمة
const saveGroup = () => {
  if (newGroup.value.name && newGroup.value.teacher) {
    groups.value.push({
      id: Date.now(),
      ...newGroup.value,
      students: [] // تبدأ المجموعة دائماً فارغة
    })
    isAddModalOpen.value = false
    newGroup.value = { name: '', teacher: '', batch: '', level: 'المستوى الأول' }
  }
}

// فتح نافذة إدارة الطالبات لمجموعة معينة
const openStudentsList = (group) => {
  selectedGroup.value = group
  isViewStudentsOpen.value = true
}

// إضافة طالبة من "القائمة العامة" إلى "المجموعة المختارة"
const assignStudentToGroup = (student) => {
  if (!selectedGroup.value.students.find(s => s.id === student.id)) {
    selectedGroup.value.students.push(student); // إضافتها للمجموعة
    // إزالتها من القائمة المتوفرة لضمان عدم تكرار الطالبة في مجموعتين
    allAvailableStudents.value = allAvailableStudents.value.filter(s => s.id !== student.id);
  }
}

// إزالة طالبة من المجموعة وإرجاعها لقائمة الطالبات المتوفرات
const removeStudentFromGroup = (student) => {
  if (confirm(`هل أنتِ متأكدة من إزالة ${student.name}؟`)) {
    selectedGroup.value.students = selectedGroup.value.students.filter(s => s.id !== student.id);
    allAvailableStudents.value.push(student); // إرجاعها للقائمة العامة
  }
}

// حذف المجموعة بالكامل
const deleteGroup = (groupId) => {
  if (confirm('سيتم حذف المجموعة بالكامل، هل أنتِ متأكدة؟')) {
    groups.value = groups.value.filter(g => g.id !== groupId);
  }
}
</script>

<template>
  <div class="p-6 space-y-6 text-right font-['Tajawal']" dir="rtl">
    
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">إدارة المجموعات</h2>
        <p class="text-sm text-gray-500 italic">توزيع الطالبات على المعلمات</p>
      </div>
      <button @click="isAddModalOpen = true" class="bg-violet-600 text-white px-6 py-2 rounded-xl shadow-lg hover:bg-violet-700 transition-all flex items-center gap-2">
        <i class="fas fa-plus"></i>
        <span>إنشاء مجموعة جديدة</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="group in groups" :key="group.id" class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 relative hover:border-violet-200 transition-all">
        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center text-xl">
            <i class="fas fa-users"></i>
          </div>
          <span class="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded-md font-bold">{{ group.batch }}</span>
        </div>

        <h3 class="text-lg font-bold text-gray-800 mb-1">{{ group.name }}</h3>
        <p class="text-sm text-gray-500 mb-4 flex items-center gap-2">
          <i class="fas fa-chalkboard-teacher text-violet-400"></i>
          {{ group.teacher }}
        </p>

        <div class="bg-gray-50 rounded-2xl p-3 flex justify-between items-center mb-6">
          <div class="text-center flex-1 border-l">
            <div class="text-[10px] text-gray-400">الطالبات</div>
            <div class="text-sm font-bold text-violet-600">{{ group.students.length }}</div>
          </div>
          <div class="text-center flex-1">
            <div class="text-[10px] text-gray-400">المستوى</div>
            <div class="text-sm font-bold text-gray-700">{{ group.level }}</div>
          </div>
        </div>

        <div class="flex gap-2">
          <button @click="openStudentsList(group)" class="flex-1 text-xs bg-violet-600 text-white py-2 rounded-xl font-bold">
            إدارة الطالبات
          </button>
          <button @click="deleteGroup(group.id)" class="p-2 text-gray-300 hover:text-red-500">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>

    <div v-if="isAddModalOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4">
      <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6">
        <h3 class="font-bold text-xl mb-4 text-gray-800">إنشاء مجموعة دراسية</h3>
        <div class="space-y-4">
          <input v-model="newGroup.name" type="text" placeholder="اسم المجموعة" class="w-full border rounded-2xl p-3 bg-gray-50 outline-none">
          <select v-model="newGroup.teacher" class="w-full border rounded-2xl p-3 bg-gray-50">
            <option value="" disabled>اختر المعلمة</option>
            <option v-for="t in teachers" :key="t">{{ t }}</option>
          </select>
          <select v-model="newGroup.batch" class="w-full border rounded-2xl p-3 bg-gray-50">
            <option value="" disabled>اختر الدفعة</option>
            <option v-for="b in batches" :key="b">{{ b }}</option>
          </select>
        </div>
        <div class="flex gap-3 mt-6">
          <button @click="isAddModalOpen = false" class="flex-1 py-3 text-gray-400 font-bold">إلغاء</button>
          <button @click="saveGroup" class="flex-1 py-3 bg-violet-600 text-white font-bold rounded-2xl shadow-lg">حفظ</button>
        </div>
      </div>
    </div>

    <div v-if="isViewStudentsOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[130] p-4">
      <div class="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
        <div class="p-6 bg-violet-600 text-white flex justify-between items-center">
          <h3 class="font-bold">طالبات: {{ selectedGroup?.name }}</h3>
          <button @click="isViewStudentsOpen = false"><i class="fas fa-times"></i></button>
        </div>
        <div class="p-6">
          <div class="space-y-3 max-h-[40vh] overflow-y-auto custom-scrollbar">
            <div v-for="student in selectedGroup?.students" :key="student.id" class="flex justify-between items-center p-3 border-b last:border-0">
              <span class="text-sm font-medium">{{ student.name }}</span>
              <button @click="removeStudentFromGroup(student)" class="text-red-400 text-xs hover:font-bold">إزالة</button>
            </div>
            <p v-if="selectedGroup?.students.length === 0" class="text-center py-4 text-gray-400 text-xs">لا يوجد طالبات بعد</p>
          </div>
          
          <div class="mt-6 pt-4 border-t">
            <h4 class="text-xs font-bold text-gray-400 mb-3">إضافة طالبة متوفرة (انقري للإضافة):</h4>
            <div class="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              <button 
                v-for="std in allAvailableStudents" :key="std.id"
                @click="assignStudentToGroup(std)"
                class="shrink-0 bg-violet-50 text-violet-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-violet-100 transition-colors"
              >
                + {{ std.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>