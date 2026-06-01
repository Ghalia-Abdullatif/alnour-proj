import { defineStore } from "pinia";
import { endpoint } from "@/constant/endpointurl.js";
import { requestData } from "@/Composable/useApi.js";
import { DefaultVal } from "@/utils/constantDefaultVal.js";

export const useBatchStore = defineStore("batch", {
  state: () => ({
    batches: [], // قائمة الدفعات الخام القادمة من السيرفر
    statuses: [], // حالات الدفعات المتاحة في النظام
    loading: false, // حالة التحميل العامة للستور
    error: null, // تخزين الأخطاء الناتجة عن الطلبات
  }),

  persist: {
    key: "alnour-batches", // مفتاح فريد للتخزين في المتصفح متوافق مع نظام المقرأة
    storage: sessionStorage, // نوع التخزين المطلوب
  },

  getters: {
    // جلب عدد الدفعات الكلي في النظام
    getTotalBatchesCount(state) {
      return state.batches?.length || 0;
    },

    // جلب خيارات الحالات الجاهزة مباشرة
    getStatusOptions(state) {
      return state.statuses || [];
    },

    // المعالجة الذكية والآمنة للدفعات وربطها بالحالات والتواريخ العربية
    getProcessedBatches(state) {
      return state.batches.map((batch) => {
        const {
          name,
          code,
          program,
          batch_supervisor,
          current_level,
          num_group,
          start_date,
          end_date,
          status,
          status_id,
          ...rest
        } = batch;

        // تحديد معرف الحالة بشكل مرن وحمايته
        const currentStatusId = status ?? status_id ?? null;
        
        // البحث عن اسم الحالة المقابلة من مصفوفة الـ statuses
        const foundStatus = state.statuses.find(
          (st) => String(st.id) === String(currentStatusId)
        );

        return {
          ...rest,
          name: name || "دفعة بدون اسم",
          code: code || "—",
          program: program || null,
          batch_supervisor: batch_supervisor || null,
          current_level: current_level || "المستوى الأول",
          num_group: num_group || 0,
          statusId: currentStatusId,
          
          // عرض اسم الحالة الفعلي أو إرجاع حالة مخصصة/افتراضية بشكل آمن
          statusName: foundStatus ? foundStatus.name : (batch.status_name || "حالة مخصصة"),

          // تنسيق التواريخ باللغة العربية عبر الكائن الموحد للنظام DefaultVal
          formattedStartDate: start_date ? DefaultVal.ArabicDate(start_date) : "غير محدد",
          formattedEndDate: end_date ? DefaultVal.ArabicDate(end_date) : "غير محدد",

          // الاحتفاظ بالتواريخ الخام بصيغة YYYY-MM-DD لتمريرها لحقول الإدخال (Inputs) مباشرة دون مشاكل الـ Timezone
          raw_start_date: start_date ? start_date.split("T")[0] : "",
          raw_end_date: end_date ? end_date.split("T")[0] : "",
        };
      });
    },
  },

  actions: {
    // الدالة الموحدة والموازية لتهيئة وجلب بيانات الستور عند إقلاع الواجهة
    async getBatchStoreData() {
      this.batches = [];
      this.statuses = [];
      console.log("fetching batch store data parallel...");
      
      try {
        await Promise.all([
          this.getAllBatches(),
        //   this.getBatchStatuses()
        ]);
        
        if (this.$persist) {
          this.$persist();
        }
      } catch (err) {
        console.error("فشل جلب مصفوفة بيانات الستور الموازية للدفعات:", err);
      }
    },

    // جلب كافة الدفعات التعليمية من النظام
    async getAllBatches() {
      this.loading = true;
      this.error = null;
      try {
        const { url, method } = endpoint.batches.getAllBatches; // تأكدي من مطابقة مسار الـ endpoint الخاص بكِ للـ batches
        const { data, error } = await requestData(url, method);

        if (data) {
          console.log(data, "batches fetched successfully from server");
          // التعامل مع البيانات سواء كانت مصفوفة مباشرة أو بداخل كائن نتائج (results)
          this.batches = Array.isArray(data) ? data : (data.results || []);
          return { success: true, ...data };
        }
        
        this.error = error;
        return { success: false, message: error };
      } catch (err) {
        console.error(err, "error batches data fetching");
        return { success: false, message: "فشل الاتصال بخادم النظام." };
      } finally {
        this.loading = false;
      }
    },

    // جلب كافة حالات الدفعات المسجلة بالنظام
    async getBatchStatuses() {
      try {
        const { url, method } = endpoint.batches.getAllBatches;
        const { data, error } = await requestData(url, method);

        if (data) {
          this.statuses = Array.isArray(data) ? data : (data.results || []);
          return { success: true, ...data };
        }
        
        // خطة بديلة Fallback لضمان عمل الواجهات حتى في حال غياب خادم الحالات
        if (this.statuses.length === 0) {
          this.statuses = [
            { id: 1, name: "نشط" },
            { id: 2, name: "مكتمل" },
            { id: 3, name: "مؤجل" },
          ];
        }
        return { success: false, ...error };
      } catch (err) {
        console.error("خطأ أثناء جلب حالات الدفعات:", err);
        if (this.statuses.length === 0) {
          this.statuses = [
            { id: 1, name: "نشط" },
            { id: 2, name: "مكتمل" },
            { id: 3, name: "مؤجل" },
          ];
        }
        return { success: false, message: "فشل الاستجابة من سيرفر الحالات بثبات." };
      }
    },

    // إنشاء دفعة تعليمية جديدة داخل نظام المقرأة
    async createBatch(batchData) {
      this.loading = true;
      this.error = null;
      console.log("Creating new batch with data:", batchData);

      try {
        const { url, method } = endpoint.batch.createBatch;
        const { data, error } = await requestData(url, method, batchData);

        if (data) {
          console.log(data, "Batch created successfully");
          this.batches.push(data); // تحديث المصفوفة محلياً لضمان تحديث الواجهة فوراً
          return { success: true, ...data };
        }
        
        this.error = error;
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "فشل الاتصال بخادم النظام أثناء حفظ الدفعة." };
      } finally {
        this.loading = false;
      }
    },

    // تعديل بيانات دفعة تعليمية حالية
    async updateBatch(batchId, batchData) {
      this.loading = true;
      this.error = null;
      console.log("Updating batch ID:", batchId, "with data:", batchData);

      try {
        const { url, method } = endpoint.batch.updateBatch;
        const finalUrl = `${url}${batchId}/`; // صياغة الرابط النهائي بالإلحاق المدعوم في الـ API الخاص بكِ
        const { data, error } = await requestData(finalUrl, method, batchData);

        if (data) {
          console.log(data, "Batch updated successfully");
          // تحديث الكائن المعدل داخل المصفوفة المحلية فوراً
          const index = this.batches.findIndex((b) => b.id === batchId);
          if (index !== -1) {
            this.batches[index] = data;
          }
          return { success: true, ...data };
        }
        
        this.error = error;
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "حدث خطأ غير متوقع أثناء تحديث بيانات الدفعة." };
      } finally {
        this.loading = false;
      }
    },

    // حذف دفعة تعليمية نهائياً من النظام
    async deleteBatch(batchId) {
      this.loading = true;
      try {
        const { url, method } = endpoint.batches.deleteBatch;
        const finalUrl = `${url}${batchId}/`;
        const { data, error } = await requestData(finalUrl, method);

        if (!error) {
          console.log("Batch deleted successfully from server");
          // فلترة المصفوفة محلياً لحذفها من الكروت فوراً بدون شاشات بيضاء
          this.batches = this.batches.filter((b) => b.id !== batchId);
          return { success: true, ...data };
        }
        
        this.error = error;
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "فشل تنفيذ أمر الحذف من النظام." };
      } finally {
        this.loading = false;
      }
    },

    // استيلاد وإنشاء حالة مخصصة فخرية جديدة من المودال مباشرة
    async createBatchStatus(statusData) {
      try {
        const { url, method } = endpoint.batch.createBatchStatus;
        const { data, error } = await requestData(url, method, statusData);

        if (data) {
          this.statuses.push(data);
          return { success: true, data: data };
        }
        return { success: false, message: error };
      } catch (err) {
        console.error("Error creating custom batch status", err);
        return { success: false, message: "فشل الاتصال بخادم الحالات." };
      }
    },
  },
});