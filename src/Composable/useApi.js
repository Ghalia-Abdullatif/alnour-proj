// Composable/useApi.js

import axios from "axios";
import api from '@/Composable/axios-instance.js';

export async function fetchData(url) {

  try {

    const response = await axios.get(url);

    return {
      data: response.data,
      error: null
    };

  } catch (error) {

    return {
      data: [],
      error: error.message
    };

  }

}
//--------------------لاضافة بيانات  وتسجيل الدخول----------------------------------------------


/**
 * @param {string} url - الرابط
 * @param {string} method - نوع الطلب (POST, GET, etc.)
 * @param {object} body - البيانات المرسلة
 * @param {string} contentType - نوع المحتوى (اختياري، الافتراضي JSON)
 * @param {object} extraHeaders - أي رؤوس إضافية مثل التوكن
 */
// export async function requestData(url, method = 'GET', body = null, contentType = 'application/json', extraHeaders = {}) {
//   console.log(method);
  
//   try {
//     const response = await api({
//       url: url,
//       method: method,
//       data: body,
//       headers: {
//         'Content-Type': contentType, // تمرير الـ Content-Type من البرام
//         ...extraHeaders              // دمج باقي الـ Headers مثل Authorization
//       }
//     });

//     return {
//       data: response.data,
//       error: null
//     };

//   } catch (error) {

//     // استخراج تفاصيل الخطأ بدقة من رد الباك إند
//     const errorMessage = error.response?.data || error.message;
//     console.log(error)
    
//     return {
//       data: null,
//       error: errorMessage
//     };
//   }
// }




/**
 * دالة طلب البيانات المطورة مع معالجة شاملة للأخطاء
 */
export async function requestData(url, method = 'GET', body = null, contentType = 'application/json', extraHeaders = {}) {
  try {
    const response = await api({
      url: url,
      method: method,
      data: body,
      headers: {
        'Content-Type': contentType,
        ...extraHeaders
      }
    });

    return {
      success: true,
      data: response.data,
      error: null
    };

  } catch (error) {
    let errorMessage = "حدث خطأ غير متوقع";
    let errorType = "UNKNOWN_ERROR";

    // 1. حالة انقطاع الاتصال أو السيرفر متوقف (No Response)
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || !window.navigator.onLine) {
        errorMessage = "تعذر الاتصال بالإنترنت، يرجى التحقق من الشبكة.";
        errorType = "NETWORK_ERROR";
      } else {
        errorMessage = "لا يمكن الوصول إلى الخادم حالياً، قد يكون متوقفاً.";
        errorType = "SERVER_OFFLINE";
      }
    } 
    
    // 2. حالة رد السيرفر بخطأ (Response Error)
    else {
      const status = error.response.status;
      const serverData = error.response.data;

      switch (status) {
        case 401: // التوكن غير صالح أو انتهى وفشل الريفرش أيضاًrefershSession
        console.log("refreeesh sessionnnnnnnnnnnnnnnnnnnnnnn")
          errorMessage = "انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى.";
          errorType = "AUTH_ERROR";
           return {success: false,...error };
          // هنا عادة يتم توجيه المستخدم لصفحة Login إذا لم يقم الـ interceptor بذلك
          break;
        case 403:
          errorMessage = "ليس لديك الصلاحية للقيام بهذا الإجراء.";
          errorType = "PERMISSION_DENIED";
          break;
        case 404:
          errorMessage = "المورد المطلوب غير موجود (404).";
          errorType = "NOT_FOUND";
          break;
        case 422:
        case 400:
          errorMessage = serverData.detail || serverData.message || "بيانات المدخلات غير صحيحة.";
          errorType = "VALIDATION_ERROR";
          break;
        case 500:
          errorMessage = "خطأ داخلي في السيرفر، يرجى المحاولة لاحقاً.";
          errorType = "SERVER_ERROR";
          break;
        default:
          errorMessage = serverData.detail || "حدث خطأ أثناء معالجة الطلب.";
      }
    }

    console.error(`[${errorType}]:`, error);

    return {
      success: false,
      data: null,
      error: errorMessage,
      type: errorType, // مفيد إذا أردت عمل منطق برمجي بناءً على نوع الخطأ
      raw: error.response?.data // لإرجاع تفاصيل الخطأ كاملة من الباك اند (مثل أخطاء الفاليديشن)
    };
  }
}