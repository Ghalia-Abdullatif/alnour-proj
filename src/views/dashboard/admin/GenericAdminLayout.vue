
<template>
  <div class="main-container" dir="rtl">
    
    <!-- التبويبات العلوية -->
    <nav v-if="filterTabs?.length && !selectedItem" class="tabs-nav custom-scrollbar">
      <button 
        v-for="tab in filterTabs" 
        :key="tab.value"
        @click="$emit('tab-change', tab.value)"
        :class="['tab-button', activeTab === tab.value ? 'tab-active' : 'tab-inactive']"
      >
        {{ tab.label }}
      </button>
    </nav>

    <!-- الهيدر الرئيسي (العنوان وزر الإضافة فقط) -->
    <div v-if="!selectedItem" class="header-section">
      <div class="header-text">
        <h2 class="title">
          <span class="title-indicator"></span>
          {{ title }}
        </h2>
        <p class="description">{{ description }}</p>
      </div>

      <div v-if="showAddButton" class="add-button-container">
        <button @click="$emit('add-new')" class="btn-primary">
          <span class="plus-icon">+</span>
          <span class="btn-text">{{ showAddButton }}</span>
        </button>
      </div>
    </div>

    <!-- مساحة الوجت الإضافية -->
    <div v-if="$slots['top-widgets']" class="widgets-area">
      <slot name="top-widgets"></slot>
    </div>

    <!-- بار البحث: متموضع فوق كرت الجدول مباشرة وخلفيته متناسقة -->
    <div v-if="!selectedItem" class="search-bar-row">
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
          placeholder="ابحث" 
          class="search-input"
        />
      </div>
    </div>

    <!-- منطقة عرض الجدول أو التفاصيل -->
    <div class="content-area">
      <Transition name="fade-slide" mode="out-in">
        
        <div v-if="!selectedItem" key="table" class="table-wrapper custom-scrollbar">
          <!-- تعديل الفحص هنا لحل مشكلة Uncaught TypeError بنجاح -->
          <template v-if="$slots.table">
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
                <tr v-if="data.length === 0">
                  <td :colspan="columns.length + (showActions?.length ? 1 : 0)" class="text-center p-10 text-gray-400 font-medium">
                    لا توجد بيانات تطابق البحث الحالي
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
// تعريف الخصائص الممررة للمكون (Props)
defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  data: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  searchQuery: { type: String, default: '' },
  showAddButton: { type: String, default: '' },
  showActions: { type: Array, default: () => [] },
  filterTabs: { type: Array, default: () => [] },
  activeTab: { type: String, default: '' },
  selectedItem: { type: Object, default: null }
});

// تعريف الأحداث المرسلة للمكون الأب (Emits)
defineEmits([
  'update:searchQuery',
  'add-new',
  'tab-change',
  'row-click',
  'edit',
  'delete'
]);

// دالة مساعدة للتحقق من القيم الفارغة في الخلايا
const isValueEmpty = (val) => {
  return val === null || val === undefined || val === '';
};
</script>

<style scoped>
@reference "@/css/style.css";

.main-container {
  @apply space-y-4 text-right font-['Tajawal',_sans-serif] bg-gray-50/50 min-h-screen;
}

/* التبويبات العلوبة */
.tabs-nav {
  @apply  sticky   flex gap-2 p-1.5 bg-white border border-gray-100 rounded-full shadow-sm mb-2 overflow-x-auto whitespace-nowrap;
  max-width: 100%;
  -webkit-overflow-scrolling: touch;
}

.tab-button {
  @apply px-6 py-2 rounded-full font-bold transition-all duration-300 text-sm;
}

.tab-active {
  @apply bg-[#802c2c] text-white shadow-md shadow-[#802c2c]/10 scale-105;
}

.tab-inactive {
  @apply text-gray-500 hover:bg-gray-50 hover:text-gray-800;
}


/* الهيدر الرئيسي */
.header-section {
  @apply flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm;
}

.title {
  @apply text-xl md:text-2xl font-black text-[#802c2c] tracking-tight flex items-center gap-3;
}

.title-indicator {
  @apply w-2.5 h-6 bg-[#802c2c] rounded-full inline-block;
}

.description {
  @apply text-gray-400 mt-1 text-xs md:text-sm font-medium mr-5;
}

.btn-primary {
  @apply bg-[#802c2c] hover:bg-[#6b2323] text-white px-6 py-3 rounded-2xl 
         flex items-center justify-center gap-2 shadow-lg shadow-[#802c2c]/10 transition-all text-sm font-bold active:scale-95 whitespace-nowrap;
}

/* صف حقل البحث وتنسيق الخط الواضح */
.search-bar-row {
  @apply w-full pt-2;
}

.search-wrapper {
  @apply relative flex items-center bg-white border border-gray-200 rounded-2xl px-5 py-3.5 
         focus-within:border-[#802c2c]/40 focus-within:ring-2 focus-within:ring-[#802c2c]/5 transition-all w-full shadow-sm;
}

.search-icon {
  @apply text-gray-400 text-lg ml-3;
}

.search-input {
  @apply bg-transparent outline-none text-base w-full text-gray-800 font-bold placeholder-gray-400/80;
}

/* كرت الجدول وبنية الخلايا */
.table-wrapper {
  @apply bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden;
}

.table-scroll {
  @apply overflow-x-auto ;
}

.data-table {
  @apply w-full text-right border-collapse;
}

.table-header-row {
  @apply bg-gray-50/70 border-b border-gray-100;
}

.th-style {
  @apply p-5 text-xs font-black text-gray-400 tracking-wider;
}

.table-row {
  @apply hover:bg-gray-50/50 transition-all cursor-pointer border-b border-gray-100 last:border-0;
}

.td-style {
  @apply p-5 text-gray-700 text-xs md:text-sm font-medium;
}

.actions-container {
  @apply flex justify-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200;
}

.edit-btn {
  @apply p-2 hover:bg-blue-50 rounded-xl text-blue-600 transition-colors;
}

.delete-btn {
  @apply p-2 hover:bg-red-50 rounded-xl text-red-600 transition-colors;
}

.empty-text {
  @apply text-gray-400 font-normal italic;
}

/* حركات الانتقال */
.fade-slide-enter-active, .fade-slide-leave-active { 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
}
.fade-slide-enter-from { 
  opacity: 0; transform: translateY(10px); 
}
.fade-slide-leave-to { 
  opacity: 0; transform: translateY(-10px); 
}
</style>