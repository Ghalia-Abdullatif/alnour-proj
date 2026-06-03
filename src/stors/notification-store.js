// import { defineStore } from "pinia";
// import { endpoint } from "@/constant/endpointurl.js";
// import { requestData } from "@/Composable/useApi.js";
// import{getMenuByRole,getRolesDetails,getRoleDetails} from"@/utils/RolesBremeshnse.js"
// import {usePepoleStore} from"@/stors/pepole-store.js";
// export const useNotifcationStore = defineStore("notification", {
//  state: () => ({
//     notifications: [],
//  }),
//   persist: {
//     key: "notifcations", // مفتاح فريد للتخزين في المتصفح.
//     storage: sessionStorage, // نوع التخزين المطلوب (Session).
//   },
//   getters:{
//     getnotfications(state){
//       return state.notifications;

//     }

//   },
//   actions: {
//      async createNotifcation(notifcationData){
//       //by spsific role
//     this.loading = true;
//             this.error = null;
//                           console.log("update account with data:pepooole", notifcationData);

//             try {
//               console.log("add notifcation", notifcationData);
//               const { url, method } = endpoint.notifications.creatNotifications; 
//                   console.log(url,"final url for update person")
//               const { data, error } = await requestData(url, method, notifcationData);
//               console.log("Response from create notifcation API:", { data, error });
      
//               if (data) {

//                 console.log(data, "notifcation updated  successfully");
//                 // نرجع البيانات للواجهة لمعرفة ما إذا كان يجب التوجه لصفحة الـ 2FA.
//                 return { success: true, ...data };
//               }
//               this.error = error;
//               console.log(error, "Error updating account");
//               return { success: false, message: error };
//             } catch (err) {
//               return { success: false, message: "فشل الاتصال بخادم النظام." };
//             } finally {
//               this.loading = false;
//             }
//     },//get notifcation
//      async getAllnotifcations(){
//              try {
      
//             const { url, method } = endpoint.notifications.getAllNotifications;

// // 3. إرسال الطلب بالرابط الجديد
//         const { data, error } = await requestData(url, method);
//         if (data) {
//          this.notifications=data;
//           console.log(this.notifications, "notifcations from  store");
                           

//           return { success: true, ...data };

//         }
//                   return { success: false, ...error };

//       } catch (err) {
//         console.log(err, "errrror user data");
//         return { success: false, message: "فشل الاتصال بخادم النظام." ,...error};
//       } finally {
//         this.loading = false;
//       }
   
//   },
  
// //تعديل بيانات hghauhv
//     async updatenotifcation(notifiId,notificationData){
//     this.loading = true;
//             this.error = null;
//                           console.log("update account with data:notifiiiiii", notificationData,"personId",notifiId);

//             try {
//               console.log("Updating account with data:pepooole", notificationData,"idd",);
//               console.log(endpoint.notifications.updateNotification, "Endpoint details");
//               const { url, method } = endpoint.notifications.updateNotification; 
//                     const finalUrl = `${url}${notifiId}/`; 
//                   console.log(finalUrl,"final url for update person")
//               const { data, error } = await requestData(finalUrl, method, notificationData);
//               console.log("Response from create account API:", { data, error });
      
//               if (data) {
//                 console.log(data, "Account updated  successfully");
//                 // نرجع البيانات للواجهة لمعرفة ما إذا كان يجب التوجه لصفحة الـ 2FA.
//                 return { success: true, ...data };
//               }
//               this.error = error;
//               console.log(error, "Error updating account");
//               return { success: false, message: error };
//             } catch (err) {
//               return { success: false, message: "فشل الاتصال بخادم النظام." };
//             } finally {
//               this.loading = false;
//             }
//     }, async deletenotifcation(notifiId){
//            try {
//             console.log("udeletttterl" ,endpoint.notifications.deleteNotification)
//             const { url, method } = endpoint.notifications.deleteNotification;
//                   const finalUrl = `${url}${notifiId}/`; 
    
    
//             const { data, error } = await requestData(finalUrl , method);
//                           console.log("teest delete role");
    
//             if (!error) {
        
//                                  return { success: true, ...data };
    
//                 }
//                   this.error = error;
//                   console.log(error, "Error creating account");
//                   return { success: false, message: error };
              
              
//               }catch (err) {
//                   return { success: false, message: "فشل الاتصال بخادم النظام." };
//                 } finally {
//                   this.loading = false;
//                 }
              
//               },
       
// },

// })
////////////////////////////////////////////////
import { defineStore } from "pinia";
import { endpoint } from "@/constant/endpointurl.js";
import { requestData } from "@/Composable/useApi.js";
import { getMenuByRole, getRolesDetails, getRoleDetails } from "@/utils/RolesBremeshnse.js";
import { usePepoleStore } from "@/stors/pepole-store.js";

export const useNotifcationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
    loading: false,
    error: null,
  }),
  
  persist: {
    key: "notifcations", // مفتاح فريد للتخزين في المتصفح.
    storage: sessionStorage, // نوع التخزين المطلوب (Session).
  },
  
  getters: {
    getnotfications(state) {
      return state.notifications;
    },
    
    /**
     * فلترة الإشعارات محلياً بناءً على دور المستخدم الحالي (قراءة فقط من الواجهات)
     * تجلب كل إشعارات الـ Broadcast بالإضافة للإشعارات الموجهة للـ roleId الممرر
     * {"id":19,"title":"لمشرفات المجموعات","message":"تجررربه","created_at":"2026-06-03T16:52:01.206614Z","created_by":1,"is_broadcast":false,"notification_roles":[{"role_id":3,"role_code":"group_supervisor","role_name":"مشرفة المجموعة"}]}
     */
    
    getNotificationsByRole: (state) => (roleId) => {
  // إذا لم يتم تمرير دور، يتم عرض الإشعارات بالكامل كخيار احتياطي
  if (!roleId) return state.notifications;
  
  return state.notifications.filter((notif) => {
    // 1. إذا كان الإشعار بث عام للكل، يظهر فوراً
    if (notif.is_broadcast === true) return true;
    
    // 2. التحقق من وجود مصفوفة الأدوار بالاسم الصحيح القادم من السيرفر
    if (notif.notification_roles && Array.isArray(notif.notification_roles)) {
      return notif.notification_roles.some((role) => {
        // فحص مطابقة الدور سواء تم تمريره كـ id رقمي أو كـ code نصي (مثال: group_supervisor)
        return role.role_id === roleId || role.role_code === roleId;
      });
    }
    
    return false;
  });
}
  },
  
  actions: {
    /**
     * جلب وفلترة الإشعارات وتحديث الـ State بناءً على دور المستخدم
     * مفيدة جداً عند الرغبة في استدعاء الـ API وحفظ البيانات المفلترة فوراً
     */
    async fetchAndFilterNotificationsByUserRole(roleId) {
      this.loading = true;
      try {
        const res = await this.getAllnotifcations();
        if (res.success && roleId) {
          // فلترة المصفوفة الحية داخل الستور بناءً على الشرطين (برودكاست أو تطابق الدور)
          this.notifications = this.notifications.filter(
            (notif) => notif.is_broadcast === true || (notif.roles && notif.roles.includes(Number(roleId)))
          );
          return { success: true, data: this.notifications };
        }
        return res;
      } catch (err) {
        return { success: false, message: "حدث خطأ أثناء معالجة وفلترة الإشعارات." };
      } finally {
        this.loading = false;
      }
    },

    async createNotifcation(notifcationData) {
      // by specific role
      this.loading = true;
      this.error = null;
      console.log("update account with data:pepooole", notifcationData);

      try {
        console.log("add notifcation", notifcationData);
        const { url, method } = endpoint.notifications.creatNotifications; 
        console.log(url, "final url for update person");
        const { data, error } = await requestData(url, method, notifcationData);
        console.log("Response from create notifcation API:", { data, error });

        if (data) {
          console.log(data, "notifcation updated successfully");
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
    },

    async getAllnotifcations() {
      this.loading = true;
      try {
        const { url, method } = endpoint.notifications.getAllNotifications;
        const { data, error } = await requestData(url, method);
        
        if (data) {
          this.notifications = data;
          console.log(this.notifications, "notifcations from store");
          return { success: true, data: data };
        }
        return { success: false, ...error };
      } catch (err) {
        console.log(err, "errrror user data");
        return { success: false, message: "فشل الاتصال بخادم النظام.", ...error };
      } finally {
        this.loading = false;
      }
    },
    
    async updatenotifcation(notifiId, notificationData) {
      this.loading = true;
      this.error = null;
      console.log("update account with data:notifiiiiii", notificationData, "personId", notifiId);

      try {
        console.log("Updating account with data:pepooole", notificationData);
        console.log(endpoint.notifications.updateNotification, "Endpoint details");
        const { url, method } = endpoint.notifications.updateNotification; 
        const finalUrl = `${url}${notifiId}/`; 
        console.log(finalUrl, "final url for update person");
        const { data, error } = await requestData(finalUrl, method, notificationData);
        console.log("Response from create account API:", { data, error });

        if (data) {
          console.log(data, "Account updated successfully");
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
    }, 
    
    async deletenotifcation(notifiId) {
      this.loading = true;
      try {
        console.log("udeletttterl", endpoint.notifications.deleteNotification);
        const { url, method } = endpoint.notifications.deleteNotification;
        const finalUrl = `${url}${notifiId}/`; 

        const { data, error } = await requestData(finalUrl, method);
        console.log("teest delete role");

        if (!error) {
          return { success: true, ...data };
        }
        this.error = error;
        console.log(error, "Error creating account");
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "فشل الاتصال بخادم النظام." };
      } finally {
        this.loading = false;
      }
    },
  },
});