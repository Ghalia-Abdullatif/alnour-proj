import { defineStore } from "pinia";
import { endpoint } from "@/constant/endpointurl.js";
import { requestData } from "@/Composable/useApi.js";
import {DefaultVal}from'@/utils/constantDefaultVal.js'
export const usePepoleStore = defineStore("pepole", {
  state:()=>({
    users:[],// جميع الاشخاص الموجودين في النظام
    usersHasAcounts:[],//الاشخاص الذين يمتلكون حسابات  ف النظام
    acountsRoles:[],//الحسابات والادوار اللمرتبطه
    allRoles:[],//جميع الادوار المتاحة في النظام
    isLoggedIn: false, // الحالة العامة: هل المستخدم مسجل دخوله حالياً أم لا.


  }),
   persist: {
    key: "alnour-users", // مفتاح فريد للتخزين في المتصفح.
    storage: sessionStorage, // نوع التخزين المطلوب (Session).
  },
  getters: {
    getTotalUsersCount(state) {
      return state.users?.length || 0;
    },
   getUsers(state) {
  // دالة مساعدة داخلية لتحويل التاريخ (لعدم تكرار الكود)
  const formatArabicDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return state.users.map(user => {
    const { 
      first_name, 
      second_name, 
      third_name, 
      fourth_name, 
      country,
      created_at,   // استخراج التواريخ لمعالجتها
      updated_at,
      birth_date,
      ...rest 
    } = user;

    const Acount = this.getUserAcount(user.id);

    return {
      ...rest,
      // 1. معالجة الأسماء والدول
      fullName: `${first_name} ${second_name} ${third_name} ${fourth_name}`,
      countryName: country.name,
      acount: Acount,

      // 2. معالجة التواريخ (تحويلها لنصوص عربية)
      joinedDate: DefaultVal.ArabicDate(created_at),   // "٢٠ مارس ٢٠٢٦"
      lastUpdate: DefaultVal.ArabicDate(updated_at),  
      birthDay: DefaultVal.ArabicDate(birth_date),     // "١٠ أكتوبر ٢٠٠٠"
      
      // إذا أردتِ الاحتفاظ بالأصل للمقارنة أو الحسابات البرمجية
      raw_created_at: created_at 
    };
  });
},
//   getUsersWithRoles(state) {
//     return state.users.map(user => {
//       // 1. جلب بيانات الحساب الأساسية لهذا الشخص
//       const userAccountInfo = this.getUserAcount(user.id);
//       const accountId = userAccountInfo.id;

//       // 2. تصفية الأدوار المرتبطة بهذا الحساب فقط من مصفوفة acountsRoles
//       const linkedRoles = state.acountsRoles.filter(ar => ar.account === accountId);

//       // 3. ربط الأدوار ببياناتها التفصيلية (الاسم والكود) من مصفوفة allRoles
//       const detailedRoles = linkedRoles.map(lr => {
//         const roleInfo = state.allRoles.find(r => r.id === lr.role);
//         return {
//           id: lr.id,             // معرف الربط (Assignment ID)
//           roleId: lr.role,       // معرف الدور نفسه
//           name: roleInfo?.name || "دور غير معروف",
//           code: roleInfo?.code || "unknown",
//           assigned_at: DefaultVal.ArabicDate(lr.assigned_at) // تاريخ التعيين بالعربي
//         };
//       });

//       // 4. دمج كل البيانات في كائن المستخدم النهائي
//       return {
//         ...user,
//         fullName: `${user.first_name} ${user.second_name} ${user.third_name} ${user.fourth_name}`,
//         accountDetails: {
//           ...userAccountInfo,
//           roles: detailedRoles, // قائمة الأدوار كاملة
//           hasRoles: detailedRoles.length > 0
//         },
//         joinedDate: DefaultVal.ArabicDate(user.created_at),
//         birthDay: DefaultVal.ArabicDate(user.birth_date)
//       };
//     });
//   }
getRoles(state){
return  state.allRoles;
  

},

getUsersWithRoles(state) {

  return state.users.map(user => {

    // 🔥 نفس الفكرة هنا
    const found = state.usersHasAcounts?.find(u => u.person?.id === user.id);
    const acc = found?.account;

    const accountId = acc?.id;

    const linkedRoles = state.acountsRoles.filter(ar => ar.account === accountId);

    const detailedRoles = linkedRoles.map(lr => {
      const roleInfo = state.allRoles.find(r => r.id === lr.role);

      return {
        id: lr.id,
        roleId: lr.role,
        name: roleInfo?.name || "دور غير معروف",
        code: roleInfo?.code || "unknown",
        assigned_at: DefaultVal.ArabicDate(lr.assigned_at)
      };
    });

    return {
      ...user,
      fullName: `${user.first_name} ${user.second_name} ${user.third_name} ${user.fourth_name}`,
      accountDetails: {
        id: acc?.id || "—",
        email: acc?.email || DefaultVal.empty,
        roles: detailedRoles,
        hasRoles: detailedRoles.length > 0,
        is_active: this.getlogicValue(acc?.is_active, "نشط", "غير نشط"),
      }
    };
  });
}
  },
  actions: {
   getlogicValue(val, trueText, falseText){
    if (val === true) return trueText;
    if (val === false) return falseText;
    return "لا توجد"; // في حال كانت القيمة null أو undefined
  },
    getUserAcount(personId){
    //  const  requierdUser= this.usersHasAcounts.find(user=>{
    //  return  user.person.id===personId;


    //   })
    //   console.log(requierdUser,"user account in get user acount method")
    //   return requierdUser.account
  // 1. البحث عن الشخص في مصفوفة الحسابات
  const found = this.usersHasAcounts?.find(u => u.person?.id === personId);
  const acc = found?.account;

  // 2. دالة داخلية صغيرة للتحقق من وجود القيمة (null أو undefined)
 

  // 3. بناء الكائن المرجع مع فحص كل حقل على حدة
  return {
    id: acc?.id || "—",
    email: acc?.email || DefaultVal.empty,
    
    // فحص حالة النشاط: (موجودة؟ -> تحويل لنص : "لا توجد")
    is_active: DefaultVal.getlogicValue(acc?.is_active, "نشط", "غير نشط"),
    
    // فحص طلب تغيير الباسورد
    must_change_password: DefaultVal.getlogicValue(acc?.must_change_password, "نعم", "لا"),
    
    // فحص التاريخ
    date_joined: acc?.date_joined 
                 ?DefaultVal.ArabicDate(acc?.date_joined) 
                 : DefaultVal.empty
};


    },
    async getPeapleStoreData(){
      this.users = [];
  this.usersHasAcounts = [];
  this.acountsRoles = [];
  this.allRoles = [];
  console.log("fetching pepole store data...")
     await Promise.all([
    this.getAllUsersHasAcounts(),
    this.getAllAcountsRoles(),
    this.getAllRoles(),
    this.getAllusers()
  ]);
   if (this.$persist) {
           this.$persist(); 
       }
    },
    async createPerson(personData){
    this.loading = true;
            this.error = null;
                          console.log("Creating account with data:pepooole", personData);

            try {
              console.log("Creating account with data:pepooole", personData);
              console.log(endpoint.pepole.creatPerson, "Endpoint details");
              const { url, method } = endpoint.pepole.creatPerson;
              const { data, error } = await requestData(url, method, personData);
              console.log("Response from create account API:", { data, error });
      
              if (data) {
                console.log(data, "Account created successfully");
                // نرجع البيانات للواجهة لمعرفة ما إذا كان يجب التوجه لصفحة الـ 2FA.
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
    //تعديل بيانات المستخدم
    async updatePerson(PersonId,personData){
    this.loading = true;
            this.error = null;
                          console.log("update account with data:pepooole", personData,"personId",PersonId);

            try {
              console.log("Updating account with data:pepooole", personData);
              console.log(endpoint.pepole.updatePerson, "Endpoint details");
              const { url, method } = endpoint.pepole.updatePerson; 
                    const finalUrl = `${url}${PersonId}/`; 
                  console.log(finalUrl,"final url for update person")
              const { data, error } = await requestData(finalUrl, method, personData);
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
    }//deletePerson
    ,
    
    async deletePerson(PersonId){
       try {
        console.log("udeletttterl" ,endpoint.pepole.deletePerson)
        const { url, method } = endpoint.pepole.deletePerson;
              const finalUrl = `${url}${PersonId}/`; 


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
   
   
    async getAllusers(){
             try {
      
            const { url, method } = endpoint.pepole.getAllusers;

// 3. إرسال الطلب بالرابط الجديد
        const { data, error } = await requestData(url, method);
        if (data) {
          
          console.log(data, "users from pepole store");
                            this.users=data;

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
    async getAllUsersHasAcounts(){
        try {
      
            const { url, method } = endpoint.pepole.getAllusersHasAcounts;

// 3. إرسال الطلب بالرابط الجديد
        const { data, error } = await requestData(url, method);
        if (data) {
      //      if (this.$persist) {
      //      this.$persist(); 
      //  }
          console.log(data, "users from pepole store");
             this.usersHasAcounts=data;

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
     async getAllAcountsRoles(){
        try {
      
            const { url, method } = endpoint.pepole.getAllAcountsRoles;

// 3. إرسال الطلب بالرابط الجديد
        const { data, error } = await requestData(url, method);
        if (data) {
         
          console.log(data, "Acountsssss from pepole store");
          this.acountsRoles=data;
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
     async getAllRoles(){
        try {
      
            const { url, method } = endpoint.pepole.getAllRoles;

// 3. إرسال الطلب بالرابط الجديد
        const { data, error } = await requestData(url, method);
        if (data) {
         
          console.log(data, "Acountsssss from pepole store");
                            this.allRoles=data;

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
    
    //createAccount
    async createAccount(accountData){
       this.loading = true;
            this.error = null;
            try {
              console.log("Creating account with data:pepooole", accountData);
              console.log(endpoint.pepole.activateAccount, "Endpoint details");
              const { url, method } = endpoint.pepole.activateAccount;
              const { data, error } = await requestData(url, method, accountData);
              console.log("Response from create account API:", { data, error });
      
              if (data) {
                console.log(data, "Account created successfully");
                // نرجع البيانات للواجهة لمعرفة ما إذا كان يجب التوجه لصفحة الـ 2FA.
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
    async deleteAcountRole(roleId){
       try {
        console.log("udeletttterl" ,endpoint.pepole.deleteAccountRole)
        const { url, method } = endpoint.pepole.deleteAccountRole;
              const finalUrl = `${url}${roleId}/`; 


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
///////////
 async addRoleToAccount(roleData) {
      this.loading = true;
      this.error = null;
      try {
        console.log("linkk",endpoint.pepole.addAccountRole)
        const { url, method } = endpoint.pepole.addAccountRole;
        const { data, error } = await requestData(url, method, roleData);
                console.log("linkk",endpoint.pepole)


        if (data) {
                      console.log("linkk","نجحححححححححح")

         
          return { success: true, ...data };
        }
        this.error = error;
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "فشل الاتصال بخادم النظام." };
      } finally {
        this.loading = false;
      }
    },


















}});
