<template>
     <label
      v-if="label"
      :for="forId"
      class="form-label"
    >
      {{ label }}
      <span v-if="required" class="required-star">*</span>
    </label>
</template>
<script setup>
const props = defineProps({
  label: { type: String, default: "" },
  required: { type: Boolean, default: false },
  forId: { type: String, default: "" },
})

</script>

<style scoped>


.required-star {
  color: #ef4444;
  margin-right: 4px;
}


</style>