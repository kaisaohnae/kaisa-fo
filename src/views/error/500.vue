<template>
  <div id="error">
    <h1><img src="@src/assets/img/common/kaisa.png" alt="" /></h1>
    <h2><strong>500</strong> Forbidden</h2>
    <p>알수 없는 에러가 발생했습니다. 관리자한테 문의해주세요.</p>
    <p><router-link to="/">홈으로</router-link></p>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
#error {width:100%; height:100%; text-align:center;}
#error h1 {padding:100px 0 20px 0;}
#error h1 img {width:200px;}
#error h2 {color:#333; font-size:40px; padding:10px 0; font-weight:bold;}
#error h2 strong {font-size:40px; color:#3e22bc;}
#error p {color:#777; padding:20px 0 10px 0; font-weight:bold;}
#error p a {font-size:20px; color:#000; text-decoration: underline;}
</style>
