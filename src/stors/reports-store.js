import { defineStore } from "pinia";
import { endpoint } from "@/constant/endpointurl.js";
import { requestData } from "@/Composable/useApi.js";
import { DefaultVal } from '@/utils/constantDefaultVal.js';

export const useReportsStore = defineStore("reports", {
  state: () => ({
    templates: [],       // قوالب التقارير (خاصة بالأدمن)
    reports: [],         // نسخ التقارير الموجهة للمجموعات (للمشرفين والأدمن)
    reportEvents: [],    // سجل الأحداث واللوقز
    loading: false,
    error: null,
  }),

  persist: {
    key: "alnour-reports",
    storage: sessionStorage,
  },

  getters: {
    // جلب القوالب منسقة مع تاريخ إنشائها
    getTemplatesList(state) {
      return state.templates.map(tpl => ({
        ...tpl,
        createdDate: DefaultVal.ArabicDate(tpl.created_at)
      }));
    },
    // تصفية التقارير المعلقة التي تحتاج إلى تعبئة بواسطة المشرف الحالي
    getPendingReports: (state) => (userId) => {
      return state.reports.filter(rep => {
        // إذا كان التقرير مرسلاً للمستخدم الحالي ولم يتم تعبئته بعد
        const isRecipient = rep.recipients?.includes(userId) || rep.recipient_user_ids?.includes(userId);
        return isRecipient && !rep.is_submitted;
      });
    }
  },

  actions: {
    // جلب كافة البيانات الأساسية للتقارير دفعة واحدة
    async getReportsStoreData() {
      this.loading = true;
      this.error = null;
      await Promise.all([
        this.getAllTemplates(),
        this.getReports()
      ]);
      this.loading = false;
    },

    // 1. جلب قوالب الأدمن
    async getAllTemplates() {
      try {
        const { url, method } = endpoint.reports.getAllTemplates;
        const { data, error } = await requestData(url, method);

        if (data) { this.templates = data; return { success: true, data }; }
        return { success: false, message: error };
      } catch (err) { return { success: false, message: "فشل جلب القوالب." }; }
    },

    // 2. إنشاء قالب جديد (أدمن)
    async createTemplate(templateData) {
      try {
        const { url, method } = endpoint.reports.createTemplate;
        const { data, error } = await requestData(url, method, templateData);
        if (data) return { success: true, data };
        return { success: false, message: error };
      } catch (err) { return { success: false }; }
    },

    // 3. إضافة سؤال داخل قالب (أدمن)
    async createTemplateQuestion(questionData) {
      try {
        const { url, method } = endpoint.reports.createTemplateQuestion;
        const { data, error } = await requestData(url, method, questionData);
        if (data) return { success: true, data };
        return { success: false, message: error };
      } catch (err) { return { success: false }; }
    },

    // 4. إضافة خيار لسؤال اختيار من متعدد (أدمن)
    async createQuestionChoice(choiceData) {
      try {
        const { url, method } = endpoint.reports.createQuestionChoice;
        const { data, error } = await requestData(url, method, choiceData);
        if (data) return { success: true, data };
        return { success: false, message: error };
      } catch (err) { return { success: false }; }
    },

    // 5. توجيه تقرير لمجموعة (أدمن)
    async createGroupReportInstance(instanceData) {
      try {
        const { url, method } = endpoint.reports.createGroupReportInstance;
        const { data, error } = await requestData(url, method, instanceData);
        if (data) return { success: true, data };
        return { success: false, message: error };
      } catch (err) { return { success: false }; }
    },

    // 6. جلب جميع التقارير الحية (المشرف والأدمن)
    async getReports() {
      try {
        const { url, method } = endpoint.reports.getAssignedReports;
        const { data, error } = await requestData(url, method);
        if (data) { this.reports = data; return { success: true, data }; }
        return { success: false, message: error };
      } catch (err) { return { success: false }; }
    },

    // 7. إرسال الإجابات وتعبئة التقرير (مشرف)
    async submitReportAnswers(answersPayload) {
      try {
        const { url, method } = endpoint.reports.submitReportAnswers;
        const { data, error } = await requestData(url, method, answersPayload);
        if (data) return { success: true, data };
        return { success: false, message: error };
      } catch (err) { return { success: false }; }
    },

    // 8. جلب تفاصيل تقرير محدد للعرض عبر الـ ID
    async getReportDetails(reportId) {
      try {
        const { url, method } = endpoint.reports.getReportDetails;
        const finalUrl = `${url}${reportId}/`;
        const { data, error } = await requestData(finalUrl, method);
        if (data) return { success: true, data };
        return { success: false, message: error };
      } catch (err) { return { success: false }; }
    }
  }
});