export const DefaultVal={
empty:"لا يوجد",
getlogicValue:(val, trueText, falseText)=>{
    if (val === true) return trueText;
    if (val === false) return falseText;
    return "لا توجد"; // في حال كانت القيمة null أو undefined
  },
ArabicDate:(date)=>{
return new Date(date).toLocaleDateString('ar-EG') 
}


}