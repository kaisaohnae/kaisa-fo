<template>
<Loading />
<Alert v-if="alert.active" :info="alert.info" />
<div id="container" v-bind:class="{menuOn : setting.menu.active}">
	<router-view />
</div>
</template>

<script setup lang="ts">
import Loading from './components/Loading.vue';
import Alert from './components/Alert.vue';
import { useAlertStore } from './store/store.alert';
import { useSettingStore } from './store/store.setting';

const alert = useAlertStore();
const setting = useSettingStore();

</script>
<style scoped>
#container {width:100%; height:100%; position:relative; background:#ddd; padding:10px;}
#container.menuOn {padding:10px 10px 10px 230px;}
</style>
