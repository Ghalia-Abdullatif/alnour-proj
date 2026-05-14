<template>
  <div class="min-h-screen bg-[#f8f9fa] py-16 px-4 font-['Cairo']" dir="rtl">
    <div class="max-w-4xl mx-auto text-center mb-20 animate-fade-down">
      <span class="inline-block px-4 py-1.5 mb-4 text-sm font-bold tracking-widest text-[#1e5d4e] uppercase bg-[#1e5d4e]/10 rounded-full">
        مقرأة النور الإلكترونية
      </span>
      <h1 class="text-4xl md:text-6xl font-black text-[#1e5d4e] mb-6 leading-tight">
        اختر <span class="text-[#c5a059]">رحلتك مع القرآن</span>
      </h1>
      <p class="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed italic">
      نهجٌ متقن ، وصحبةٌ صالحة ، وتيسيرٌ في سبل الحفظ
      </p>
    </div>

    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
      
      <div class="group relative flex flex-col bg-white rounded-[45px] shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden hover:-translate-y-4 transition-all duration-500">
        <div class="absolute top-8 left-8 z-10">
          <span class="px-5 py-2 bg-[#1e5d4e] text-white text-xs font-black rounded-2xl shadow-xl shadow-[#1e5d4e]/30 tracking-wide">
            المسار المكثف
          </span>
        </div>

        <div class="p-10 flex-grow">
          <div class="text-center mb-10">
            <div class="w-36 h-36 mx-auto mb-6 bg-white rounded-[35px] flex items-center justify-center shadow-2xl shadow-gray-200 group-hover:rotate-3 transition-transform duration-500 p-4 border border-gray-50">
               <img src="/assets/logos/mthani.png" alt="لوجو مثاني" class="w-full h-full object-contain">
            </div>
            <h2 class="text-3xl font-black text-[#1e5d4e] mb-2">برنامج مثاني</h2>
            <div class="h-1.5 w-16 bg-[#c5a059] mx-auto rounded-full"></div>
            <p class="text-gray-400 mt-4 font-bold text-sm">حفظ الختمة في (18 شهر)</p>
          </div>

          <div class="space-y-8">
            <div class="bg-gradient-to-r from-[#1e5d4e]/10 to-transparent p-5 rounded-[25px] border-r-8 border-[#1e5d4e]">
              <p class="text-[#1e5d4e] font-bold text-sm leading-relaxed">
                المنهجية: تركيز عالٍ على ضبط المتون والتجويد العملي مع مراجعة تراكمية مكثفة لضمان عدم التفلت.
              </p>
            </div>
            
            <div class="grid grid-cols-1 gap-4">
              <div v-for="(item, index) in mathaniDetails" :key="index" class="flex items-start gap-4 p-4 rounded-3xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-100">
                <div class="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                   <component :is="item.icon" class="w-5 h-5 text-[#1e5d4e]" />
                </div>
                <div>
                  <h4 class="text-xs font-black text-gray-400 mb-1 uppercase tracking-tighter">{{ item.label }}</h4>
                  <p class="text-sm font-bold text-[#1e5d4e]" v-html="item.value"></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button @click="selectProgram('مثاني', '/assets/logos/mthani.png')" 
                class="m-10 py-6 bg-[#1e5d4e] text-white text-xl font-black rounded-[30px] hover:bg-[#16453a] hover:shadow-2xl hover:shadow-[#1e5d4e]/40 transition-all active:scale-95 group">
          ابدأ رحلة الإتقان الآن 
          <span class="inline-block transition-transform group-hover:translate-x-[-5px]">←</span>
        </button>
      </div>

      <div class="group relative flex flex-col bg-white rounded-[45px] shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden hover:-translate-y-4 transition-all duration-500">
        <div class="absolute top-8 left-8 z-10">
          <span class="px-5 py-2 bg-[#c5a059] text-white text-xs font-black rounded-2xl shadow-xl shadow-[#c5a059]/30 tracking-wide">
            المسار المتدرج
          </span>
        </div>

        <div class="p-10 flex-grow">
          <div class="text-center mb-10">
            <div class="w-36 h-36 mx-auto mb-6 bg-white rounded-[35px] flex items-center justify-center shadow-2xl shadow-gray-200 group-hover:-rotate-3 transition-transform duration-500 p-4 border border-gray-50">
               <img src="/assets/logos/maarej.png" alt="لوجو معارج" class="w-full h-full object-contain">
            </div>
            <h2 class="text-3xl font-black text-[#c5a059] mb-2">برنامج معارج</h2>
            <div class="h-1.5 w-16 bg-[#1e5d4e] mx-auto rounded-full"></div>
            <p class="text-gray-400 mt-4 font-bold text-sm">حفظ الختمة في (36 شهر)</p>
          </div>

          <div class="space-y-8">
            <div class="bg-gradient-to-r from-[#c5a059]/10 to-transparent p-5 rounded-[25px] border-r-8 border-[#c5a059]">
              <p class="text-[#c5a059] font-bold text-sm leading-relaxed">
                المنهجية: تدرج مريح يناسب أصحاب الانشغالات، مع إثرائيات في التفسير وتدبر الآيات.
              </p>
            </div>
            
            <div class="grid grid-cols-1 gap-4">
              <div v-for="(item, index) in maarejDetails" :key="index" class="flex items-start gap-4 p-4 rounded-3xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-100">
                <div class="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                   <component :is="item.icon" class="w-5 h-5 text-[#c5a059]" />
                </div>
                <div>
                  <h4 class="text-xs font-black text-gray-400 mb-1 uppercase tracking-tighter">{{ item.label }}</h4>
                  <p class="text-sm font-bold text-[#c5a059]" v-html="item.value"></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button @click="selectProgram('معارج', '/assets/logos/maarej.png')" 
                class="m-10 py-6 bg-[#c5a059] text-white text-xl font-black rounded-[30px] hover:bg-[#b08e4d] hover:shadow-2xl hover:shadow-[#c5a059]/40 transition-all active:scale-95 group">
          انضم لمسار التدرج 
          <span class="inline-block transition-transform group-hover:translate-x-[-5px]">←</span>
        </button>
      </div>

    </div>

    <div class="mt-20 text-center flex flex-col items-center">
      <div class="flex items-center gap-6 mb-4 opacity-50">
        <span class="text-xs font-bold text-gray-400 tracking-[0.2em]">POWERED BY VUE.JS 3</span>
        <div class="w-1 h-1 bg-gray-300 rounded-full"></div>
        <span class="text-xs font-bold text-gray-400 tracking-[0.2em]">DJANGO BACKEND</span>
      </div>
      <p class="text-gray-400 text-[10px] font-bold" >مقرأة النور  </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { 
  BookOpenIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon, 
  ClockIcon 
} from '@heroicons/vue/24/solid'; // تأكدي من تثبيت heroicons

const router = useRouter();

// بيانات برنامج مثاني
const mathaniDetails = [
  { label: "توزيع المنهج", value: "3 مستويات (10 أجزاء لكل مستوى)", icon: BookOpenIcon },
  { label: "مقدار الحفظ والمراجعة", value: "حفظ وجهين يومياً + مراجعة 5 أوجه ماضي", icon: ClockIcon },
  { label: "وسيلة التسميع", value: "مكالمة صوتية مباشرة (Telegram / Google Meet)", icon: ChatBubbleLeftRightIcon },
  { label: "نظام الحلقات", value: "  3 أيام أسبوعياً ", icon: CalendarIcon }
];

// بيانات برنامج معارج
const maarejDetails = [
  { label: "توزيع المنهج", value: "6 مستويات (5 أجزاء لكل مستوى)", icon: BookOpenIcon },
  { label: "مقدار الحفظ والمراجعة", value: "حفظ وجه واحد يومياً + مراجعة 3 أوجه ماضي", icon: ClockIcon },
  { label: "وسيلة التسميع", value: "مكالمة صوتية مباشرة (Telegram / Google Meet)", icon: ChatBubbleLeftRightIcon },
  { label: "نظام الحلقات", value: "يومين أسبوعياً", icon: CalendarIcon }
];

const selectProgram = (name, logo) => {
  router.push({
    name: 'Register', 
    query: { program: name, logo: logo }
  });
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');

.animate-fade-down {
  animation: fadeDown 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* تأثيرات الزر */
button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}
</style>