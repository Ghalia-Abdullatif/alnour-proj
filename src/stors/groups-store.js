import { defineStore } from "pinia";
import { endpoint } from "@/constant/endpointurl.js";
import { requestData } from "@/Composable/useApi.js";
import { DefaultVal } from '@/utils/constantDefaultVal.js';

export const useGroupsStore = defineStore("groups", {
  state: () => ({
    groups: [],           // قائمة المجموعات الأساسية في النظام
    groupStudents: [],    // سجلات توزيع الطالبات وتسكينهن داخل المجموعات
    loading: false,       // حالة التحميل أثناء طلب البيانات من السيرفر
    error: null,          // لتخزين رسائل الأخطاء إن وجدت
  }),

  persist: {
    key: "alnour-groups",      // مفتاح التخزين المخصص للمجموعات في المتصفح
    storage: sessionStorage,   // نوع التخزين المطلوب للمقرأة (Session)
  },

  getters: {
    // جلب إجمالي عدد المجموعات المسجلة
    getTotalGroupsCount(state) {
      return state.groups?.length || 0;
    },

    // معالجة قائمة المجموعات ودمج التواريخ المنسقة باللغة العربية
    getGroupsList(state) {
      return state.groups.map(group => {
        return {
          ...group,
          // تحويل تواريخ الإنشاء والتعديل إلى نصوص عربية منسقة مظهرًا
          createdDate: DefaultVal.ArabicDate(group.created_at),
          updatedDate: DefaultVal.ArabicDate(group.updated_at),
        };
      });
    },

    // جلب الطالبات المقيدات في مجموعة محددة برقم معرّفها (groupId)
    getStudentsInGroup: (state) => (groupId) => {
      if (!state.groupStudents || state.groupStudents.length === 0) return [];
      
      // ترشيح السجلات التي تطابق معرف المجموعة المطلوبة فقط
      return state.groupStudents
        .filter(gs => String(gs.group) === String(groupId))
        .map(gs => {
          return {
            id: gs.id, // معرف سجل التسكين (Assignment ID) الحزمي للتحكم به أو الحذف
            studentId: gs.student?.id || gs.student, // معرف الطالبة الأساسي
            fullName: gs.student ? `${gs.student.first_name} ${gs.student.second_name} ${gs.student.third_name} ${gs.student.fourth_name}` : "طالبة غير معروفة",
            joinedAt: DefaultVal.ArabicDate(gs.assigned_at || gs.created_at) // تاريخ الانضمام للمجموعة منسقًا
          };
        });
    }
  },

  actions: {
    // --- 1. جلب كافة بيانات المجموعات والتسكينات وتحديثها دفعة واحدة ---
    async getGroupsStoreData() {
      this.groups = [];
      this.groupStudents = [];
      this.error = null;
      console.log("fetching groups store data...");

      await Promise.all([
        this.getAllGroups(),
        this.getGroupStudents()
      ]);

      if (this.$persist) {
        this.$persist();
      }
    },

    // --- 2. جلب قائمة المجموعات من السيرفر ---
    async getAllGroups() {
      try {
        const { url, method } = endpoint.groups.getAllGroups;
        const { data, error } = await requestData(url, method);
        
        if (data) {
          console.log(data, "groups loaded from API");
          this.groups = data;
          return { success: true, data };
        }
        return { success: false, message: error };
      } catch (err) {
        console.error("Error fetching groups:", err);
        return { success: false, message: "فشل الاتصال بخادم النظام لجلب المجموعات." };
      }
    },

    // --- 3. إنشاء مجموعة جديدة ---
    async createGroup(groupData) {
      this.loading = true;
      this.error = null;
      try {
        const { url, method } = endpoint.groups.createGroup;
        const { data, error } = await requestData(url, method, groupData);

        if (data) {
          console.log(data, "Group created successfully");
          return { success: true, ...data };
        }
        this.error = error;
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "فشل الاتصال بخادم النظام لإنشاء المجموعة." };
      } finally {
        this.loading = false;
      }
    },

    // --- 4. تعديل بيانات مجموعة (PUT) مع إلحاق الـ ID ديناميكيًا ---
    async updateGroup(groupId, groupData) {
      this.loading = true;
      this.error = null;
      try {
        const { url, method } = endpoint.groups.updateGroup;
        const finalUrl = `${url}${groupId}/`; // صياغة الرابط ديناميكيًا بإلحاق المعرف والسلاش الخلفي

        const { data, error } = await requestData(finalUrl, method, groupData);

        if (data) {
          console.log(data, "Group updated successfully");
          return { success: true, ...data };
        }
        this.error = error;
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "فشل الاتصال بخادم النظام لتحديث بيانات المجموعة." };
      } finally {
        this.loading = false;
      }
    },

    // --- 5. حذف مجموعة نهائيًا من المنظومة ---
    async deleteGroup(groupId) {
      this.loading = true;
      this.error = null;
      try {
        const { url, method } = endpoint.groups.deleteGroup;
        const finalUrl = `${url}${groupId}/`;

        const { data, error } = await requestData(finalUrl, method);

        if (!error) {
          console.log("Group deleted successfully");
          return { success: true, ...data };
        }
        this.error = error;
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "فشل الاتصال بخادم النظام لحذف المجموعة." };
      } finally {
        this.loading = false;
      }
    },

    // --- 6. جلب جميع سجلات توزيع وتسكين الطالبات ---
    async getGroupStudents() {
      try {
        const { url, method } = endpoint.groups.getGroupStudents;
        const { data, error } = await requestData(url, method);

        if (data) {
          console.log(data, "group-students assignments loaded");
          this.groupStudents = data;
          return { success: true, data };
        }
        return { success: false, message: error };
      } catch (err) {
        console.error("Error fetching group students:", err);
        return { success: false, message: "فشل الاتصال بالسيرفر لجلب تسكينات الطالبات." };
      }
    },

    // --- 7. إضافة وتسكين طالبة داخل مجموعة معينة ---
    async addStudentToGroup(assignmentData) {
      this.loading = true;
      this.error = null;
      try {
        const { url, method } = endpoint.groups.addStudentToGroup;
        const { data, error } = await requestData(url, method, assignmentData);

        if (data) {
          console.log(data, "Student added to group successfully");
          return { success: true, ...data };
        }
        this.error = error;
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "فشل الاتصال بالسيرفر لتسكين الطالبات." };
      } finally {
        this.loading = false;
      }
    },

    // --- 8. إلغاء تسكين طالبة أو حذفها من المجموعة بواسطة معرف السجل (id) ---
    async removeStudentFromGroup(assignmentId) {
      this.loading = true;
      this.error = null;
      try {
        const { url, method } = endpoint.groups.removeStudentFromGroup;
        const finalUrl = `${url}${assignmentId}/`;

        const { data, error } = await requestData(finalUrl, method);

        if (!error) {
          console.log("Student removed from group successfully");
          return { success: true, ...data };
        }
        this.error = error;
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "فشل الاتصال بالسيرفر لإلغاء تسكين الطالبات." };
      } finally {
        this.loading = false;
      }
    }
  }
});