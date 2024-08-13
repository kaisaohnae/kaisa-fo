<template>
  <Header />
  <div id="contents" v-bind:class="{menuOn : setting.menu.active}">
    <router-view />
  </div>
  <Footer />
</template>
<script setup lang="ts">
import Header from '../views/layout/Header.vue';
import Footer from '../views/layout/Footer.vue';
import { useSettingStore } from '../store/store.setting';

const setting = useSettingStore();
</script>

<style scoped>
#contents {padding:10px; background:#fff; border:1px solid #ccc; height:calc(100% - 109px); z-index:1; overflow:auto;}
</style>
