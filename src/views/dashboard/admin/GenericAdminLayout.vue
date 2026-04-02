<template>
  <div class="main-container" dir="rtl">
    
    <nav v-if="filterTabs?.length && !selectedItem" class="tabs-nav">
      <button 
        v-for="tab in filterTabs" 
        :key="tab.value"
        @click="$emit('tab-change', tab.value)"
        :class="['tab-button', activeTab === tab.value ? 'tab-active' : 'tab-inactive']"
      >
        {{ tab.label }}
      </button>
    </nav>

    <div v-if="!selectedItem" class="header-section">
      <div class="header-text">
        <h1 class="title">{{ title }}</h1>
        <p class="description">{{ description }}</p>
      </div>

      <div v-if="showAddButton" class="add-button-container">
        <button @click="$emit('add-new')" class="btn-primary">
          <span class="plus-icon">+</span>
          <span class="btn-text">{{ showAddButton }}</span>
        </button>
      </div>
    </div>

    <div v-if="$slots['top-widgets']" class="widgets-area">
      <slot name="top-widgets"></slot>
    </div>

    <div class="content-area">
      <Transition name="fade-slide" mode="out-in">
        
        <div v-if="!selectedItem" key="table" class="table-wrapper">
          
          <template v-if="slots.table">
            <slot name="table" :data="data" :columns="columns"></slot>
          </template>

          <div v-else class="table-scroll">
            <table class="data-table">
              <thead>
                <tr class="table-header-row">
                  <th v-for="col in columns" :key="col.key" class="th-style">
                    {{ col.label }}
                  </th>
                  <th v-if="showActions?.length" class="th-style text-center">العمليات</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(row, index) in data" :key="index"
                  @click="$emit('row-click', row)"
                  class="table-row group"
                >
                  <td v-for="col in columns" :key="col.key" class="td-style">
                    <slot :name="`cell-${col.key}`" :value="row[col.key]" :row="row">
                      <span :class="{ 'empty-text': isValueEmpty(row[col.key]) }">
                        {{ row[col.key] }}
                      </span>
                    </slot>
                  </td>
                  
                  <td v-if="showActions?.length" class="p-5 text-center" @click.stop>
                    <div class="actions-container">
                      <button v-if="showActions.includes('edit')" @click="$emit('edit', row)" class="edit-btn">✏️</button>
                      <button v-if="showActions.includes('delete')" @click="$emit('delete', row)" class="delete-btn">🗑️</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else key="details">
          <slot name="details" :item="selectedItem"></slot>
        </div>

      </Transition>
    </div>
  </div>
</template>

<script setup>
import { useSlots } from 'vue';

const slots = useSlots();

defineProps({
  // العنوان الرئيسي للصفحة (مثلاً: "إدارة المحفظين" أو "قائمة الطلاب")
  title: String,

  // وصف فرعي يظهر أسفل العنوان لشرح محتوى الصفحة
  description: String,

  // نص زر الإضافة؛ إذا تم تمريره يظهر الزر، وإذا لم يمرر تظهر القيمة الافتراضية "إضافة جديد"
  showAddButton: { type: String, default: "إضافة جديد" },

  // مصفوفة الكائنات التي تحدد أعمدة الجدول (تحتوي عادة على label و key)
  columns: Array,

  // البيانات الفعلية المراد عرضها في الجدول (التي جلبناها من الـ Store)
  data: Array,

  // مصفوفة تحتوي على التبويبات العلوية للفلترة (مثلاً: "الكل"، "نشط"، "غير نشط")
  filterTabs: Array,

  // قيمة التبويب المختار حالياً لتمييزه بصرياً عن بقية التبويبات
  activeTab: String,

  // مصفوفة تحدد العمليات المسموحة في الجدول (مثل: ['edit', 'delete'])
  showActions: { type: Array, default: () => [] },

  // الكائن الذي يحتوي على بيانات العنصر المختار عند الرغبة في عرض صفحة "التفاصيل" بدلاً من الجدول
  selectedItem: Object
});
defineEmits([
  // يُرسل عند النقر على زر "إضافة جديد" لفتح واجهة إدخال بيانات جديدة
  'add-new', 

  // يُرسل عند تغيير التبويب (Tab) ليقوم المكون الأب بفلترة البيانات في الـ Store
  'tab-change', 

  // يُرسل عند النقر على أي صف في الجدول (مثلاً لفتح تفاصيل المستخدم)
  'row-click', 

  // يُرسل عند النقر على أيقونة القلم لتعديل بيانات سطر معين
  'edit', 

  // يُرسل عند النقر على أيقونة السلة لحذف سجل من النظام
  'delete', 

  // يُرسل عند الرغبة في إغلاق واجهة التفاصيل والعودة لعرض الجدول الرئيسي
  'close-details'
]);
// دالة للتحقق من القيم الفارغة لتنسيقها
const isValueEmpty = (val) => {
  return val === 'لا توجد' || val === 'لا يوجد حساب' || val === '—' || !val;
};
</script>

<style scoped>
@reference "@/css/style.css";

/* باستخدام @apply لتجميع تنسيقات Tailwind وجعل الكود أنظف */

.main-container {
  @apply p-6 bg-gray-50 min-h-screen text-right;
}

/* تنسيق التبويبات */
.tabs-nav {
  @apply mb-8 flex flex-wrap gap-2 p-1 bg-gray-200/50 rounded-2xl w-fit;
}

.tab-button {
  @apply px-6 py-2.5 rounded-xl font-bold transition-all duration-300 text-sm;
}

.tab-active {
  @apply bg-white text-blue-600 shadow-sm scale-105;
}

.tab-inactive {
  @apply text-gray-500 hover:bg-gray-200;
}

/* تنسيق الهيدر */
.header-section {
  @apply flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4;
}

.title {
  @apply text-3xl font-black text-gray-900 leading-tight;
}

.description {
  @apply text-gray-500 mt-1 text-sm font-bold;
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl 
         flex items-center gap-2 shadow-lg shadow-blue-200 transition-all;
}

/* تنسيق الجدول */
.table-wrapper {
  @apply bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden;
}

.table-scroll {
  @apply overflow-x-auto;
}

.data-table {
  @apply w-full text-right;
}

.th-style {
  @apply p-5 text-xs font-black text-gray-400 italic;
}

.table-row {
  @apply hover:bg-blue-50/30 transition-all cursor-pointer border-b border-gray-50 last:border-0;
}

.td-style {
  @apply p-5 text-gray-700 text-xs font-bold;
}

/* العمليات */
.actions-container {
  @apply flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity;
}

.edit-btn {
  @apply p-2 hover:bg-blue-100 rounded-lg text-blue-600;
}

.delete-btn {
  @apply p-2 hover:bg-red-100 rounded-lg text-red-600;
}

/* تنسيق النصوص الفارغة */
.empty-text {
  @apply text-gray-400 font-normal italic;
}

/* حركات الانتقال */
.fade-slide-enter-active, .fade-slide-leave-active { 
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
}
.fade-slide-enter-from { 
  opacity: 0; transform: translateY(20px); 
}
.fade-slide-leave-to { 
  opacity: 0; transform: translateY(-20px); 
}
</style>