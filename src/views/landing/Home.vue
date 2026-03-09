
<!-- <script>
import { useNavigation } from '../../Composable/useNavigation'
const { goToLogin, goToDashboard, goToHome } = useNavigation()

</script> -->

<template>
    <div>
    
  </div>
    <router-view /> <!-- الصفحات الفرعية تظهر هنا -->

<button @click="goToJoinRequest"> تسجيل  الدخول</button>
  <div  class="w-full h-screen bg-green-950 text-amber-50 text-center"> الصفحة الرئيسه</div>
</template>

<script setup >


import { useNavigation } from '../../Composable/useNavigation'
const { goToLogin, goToDashboard, goToHom ,goToJoinRequest } = useNavigation()
// function goTologi(){
//     goToLogin();
// }



</script>

<style>

</style>