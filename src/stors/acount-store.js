
/*
*كلاس وظيفته جلب  وتخزين بيانات المستخدم من قواعد البيانات
*
*/

import { defineStore } from "pinia";
import { endpoint } from "@/constant/endpointurl.js";
import { requestData } from "@/Composable/useApi.js";
import{getMenuByRole,getRolesDetails,getRoleDetails} from"@/utils/RolesBremeshnse.js"
import {usePepoleStore} from"@/stors/pepole-store.js"

export const useAuthStore = defineStore("auth", {
  /**
   * -------------------------------------------------------
   * الحالة (State): تمثل مخزن البيانات التفاعلي.
   * -------------------------------------------------------
   */
  state: () => ({
    accessToken: null, // رمز الوصول: يستخدم لتصريح العمليات (Authorization) في كل طلب.
    refreshToken: null, // رمز التحديث: يرسل للسيرفر عند تسجيل الخروج لإبطال الجلسة.
    roles: [], // مصفوفة الأدوار: تحدد صلاحيات المستخدم (معلم، طالب، مشرف).
    mustChangePassword: false, // حالة إجبارية: لتنبيه المستخدم بضرورة تغيير كلمة المرور.
    preferredRole: null, // الدور المختار: في حال كان للمستخدم أكثر من صلاحية.
    isLoggedIn: false, // الحالة العامة: هل المستخدم مسجل دخوله حالياً أم لا.
    user: null, // بيانات المستخدم  (الاسم، المعرف، إلخ).
    userInfo:null,//البيانات الشخصيه للمستخدم
    loading: false, // مؤشر التحميل: يستخدم لإظهار "Spinner" أثناء انتظار السيرفر.
    error: null, // حاوية الأخطاء: لتخزين وعرض الرسائل القادمة من الباكند.
    sessionRole:null,// دور الجلسة الحالية للمستخدم
    sessionpremission:null,//الصلاحيات الحالية المتاحه  للمستخدم
  }),

  /**
   * -------------------------------------------------------
   * التخزين المستمر (Persist):
   * يقوم بحفظ الحالة تلقائياً في sessionStorage لضمان عدم ضياع البيانات
   * عند تحديث الصفحة (Refresh) ومسحها تماماً عند إغلاق التبويب.
   * -------------------------------------------------------
   */
  persist: {
    key: "alnour-auth-session", // مفتاح فريد للتخزين في المتصفح.
    storage: sessionStorage, // نوع التخزين المطلوب (Session).
  },
 getters: {
    // تصحيح: نستخدم state بدلاً من this
    getEnablesRoles: (state) => {
      // نمرر مصفوفة الأدوار (IDs) للحصول على الكائنات الكاملة
      return getRolesDetails(state.roles);
    },
    getEnableBremetion: (state) => {
      return state.sessionpremission;
    },

    getCrrentRoleDetails: (state) => {
      // نستخدم sessionRole المعرف في الـ state
      return getRoleDetails(state.sessionRole);
    },
    getUserName: (state) => {
      return state.userInfo?`${state.userInfo.first_name} ${state.userInfo.second_name}` : "مستخدم غير معروف";
    },
    getCurrentRole: (state) => {
      return state.sessionRole ?getRoleDetails(state.sessionRole)  : "دور غير محدد";
    }
  },
  actions: {
    //  ميثود تهيئة الجلسة (للحصول على CSRF)
    async initSession() {
      try {
        const { url, method } = endpoint.getcrtf;
        await requestData(url, method);
        return true;
      } catch (err) {
        return false;
      }
    },
    /**
     * @param {Object} data - البيانات القادمة من استجابة السيرفر الناجحة.
     * وظيفة: تسكين البيانات في المتجر وتحديث حالة الدخول.
     */
   async finalizeLogin(data) {
      this.accessToken = data.access;
      this.refreshToken = data.refresh;
      this.roles = data.roles || [];
      this.mustChangePassword = data.must_change_password;
      this.preferredRole = data.preferred_role;
      this.isLoggedIn = true;
      if (this.$persist) {
    this.$persist(); 
       }
      await this.getUserData();
  
    },
    /***
     *
     */
  async getUserData() {
      try {
        const { url, method } = endpoint.Auth.getCurrentUser;
        const { data, error } = await requestData(url, method);
      console.log(this.accessToken,"tokennnnnnnnnnnnnnnnnnnnnnnnnnnn");
        if (data) {
          this.user = data;
          console.log(data, "user data received");

          const pepoleStore = usePepoleStore(); 

          
          const personResponse = await pepoleStore.getPersonById(data.person_id);
          
          if (personResponse.success) {
            this.userInfo = personResponse;
             console.log(this.userInfo, "Final User Info");
          return { success: true, ...data };
          }

         
        }
        
        this.error = error;
        console.log(error,"errorrrrrrrrrrrrrrrr")
        return { success: false, message: error };
      } catch (err) {
        console.log(err, "error user data");
        return { success: false, message: "فشل الاتصال بخادم النظام." };
      } finally {
        this.loading = false;
      }
    },
    /**
     * @param {Object} credentials - تحتوي على (email) و (password).
     * وظيفة: إرسال طلب الدخول الأولي والتعامل مع حالات التحقق المزدوج.
     */
    async loginUser(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const { url, method } = endpoint.Auth.Login;
        const { data, error } = await requestData(url, method, credentials);

        if (data) {
          // إذا كان الحساب لا يتطلب تحققاً مزدوجاً (2FA)، نعتمد الدخول فوراً.
          if (!data.requires_2fa) {
      
           await this.finalizeLogin(data);
           // هنا ننشئ الكي بقيمه الحالية (التي هي فارغة حالياً)
   
          }
          // نرجع البيانات للواجهة لمعرفة ما إذا كان يجب التوجه لصفحة الـ 2FA.
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

    /**
     * @param {String} code - الرمز المرسل لهاتف أو إيميل المستخدم.
     * @param {String} challengeId - المعرف الفريد لعملية التحقق الحالية.
     */
    async verify2FA(code, challengeId) {
      this.loading = true;
      try {
        const { url, method } = endpoint.Auth.Verify2FA;
        const { data, error } = await requestData(url, method, {
          code: code,
          challenge_id: challengeId,
        });

        if (data) {
          // بعد نجاح التحقق من الكود، نقوم بتخزين البيانات النهائية.
         await this.finalizeLogin(data);
          return { success: true, ...data };
        }
        return { success: false, message: error };
      } catch (err) {
        return { success: false, message: "حدث خطأ أثناء معالجة رمز التحقق." };
      } finally {
        this.loading = false;
      }
    },

    /**
     * وظيفة: تسجيل الخروج الآمن.
     * ترسل الـ Refresh Token للسيرفر لإبطاله، ثم تمسح البيانات محلياً.
     */
    async logoutUser() {
      this.loading = true;
      console.log(this.refreshToken);
      try {
        const { url, method } = endpoint.Auth.logout;

        // إرسال طلب إبطال التوكن (Token Revocation) للسيرفر.
      const { data, error }  =   await requestData(url, method, {
          refresh: this.refreshToken,
        });
        if(data){
         return { success: true, ...data };

        }
        console.log(Response,"looogoutt");
        return { success: false, message: "حدث خطأ أثناء معالجة رمز التحقق." };

      } catch (err) {
        console.warn("⚠️ تم تسجيل الخروج محلياً فقط بسبب تعذر الوصول للسيرفر.");
      } finally {
        // إعادة المتجر لحالته الافتراضية (سيقوم Persist بمسح الـ SessionStorage تلقائياً).
         this.$reset(); // يعيد كل state للقيم الافتراضية
    // optional: امسحي sessionStorage للتأكيد

    sessionStorage.removeItem("alnour-auth-session");

        if (this.router) {
    router.router.replace({ name: "Login" });

        }

    }},
   // دالة لتحديث دور الجلسة الحالي
    setCurrentRole(roleId) {
      // تصحيح: التأكد من مطابقة اسم المتغير في الـ state وهو sessionRole
      this.sessionRole = roleId;
      
      // جلب الصلاحيات بناءً على الدور وتخزينها
      const permissions = getMenuByRole(roleId);
      this.setCurrentPremission(permissions);
      
      console.log(`✅ تم اختيار دور الجلسة: ${roleId}`);
    },

    setCurrentPremission(premission) {
      this.sessionpremission = premission;
    },
    handleLoginNavigation(userData) {
    // التحقق من وجود أدوار أولاً
    const roles = userData.roles || [];

    if (userData.preferred_role) {
      // الحالة 1: دور مفضل
      this.setCurrentRole(userData.preferred_role);
      return { name: "Dashboard" };
    } 
    
    if (roles.length > 1) {
      // الحالة 2: تعدد أدوار
      return { name: "ChoseRole" };
    } 
    
    if (roles.length === 1) {
      // الحالة 3: دور واحد فقط
      this.setCurrentRole(roles[0]);
      return { name: "Dashboard" };
    }

    // حالة فشل: لا توجد أدوار
    console.error("User has no roles assigned");
    return { name: "Login" }; // أو صفحة خطأ
  },

  },
});
