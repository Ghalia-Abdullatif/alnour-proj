<script setup>
import { reactive, ref, computed, watch } from "vue";
import { useValidation } from "../../utils/useValidation";
import DatePicker from "../../components/global/DatePicker.vue"; // مكون FlatPicker الجاهز
import SelectItem from "../../components/global/SelectItem.vue";
import PhoneNumber from "../../components/global/PhoneNumber.vue";
import LableItem from "../../components/global/LableItem.vue";
import FieldContainer from "../../components/global/FieldContainer.vue";
// import conteris from '../../components/json/counterys.json'
import RegesterSucces from'./RegesterSucces.vue'
import AddPerson from "./AddPerson.vue";
import PasswordField from'../../components/global/PasswordField.vue'

const formRef = ref(null);
const phoneRef = ref();
const programs= ref([
  {id:1, name:"معارج"},
    {id:2, name:"مثاني"}

])

const { errors, validateField, validateForm } = useValidation();

/* ================= الدول ================= */
// const countries =ref(conteris);

/* ================= الولايات ================= */
const sudanStates = [
  { id: 1, name: "الخرطوم" },
  { id: 2, name: "الجزيرة" },
  { id: 3, name: "البحر الأحمر" },
  { id: 4, name: "كسلا" },
  { id: 5, name: "القضارف" },
  { id: 6, name: "سنار" },
  { id: 7, name: "النيل الأبيض" },
  { id: 8, name: "النيل الأزرق" },
  { id: 9, name: "الشمالية" },
  { id: 10, name: "نهر النيل" },
  { id: 11, name: "شمال كردفان" },
  { id: 12, name: "غرب كردفان" },
  { id: 13, name: "جنوب كردفان" },
  { id: 14, name: "شمال دارفور" },
  { id: 15, name: "غرب دارفور" },
  { id: 16, name: "وسط دارفور" },
  { id: 17, name: "شرق دارفور" },
  { id: 18, name: "جنوب دارفور" },
];
const showSuccess= ref (false);

/* ================= الفورم ================= */
const formData = reactive({
  firstName: "",
  secondName: "",
  thirdName: "",
  fourthName: "",
  birthDate: "",
  country: "",
  state: "",
  email: "",
  phoneKey: { id: "SD", value: "السودان", icon: "sd", dialCode: "+249" },
  phone: "",
  telegram: "",
});
watch(formData.country,()=>{
  if(!formData.country=="السودان"){
    console.log("iiii")
    formData.state=""
  }
})
const isFormValid = computed(() => {
  return (
    Object.values(formData).every((v) => v !== "") &&
    Object.keys(errors).length === 0
  );
});

const handleSubmit = () => {
  showSuccess.value = true;
  for (data in personData){
      console.log(`${data}  استلام طلبك بنح! ✅`);

  }
  console.log(`${!phoneRef.value.validate()}`);

  formData.forEach(il=>console.log(il))
  alert(`'تم استلام طلبك بنح! ✅ `);
};
</script>
<template>
  <div
    class="min-h-screen  flex justify-center items-start py-6 px-3 md:py-10 md:px-4 font-['Tajawal']"
    dir="rtl"
  >


  <add-person puttonLabel="ارسال" @supmit="(e)=>console.log(e)">
    <template #top>
        <PasswordField/>

    <div class="text-center flex flex-col items-center gap-2  mb-6 md:mb-8">
        <h2 class="text-green-primary text-sm  md:text-3xl font-extrabold">
          طلب التسجيل بمقرأة النور الإلكترونيه
        </h2>
        <div class="w-12 h-1 bg-[#d97706] mx-auto mt-2 rounded-full"></div>
        <div class="w-24">
      اختاري البرنامج
           <!-- الدولة -->
          <FieldContainer
            :errors="errors"
            name="program"
          >
            <SelectItem
              ariaLabel="اختر بلد الاقامة"
              customClass="rounded-full bg-black"
              :options="programs"
              v-model:selected="formData.country"
              labelKey="name"
              valueKey="name"
              name="program"
              :required="true"
              :localError="errors.program ? true : false"
              placeholder="اختر الدولة"
              @error="(e) => (errors[e.name] = e.message)"
            />
          </FieldContainer>
        
            </div>
      </div>
    </template>
  </add-person>
  </div>

  <RegesterSucces 
      :is-open="showSuccess" 
      registration-code="MQ-9920"
      @close="showSuccess = false" 
    />
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
