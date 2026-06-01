<template>
  <GenericAdminLayout
    title="بناء قوالب التقارير"
    description="تجهيز الهيكل العام للتقارير، صياغة الأسئلة الديناميكية، وتوجيهها للمجموعات والدفعات"
    :columns="templateColumns"
    showAddButton="إنشاء قالب جديد"
    @add-new="openCreateTemplateModal"
    :data="reportsStore.getTemplatesList"
    v-model:searchQuery="searchKeyword"
  >
    <template #table="{ data }">
      <div class="table-container">
        <div class="overflow-x-auto w-full custom-scrollbar">
          <table class="main-table min-w-[850px]">
            <thead>
              <tr>
                <th class="th-style w-16 text-center">ID</th>
                <th class="th-style">اسم القالب والوصف</th>
                <th class="th-style text-center w-40">تاريخ الإنشاء</th>
                <th class="th-style text-center w-28">الحالة</th>
                <th class="th-style text-center min-w-[280px]">أدوات البناء والتوجيه</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tpl, index) in data" :key="tpl.id" class="table-row">
                <td class="td-style text-center font-mono text-gray-400">#{{ index + 1 }}</td>
                <td class="td-style">
                  <p class="name-text text-amber-900 font-black">{{ tpl.name }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ tpl.description || 'لا يوجد وصف' }}</p>
                </td>
                <td class="td-style text-center text-xs text-gray-600 font-medium">{{ tpl.created_at || tpl.createdDate }}</td>
                <td class="td-style text-center">
                  <span :class="tpl.is_active ? 'active-badge' : 'archive-badge'" class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border">
                    {{ tpl.is_active ? 'نشط' : 'مؤرشف' }}
                  </span>
                </td>
                <td class="td-style text-center">
                  <div class="flex justify-center gap-2">
                    <button @click="openManageQuestionsModal(tpl)" class="btn-structure">
                      <i class="fa fa-list-ol"></i> هيكلة الأسئلة
                    </button>
                    <button @click="openAssignReportModal(tpl)" class="btn-submit-primary">
                      <i class="fa fa-paper-plane-o"></i> توجيه للمجموعات
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </GenericAdminLayout>

  <div v-if="modals.template" class="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div class="modal-box w-full max-w-md bg-white rounded-[2rem] p-6 shadow-2xl border">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-base font-black text-amber-900">إنشاء قالب تقرير جديد</h3>
        <button @click="modals.template = false" class="text-gray-400 hover:text-[var(--color-primary)]">
          <i class="fa fa-times"></i>
        </button>
      </div>
      <form @submit.prevent="handleCreateTemplate" class="flex flex-col gap-4">
        <div>
          <label class="block text-xs font-black text-gray-500 mb-1">اسم القالب *</label>
          <input v-model="formTemplate.name" type="text" required class="form-input" placeholder="مثال: تقرير متابعة الحفظ الأسبوعي">
        </div>
        <div>
          <label class="block text-xs font-black text-gray-500 mb-1">وصف القالب</label>
          <textarea v-model="formTemplate.description" class="form-input h-20 resize-none" placeholder="اكتبي غرض التقرير هنا..."></textarea>
        </div>
        <div class="flex justify-end gap-2 mt-2">
          <button type="button" @click="modals.template = false" class="btn-cancel">إلغاء</button>
          <button type="submit" class="btn-submit-primary">حفظ القالب</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="modals.questions" class="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div class="modal-box w-full max-w-lg bg-white rounded-[2rem] p-6 shadow-2xl border max-h-[90vh] flex flex-col">
      <div class="flex justify-between items-center border-b pb-3 mb-4">
        <div>
          <h3 class="text-base font-black text-amber-900">هيكلة أسئلة القالب</h3>
          <p class="text-[11px] text-gray-500 font-medium">{{ activeTemplate?.name }}</p>
        </div>
        <button @click="modals.questions = false; activeTemplate = null" class="text-gray-400 hover:text-[var(--color-primary)]">
          <i class="fa fa-times"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar pr-1 mb-4 flex flex-col gap-3">
        <div v-for="(q, qIdx) in activeTemplate?.questions || []" :key="q.id" class="p-3 bg-gray-50 border rounded-xl flex flex-col gap-1.5">
          <div class="flex justify-between items-start gap-2">
            <p class="text-xs font-bold text-gray-800"><span class="font-mono text-amber-700">س{{ qIdx+1 }}:</span> {{ q.question_text }}</p>
            <span class="text-[9px] font-black px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded">
              {{ q.question_type === 'text' ? 'نصي' : 'اختياري' }}
            </span>
          </div>
          <div v-if="q.question_type === 'choice'" class="flex flex-wrap gap-1 mt-1">
            <span v-for="option in q.options || []" :key="option.id" class="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-100">
              {{ option.option_text }}
            </span>
          </div>
        </div>
        <p v-if="!(activeTemplate?.questions?.length)" class="text-xs text-gray-400 italic text-center py-6">لا توجد أسئلة مضافة في هذا القالب بعد.</p>
      </div>

      <form @submit.prevent="handleCreateQuestion" class="border-t pt-4 flex flex-col gap-3 bg-[var(--color-layer)] p-4 rounded-xl border">
        <p class="text-xs font-black text-gray-700 mb-1"><i class="fa fa-plus-circle"></i> إضافة سؤال جديد لهذا القالب</p>
        <div class="grid grid-cols-3 gap-3">
          <input v-model="formQuestion.question_text" type="text" required class="col-span-2 form-input bg-white" placeholder="نص السؤال (مثال: أداء الحفظ؟)">
          <select v-model="formQuestion.question_type" class="form-input bg-white font-bold text-gray-700">
            <option value="text">نصي (تعليق)</option>
            <option value="choice">اختيار من متعدد</option>
          </select>
        </div>
        <div v-if="formQuestion.question_type === 'choice'" class="flex flex-col gap-1.5">
          <label class="block text-[10px] font-black text-gray-500">الخيارات المتاحة تفصل بينها فاصلة ( , )</label>
          <input v-model="formQuestion.raw_choices" type="text" class="form-input bg-white" placeholder="مثال: ممتاز, جيد جداً, مقصر">
        </div>
        <button type="submit" class="w-full py-2 bg-[var(--color-primary)] hover:opacity-90 text-white text-xs font-black rounded-xl shadow-sm transition-all">
          ➕ حفظ السؤال وإدراجه بالقالب
        </button>
      </form>
    </div>
  </div>

  <div v-if="modals.assign" class="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div class="modal-box w-full max-w-md bg-white rounded-[2rem] p-6 shadow-2xl border">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-base font-black text-amber-900">توجيه التقرير إلى المجموعات</h3>
        <button @click="modals.assign = false; activeTemplate = null" class="text-gray-400 hover:text-[var(--color-primary)]">
          <i class="fa fa-times"></i>
        </button>
      </div>
      <form @submit.prevent="handleAssignReport" class="flex flex-col gap-4">
        <div>
          <label class="block text-xs font-black text-gray-500 mb-1">المجموعة المستهدفة بالتقرير *</label>
          <select v-model="formAssign.group" required class="form-input">
            <option value="" disabled>اختاري المجموعة</option>
            <option v-for="g in groupsStore.groups" :key="g.id" :value="g.id">{{ g.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-black text-gray-500 mb-1">تاريخ استحقاق التقرير *</label>
          <input v-model="formAssign.report_date" type="date" required class="form-input">
        </div>
        <div class="flex justify-end gap-2 mt-2">
          <button type="button" @click="modals.assign = false; activeTemplate = null" class="btn-cancel">إلغاء</button>
          <button type="submit" class="btn-submit-primary">🚀 إطلاق التقرير وتوجيهه</button>
        </div>
      </form>
    </div>
  </div>

  <SuccessToast :show="toast.show" :message="toast.msg" @close="toast.show = false" />
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import GenericAdminLayout from '@/views/dashboard/admin/GenericAdminLayout.vue';
import SuccessToast from '@/components/confirmAndSucces/SuccessToast.vue';
import { useReportsStore } from '@/stors/reports-store.js';
import { useGroupsStore } from '@/stors/groups-store.js';

const reportsStore = useReportsStore();
const groupsStore = useGroupsStore();

const searchKeyword = ref('');
const activeTemplate = ref(null);
const templateColumns = [{ label: 'اسم القالب والوصف' }, { label: 'تاريخ الإنشاء' }, { label: 'الحالة' }, { label: 'أدوات البناء والتوجيه' }];

const modals = reactive({ template: false, questions: false, assign: false });
const toast = reactive({ show: false, msg: '' });

const formTemplate = ref({ name: '', description: '' });
const formQuestion = ref({ question_text: '', question_type: 'text', raw_choices: '' });
const formAssign = ref({ group: '', report_date: '' });

onMounted(async () => {
  await reportsStore.getReportsStoreData();
  await groupsStore.getAllGroups();
});

const openCreateTemplateModal = () => {
  formTemplate.value = { name: '', description: '' };
  modals.template = true;
};

const handleCreateTemplate = async () => {
  const res = await reportsStore.createTemplate(formTemplate.value);
  if (res.success) {
    showToast("تم إنشاء قالب التقرير الهيكلي بنجاح");
    modals.template = false;
    await reportsStore.getReportsStoreData();
  }
};

const openManageQuestionsModal = (tpl) => {
  activeTemplate.value = tpl;
  formQuestion.value = { question_text: '', question_type: 'text', raw_choices: '' };
  modals.questions = true;
};

const handleCreateQuestion = async () => {
  if (!activeTemplate.value || !activeTemplate.value.id) {
    console.error("خطأ حرج: لم يتم العثور على القالب النشط!");
    return;
  }

  const currentQuestionsLength = activeTemplate.value.questions?.length || 0;
  
  // المفتاح المعتمد بالسيريالايزر هو report_template لربط السؤال بالقالب
  const payload = {
    report_template: activeTemplate.value.id, 
    question_text: formQuestion.value.question_text,
    question_type: formQuestion.value.question_type,
    allow_comment: false,
    order_num: currentQuestionsLength + 1, 
    is_required: true
  };
  
  const res = await reportsStore.createTemplateQuestion(payload);
  
  if (res.success) {
    // إذا كان اختيارياً نقوم ببناء خيارات السؤال وإرسالها بالتتابع
    if (formQuestion.value.question_type === 'choice' && formQuestion.value.raw_choices) {
      const choicesArr = formQuestion.value.raw_choices.split(',');
      let currentOptionOrder = 1;
      
      for (let cText of choicesArr) {
        if (cText.trim()) {
          // تعديل الدالة والمفاتيح لتطابق TemplateQuestionOptionSerializer وحقل option_text
          await reportsStore.createQuestionOption({ 
            question: res.data.id, 
            option_text: cText.trim(),
            order_num: currentOptionOrder
          });
          currentOptionOrder++;
        }
      }
    }
    showToast("تم إدراج السؤال بنجاح في القالب الحالي");
    modals.questions = false;
    activeTemplate.value = null; 
    await reportsStore.getReportsStoreData();
  }
};

const openAssignReportModal = (tpl) => {
  activeTemplate.value = tpl;
  formAssign.value = { group: '', report_date: new Date().toISOString().substr(0, 10) };
  modals.assign = true;
};

const handleAssignReport = async () => {
  if (!activeTemplate.value || !activeTemplate.value.id) return;

  const payload = { 
    report_template: activeTemplate.value.id, 
    group: formAssign.value.group, 
    report_date: formAssign.value.report_date 
  };
  
  const res = await reportsStore.createGroupReportInstance(payload);
  if (res.success) {
    showToast("🚀 تم إطلاق نسخة التقرير وتوجيهه للمشرف بنجاح");
    modals.assign = false;
    activeTemplate.value = null;
    await reportsStore.getReportsStoreData();
  }
};

const showToast = (msg) => { toast.msg = msg; toast.show = true; };
</script>

<style scoped>
@reference "@/css/style.css";

.form-input {
  @apply w-full p-3 border rounded-xl text-xs outline-none transition-all;
  border-color: #e5e7eb;
}
.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(118, 23, 23, 0.1);
}
.btn-submit-primary {
  @apply px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all;
  background-color: var(--color-primary);
}
.btn-submit-primary:hover {
  opacity: 0.9;
}
.btn-cancel {
  @apply px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all;
}
.btn-structure {
  @apply px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[11px] font-black rounded-lg transition-colors flex items-center gap-1;
}
.active-badge {
  @apply bg-emerald-50 text-emerald-700 border-emerald-200;
}
.archive-badge {
  @apply bg-gray-50 text-gray-500 border-gray-200;
}
</style>