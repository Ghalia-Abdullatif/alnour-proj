<template>
  <div class="p-4 sm:p-6 min-h-screen bg-gray-50/40 text-right" dir="rtl">
    
    <!-- رأس الصفحة المطور -->
    <div class="mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-primary font-black text-2xl flex items-center gap-2">
          <i class="fas fa-graduation-cap text-primary/80"></i>
          المساقات الدراسية
        </h2>
        <p class="text-basicGray text-sm mt-1">
          دليل البرامج والمساقات التعليمية المعتمدة داخل المقرأة.
        </p>
      </div>
      <div v-if="!isLoading && !errorMessage && coursesList.length > 0" class="bg-primary/5 px-4 py-1.5 rounded-xl border border-primary/10">
        <span class="text-primary font-bold text-sm">العدد الإجمالي: {{ coursesList.length }} مساقات</span>
      </div>
    </div>

    <!-- حالة جاري التحميل -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-primary"></div>
      <p class="text-basicBlack font-bold mt-4 text-sm">جاري تحميل المساقات الدراسية...</p>
    </div>

    <!-- حالة حدوث خطأ -->
    <div v-else-if="errorMessage" class="text-center py-12 bg-white border border-gray-100 rounded-2xl max-w-md mx-auto shadow-sm p-6">
      <div class="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h4 class="text-basicBlack font-bold text-base mb-1">فشل تحميل البيانات</h4>
      <p class="text-red-600 text-xs px-4 mb-4">{{ errorMessage }}</p>
      <button @click="fetchCourses" class="btn-primary !py-2 !px-5 text-xs shadow-sm flex items-center gap-2 mx-auto">
        <i class="fas fa-sync-alt text-[10px]"></i>
        إعادة المحاولة
      </button>
    </div>

    <!-- حالة عدم وجود بيانات -->
    <div v-else-if="coursesList.length === 0" class="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-xl mx-auto p-8">
      <p class="text-basicGray text-sm">لا توجد مساقات دراسية مضافة في النظام حالياً.</p>
    </div>

    <!-- عرض الكروت -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div 
          v-for="course in coursesList" 
          :key="course.id" 
          class="bg-white rounded-2xl border border-gray-100 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <!-- محتوى الكرت العلوي -->
          <div class="p-6 space-y-5">
            
            <!-- القسم الأول: الهيدر والتعريف بالمساق + اللوقو الديناميكي -->
            <div class="flex justify-between items-start gap-4 border-b border-gray-50 pb-4">
              <div class="flex items-center gap-3">
                
                <!-- حاوية الشعار (Logo Container) المحدثة بدقة هنا 👇 -->
                <div class="w-12 h-12 bg-gray-50 text-primary rounded-xl flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden border border-gray-100">
                  <img 
                    v-if="course.name === 'مثاني' || course.code === 'maarij'"
                    :src="`/assets/logos/${course.code}.png`" 
                    :alt="course.name"
                    class="w-full h-full object-cover"
                  />
                  <!-- أيقونة افتراضية احتياطية في حال كان المساق لا يملك شعاراً مخصصاً -->
                  <i v-else class="fas fa-book-open text-base text-primary"></i>
                </div>

                <div>
                  <h3 class="font-black text-basicBlack text-lg leading-snug mb-1 group-hover:text-primary">
                    {{ course.name }}
                  </h3>
                  <span class="bg-gray-100 text-basicGray font-mono font-bold text-[10px] uppercase px-2 py-0.5 rounded tracking-wider border border-gray-200/40">
                    {{ course.code }}
                  </span>
                </div>
              </div>
              
              <!-- مدة المساق الكلية -->
              <span class="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-bold px-2.5 py-1 rounded-lg shrink-0">
                <i class="far fa-clock ml-1"></i>{{ course.duration_months }} شهراً
              </span>
            </div>

            <!-- القسم الثاني: الوصف النصي -->
            <p class="text-xs text-basicGray leading-relaxed min-h-[38px] line-clamp-2">
              {{ course.description || 'لا يوجد وصف تعريفي مخصص لهذا المساق التعليمي حالياً.' }}
            </p>

            <!-- القسم الثالث: بيانات الخطة اليومية والأسبوعية -->
            <div class="space-y-2.5">
              <span class="text-[11px] font-black text-basicBlack block tracking-wide text-gray-400">خطة الحفظ والمتابعة</span>
              
              <div class="grid grid-cols-2 gap-2">
                <!-- الحفظ اليومي -->
                <div class="bg-gray-50/60 border border-gray-100 rounded-xl p-2.5 flex items-center gap-2.5">
                  <div class="w-7 h-7 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-xs shrink-0">
                    <i class="fas fa-plus-circle"></i>
                  </div>
                  <div>
                    <p class="text-[10px] text-gray-400 font-medium">الحفظ اليومي</p>
                    <p class="text-xs font-bold text-basicBlack">{{ course.daily_memorization_faces }} أوجه</p>
                  </div>
                </div>

                <!-- المراجعة اليومية -->
                <div class="bg-gray-50/60 border border-gray-100 rounded-xl p-2.5 flex items-center gap-2.5">
                  <div class="w-7 h-7 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center text-xs shrink-0">
                    <i class="fas fa-sync-alt"></i>
                  </div>
                  <div>
                    <p class="text-[10px] text-gray-400 font-medium">المراجعة اليومية</p>
                    <p class="text-xs font-bold text-basicBlack">{{ course.daily_review_pages }} صفحة</p>
                  </div>
                </div>

                <!-- عدد المستويات + المدة الافتراضية للمستوى كـ Subtitle -->
                <div class="bg-gray-50/60 border border-gray-100 rounded-xl p-2.5 flex items-center gap-2.5">
                  <div class="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xs shrink-0">
                    <i class="fas fa-layer-group"></i>
                  </div>
                  <div>
                    <p class="text-[10px] text-gray-400 font-medium">الهيكل التعليمي</p>
                    <p class="text-xs font-bold text-basicBlack">{{ course.num_levels }} مستويات</p>
                    <p class="text-[9px] text-blue-600 font-medium mt-0.5">
                      (المستوى: {{ course.default_level_duration_months }} أشهر)
                    </p>
                  </div>
                </div>

                <!-- اللقاءات الأسبوعية -->
                <div class="bg-gray-50/60 border border-gray-100 rounded-xl p-2.5 flex items-center gap-2.5">
                  <div class="w-7 h-7 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center text-xs shrink-0">
                    <i class="fas fa-calendar-alt"></i>
                  </div>
                  <div>
                    <p class="text-[10px] text-gray-400 font-medium">اللقاءات الأسبوعية</p>
                    <p class="text-xs font-bold text-basicBlack">{{ course.basic_sessions_per_week }} حلقات</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- القسم الرابع: محددات القبول والتسكين -->
            <div class="pt-4 border-t border-gray-50 flex items-center justify-between text-[11px] text-basicGray">
              <span class="flex items-center gap-1.5">
                <i class="fas fa-user-check text-gray-400 text-xs"></i>
                العمر: <strong class="text-basicBlack font-bold">{{ course.min_age }} - {{ course.max_age }} سنة</strong>
              </span>
              <span class="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
              <span class="flex items-center gap-1.5">
                <i class="fas fa-users text-gray-400 text-xs"></i>
                الطالبات بالحلقة: <strong class="text-basicBlack font-bold">{{ course.group_min_students }} إلى {{ course.group_max_students }}</strong>
              </span>
            </div>

          </div>

          <!-- زر الإجراء السفلي -->
          <div class="px-6 pb-6 pt-0">
            <button 
              @click="goToBatches(course.id)" 
              class="w-full bg-primary/5 hover:bg-primary text-primary hover:text-white font-bold py-2.5 rounded-xl text-xs transition-all duration-200 flex items-center justify-center gap-1.5 group border border-primary/10"
            >
              <span>عرض الدفعات والمجموعات</span>
              <i class="fas fa-arrow-left text-[10px] group-hover:-translate-x-1 transition-transform"></i>
            </button>
          </div>

        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProgramStore } from "@/stors/program-stor.js"; 

const router = useRouter();
const programStore = useProgramStore();

const coursesList = computed(() => programStore.programs || []);
const isLoading = computed(() => programStore.loading);
// const errorMessage = computed(() => programStore.error);

const fetchCourses = async () => {
  if (typeof programStore.getAllPrograms === 'function') {
    await programStore.getAllPrograms();
  }
};

onMounted(() => {
  fetchCourses();
});

const goToBatches = (courseId) => {
  router.push({ 
    name: 'SupervisorBatches', 
    params: { courseId: String(courseId) }
  });
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>