<template>
  <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
    <div class="mb-6 bg-white p-6 rounded-2xl shadow-sm border border-amber-100 flex justify-between items-center">
      <div>
        <h1 class="text-xl font-black text-amber-950">🔍 شاشة فحص بيانات المجموعات والتسكينات</h1>
        <p class="text-xs text-gray-500 mt-1">تستخدم هذه الشاشة للتأكد من جلب الكائنات (Objects) من الباكند بنجاح قبل بناء التصميم المتجاوب.</p>
      </div>
      <button 
        @click="fetchDataFromServer" 
        :disabled="isLoading"
        class="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 disabled:bg-gray-400 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
      >
        <span v-if="isLoading">🔄 جاري التحديث الحركي...</span>
        <span v-else>🔄 تحديث البيانات يدويًا</span>
      </button>
    </div>

    <div v-if="isLoading" class="p-12 text-center bg-white rounded-2xl border shadow-sm">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-amber-700 border-t-transparent rounded-full mb-3"></div>
      <p class="text-sm font-bold text-gray-600 animate-pulse">جاري طلب البيانات من السيرفر وفك الحزم...</p>
    </div>

    <div v-else-if="errorMessage" class="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl mb-6">
      <p class="text-sm font-black">⚠️ فشل الاتصال بالسيرفر:</p>
      <p class="text-xs mt-1 font-mono bg-white/50 p-2 rounded border">{{ errorMessage }}</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div class="flex justify-between items-center mb-3 border-b pb-2">
          <h2 class="text-sm font-black text-amber-900">📦 كائن المجموعات الخام (Groups Array)</h2>
          <span class="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-md">
            العدد: {{ groupsStore.groups?.length || 0 }}
          </span>
        </div>
        
        <div class="flex-1 bg-gray-900 text-green-400 font-mono text-xs p-4 rounded-xl overflow-x-auto max-h-[500px] custom-scrollbar" dir="ltr">
          <pre v-if="groupsStore.groups?.length > 0">{{ JSON.stringify(groupsStore.groups, null, 2) }}</pre>
          <p v-else class="text-gray-500 italic text-center py-8">المصفوفة فارغة، لم تقم الـ API بإرجاع مجموعات بعد.</p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div class="flex justify-between items-center mb-3 border-b pb-2">
          <h2 class="text-sm font-black text-blue-900">👥 كائن تسكين الطلاب الوسيط (Group Students)</h2>
          <span class="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-1 rounded-md">
            العدد: {{ groupsStore.groupStudents?.length || 0 }}
          </span>
        </div>

        <div class="flex-1 bg-gray-900 text-blue-300 font-mono text-xs p-4 rounded-xl overflow-x-auto max-h-[500px] custom-scrollbar" dir="ltr">
          <pre v-if="groupsStore.groupStudents?.length > 0">{{ JSON.stringify(groupsStore.groupStudents, null, 2) }}</pre>
          <p v-else class="text-gray-500 italic text-center py-8">لا يوجد طالبات مسكنات في أي مجموعة حالياً.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useGroupsStore } from "@/stors/groups-store.js";

const groupsStore = useGroupsStore();
const isLoading = ref(false);
const errorMessage = ref(null);

// دالة جلب وتحديث البيانات من السيرفر عن طريق الاستور المحدث
const fetchDataFromServer = async () => {
  isLoading.value = true;
  errorMessage.value = null;
  try {
    console.log("🚀 جاري فحص استجابة الـ Endpoints للمجموعات...");
    await groupsStore.getGroupsStoreData();
    console.log("✅ تمت العملية بنجاح. البيانات الحالية بالـ State هي:", groupsStore.groups);
  } catch (error) {
    console.error("❌ خطأ بالاتصال أثناء فحص المجموعات:", error);
    errorMessage.value = error.message || "فشل جلب البيانات، تأكدي من عمل الباكند وصحة الروابط.";
  } finally {
    isLoading.value = false;
  }
};

// الاستدعاء التلقائي بمجرد تحميل المكون
onMounted(async () => {
  await fetchDataFromServer();
});
</script>

<style scoped>
/* سكرول بار مخصص لقراءة الـ JSON بمرونة عالية */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #1a1a1a;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}
</style>