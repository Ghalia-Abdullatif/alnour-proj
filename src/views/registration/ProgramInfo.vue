<template>
    <div class="card">
        <!-- <div class="img"><img :src="image" alt="لا توجد صورة" /></div>
        <p class="titp">برنامج {{ title }}</p>
        <p class="dis">هو برنامج للحفظ في عامين</p>
        <p class="det">وجهين كل الحلقة</p>
        <p class="det">ثلاث حلقات اسبوعيا</p> -->
        ,,,,,,,,,,,,,,
    </div>
</template>
<script setup>
defineProps({
    // program:{}
})
    
//  getImage()=>{
//     try {
//       // نستخدم require لتحويل النص إلى مسار حقيقي يفهمه Webpack
//       // نمرر this.image الذي يأتي من الـ Props
//       return require(`${this.image}`);
//     } catch (e) {
//       // في حال لم يجد المسار المكتوب في الـ JSON
//       console.warn("الصورة غير موجودة في المسار: " + this.image);
//       return "https://via.placeholder.com/90"; // رابط صورة احتياطية
//     }
  

// }
// ;


</script>
<style scoped>
.card{
    width:fit-content;
    background-color: rgb(253, 247, 247);
    box-shadow: 0px 0px 3px #888;
    padding:30px 40px;
    margin:20px;
    display:flex;
    flex-direction:column;
    gap:10px;
    justify-content:center;
    align-items: center;
}
.titp{
    font-size:18px;
    font-weight: bold;
    color:rgb(37, 37, 37)
}
.dis{
        font-size:1rem;

    color:rgb(63, 63, 63)
}
p{
font-size: 14px;
color:rgb(253, 241, 220);
}
img{
    height:90px;
    width:90px;
}
.img{
    width:fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: bisque;
    width:100px;
    height: 100px;
    border-radius: 100%;
}
.det{
    width:120px;
    border-radius: 10px;
    padding: 8px 10px;
    background-color: rgb(88, 75, 51);
}
</style>
