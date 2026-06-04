import { defineStore } from "pinia";
import { endpoint } from "@/constant/endpointurl.js";
import { requestData } from "@/Composable/useApi.js";
import { DefaultVal } from "@/utils/constantDefaultVal.js";

export const useProgramStore = defineStore("program", {
  state: () => ({
    programs: [],      // مصفوفة البرامج/المساقات
    levels: [],        // مصفوفة المستويات الدراسية
    gradeWeights: [],  // مصفوفة أوزان الدرجات
    loading: false,
    error: null,
  }),

  persist: {
    key: "alnour-programs-data",
    storage: sessionStorage,
  },

  getters: {
    getProgramsList(state) {
      return state.programs.map(prog => ({
        ...prog,
        formattedDate: prog.created_at ? DefaultVal.ArabicDate(prog.created_at) : "—"
      }));
    },
    getLevelsList(state) {
      return state.levels || [];
    },
    getGradeWeightsList(state) {
      return state.gradeWeights || [];
    }
  },

  actions: {
    // جلب كل البيانات الأساسية بالتوازي للبرامج
    async getProgramStoreData() {
      this.loading = true;
      try {
        await Promise.all([
          this.getAllPrograms(),
          this.getAllLevels(),
          this.getAllGradeWeights()
        ]);
      } catch (err) {
        console.error("خطأ في جلب بيانات البرامج التوازية:", err);
      } finally {
        this.loading = false;
      }
    },

    // ==========================================
    // 1. المساقات (Programs) APIs
    // ==========================================
    async getAllPrograms() {
      try {
        const { url, method } = endpoint.programs.getAllPrograms;
        const { data, error } = await requestData(url, method);
        if (data) {
          this.programs = Array.isArray(data) ? data : (data.results || []);
          return { success: true, data: this.programs };
        }
        this.error = error;
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "فشل جلب المساقات." };
      }
    },

    async createProgram(payload) {
      try {
        const { url, method } = endpoint.programs.createProgram || { url: "api/programs/programs/", method: "POST" };
        const { data, error } = await requestData(url, method, payload);
        if (data) {
          this.programs.push(data);
          return { success: true, data };
        }
        return { success: false, message: error };
      } catch (err) {
        return { success: false };
      }
    },

    async updateProgram(id, payload) {
      try {
        const { url, method } = endpoint.programs.updateProgram || { url: "api/programs/programs/", method: "PUT" };
        const { data, error } = await requestData(`${url}${id}/`, method, payload);
        if (data) {
          const idx = this.programs.findIndex(p => p.id === id);
          if (idx !== -1) this.programs[idx] = data;
          return { success: true, data };
        }
        return { success: false, message: error };
      } catch (err) {
        return { success: false };
      }
    },

    async deleteProgram(id) {
      try {
        const { url, method } = endpoint.programs.deleteProgram || { url: "api/programs/programs/", method: "DELETE" };
        const { error } = await requestData(`${url}${id}/`, method);
        if (!error) {
          this.programs = this.programs.filter(p => p.id !== id);
          return { success: true };
        }
        return { success: false };
      } catch (err) {
        return { success: false };
      }
    },

    // ==========================================
    // 2. المستويات الدراسية (Levels) APIs
    // ==========================================
    async getAllLevels() {
      try {
        const { url, method } = endpoint.programs.getAllLevels || { url: "api/programs/levels/", method: "GET" };
        const { data } = await requestData(url, method);
        if (data) {
          this.levels = Array.isArray(data) ? data : (data.results || []);
        }
      } catch (err) {
        console.error("خطأ في جلب المستويات:", err);
      }
    },

    async createLevel(payload) {
      try {
        const { url, method } = { url: "api/programs/levels/", method: "POST" };
        const { data } = await requestData(url, method, payload);
        if (data) { this.levels.push(data); return { success: true }; }
      } catch (err) { return { success: false }; }
    },

    async updateLevel(id, payload) {
      try {
        const { url, method } = { url: `api/programs/levels/${id}/`, method: "PUT" };
        const { data } = await requestData(url, method, payload);
        if (data) { await this.getAllLevels(); return { success: true }; }
      } catch (err) { return { success: false }; }
    },

    async deleteLevel(id) {
      try {
        const { url, method } = { url: `api/programs/levels/${id}/`, method: "DELETE" };
        await requestData(url, method);
        this.levels = this.levels.filter(l => l.id !== id);
        return { success: true };
      } catch (err) { return { success: false }; }
    },

    // ==========================================
    // 3. أوزان الدرجات (Grade Weights) APIs
    // ==========================================
    async getAllGradeWeights() {
      try {
        const { url, method } = { url: "api/programs/grade-weights/", method: "GET" };
        const { data } = await requestData(url, method);
        if (data) {
          this.gradeWeights = Array.isArray(data) ? data : (data.results || []);
        }
      } catch (err) {
        console.error("خطأ في جلب أوزان الدرجات:", err);
      }
    },

    async createGradeWeight(payload) {
      try {
        const { url, method } = { url: "api/programs/grade-weights/", method: "POST" };
        const { data } = await requestData(url, method, payload);
        if (data) { this.gradeWeights.push(data); return { success: true }; }
      } catch (err) { return { success: false }; }
    },

    async updateGradeWeight(id, payload) {
      try {
        const { url, method } = { url: `api/programs/grade-weights/${id}/`, method: "PUT" };
        const { data } = await requestData(url, method, payload);
        if (data) { await this.getAllGradeWeights(); return { success: true }; }
      } catch (err) { return { success: false }; }
    },

    async deleteGradeWeight(id) {
      try {
        const { url, method } = { url: `api/programs/grade-weights/${id}/`, method: "DELETE" };
        await requestData(url, method);
        this.gradeWeights = this.gradeWeights.filter(g => g.id !== id);
        return { success: true };
      } catch (err) { return { success: false }; }
    }
  }
});