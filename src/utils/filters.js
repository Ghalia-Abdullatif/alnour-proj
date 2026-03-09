export default class Validator {
  
  // لاحظي: لا نستخدم "=" ولا "=>" في تعريف الدالة داخل الكلاس
  static filterData(options, query, keys = []) {
    if (!options) return [];
    
    // تأكدي من استخدام الـ Optional chaining أو شرط بسيط للـ query
    const term = query ? query.toLowerCase().trim() : '';
    if (!term) return options;

    return options.filter(option => {
      // حالة 1: مصفوفة كائنات (Objects)
      if (keys.length > 0 && typeof option === 'object' && option !== null) {
        return keys.some(key => {
          const value = String(option[key] || '').toLowerCase();
          return value.includes(term);
        });
      }

      // حالة 2: مصفوفة عادية (Strings/Numbers)
      return String(option).toLowerCase().includes(term);
    });
  }
}