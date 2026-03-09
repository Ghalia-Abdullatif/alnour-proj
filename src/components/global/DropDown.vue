<template>
 <div 
    ref="dropdownContainer"
    v-show="open" 
    :style="isAbove ? { bottom: '100%', top: 'auto' } : { top: '100%', bottom: 'auto' }"
    class="absolute flex  z-[999] w-full bg-white border  border-none shadow-lg overflow-hidden px-4 py-2"
    :class="[isAbove ? 'rounded-t-xl border-b-0 mb-1 flex-col-reverse' : 'rounded-b-xl flex-col border-t-0 mt-0']"
  >
    <input id="research"
      v-if="isSearch&&options.length>6"
      ref="searchInput"
      v-model="searchQuery" 
      @click.stop 
      placeholder="ابحث هنا..."
      class="w-full border  border-gray-500 my-2 px-3 py-2 outline-none rounded-md custom-search-input" 
      type="search"
    />

    <div 
      role="listbox"
      class="max-h-[200px] overflow-y-auto custom-scrollbar my-2"
    >
      <div 
        v-for="(option, index) in filteredOptions" 
        role="option"
        :key="option.id"
        :ref="el => { if (el) optionsRefs[option[valueKey]] = el }"
        @mouseenter="activeIndex = index"  
        @click="selectOption(option)"
        :class="[
          'px-4 py-2 hover:bg-green-50 cursor-pointer transition-colors text-right flex flex-row gap-4 justify-start items-center',
          activeIndex === index ? 'bg-green-50' : '',
          customClass
        ]"
      >
        <img 
          v-if="Validator.isImage(option[iconKey])" 
          :src="option[iconKey]" 
          class="w-5 h-5 object-contain" 
        />
        <span v-else-if="option[iconKey]" class="text-xl leading-none">
           <country-flag :country="option[iconKey]" size="small"/>
        </span>
        {{ option[labelKey] }}
      </div>
      
      <div v-if="filteredOptions.length === 0" class="text-center py-4 text-gray-500">
        لا توجد نتائج مطابقة لبحثك
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed, onUnmounted } from 'vue'
import CountryFlag from 'vue-country-flag-next' 
import Validator from "../../utils/validaion"
import filter from "../../utils/filters"

const props = defineProps({
  labelKey: String,//اسم مفتاح اسم العنصر في الاوبجكت
  valueKey: String,//اسم مفتاح قيمة العنصر من الاوبجكت 
  iconKey: String,// اسم المفتاح الذي يحتوي على ايقونه  او رمز للاعلام في ارقام الهواتف
  options: { type: Array, default: () => [] },//قائمة العناصر  من نوع اوبجكت
  customClass: { type: String, default: '' },
  isSearch:{type:Boolean, default:true}// لتحديد ظهور حقل البحث اولا
})
const dropdownContainer = ref(null);
const isAbove = ref(false);

const selected = defineModel('selected')// لارجاع القيمه المختارة
const open = defineModel('open', { type: Boolean, default: false })

// const dropdownContainer = ref(null)
const searchInput = ref(null)//حقل البحث
const optionsRefs = ref({}) //العناصر في القائمة
const searchQuery = ref('')//قيمة محتويات حقل البحث
const activeIndex = ref(-1)//العنصر الذي تم التركيز علية من العناصر

// 1. الفلترة
const filteredOptions = computed(() => {
  return filter.filterData(
    props.options, 
    searchQuery.value, 
    [props.labelKey, props.valueKey, 'dialCode'] 
  );
})

// 2. دالة السكرول الثابتة
const scrollToActive = () => {
  nextTick(() => {
    const activeOption = filteredOptions.value[activeIndex.value];
    if (activeOption) {
      const activeEl = optionsRefs.value[activeOption[props.valueKey]];
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  });
}

// 3. مراقبة البحث
watch(searchQuery, () => {
  activeIndex.value = 0;
  scrollToActive();
})

// 4. مراقبة الفتح والإغلاق
watch(open, (isOpen) => {
  if (isOpen) {
    searchQuery.value = '';//حقل البحث
    optionsRefs.value = {}; 
    window.addEventListener('keydown', handleKeyDown);
    
    nextTick(() => {
      updatePosition();//لتحددمكان ظهور القائمة اسفل او اعلى
      searchInput.value?.focus();//للتركيز على حقل البحث
      
      const foundIndex = filteredOptions.value.findIndex(
        opt => opt[props.valueKey] === selected.value?.[props.valueKey]//لتحديد موفع العنصر المختار سابقا في القائمه
      );
      
      activeIndex.value = foundIndex !== -1 ? foundIndex : 0;
      setTimeout(scrollToActive, 10); //سحب القائمة لمكان العنصر المختار سابقا
    });
  } else {
    window.removeEventListener('keydown', handleKeyDown);//ازالة الاستماع للمفاتيح
  }
})

const selectOption = (val) => {
  if (!val) return;
  selected.value = val;
  open.value = false;
  searchQuery.value = '';
}

// 5. الكيبورد (إغلاق مع Tab)
const handleKeyDown = (e) => {
  // console.log(e.Key.value)
  if (!open.value) return;

  if (e.key === 'Tab') {
    console.log("taaaaaaap")
    open.value = false; 
    return;
  }

  if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(e.key)) {
    e.preventDefault();
    if (e.key !== 'Enter') searchInput.value?.blur();
  }

  if (e.key === 'ArrowDown') {
    if (activeIndex.value < filteredOptions.value.length - 1) {
      activeIndex.value++;
      scrollToActive();
    }
  } 
  else if (e.key === 'ArrowUp') {
    if (activeIndex.value > 0) {
      activeIndex.value--;
      scrollToActive();
    }
  } 
  else if (e.key === 'Enter') {
    if (activeIndex.value >= 0 && activeIndex.value < filteredOptions.value.length) {
      selectOption(filteredOptions.value[activeIndex.value]);
    }
  } 
  else if (e.key === 'Escape') {
    open.value = false;
  }
}

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
})
const updatePosition = () => {
  if (!open.value || !dropdownContainer.value) return;

  // الحصول على العنصر الأب (الذي يحتوي على الـ dropdown)
  const parent = dropdownContainer.value.parentElement;
  if (!parent) return;

  const rect = parent.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const dropdownHeight = 200; // ارتفاع تقريبي للقائمة (max-height + search)

  // إذا كانت المساحة بالأسفل أقل من ارتفاع القائمة، ارفعها للأعلى
  isAbove.value = spaceBelow < dropdownHeight && rect.top > dropdownHeight;
};
</script>

<style scoped>
/* تنسيق السكرول بار الأصلي */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
  height: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #10b981; 
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #059669;
}

/* تنسيق علامة الكروس (X) في حقل البحث */
.custom-search-input::-webkit-search-cancel-button {
  -webkit-appearance: none;
  height: 14px;
  width: 14px;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E");
  background-size: contain;
  opacity: 0.6;
  cursor: pointer;
}

.absolute {
  top: 100%;
  left: 0;
  right: 0;
}
</style>