<script setup>
import { ref, computed } from 'vue'
import { isMobile } from "../../../utils/useBreakpoints"; 

// 1. البيانات الموسعة (إجابات مفصلة لكل طالبة)
const reports = ref([
  { 
    id: 1, 
    studentName: 'فاطمة أحمد', 
    course: 'تجويد (1)', 
    completion: 100,
    submissionDate: '2024-05-20 09:30 PM',
    answers: {
      listening: 'نعم، تم الاستماع لمقطع الشيخ المنشاوي 3 مرات مع الترديد.',
      repetition: 'تم تكرار أوجه الحفظ 15 مرة غيباً.',
      difficulty: 'واجهت صعوبة بسيطة في مخرج حرف الضاد وتمت معالجتها.',
      timeSpent: 'ساعتان ونصف',
      teacherNote: 'ممتازة جداً، يرجى التركيز في المرة القادمة على زمن الغنة.'
    }
  },
  { 
    id: 2, 
    studentName: 'زينب محمد', 
    course: 'تجويد (1)', 
    completion: 70,
    submissionDate: '2024-05-21 11:15 AM',
    answers: {
      listening: 'استمعت للمقطع مرة واحدة فقط.',
      repetition: 'تم التكرار 5 مرات فقط بسبب الانشغال.',
      difficulty: 'صعوبة في حفظ الآيات الأخيرة من السورة.',
      timeSpent: '45 دقيقة',
      teacherNote: 'الأداء متوسط، نحتاج لزيادة وقت التكرار لثبات الحفظ.'
    }
  }
])

const searchQuery = ref('')
const filterCourse = ref('الكل')
const isDetailsModalOpen = ref(false)
const selectedReport = ref(null)

const filteredReports = computed(() => {
  return reports.value.filter(r => {
    return r.studentName.includes(searchQuery.value) && 
           (filterCourse.value === 'الكل' || r.course === filterCourse.value)
  })
})

const viewDetails = (report) => {
  selectedReport.value = report
  isDetailsModalOpen.value = true
}
</script>

<template>
  <div class="p-6 text-right font-['Tajawal'] bg-slate-50 min-h-screen" dir="rtl">
    
    <div class="flex flex-wrap gap-4 mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <div class="flex-1 min-w-[250px]">
        <label class="block text-xs font-bold text-slate-400 mb-2 mr-2">ابحثي باسم الطالبة</label>
        <input v-model="searchQuery" type="text" placeholder="مثلاً: فاطمة..." class="w-full p-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
      </div>
      <div class="w-48">
        <label class="block text-xs font-bold text-slate-400 mb-2 mr-2">تصفية المساق</label>
        <select v-model="filterCourse" class="w-full p-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-600">
          <option>الكل</option>
          <option>تجويد (1)</option>
          <option>حفظ جزء عم</option>
        </select>
      </div>
    </div>

    <div class="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <table class="w-full text-right">
        <thead>
          <tr class="bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-widest">
            <th class="p-6">معلومات الطالبة</th>
            <th class="p-6">حالة الإنجاز</th>
            <th class="p-6 text-center">الإجراء</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="report in filteredReports" :key="report.id" class="hover:bg-slate-50/80 transition-all group">
            <td class="p-6">
              <div class="font-black text-slate-800 text-lg">{{ report.studentName }}</div>
              <div class="text-xs text-emerald-600 font-bold">{{ report.course }}</div>
            </td>
            <td class="p-6">
              <div class="flex items-center gap-3">
                <div class="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div class="h-full transition-all duration-1000" :class="report.completion >= 90 ? 'bg-emerald-500' : 'bg-amber-500'" :style="{ width: report.completion + '%' }"></div>
                </div>
                <span class="text-sm font-black text-slate-700">{{ report.completion }}%</span>
              </div>
            </td>
            <td class="p-6 text-center">
              <button @click="viewDetails(report)" class="bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-xs font-bold hover:bg-emerald-600 hover:scale-105 transition-all shadow-lg shadow-slate-200">
                مراجعة التقرير المفصل
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Transition name="modal">
      <div v-if="isDetailsModalOpen && selectedReport" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
        <div class="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <div class="p-8 bg-slate-900 text-white flex justify-between items-start relative">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span class="bg-emerald-500 text-[10px] px-3 py-1 rounded-full font-black uppercase">تقرير أسبوعي</span>
                <span class="text-slate-400 text-[11px]">{{ selectedReport.submissionDate }}</span>
              </div>
              <h3 class="text-3xl font-black italic">{{ selectedReport.studentName }}</h3>
              <p class="text-emerald-400 font-bold mt-1">{{ selectedReport.course }}</p>
            </div>
            <button @click="isDetailsModalOpen = false" class="bg-white/10 hover:bg-rose-500 w-12 h-12 rounded-2xl transition-all flex items-center justify-center">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <div class="p-8 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
            
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <p class="text-[10px] text-slate-400 font-bold mb-1">الوقت المستغرق</p>
                <p class="text-sm font-black text-slate-800"><i class="far fa-clock ml-1 text-emerald-500"></i> {{ selectedReport.answers.timeSpent }}</p>
              </div>
              <div class="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <p class="text-[10px] text-slate-400 font-bold mb-1">نسبة الإنجاز</p>
                <p class="text-sm font-black text-slate-800"><i class="fas fa-chart-line ml-1 text-emerald-500"></i> {{ selectedReport.completion }}%</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors">
                <div class="flex items-center gap-3 mb-3 text-emerald-600">
                  <i class="fas fa-headphones-alt"></i>
                  <span class="text-xs font-black italic">الاستماع للمقاطع الصوتية:</span>
                </div>
                <p class="text-sm text-slate-700 leading-relaxed pr-7">{{ selectedReport.answers.listening }}</p>
              </div>

              <div class="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors">
                <div class="flex items-center gap-3 mb-3 text-emerald-600">
                  <i class="fas fa-redo-alt"></i>
                  <span class="text-xs font-black italic">عدد مرات تكرار الورد:</span>
                </div>
                <p class="text-sm text-slate-700 leading-relaxed pr-7 font-bold text-lg">{{ selectedReport.answers.repetition }}</p>
              </div>

              <div class="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:border-rose-200 transition-colors">
                <div class="flex items-center gap-3 mb-3 text-rose-500">
                  <i class="fas fa-exclamation-triangle"></i>
                  <span class="text-xs font-black italic">الصعوبات التي واجهتها:</span>
                </div>
                <p class="text-sm text-slate-600 italic pr-7">{{ selectedReport.answers.difficulty }}</p>
              </div>
            </div>

            <div class="p-6 bg-emerald-600 rounded-[2.5rem] text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
              <i class="fas fa-quote-left absolute right-4 bottom-2 text-white/10 text-6xl"></i>
              <h4 class="text-[11px] font-black uppercase mb-2 opacity-80 flex items-center gap-2">
                <i class="fas fa-comment-medical"></i> توجيه المعلمة للطالبة
              </h4>
              <p class="text-sm font-medium leading-relaxed italic pr-2">
                " {{ selectedReport.answers.teacherNote }} "
              </p>
            </div>
          </div>

          <div class="p-6 bg-white border-t border-slate-100">
            <button @click="isDetailsModalOpen = false" class="w-full bg-slate-100 text-slate-800 py-4 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all">
              إغلاق المراجعة المفصلة
            </button>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
/* انيميشن النافذة */
.modal-enter-active, .modal-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.9) translateY(30px); }

/* تحسين السكرول بار داخل المودال */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>