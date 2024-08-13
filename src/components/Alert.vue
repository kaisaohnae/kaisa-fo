<template>
  <div id="alertWrap" v-if="info">
    <div id="alert">
      <h3>{{ info.title }}</h3>
      <div>
        <p>{{ info.message }}</p>
      </div>
      <div class="btnWrap">
        <button type="button" @click="closeAlert">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAlertStore } from '../store/store.alert';

const alert = useAlertStore();

interface Info {
  title: string;
  message: string;
}
defineProps({
  info: {
    type: Object,
    required: true,
    validator: (value) => {
      const info = value as Info;
      return true;
    },
  },
});
const closeAlert = () => {
  alert.close();
}

</script>
<style>
#alertWrap {width:100%; z-index:9000; height:100%; background:rgba(0,0,0,0.3); position:fixed; left:0; top:0;}
#alert {position:fixed; z-index:9001; padding:20px 30px; width:70%; left:15%; top:30%; border-radius:5px; box-shadow:0 0 5px rgba(0,0,0,0.3); background:#fff; color:#000; text-align:center; overflow:hidden;}
#alert p {padding:20px;}
#alert.green {background-color:#9ef0c0;}
</style>
