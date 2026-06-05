import { defineStore } from "pinia";
import { endpoint } from "@/constant/endpointurl.js";
import { requestData } from "@/Composable/useApi.js";

export const contrystore = defineStore("contrystore", {
  state: () => ({
    contryes: [],
   
  }),

  persist: {
    key: "country_data", // مفتاح للتخزين في المتصفح إذا رغبتِ في حفظ الحالة
    storage: sessionStorage,
  },

  getters: {
    countryId(state) {
     
    },
   
  },

  actions: {
async getallcountryes(){
    try{
                const { url, method } = endpoint.pepole.getAllcountryes;

    const { data, error } = await requestData(url, method);
        if (data) {
          this.contryes = data;
          console.log("دول المحملة في الستور بنجاح:", this.groups);
          return { success: true, data: data };
        }
        
        this.error = error;
        return { success: false, message: error };
      } catch (err) {
        console.error(err);
        return { success: false, message: "فشل الاتصال بخادم النظام لجلب الدول" };
      } finally {
        this.loading = false;
      }
}

  }})