<template>
  <div class="flex flex-col">
     <div w-full :class="['w-full h-fit grid grid-cols-8 relative',phoneStatus&&!phoneStatus?.isValid? 'border input-invalid   rounded-xl':'border-none']">
    <SelectItem
       :underselect=false
      class="col-span-2"
      :customClass="['rounded-l-none',phoneStatus&&!phoneStatus?.isValid?'border-r-0 border-b-0 border-t-0 ':' rounded-r-xl']  "
      role="combobox"
      ariaLabel="اختر مفتاح الدولة"
      :options="options"
      v-model:selected="key"
      labelKey="value"
      valueKey="dialCode"
      iconKey="icon"
    />

    <input
    type="tel"
    :required="required"
    :name="name"
    dir="ltr"

    :placeholder="phonePlaceholder"
      :class="[' rounded-r-none  py-3 col-span-6  text-end',phoneStatus&&!phoneStatus?.isValid?'border-none':''] "
      v-model="phone"
      @input="handleinput"
      @blur="handleblur"
    />
  </div>
  <p
    v-if="phoneStatus&&!phoneStatus?.isValid"
    class="error-text"
  >
    {{ phoneStatus.message }}
  </p>
  </div>
 
 
</template>

<script setup>
import Validator from "../../utils/validaion";//validation class
import { ref, computed } from "vue";
import SelectItem from "./SelectItem.vue";//select item component
import examples from 'libphonenumber-js/examples.mobile.json'
import { AsYouType, getExampleNumber } from 'libphonenumber-js'
import countriesData from "../json/counterys.json"
const props=defineProps({
  required:{type:Boolean ,default:false}
  , name:{type:String }
})
const phone = defineModel("phone"); //value of phone number field
const key = defineModel("selected");//object of selected object in select item component
const phoneStatus = defineModel("phoneStatus");// import { AsYouType } from 'libphonenumber-js'
const phonePlaceholder = computed(() => {
  try {
    if (key.value?.id) {
      const example = getExampleNumber(key.value.id, examples)
      return example
        ? example.formatNational()
        : '000 000 000'
    }
    return '000 000 000'
  } catch (e) {
    console.error(e)
    return '000 000 000'
  }
});
const validate=()=>{
return Validator.validatePhone(phone.value || "", key.value?.id,props.required)

}
const handleblur = ()=>{
  phoneStatus.value=validate()
  console.log(`${phoneStatus.value.message}`)
}
const handleinput =()=>{
  phone.value=formatPhone(phone.value)
    phoneStatus.value=validate()

}
const formatPhone = (value) => {
  if (!value) return ''

  const digitsOnly = value.replace(/\D/g, '')

  const formatter = new AsYouType(key.value?.id)

  return formatter.input(digitsOnly)
}

const options = ref(countriesData)
// contry array objects options for select  option 
// const phoneStatus = computed(() => {
//   //call methods for validate phone number
//   return Validator.validatePhone(phone.value || "", key.value?.id);
// });//to handle  error of phone number 
//make  phoneStatus  to parent component
defineExpose({
    // الآن الأب يمكنه مناداة componentRef.value.validate()
    validate: () => {
        phoneStatus.value = validate();
        console.log(phoneStatus)
        return phoneStatus.value.isValid;
    }
});
</script>
<style></style>
