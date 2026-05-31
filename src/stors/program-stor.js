import { defineStore } from "pinia";
import { endpoint } from "@/constant/endpointurl.js";
import { requestData } from "@/Composable/useApi.js";
import { DefaultVal } from "@/utils/constantDefaultVal.js";

export const useProgramStore = defineStore("program", {
  state: () => ({
    programs: [],   // مصفوفة تخزين البرامج/المساقات المجلوبة من السيرفر
    loading: false, // حالة التحميل أثناء معالجة الطلبات
    error: null,    // تخزين رسائل الأخطاء إن وجدت
  }),

  persist: {
    key: "alnour-programs-data", // مفتاح فريد لحفظ البرامج في جلسة المتصفح
    storage: sessionStorage,     // التخزين المؤقت للـ Session
  },

  getters: {
    // جلب البرامج مضافاً إليها تنسيق عربي لتاريخ الإنشاء إذا كان متوفراً (مثل created_at)
    getProgramsList(state) {
      return state.programs.map(prog => ({
        ...prog,
        formattedDate: prog.created_at ? DefaultVal.ArabicDate(prog.created_at) : "—"
      }));
    },
    // حساب عدد البرامج الإجمالي في النظام
    getTotalProgramsCount(state) {
      return state.programs?.length || 0;
    }
  },

  actions: {
    // 1. جلب جميع البرامج من السيرفر
    async getAllPrograms() {
      this.loading = true;
      this.error = null;
      try {
        const { url, method } = endpoint.programs.getAllPrograms;
        const { data, error } = await requestData(url, method);
        
        if (data) {
          this.programs = data;
          console.log(this.programs, "Programs loaded successfully from store");
          return { success: true, data };
        }
        
        this.error = error;
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "فشل الاتصال بخادم النظام أثناء جلب البرامج." };
      } finally {
        this.loading = false;
      }
    },

    // 2. إنشاء برنامج جديد
    async createProgram(programData) {
      this.loading = true;
      this.error = null;
      try {
        console.log("Creating new program with data:", programData);
        const { url, method } = endpoint.programs.createProgram;
        const { data, error } = await requestData(url, method, programData);
        
        if (data) {
          console.log(data, "Program created successfully");
          // إعادة جلب القائمة بعد الإضافة لضمان تزامن البيانات فوراً
          await this.getAllPrograms();
          return { success: true, ...data };
        }
        
        this.error = error;
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "فشل الاتصال بخادم النظام لإنشاء البرنامج." };
      } finally {
        this.loading = false;
      }
    },

    // 3. تعديل برنامج معين بواسطة الـ ID
    async updateProgram(programId, programData) {
      this.loading = true;
      this.error = null;
      try {
        console.log("Updating program ID:", programId, "with data:", programData);
        const { url, method } = endpoint.programs.updateProgram; 
        
        // دمج الـ ID مع الرابط وإضافة الـ Slash الإلزامي لـ Django ليكون مثل: /api/programs/programs/5/
        const finalUrl = `${url}${programId}/`; 
        
        const { data, error } = await requestData(finalUrl, method, programData);
        
        if (data) {
          console.log(data, "Program updated successfully");
          // تحديث القائمة لإظهار التعديلات مباشرة
          await this.getAllPrograms();
          return { success: true, ...data };
        }
        
        this.error = error;
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "فشل الاتصال بخادم النظام لتعديل البرنامج." };
      } finally {
        this.loading = false;
      }
    },

    // 4. حذف برنامج من النظام نهائياً
    async deleteProgram(programId) {
      this.loading = true;
      this.error = null;
      try {
        console.log("Deleting program ID:", programId);
        const { url, method } = endpoint.programs.deleteProgram;
        
        // دمج الـ ID مع الرابط وإضافة الـ Slash الإلزامي لـ Django
        const finalUrl = `${url}${programId}/`; 
        
        const { data, error } = await requestData(finalUrl, method);
        
        if (!error) {
          console.log("Program deleted successfully from backend");
          // تحديث المصفوفة محلياً فوراً لحذف العنصر من الواجهة دون استهلاك طلب شبكة إضافي
          this.programs = this.programs.filter(p => p.id !== programId);
          return { success: true, ...data };
        }
        
        this.error = error;
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "فشل الاتصال بخادم النظام لحذف البرنامج." };
      } finally {
        this.loading = false;
      }
    }
  }
});