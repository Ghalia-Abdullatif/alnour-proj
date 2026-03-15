<script setup>
import { reactive, ref, computed, watch } from "vue";
import { useValidation } from "../../utils/useValidation";
import DatePicker from "../../components/global/DatePicker.vue"; // مكون FlatPicker الجاهز
import SelectItem from "../../components/global/SelectItem.vue";
import PhoneNumber from "../../components/global/PhoneNumber.vue";
import LableItem from "../../components/global/LableItem.vue";
import FieldContainer from "../../components/global/FieldContainer.vue";
import conteris from '../../components/json/counterys.json'
const props =defineProps(
    {
    puttonLabel:{ type: String, default: '' }
    }
 
)
const formRef = ref(null);
const phoneRef = ref();
const { errors, validateField, validateForm } = useValidation();

/* ================= الدول ================= */
const countries =ref(conteris);


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
const emit = defineEmits([ 'supmit'])


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
  console.log(`${!phoneRef.value.validate()}`);

  if (!validateForm(formRef.value) || !phoneRef.value.validate()){

     return;
  }
  
      emit('supmit', {name:"personData" ,message:formData} )

  alert(`'تم استلام طلبك بنح! ✅ `);
};
</script>


<template>
     <div
      class="bg-background w-full max-w-3xl rounded-[24px] md:rounded-[32px] p-5 md:p-10 shadow-2xl border border-gray-200 absolute"
    >
                <slot name="top"/>


      <form
        ref="formRef"
        @submit.prevent="handleSubmit"
        class="space-y-5 md:space-y-6"
      >

        <!-- الأسماء -->
        <div class="space-y-2 text-right">
          <LableItem
            label=" الإسم (باللغة العربية) :"
            :required="true"
          ></LableItem>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            <div
              v-for="(field, i) in [
                { name: 'firstName', placeholder: 'الإسم الأول' },
                { name: 'secondName', placeholder: 'الإسم الثاني' },
                { name: 'thirdName', placeholder: 'الإسم الثالث' },
                { name: 'fourthName', placeholder: 'الإسم الرابع' },
              ]"
              :key="i"
            >
              <FieldContainer :errors="errors" :name="field.name">
                <input
                  :name="field.name"
                  :id="field.name"
                  required
                  arabic
                  v-model="formData[field.name]"
                  @input="validateField($event.target)"
                  @blur="validateField($event.target)"
                  :placeholder="field.placeholder"
                  class="select"
                  :class="errors[field.name] ? 'input-invalid' : ''"
              /></FieldContainer>
            </div>
          </div>
        </div>

        <!-- تاريخ الميلاد -->
        <div class="grid gap-5 md:gap-6 grid-cols-1 md:grid-cols-2">
          <FieldContainer
            :errors="errors"
            :required="true"
            name="birthDate"
            label="تاريخ الميلاد :"
            fieldContainerStyle="space-y-2 text-right"
          >
            <DatePicker
              name="birthDate"
              v-model="formData.birthDate"
              placeholder="اختر تاريخ الميلاد"
              :required="true"
              :min-age="12"
              :max-age="20"
              :localerror="!!errors.birthDate"
              @error="
                (e) => {
                  if (e.message) {
                    errors[e.name] = e.message;
                  } else {
                    delete errors[e.name];
                  }
                }
              "
            />
          </FieldContainer>

          <!-- الدولة -->
          <FieldContainer
            :errors="errors"
            :required="true"
            name="country"
            label="الدولة (بلد الإقامة):"
            fieldContainerStyle="space-y-2 text-right"
          >
            <SelectItem
              ariaLabel="اختر بلد الاقامة"
              :options="countries"
              v-model:selected="formData.country"
              labelKey="value"
              valueKey="value"
              name="country"
              :required="true"
              :localError="errors.country ? true : false"
              placeholder="اختر الدولة"
              @error="(e) => (errors[e.name] = e.message)"
            />
          </FieldContainer>
        </div>
        <!-- الولاية -->
        <transition name="fade">
          <FieldContainer
            v-if="formData.country.value === 'السودان'"
            :errors="errors"
            :required="true"
            name="state"
            label="الولاية :"
            fieldContainerStyle="space-y-2 text-right"
          >
            <SelectItem
              ariaLabel="اختر الولاية"
              :options="sudanStates"
              v-model:selected="formData.state"
              labelKey="name"
              valueKey="name"
              name="state"
              :required="true"
              :localError="errors.state ? true : false"
              placeholder="اختر الولاية"
              @error="(e) => (errors[e.name] = e.message)"
            />
          </FieldContainer>
        </transition>

        <!-- باقي الحقول (البريد والهاتف والتلجرام) -->
        <FieldContainer
          :errors="errors"
          :required="true"
          name="email"
          label="البريد الإلكتروني :"
          fieldContainerStyle="space-y-2 text-right"
        >
          <input
            name="email"
            type="email"
            required
            v-model="formData.email"
            placeholder="أدخل البريد الإلكتروني"
            @input="validateField($event.target)"
            @blur="validateField($event.target)"
            class="text-center"
            :class="errors.email ? 'input-invalid' : ''"
            dir="ltr"
          />
                  <!-- الهاتف والتلجرام -->

        </FieldContainer>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <div class="space-y-2 text-right">
            <LableItem label=" رقم الهاتف :" :required="true"></LableItem>

            <div class="flex items-center">
              <PhoneNumber
                ref="phoneRef"
                v-model:selected="formData.phoneKey"
                :required="true"
                v-model:phone="formData.phone"
              ></PhoneNumber>
            </div>
          </div>

          <FieldContainer
            :errors="errors"
            :required="true"
            forId="telegram"
            name="telegram"
            label="معرف التلجرام :"
            fieldContainerStyle="space-y-2 text-right"
          >
            <input
            id="telegram"
              name="telegram"
              required
              v-model="formData.telegram"
              telegram
              @input="validateField($event.target)"
              @blur="validateField($event.target)"
              :class="errors.telegram ? 'input-invalid' : ''"
              placeholder="أدخل معرف التلجرام"
            />
          </FieldContainer>
        </div>

        <!-- الأزرار -->
        <div class="flex flex-col md:flex-row gap-4 pt-4">
          <button
            type="button"
            @click="handleSubmit"
            class="w-full btn-primary  transition-all shadow-lg active:scale-95"
          >
           {{puttonLabel}}
          </button>
  

          <button
            type="button"
            class="w-full btn-secondry transition-all"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
</template>