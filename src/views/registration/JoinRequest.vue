<template>
  <div class="h-screen w-screen">
    <div class="bg-green-500 h-1/12 w-screen">المقدمه</div>
    <div class="h-full grid grid-cols-1 sm:grid grid-cols-2 justify-stretch">
      <div class="w-screen h-full sm:w-full">
        <div>
          <form class="w-full">
            <input type="text" v-model="firstnName"/>
            <PhoneNumber ref="phoneComponent" v-model:selected="countrKey" v-model:phone="phone"></PhoneNumber>
         
            <vue-tel-input v-model="phone"></vue-tel-input>
            <country-flag country="fr" size="small" />
       
             <SelectItem
      class=""
      role="combobox"
      ariaLabel="اختر مفتاح الدولة"
      :options="people"
      v-model:selected="key"
      labelKey="value"
      valueKey="dialCode"
      iconKey="icon"
    />
          </form>
        </div>
        <input type="date"/>
                <input type="compo"/>


        <p class="text-base font-tajawal font-bold text-golden ">لديك حساب في تالمقرأة؟ <span>معرف الحساب</span></p>
        <button class="btn-secondry" @click="handleSave">ارسال</button>
        <!-- <p>{{ contry }}</p> -->
      </div>
      <aside class="bg-green-500 w-full h-full hidden sm:block">الجانب</aside>
    </div>
  </div>
</template>
<script setup>
import CountryFlag from "vue-country-flag-next";
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
  
    import 'flatpickr/dist/flatpickr.css';
import { ref } from "vue";
// const key = defineModel(249);

const countrKey = ref({ id: "SD", value: "السودان", icon: "sd", dialCode: "+249" })
const phone =ref("");
const phoneComponent = ref("");
const firstnName=defineModel()
const key = defineModel("selected");
// const countrKey=defineModel()
// const phoneNumber=defineModel()
 const date = ref(null);

import SelectItem from "../../components/global/SelectItem.vue";
import PhoneNumber from "../../components/global/PhoneNumber.vue";

const people = ref([
  { id: "1", value: "أحمد", dialCode: "001" },
  { id: "2", value: "محمد", dialCode: "002" },
  { id: "3", value: "سارة", dialCode: "003" },
  { id: "4", value: "ليلى", dialCode: "004" },
  { id: "5", value: "يوسف", dialCode: "005" },
  { id: "6", value: "نور", dialCode: "006" },
  { id: "7", value: "علي", dialCode: "007" },
  { id: "8", value: "هالة", dialCode: "008" },
  { id: "9", value: "رامي", dialCode: "009" },
  { id: "10", value: "مريم", dialCode: "010" },
]);

// handleSwitchForms:()=>{
const handleSave = () => {
  // 3. هنا بننادي الدالة اللي عملنا لها Expose في الابن
  // بنستخدم .value لأنها ref، وبعدين اسم الدالة validate()
  const ispasic = phoneComponent.value.validate();
      console.log(phone.value)
            console.log(countrKey.value.dialCode)



  if (ispasic) {
    console.log("الرقم تمام.. كملي العملية");
  } else {
    console.log("الرقم فيه مشكلة.. وقفي العملية");
  }
};
// }
</script>

<style></style>
