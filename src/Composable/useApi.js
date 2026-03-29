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
export async function requestData(url, method = 'GET', body = null, contentType = 'application/json', extraHeaders = {}) {
  console.log(method);
  
  try {
    const response = await api({
      url: url,
      method: method,
      data: body,
      headers: {
        'Content-Type': contentType, // تمرير الـ Content-Type من البرام
        ...extraHeaders              // دمج باقي الـ Headers مثل Authorization
      }
    });

    return {
      data: response.data,
      error: null
    };

  } catch (error) {
    // استخراج تفاصيل الخطأ بدقة من رد الباك إند
    const errorMessage = error.response?.data || error.message;
    console.log(error)
    
    return {
      data: null,
      error: errorMessage
    };
  }
}