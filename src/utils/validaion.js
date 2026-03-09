import { parsePhoneNumberFromString, getExampleNumber } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import { messages } from '../utils/errorMessages';
export default class Validator {
  /**
   * التحقق من رقم الهاتف لدولة معينة
   */
static validatePhone(phone, countryCode = 'SD', required = false) {
    const code = countryCode.toUpperCase();
    
    // 1. التحقق من القيمة إذا كانت مطلوبة
    if (!phone || phone.trim() === "") {
      return required 
        ? { isValid: false, message: messages.valueMissing } 
        : { isValid: true, message: '' };
    }

    // 2. السماح بالأرقام والرموز المحددة فقط (النمط الذي طلبته)
    const phonePattern = /^[0-9+\s()/-]+$/;
    if (!phonePattern.test(phone)) {
      return { isValid: false, message: 'يرجى إدخال أرقام صحيحة فقط' };
    }

    // 3. استخراج الطول المتوقع للدولة من المكتبة
    let expectedLength = 9; // قيمة افتراضية للسودان مثلاً
    const example = getExampleNumber(code, examples);
    if (example) {
      expectedLength = example.nationalNumber.length;
    }

    // 4. تنظيف المدخلات للمقارنة (أرقام فقط)
    const digitsOnly = phone.replace(/\D/g, '');
    const phoneNumber = parsePhoneNumberFromString(phone, code);

    // 5. التحقق النهائي
    if (phoneNumber && phoneNumber.isValid()) {
      return { 
        isValid: true, 
        message: 'رقم صحيح', 
        formatted: phoneNumber.formatInternational() 
      };
    }

    // 6. رسالة الطول المخصصة التي طلبتها
    if (digitsOnly.length !== expectedLength) {
      return { 
        isValid: false, 
        message: `رقم الهاتف في هذه الدولة يجب أن يتكون من ${expectedLength} أرقام.` 
      };
    }

    return { isValid: false, message: 'تنسيق الرقم غير صحيح' };
  }

  /**
   * التحقق من أن النص يحتوي على حروف عربية فقط (للأسماء)
   */
  static isArabic(text) {
    if (!text) return { isValid: false, message: 'هذا الحقل مطلوب' };
    // الـ Regex الخاص بالحروف العربية والمسافات
    const arabicRegex = /^[\u0600-\u06FF\s]+$/;
    if (arabicRegex.test(text)) {
      return { isValid: true, message: '' };
    }
    return { isValid: false, message: 'يرجى إدخال الاسم بالحروف العربية فقط' };
  }

  /**
   * التحقق من البريد الإلكتروني
   */
  static isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) return { isValid: true, message: '' };
    return { isValid: false, message: 'البريد الإلكتروني غير صحيح' };
  }
  static isImage  (icon)  {
  if (typeof icon !== 'string') return false;
  // إذا كان ينتهي بامتداد صورة أو يبدأ بمسار
  return icon.match(/\.(jpeg|jpg|gif|png|svg)$/) || icon.startsWith('/') || icon.startsWith('http');
};
static formValidate(formEl){
   const fields = formEl.querySelectorAll(
      'input, select, textarea'
    )

}
validField(field){

}
}
