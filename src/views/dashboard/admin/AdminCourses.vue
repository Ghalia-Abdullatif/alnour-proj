<script setup>
import { ref } from 'vue'

// 1. بيانات المساقات
const courses = ref([
  { id: 1, name: 'تجويد (المستوى الأول)', description: 'أساسيات أحكام النون الساكنة والتنوين', status: 'نشط', studentsCount: 120, questions: [
      { id: 101, text: 'هل استمعتِ لمقطع الشرح؟', type: 'نعم/لا' },
      { id: 102, text: 'عدد مرات التكرار؟', type: 'رقمي' }
  ]},
  { id: 2, name: 'حفظ جزء عم', description: 'مراجعة وتثبيت قصار السور مع الترتيل', status: 'نشط', studentsCount: 85, questions: [] },
])

// 2. حالات التحكم
const isAddModalOpen = ref(false)
const isQuestionsModalOpen = ref(false)
const currentCourse = ref(null) // المساق اللي بنعدل أسئلته حالياً

const newCourse = ref({ name: '', description: '', status: 'نشط' })
const newQuestion = ref({ text: '', type: 'نعم/لا' })

// 3. الوظائف
const saveCourse = () => {
  if (newCourse.value.name) {
    courses.value.push({
      id: Date.now(),
      ...newCourse.value,
      studentsCount: 0,
      questions: []
    })
    newCourse.value = { name: '', description: '', status: 'نشط' }
    isAddModalOpen.value = false
  }
}

// فتح إدارة الأسئلة (UC074)
const openQuestions = (course) => {
  currentCourse.value = course
  isQuestionsModalOpen.value = true
}

const addQuestion = () => {
  if (newQuestion.value.text) {
    currentCourse.value.questions.push({
      id: Date.now(),
      text: newQuestion.value.text,
      type: newQuestion.value.type
    })
    newQuestion.value = { text: '', type: 'نعم/لا' }
  }
}

const removeQuestion = (qId) => {
  currentCourse.value.questions = currentCourse.value.questions.filter(q => q.id !== qId)
}
</script>

<template>
  <div class="p-6 space-y-6 text-right" dir="rtl">
    
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">إدارة المساقات</h2>
        <p class="text-sm text-gray-500">إضافة المساقات وإدارة أسئلة التقارير الأسبوعية</p>
      </div>
      <button @click="isAddModalOpen = true" class="bg-emerald-600 text-white px-6 py-2 rounded-xl shadow-lg">
        <i class="fas fa-plus ml-1"></i> إضافة مساق
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="course in courses" :key="course.id" class="bg-white rounded-2xl border p-5 shadow-sm">
        <h3 class="text-lg font-bold">{{ course.name }}</h3>
        <p class="text-sm text-gray-500 mb-4 h-10">{{ course.description }}</p>
        
        <div class="flex justify-between items-center mb-4">
          <span class="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">{{ course.status }}</span>
          <span class="text-xs text-gray-400">{{ course.questions.length }} سؤال تقرير</span>
        </div>

        <div class="grid grid-cols-2 gap-2 border-t pt-4">
          <button @click="openQuestions(course)" class="text-sm bg-blue-50 text-blue-600 py-2 rounded-lg font-bold">
            <i class="fas fa-tasks ml-1"></i> الأسئلة
          </button>
          <button @click="courses = courses.filter(c => c.id !== course.id)" class="text-sm bg-red-50 text-red-600 py-2 rounded-lg font-bold">
            <i class="fas fa-trash ml-1"></i> حذف
          </button>
        </div>
      </div>
    </div>

    <div v-if="isQuestionsModalOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4">
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
        <div class="p-6 bg-blue-600 text-white flex justify-between">
          <h3 class="font-bold text-xl">أسئلة تقرير: {{ currentCourse?.name }}</h3>
          <button @click="isQuestionsModalOpen = false"><i class="fas fa-times"></i></button>
        </div>

        <div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div v-for="(q, index) in currentCourse?.questions" :key="q.id" class="flex items-center justify-between bg-gray-50 p-3 rounded-xl border">
            <div>
              <span class="text-xs text-blue-600 font-bold ml-2">س{{ index + 1 }} ({{ q.type }}):</span>
              <span class="text-sm">{{ q.text }}</span>
            </div>
            <button @click="removeQuestion(q.id)" class="text-red-400 hover:text-red-600"><i class="fas fa-minus-circle"></i></button>
          </div>

          <div v-if="currentCourse?.questions.length === 0" class="text-center py-4 text-gray-400">لا توجد أسئلة مضافة بعد</div>

          <hr class="my-4">

          <div class="bg-blue-50 p-4 rounded-xl space-y-3">
            <p class="text-sm font-bold text-blue-800 italic">إضافة سؤال جديد للتقرير:</p>
            <input v-model="newQuestion.text" type="text" placeholder="نص السؤال (مثلاً: هل راجعتِ التفسير؟)" class="w-full p-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-400">
            <div class="flex gap-2">
              <select v-model="newQuestion.type" class="flex-1 p-2 rounded-lg border">
                <option>نعم/لا</option>
                <option>رقمي</option>
                <option>نصي مختصر</option>
              </select>
              <button @click="addQuestion" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">إضافة</button>
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-100 text-center">
          <button @click="isQuestionsModalOpen = false" class="text-blue-600 font-bold">تم حفظ التغييرات</button>
        </div>
      </div>
    </div>

    <div v-if="isAddModalOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in duration-200">
        <div class="p-6 border-b font-bold text-xl">إضافة مساق جديد</div>
        <div class="p-6 space-y-4">
          <input v-model="newCourse.name" type="text" placeholder="اسم المساق" class="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500">
          <textarea v-model="newCourse.description" placeholder="وصف المساق" class="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
          <select v-model="newCourse.status" class="w-full border rounded-xl p-3">
            <option value="نشط">نشط</option>
            <option value="مغلق">مغلق</option>
          </select>
        </div>
        <div class="p-6 flex gap-3">
          <button @click="isAddModalOpen = false" class="flex-1 py-3 bg-gray-100 rounded-xl">إلغاء</button>
          <button @click="saveCourse" class="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl">حفظ المساق</button>
        </div>
      </div>
    </div>

  </div>
</template>