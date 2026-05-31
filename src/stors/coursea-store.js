import { defineStore } from "pinia";
import { endpoint } from "@/constant/endpointurl.js";
import { requestData } from "@/Composable/useApi.js";
import{getMenuByRole,getRolesDetails,getRoleDetails} from"@/utils/RolesBremeshnse.js"
import {usePepoleStore} from"@/stors/pepole-store.js";
export const useNotifcationStore = defineStore("notification", {
 state: () => ({
    notifications: [],
 }),
  persist: {
    key: "notifcations", // مفتاح فريد للتخزين في المتصفح.
    storage: sessionStorage, // نوع التخزين المطلوب (Session).
  },
  getters:{
    getnotfications(state){
      return state.notifications;

    }

  },
  actions: {
     async createNotifcation(notifcationData){
      //by spsific role
    this.loading = true;
            this.error = null;
                          console.log("update account with data:pepooole", notifcationData);

            try {
              console.log("add notifcation", notifcationData);
              const { url, method } = endpoint.notifications.creatNotifications; 
                  console.log(url,"final url for update person")
              const { data, error } = await requestData(url, method, notifcationData);
              console.log("Response from create notifcation API:", { data, error });
      
              if (data) {

                console.log(data, "notifcation updated  successfully");
                // نرجع البيانات للواجهة لمعرفة ما إذا كان يجب التوجه لصفحة الـ 2FA.
                return { success: true, ...data };
              }
              this.error = error;
              console.log(error, "Error updating account");
              return { success: false, message: error };
            } catch (err) {
              return { success: false, message: "فشل الاتصال بخادم النظام." };
            } finally {
              this.loading = false;
            }
    },//get notifcation
     async getAllnotifcations(){
             try {
      
            const { url, method } = endpoint.notifications.getAllNotifications;

// 3. إرسال الطلب بالرابط الجديد
        const { data, error } = await requestData(url, method);
        if (data) {
         this.notifications=data;
          console.log(this.notifications, "notifcations from  store");
                           

          return { success: true, ...data };

        }
                  return { success: false, ...error };

      } catch (err) {
        console.log(err, "errrror user data");
        return { success: false, message: "فشل الاتصال بخادم النظام." ,...error};
      } finally {
        this.loading = false;
      }
   
  },
  
//تعديل بيانات hghauhv
    async updatenotifcation(notifiId,notificationData){
    this.loading = true;
            this.error = null;
                          console.log("update account with data:notifiiiiii", notificationData,"personId",notifiId);

            try {
              console.log("Updating account with data:pepooole", notificationData,"idd",);
              console.log(endpoint.notifications.updateNotification, "Endpoint details");
              const { url, method } = endpoint.notifications.updateNotification; 
                    const finalUrl = `${url}${notifiId}/`; 
                  console.log(finalUrl,"final url for update person")
              const { data, error } = await requestData(finalUrl, method, notificationData);
              console.log("Response from create account API:", { data, error });
      
              if (data) {
                console.log(data, "Account updated  successfully");
                // نرجع البيانات للواجهة لمعرفة ما إذا كان يجب التوجه لصفحة الـ 2FA.
                return { success: true, ...data };
              }
              this.error = error;
              console.log(error, "Error updating account");
              return { success: false, message: error };
            } catch (err) {
              return { success: false, message: "فشل الاتصال بخادم النظام." };
            } finally {
              this.loading = false;
            }
    }, async deletenotifcation(notifiId){
           try {
            console.log("udeletttterl" ,endpoint.notifications.deleteNotification)
            const { url, method } = endpoint.notifications.deleteNotification;
                  const finalUrl = `${url}${notifiId}/`; 
    
    
            const { data, error } = await requestData(finalUrl , method);
                          console.log("teest delete role");
    
            if (!error) {
        
                                 return { success: true, ...data };
    
                }
                  this.error = error;
                  console.log(error, "Error creating account");
                  return { success: false, message: error };
              
              
              }catch (err) {
                  return { success: false, message: "فشل الاتصال بخادم النظام." };
                } finally {
                  this.loading = false;
                }
              
              },
       
},

})