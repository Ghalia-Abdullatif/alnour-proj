import { createApp } from 'vue'
import './css/style.css'
import'./css/normalize.css'
import'bootstrap-icons/font/bootstrap-icons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { createPinia } from 'pinia'
import router from './router'
import VueTelInput from 'vue-tel-input';
  import 'flatpickr/dist/flatpickr.css';
    // theme is optional
    // try more themes at - https://flatpickr.js.org/themes/
    import 'flatpickr/dist/themes/material_blue.css';
    // localization is optional

import 'vue-tel-input/vue-tel-input.css';


import App from './App.vue'

// إنشاء التطبيق
const app = createApp(App)

// إنشاء Pinia
const pinia = createPinia()

// إضافة Pinia قبل mount
app.use(pinia)
// ربط الراوتر
app.use(router)
app.use(VueTelInput);



// تثبيت التطبيق على DOM
app.mount('#app')