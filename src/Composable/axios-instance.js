import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    withCredentials: true, // مهم جداً لإرسال واستقبال الكوكيز والـ Sessions
});

// إعدادات الـ CSRF التلقائية لـ Django
api.defaults.xsrfCookieName = 'csrftoken';
api.defaults.xsrfHeaderName = 'X-CSRFToken';

/**
 * إضافة الـ Interceptor للطلبات الصادرة
 * يقوم بجلب التوكن من الـ localStorage في كل طلب "لحظياً"
 */
api.interceptors.request.use(
    (config) => {
        const rawData = sessionStorage.getItem("alnour-auth-session");
        if (rawData) {
            const authData = JSON.parse(rawData);
            // الوصول للقيمة التفصيلية داخل النص المخزن
            const token = authData.accessToken; 
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
    // (config) => {
    //     // جلب أحدث قيمة للتوكن في لحظة إرسال الطلب
    //     const token = sessionStorage.getItem("alnour-auth-session");
    //     // localStorage.getItem("user_token");
        

    //     if (token) {
    //         // إرسال التوكن في الـ Headers بصيغة Bearer
    //         config.headers.Authorization = `Bearer ${token}`;
    //     }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;