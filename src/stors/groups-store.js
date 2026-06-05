import { defineStore } from "pinia";
import { endpoint } from "@/constant/endpointurl.js";
import { requestData } from "@/Composable/useApi.js";

export const useGroupStore = defineStore("groupStore", {
  state: () => ({
    groups: [],
    groupStudents: [], // لحفظ سجل تسكين الطالبات داخل المجموعة الحالي
    loading: false,
    error: null,
  }),

  persist: {
    key: "groups_data", 
    storage: sessionStorage,
  },

  getters: {
    getGroups(state) {
      return state.groups;
    },
    getGroupStudentsList(state) {
      return state.groupStudents;
    }
  },

  actions: {
    /**
     * 1. جلب كافة المجموعات أو فلترتها بناءً على الدفعة
     * GET /api/groups/ أو /api/groups/?batch=id
     */
    async getAllGroups(batchId = null) {
      this.loading = true;
      this.error = null;
      try {
        let { url, method } = endpoint.groups.getAllGroups;
        
        // التوافق مع Django: إلحاق الباراميتر بشكل صحيح
        if (batchId) {
          url = `${url}?batch=${batchId}`;
        }

        const { data, error } = await requestData(url, method);
        if (data) {
          this.groups = data;
          console.log("المجموعات المحملة بنجاح:", data);
        }
        if (error) this.error = error;
      } catch (err) {
        this.error = "فشل في تحميل المجموعات التعليمية.";
      } finally {
        this.loading = false;
      }
    },

    /**
     * 2. جلب طالبات مجموعة معينة بناءً على الـ group id 
     * GET /api/groups/group-students/?group=id
     */
    async fetchStudentsByGroup(groupId) {
  this.loading = true;
  this.error = null;
  try {
    // جلب الرابط وهو: http://127.0.0.1:8000/api/groups/group-students/
    const { url, method } = endpoint.groups.getGroupStudents;
    
    // 🛠️ الدمج الصحيح: نأخذ الرابط المكتمل بالسلاش ونضيف عليه الاستعلام مباشرة
    const finalUrl = `${url}?group=${groupId}`;

    console.log("الطلب مرسل إلى الرابط:", finalUrl); // للتأكد من الصحة في الـ Console

    const { data, error } = await requestData(finalUrl, method);
    if (data) {
      this.groupStudents = Array.isArray(data) ? data : (data.results || []);
    }
    if (error) this.error = error;
  } catch (err) {
    this.error = "حدث خطأ أثناء جلب قائمة طالبات الحلقة.";
  } finally {
    this.loading = false;
  }
},

    /**
     * 3. إضافة مجموعة تعليمية جديدة داخل المقرأة
     * POST /api/groups/
     */
    async createNewGroup(groupData) {
      this.loading = true;
      try {
        const { url, method } = endpoint.groups.createGroup;
        const { data, error } = await requestData(url, method, groupData);
        if (data) {
          this.groups.push(data);
          return { success: true, data: data };
        }
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "فشل إنشاء المجموعة التعليمية." };
      } finally {
        this.loading = false;
      }
    },

    /**
     * 4. تحديث السعة الاستيعابية والبيانات الأساسية للمجموعة (PUT)
     * PUT /api/groups/{id}/
     */
    async updateGroup(groupId, updatedData) {
      this.loading = true;
      try {
        const { url, method } = endpoint.groups.updateGroup;
        // التأكد من إضافة الشرطة المائلة الثابتة في Django (Trailing Slash)
        const finalUrl = `${url}${groupId}/`;

        const { data, error } = await requestData(finalUrl, method, updatedData);
        if (data) {
          const index = this.groups.findIndex((g) => g.id === groupId);
          if (index !== -1) this.groups[index] = data;
          return { success: true, data: data };
        }
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "فشل تحديث بيانات المجموعة الفنية." };
      } finally {
        this.loading = false;
      }
    },

    /**
     * 5. تحديث جزئي للمجموعة (PATCH)
     * PATCH /api/groups/{id}/
     */
    async patchGroupData(groupId, partialData) {
      this.loading = true;
      try {
        const { url, method } = endpoint.groups.patchGroup;
        const finalUrl = `${url}${groupId}/`;

        const { data, error } = await requestData(finalUrl, method, partialData);
        if (data) {
          const index = this.groups.findIndex((g) => g.id === groupId);
          if (index !== -1) this.groups[index] = { ...this.groups[index], ...data };
          return { success: true, data: data };
        }
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "فشل التحديث الجزئي للحلقة." };
      } finally {
        this.loading = false;
      }
    },

    /**
     * 6. حذف مجموعة بشكل نهائي من المقرأة
     * DELETE /api/groups/{id}/
     */
    async deleteGroup(groupId) {
      this.loading = true;
      try {
        const { url, method } = endpoint.groups.deleteGroup;
        const finalUrl = `${url}${groupId}/`;

        const { error } = await requestData(finalUrl, method);
        if (!error) {
          this.groups = this.groups.filter((g) => g.id !== groupId);
          return { success: true };
        }
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "فشل حذف المجموعة من النظام." };
      } finally {
        this.loading = false;
      }
    },

    /**
     * 7. إضافة (تسكين) طالبة جديدة داخل حلقة
     * POST /api/groups/group-students/
     */
    async addStudentToGroup(assignmentData) {
      this.loading = true;
      try {
        const { url, method } = endpoint.groups.addStudentToGroup;
        const { data, error } = await requestData(url, method, assignmentData);
        if (data) {
          this.groupStudents.push(data);
          return { success: true, data: data };
        }
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "فشل تعيين الطالبة داخل الحلقة." };
      } finally {
        this.loading = false;
      }
    },

    /**
     * 8. إزالة (حذف) طالبة من الحلقة التعليمية (إلغاء تسكين)
     * DELETE /api/groups/group-students/{id}/
     */
    async removeStudentFromGroup(assignmentId) {
      this.loading = true;
      try {
        const { url, method } = endpoint.groups.removeStudentFromGroup;
        const finalUrl = `${url}${assignmentId}/`;

        const { error } = await requestData(finalUrl, method);
        if (!error) {
          this.groupStudents = this.groupStudents.filter((item) => item.id !== assignmentId);
          return { success: true };
        }
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "تعذر إلغاء تسكين الطالبة حالياً." };
      } finally {
        this.loading = false;
      }
    },
  },
});