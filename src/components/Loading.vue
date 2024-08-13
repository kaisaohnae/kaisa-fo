<template>
  <div id="loading" v-if="loading.progress">
    <div class="loadingCircle" v-if="loading.active">
      <svg viewBox="0 0 100 100">
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="0" stdDeviation="0.5" />
          </filter>
        </defs>
        <circle id="spinner" cx="50" cy="50" r="45" style="
          fill:transparent;
          stroke:#3e22bc;
          stroke-width:8px;
          stroke-linecap:round;
          filter:url(#shadow);
        " />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLoadingStore } from '../store/store.loading';

const loading = useLoadingStore();
</script>
<style>
#loading {width:100%; height:100%; position:fixed; left:0; top:0; background:rgba(0,0,0,0); z-index:9000;}
#loading .loadingCircle {width:100px; height:100px; position:fixed; left:50%; top:50%; margin:-50px 0 0 -50px;}
@keyframes animation {
  0% {
    stroke-dasharray: 2 98;
    stroke-dashoffset: -105;
  }
  50% {
    stroke-dasharray: 80 10;
    stroke-dashoffset: -160;
  }
  100% {
    stroke-dasharray: 2 98;
    stroke-dashoffset: -200;
  }
}
#spinner {
  transform-origin: center;
  animation-name: animation;
  animation-duration: 1.2s;
  animation-timing-function: cubic-bezier;
  animation-iteration-count: infinite;
}
</style>
