import { reactive } from 'vue'
import { messages } from '../utils/errorMessages'



// ترتيب الأولوية
const priority = [
  'valueMissing',
  'typeMismatch',
  'tooShort',
  'tooLong',
  'patternMismatch',
  'rangeUnderflow',
  'rangeOverflow',
  'telegramInvalid',
  'arabicOnly'
]

export function useValidation() {
  const errors = reactive({})

  // تحقق من الفورم كامل
  function validateForm(formEl) {
    clearAll()
    if (!formEl || !formEl.querySelectorAll) return false

    // تحقق من الحقول الأصلية
    const fields = formEl.querySelectorAll('input, select, textarea')
    fields.forEach(field => validateField(field))

    // تحقق من hidden inputs حتى لو disabled
    fields.forEach(field => {
      if (field.type === 'hidden' && (!field.value || field.value === '')) {
        errors[field.name] = messages.valueMissing
      }
    })

    // تحقق من كل SelectItem
    const selectItems = formEl.querySelectorAll('[data-validate="select-item"]')
    selectItems.forEach(el => {
      const comp = el.__vueParentComponent?.proxy
      if (comp && typeof comp.validate === 'function') {
        comp.validate() // كل SelectItem يتحقق من نفسه
      }
    })

    return Object.keys(errors).length === 0
  }

  // تحقق من حقل واحد
  function validateField(field) {
    const name = field.name
    if (!name) return

    // تحقق من hidden input بشكل صريح
    if (field.type === 'hidden' && (!field.value || field.value === '')) {
      errors[name] = messages.valueMissing
      return
    }
   if (field.hasAttribute('telegram')&& !(field.value === '')) {
      // نزيل @ إذا وجدت للتحقق من النص
      // const cleanValue = field.value.startsWith('@') ?field.value.slice(1) : field.value
      
      // النمط: يبدأ بحرف إنجليزي [a-zA-Z] ثم يتبعه حروف أو أرقام أو _ [a-zA-Z0-9_]
      // الطول الإجمالي بين 5 و 32 حرفاً
      const telegramRegex = /^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/
      
      if (!field.value.startsWith('@')||!telegramRegex.test(field.value)) {
        errors[name] = messages.telegramInvalid
        
        return
      }
    }
    // تحقق أساسي من HTML validity
    if (field.checkValidity()) {
      // تحقق إضافي للخاصية "arabic" للنصوص
      if (field.type === 'text' && field.hasAttribute('arabic')) {
        if (!/^[\u0600-\u06FF\s]+$/.test(field.value)) {
          errors[name] = messages.arabicOnly
          return
        }
      }
      delete errors[name]
      return
    }

    // ترتيب الأولوية لرسائل الخطأ
    for (const rule of priority) {
      if (rule === 'arabicOnly') continue // تم التحقق سابقاً
      if (field.validity[rule]) {
        errors[name] = messages[rule]
        break
      }
    }
  }

  // مسح خطأ لحقل محدد
  function clearField(name) {
    delete errors[name]
  }

  // مسح كل الأخطاء
  function clearAll() {
    Object.keys(errors).forEach(k => delete errors[k])
  }

  // تحقق من مجموعة SelectItem خارجيًا إذا حبيت
  function validateSelectItems(formEl) {
    if (!formEl) return true
    const selectItems = formEl.querySelectorAll('[data-validate="select-item"]')
    let allValid = true
    selectItems.forEach(el => {
      const comp = el.__vueParentComponent?.proxy
      if (comp && typeof comp.validate === 'function') {
        const valid = comp.validate()
        if (!valid) allValid = false
      }
    })
    return allValid
  }

  return {
    errors,
    validateForm,
    validateField,
    validateSelectItems,
    clearField,
    clearAll
  }
}