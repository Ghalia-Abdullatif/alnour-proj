<template>
  <div class="p-6 bg-gray-50 min-h-screen text-right" dir="rtl">
    
    <nav v-if="filterTabs?.length && !selectedItem" class="mb-8 flex flex-wrap gap-2 p-1 bg-gray-200/50 rounded-2xl w-fit">
      <button 
        v-for="tab in filterTabs" 
        :key="tab.value"
        @click="$emit('tab-change', tab.value)"
        :class="[
          'px-6 py-2.5 rounded-xl font-bold transition-all duration-300 text-sm',
          activeTab === tab.value ? 'bg-white text-blue-600 shadow-sm scale-105' : 'text-gray-500 hover:bg-gray-200'
        ]"
      >
        {{ tab.label }}
      </button>
    </nav>
   

    <div v-if="!selectedItem" class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 text-right">
      <div>
        <h1 class="text-3xl font-black text-gray-900 leading-tight">{{ title }}</h1>
        <p class="text-gray-500 mt-1 text-sm font-bold">{{ description }}</p>
      </div>

      <div class="relative group" v-if="showAddButton">
        <button @click="$emit('add-new')" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-200 transition-all">
          <span class="text-xl">+</span>
          <span class="font-bold">إضافة جديد</span>
        </button>
      </div>
    </div>
     <div v-if="$slots['top-widgets']" class="mb-6">
      <slot name="top-widgets"></slot>
    </div>
    <div class="relative min-h-[400px]">
      <Transition name="fade-slide" mode="out-in">
        
        <div v-if="!selectedItem" key="table" class="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-right">
              <thead>
                <tr class="bg-gray-50/50 border-b border-gray-100">
                  <th v-for="col in columns" :key="col.key" class="p-5 text-xs font-black text-gray-400 italic">
                    {{ col.label }}
                  </th>
                  <th v-if="showActions?.length" class="p-5 text-xs font-black text-gray-400 text-center">العمليات</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(row, index) in data" :key="index"
                  @click="$emit('row-click', row)"
                  class="hover:bg-blue-50/30 transition-all cursor-pointer border-b border-gray-50 last:border-0 group"
                >
                  <td v-for="col in columns" :key="col.key" class="p-5 text-gray-700 text-sm font-bold">
                    <slot :name="`cell-${col.key}`" :value="row[col.key]" :row="row">
                      {{ row[col.key] }}
                    </slot>
                  </td>
                  <td v-if="showActions?.length" class="p-5 text-center" @click.stop>
                    <div class="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button v-if="showActions.includes('edit')" @click="$emit('edit', row)" class="p-2 hover:bg-blue-100 rounded-lg text-blue-600">✏️</button>
                      <button v-if="showActions.includes('delete')" @click="$emit('delete', row)" class="p-2 hover:bg-red-100 rounded-lg text-red-600">🗑️</button>
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
defineProps({
  title: String,
  description: String,
  showAddButton: Boolean,
  columns: Array,
  data: Array,
  filterTabs: Array,
  activeTab: String,
  showActions: { type: Array, default: () => [] },
  selectedItem: Object
});
defineEmits(['add-new', 'tab-change', 'row-click', 'edit', 'delete', 'close-details']);
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-slide-enter-from { opacity: 0; transform: translateY(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-20px); }
</style>