<template>
  <div class="p-4 space-y-4">

    <!-- Toolbar: برامج -->
    <div class="w-full h-10 py-1 bg-amber-300 flex gap-2">
      <button
        v-for="prog in programs"
        :key="prog.id"
        @click="selectedProgram = prog.id"
        :class="[
          'rounded-full h-7 px-3 hover:bg-blue-600',
          selectedProgram === prog.id ? 'bg-blue-500 text-white' : 'bg-white text-black'
        ]"
      >
        {{ prog.name }}
      </button>
    </div>

    <!-- أزرار إضافة -->
    <div class="flex gap-2">
      <button class="bg-green-500 text-white px-4 py-1 rounded">إضافة طالبة</button>
      <button class="bg-green-500 text-white px-4 py-1 rounded">إضافة معلمة</button>
      <button class="bg-green-500 text-white px-4 py-1 rounded">إضافة مشرفة</button>
    </div>

    <!-- جدول المجموعات -->
    <table class="min-w-full bg-white border border-gray-200 shadow-md rounded">
      <thead>
        <tr class="bg-gray-100 text-gray-700">
          <th class="py-2 px-4 border">المجموعة</th>
          <th class="py-2 px-4 border">البرنامج</th>
          <th class="py-2 px-4 border">المعلمة</th>
          <th class="py-2 px-4 border">المشرفة</th>
          <th class="py-2 px-4 border">عدد الطالبات</th>
          <th class="py-2 px-4 border">الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="grp in filteredGroups" :key="grp.id">

          <!-- صف المجموعة -->
          <tr class="hover:bg-gray-50 cursor-pointer">
            <td class="py-2 px-4 border">{{ grp.group }}</td>
            <td class="py-2 px-4 border">{{ getProgramName(grp.program) }}</td>
            <td class="py-2 px-4 border flex justify-between items-center">
              {{ grp.techer }}
              <button @click.stop="deleteTeacher(grp)" class="text-red-500 hover:text-red-700">حذف</button>
            </td>
            <td class="py-2 px-4 border flex justify-between items-center">
              {{ grp.supervisor }}
              <button @click.stop="deleteSupervisor(grp)" class="text-red-500 hover:text-red-700">حذف</button>
            </td>
            <td class="py-2 px-4 border">{{ grp.studiens }}</td>
            <td class="py-2 px-4 border">
              <button @click="toggleGroupDetails(grp.id)" class="bg-blue-500 text-white px-2 py-1 rounded">
                {{ openGroupId === grp.id ? 'إخفاء' : 'عرض' }}
              </button>
            </td>
          </tr>

          <!-- تفاصيل الطالبات -->
          <tr v-if="openGroupId === grp.id" class="bg-gray-50">
            <td colspan="6" class="p-4">
              <table class="w-full text-sm">
                <thead>
                  <tr>
                    <th class="py-1 px-2 border">اسم الطالبة</th>
                    <th class="py-1 px-2 border">إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="stu in getStudentsByGroup(grp.group)" :key="stu.id">
                    <td class="py-1 px-2 border">{{ stu.name }}</td>
                    <td class="py-1 px-2 border">
                      <button @click="deleteStudent(stu)" class="bg-red-500 text-white px-2 py-1 rounded">حذف</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

        </template>
      </tbody>
    </table>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const groups = [
  {id:1 ,group:"12" ,patch:4,program:1,techer:"سعاد الطاهر",supervisor:" تقى امجد" ,studiens:5},
  {id:2 ,group:"11" ,patch:4,program:2,techer:"مهاد الطاهر",supervisor:" تقى امجد",studiens:3},
  {id:3 ,group:"13" ,patch:4,program:1,techer:"جهاد الطاهر",supervisor:" تقى امجد",studiens:4}
]

const students = [
  {id:1 ,name:"ليلى احمد" ,group:"12"},
  {id:2 ,name:"فجر احمد" ,group:"12"},
  {id:3 ,name:"سدرة احمد" ,group:"12"},
  {id:4 ,name:"اشرقت احمد" ,group:"12"},
  {id:5 ,name:"رتيل احمد" ,group:"12"},
  {id:6 ,name:"لدن احمد" ,group:"13"},
  {id:7 ,name:"لينه احمد" ,group:"11"},
  {id:8 ,name:"ازاهر احمد" ,group:"13"},
  {id:9 ,name:"سجى احمد" ,group:"11"},
  {id:10 ,name:"ضحى احمد" ,group:"13"},
  {id:11 ,name:"ليلى علي" ,group:"11"},
]

const programs = [
  {id:1 ,name:"مثاني"},
  {id:2 ,name:"معارج"}
]

const selectedProgram = ref(null)
const openGroupId = ref(null)

// فلترة المجموعات حسب البرنامج المحدد
const filteredGroups = computed(() => {
  if(!selectedProgram.value) return groups
  return groups.filter(g => g.program === selectedProgram.value)
})

function getProgramName(id){
  const prog = programs.find(p => p.id === id)
  return prog ? prog.name : ''
}

function getStudentsByGroup(groupName){
  return students.filter(s => s.group === groupName)
}

function toggleGroupDetails(groupId){
  openGroupId.value = openGroupId.value === groupId ? null : groupId
}

function deleteStudent(stu){
  const index = students.findIndex(s => s.id === stu.id)
  if(index !== -1) students.splice(index,1)
}

function deleteTeacher(grp){
  grp.techer = ''
}

function deleteSupervisor(grp){
  grp.supervisor = ''
}
</script>