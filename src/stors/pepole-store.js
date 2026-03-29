import { defineStore } from "pinia";
import { endpoint } from "@/constant/endpointurl.js";
import { requestData } from "@/Composable/useApi.js";
export const usePepoleStore = defineStore("pepole", {
  actions: {
    async getPersonById(PersonId) {
      try {
        const { url, method } = endpoint.pepole.getpersonInfo;
      const finalUrl = `${url}${PersonId}/`; 

// 3. إرسال الطلب بالرابط الجديد
const { data, error } = await requestData(finalUrl, method);
        if (data) {
          console.log(data, "user from pepole store");
          return { success: true, ...data };
        }
                  return { success: false, ...error };

      } catch (err) {
        console.log(err, "errrror user data");
        return { success: false, message: "فشل الاتصال بخادم النظام." };
      } finally {
        this.loading = false;
      }
    },
  },
});
