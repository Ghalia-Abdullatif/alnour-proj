// import axios from 'axios';

// const api = axios.create({
//     baseURL: 'http://127.0.0.1:8000/',
//     withCredentials: true, // مهم جداً لإرسال واستقبال الكوكيز والـ Sessions
// });

// // إعدادات الـ CSRF التلقائية لـ Django
// api.defaults.xsrfCookieName = 'csrftoken';
// api.defaults.xsrfHeaderName = 'X-CSRFToken';

// /**
//  * إضافة الـ Interceptor للطلبات الصادرة
//  * يقوم بجلب التوكن من الـ localStorage في كل طلب "لحظياً"
//  */
// api.interceptors.request.use(
//     (config) => {
//         const rawData = sessionStorage.getItem("alnour-auth-session");
//         if (rawData) {
//             const authData = JSON.parse(rawData);
//             // الوصول للقيمة التفصيلية داخل النص المخزن
//             const token = authData.accessToken; 
//             if (token) {
//                 config.headers.Authorization = `Bearer ${token}`;
//             }
//         }
//     // (config) => {
//     //     // جلب أحدث قيمة للتوكن في لحظة إرسال الطلب
//     //     const token = sessionStorage.getItem("alnour-auth-session");
//     //     // localStorage.getItem("user_token");
        

//     //     if (token) {
//     //         // إرسال التوكن في الـ Headers بصيغة Bearer
//     //         config.headers.Authorization = `Bearer ${token}`;
//     //     }
//     console.log(config, "intercepted request config")
        
//         return config;
//     },
//     (error) => {

//         console.log("exiiiiiiiiiossssss",error)
//         return Promise.reject(error);
//     }
// );

// export default api;
// import axios from 'axios';

// const api = axios.create({
//     baseURL: 'http://127.0.0.1:8000/',
//     withCredentials: true,
// });
//  api.defaults.xsrfCookieName = 'csrftoken';
// api.defaults.xsrfHeaderName = 'X-CSRFToken';

// // --- Interceptor للردود (الاستجابة) ---
// api.interceptors.response.use(
//     (response) => response, // إذا الطلب ناجح، مرره كما هو
//     async (error) => {
//         const originalRequest = error.config; // هنا "الطلب القديم" بكل بياناته

//         // 1. الشرط: هل الخطأ 401؟ وهل هو بسبب التوكن؟ وهل لم نحاول الإعادة بعد؟
//         if (
//             error.response?.status === 401 && 
//             error.response.data?.code === "token_not_valid" && 
//             !originalRequest._retry
//         ) {
//             originalRequest._retry = true; // نضع علامة "تمت المحاولة" لمنع اللوب اللانهائي

//             try {
//                 console.log("🔄 جاري تجديد التوكن وإعادة الطلب...");

//                 // 2. جلب الريفرش توكن من السيسشن
//                 const rawData = sessionStorage.getItem("alnour-auth-session");
//                 if (!rawData) throw new Error("No session");
//                 const authData = JSON.parse(rawData);

//                 // 3. طلب التوكن الجديد (نستخدم axios العادي وليس api لتجنب التعليق)
//                 const res = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
//                     refresh: authData.refreshToken
//                 });

//                 if (res.status === 200) {
//                     const newAccessToken = res.data.access;

//                     // 4. تحديث البيانات في السيسشن
//                     authData.accessToken = newAccessToken;
//                     sessionStorage.setItem("alnour-auth-session", JSON.stringify(authData));

//                     // 5. تحديث التوكن في "الطلب القديم" (originalRequest)
//                     originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

//                     // 6. السحر هنا: إعادة تنفيذ الطلب القديم وإرجاع نتيجته
//                     return api(originalRequest); 
//                 }
//             } catch (refreshError) {
//                 // إذا فشل الريفرش نفسه (المستخدم لازم يسجل دخول)
//                 console.error("❌ فشل التجديد، يجب تسجيل الدخول مجدداً");
//                 sessionStorage.removeItem("alnour-auth-session");
//                 window.location.href = "/login";
//                 return Promise.reject(refreshError);
//             }
//         }

//         // إذا كان الخطأ ليس له علاقة بالتوكن، نمرر الخطأ كما هو
//         return Promise.reject(error);
//     }
// );

// export default api;


import axios from 'axios';

/**
 * إنشاء نسخة مخصصة من مكتبة Axios بإعدادات عامة للمشروع
 */
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/', // المسار الأساسي لواجهة برمجة التطبيقات
    withCredentials: true,             // السماح بإرسال واستقبال ملفات تعريف الارتباط (Cookies) للجلسات
});

/**
 * إعدادات الحماية من هجمات تزوير الطلبات عبر المواقع (CSRF) المتوافقة مع إطار عمل Django
 */
api.defaults.xsrfCookieName = 'csrftoken';
api.defaults.xsrfHeaderName = 'X-CSRFToken';

/**
 * مُعترض الطلبات الصادرة (Request Interceptor)
 * الوظيفة: حقن رمز الدخول (Access Token) في ترويسة كل طلب قبل إرساله إلى الخادم
 */
api.interceptors.request.use(
    (config) => {
        // استخراج بيانات المصادقة المخزنة في ذاكرة الجلسة للمتصفح
        const rawData = sessionStorage.getItem("alnour-auth-session");
        
        if (rawData) {
            const authData = JSON.parse(rawData);
            const token = authData.accessToken;
            
            // إذا وُجد رمز الدخول، يتم تضمينه في ترويسة التفويض بصيغة Bearer
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config; // تمرير الإعدادات المحدثة لإتمام إرسال الطلب
    },
    (error) => {
        // التعامل مع أخطاء إعداد الطلب قبل وصوله للخادم
        return Promise.reject(error);
    }
);

/**
 * مُعترض الاستجابات الواردة (Response Interceptor)
 * الوظيفة: مراقبة الأخطاء ومعالجة انتهاء صلاحية الرموز تلقائياً (Silent Refresh)
 */
api.interceptors.response.use(
    (response) => response, // في حال نجاح الاستجابة، يتم تمرير البيانات مباشرة
    async (error) => {
        const originalRequest = error.config; // الاحتفاظ بنسخة من تفاصيل الطلب الأصلي الذي تعثر

        /**
         * التحقق من شروط إعادة المحاولة:
         * 1. أن يكون رمز الخطأ 401 (غير مصرح به).
         * 2. أن يؤكد الخادم أن الرمز غير صالح (token_not_valid).
         * 3. التأكد من أن هذا الطلب لم يخضع لمحاولة إعادة مسبقة لتجنب التكرار اللانهائي.
         */
        if (
            error.response?.status === 401 && 
            error.response.data?.code === "token_not_valid" && 
            !originalRequest._retry
        ) {
            originalRequest._retry = true; // وسم الطلب بأنه قيد إعادة المحاولة

            try {
                console.log("🔄 بدأت عملية تجديد رمز الدخول تلقائياً...");

                const rawData = sessionStorage.getItem("alnour-auth-session");
                if (!rawData) throw new Error("بيانات الجلسة غير متوفرة");
                
                const authData = JSON.parse(rawData);
                const refreshToken = authData.refreshToken;

                /**
                 * إرسال طلب مستقل لتجديد رمز الدخول باستخدام (Refresh Token)
                 * ملاحظة: نستخدم نسخة axios الخام لتجنب تداخل المُعترضات مع طلب التجديد نفسه
                 */
                const res = await axios.post('http://127.0.0.1:8000/api/accounts/auth/token/refresh/', {
                    refresh: refreshToken
                });

                if (res.status === 200) {
                    const newAccessToken = res.data.access;

                    // تحديث رمز الدخول الجديد في ذاكرة التخزين المحلية للجلسة
                    authData.accessToken = newAccessToken;
                    sessionStorage.setItem("alnour-auth-session", JSON.stringify(authData));

                    // تحديث ترويسة الطلب الأصلي برمز الدخول الجديد المستلم
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    // إعادة تنفيذ الطلب الأصلي وإرجاع نتيجته النهائية للمستخدم
                    console.log("✅ تم تجديد الرمز وإعادة تشغيل الطلب المتعثر بنجاح.");
                    return api(originalRequest); 
                }
            } catch (refreshError) {
                /**
                 * في حال فشل عملية التجديد (مثلاً انتهاء صلاحية رمز التجديد نفسه):
                 * يتم تنظيف بيانات الجلسة وتوجيه المستخدم قسرياً لصفحة تسجيل الدخول
                 */
                console.error("❌ فشلت محاولة التجديد: يجب إعادة تسجيل الدخول");
                sessionStorage.removeItem("alnour-auth-session");
                
                // if (window.location.pathname !== '/auth/login') {
                //     window.location.href = "/auth/login";
                // }
                return Promise.reject(refreshError);
            }
        }

        // إرجاع أي أخطاء أخرى (مثل 400 أو 500) لمعالجتها في واجهة الاستخدام
        return Promise.reject(error);
    }
);

export default api;