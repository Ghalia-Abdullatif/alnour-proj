<template>
  <div class="p-6 bg-slate-50 min-h-screen text-right" dir="rtl">
    
    <div class="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-6 flex flex-wrap gap-4 items-center">
      <div class="flex items-center gap-2">
        <span class="text-xs font-black text-slate-400">المساق:</span>
        <nav class="flex gap-1 bg-slate-100 p-1 rounded-xl">
          <button 
            v-for="track in tracks" :key="track.id"
            @click="activeTrack = track.id"
            :class="[activeTrack === track.id ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500']"
            class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
          >
            {{ track.name }}
          </button>
        </nav>
      </div>

      <div class="h-8 w-px bg-slate-200 mx-2"></div>

      <div class="flex items-center gap-2">
        <span class="text-xs font-black text-slate-400">العرض حسب:</span>
        <select v-model="reportType" class="bg-slate-50 border-none rounded-xl font-bold text-xs px-4 py-2 focus:ring-2 focus:ring-blue-500">
          <option value="batch">تقارير الدفعات</option>
          <option value="group">تقارير المجموعات</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="md:col-span-2 bg-gradient-to-r from-slate-800 to-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <div class="relative z-10">
          <h2 class="text-3xl font-black mb-2">{{ currentTitle }}</h2>
          <p class="opacity-70 font-bold">إحصائيات المساق: {{ currentTrackName }}</p>
        </div>
        <div class="absolute left-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform"></div>
      </div>

      <div v-for="stat in quickStats" :key="stat.label" class="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <p class="text-slate-400 font-bold text-xs mb-1">{{ stat.label }}</p>
        <h3 class="text-2xl font-black text-slate-800">{{ stat.value }}</h3>
        <div :class="stat.trendColor" class="text-[10px] font-bold mt-2">
          {{ stat.trend }} منذ الشهر الماضي
        </div>
      </div>
    </div>

    <div class="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
      <div class="flex justify-between items-center mb-10">
        <h3 class="text-xl font-black text-slate-800">تحليل سير الأداء</h3>
        <button class="text-blue-600 text-sm font-bold hover:underline">عرض الكل</button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
        <div v-for="item in reportData" :key="item.id" class="group">
          <div class="flex justify-between items-center mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                {{ item.name.charAt(0) }}
              </div>
              <div>
                <h4 class="font-black text-slate-700 text-sm">{{ item.name }}</h4>
                <p class="text-[10px] text-slate-400 font-bold">{{ item.subtext }}</p>
              </div>
            </div>
            <span class="font-black text-sm" :class="item.score > 80 ? 'text-emerald-500' : 'text-blue-600'">{{ item.score }}%</span>
          </div>
          <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              class="h-full rounded-full transition-all duration-1000"
              :class="item.score > 80 ? 'bg-emerald-500' : 'bg-blue-600'"
              :style="{ width: item.score + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 1. تعريف الحالة (State)
const activeTrack = ref('quran');
const reportType = ref('batch'); // 'batch' or 'group'

const tracks = [
  { id: 'quran', name: 'حفظ القرآن' },
  { id: 'tajweed', name: 'التجويد' },
  { id: 'sunnah', name: 'السنة النبوية' }
];

// 2. المحتوى المتغير (Computed Content)
const currentTitle = computed(() => {
  return reportType.value === 'batch' ? 'تقارير الدفعات الشاملة' : 'تقارير المجموعات التفصيلية';
});

const currentTrackName = computed(() => {
  return tracks.find(t => t.id === activeTrack.value)?.name;
});

const quickStats = computed(() => [
  { label: 'متوسط الحفظ', value: '14 صفحة', trend: '↑ 12%', trendColor: 'text-emerald-500' },
  { label: 'نسبة الانضباط', value: '96%', trend: '↑ 5%', trendColor: 'text-emerald-500' }
]);

// 3. البيانات الديناميكية (تحاكي الجلب من API)
const reportData = computed(() => {
  if (reportType.value === 'batch') {
    return [
      { id: 1, name: 'الدفعة الأولى', subtext: '12 مجموعة - 150 طالب', score: 88 },
      { id: 2, name: 'الدفعة الثانية', subtext: '8 مجموعات - 90 طالب', score: 72 },
      { id: 3, name: 'الدفعة الثالثة', subtext: '15 مجموعة - 200 طالب', score: 95 }
    ];
  } else {
    return [
      { id: 101, name: 'مجموعة الفجر', subtext: 'المعلم: علي أحمد', score: 94 },
      { id: 102, name: 'مجموعة النور', subtext: 'المعلم: عمر خالد', score: 81 },
      { id: 103, name: 'مجموعة الفرقان', subtext: 'المعلم: ياسين وليد', score: 65 }
    ];
  }
});

// 4. مراقبة التغييرات لتحديث الرابط (Optional)
watch([activeTrack, reportType], () => {
  // هنا يمكنك تحديث الرابط برمجياً إذا أردت
  // router.push({ query: { track: activeTrack.value, type: reportType.value } });
});
</script>