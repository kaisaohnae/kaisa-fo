<template>
  <select v-model="data.value" @change="change">
    <option v-for="(o, idx) in auth.codeList[props.cd]"
      :key="idx"
      :value="o.value">
      {{ o.text }}
    </option>
  </select>
</template>
<script setup lang="ts">
/* eslint-disable no-debugger */
import { onMounted, ref, reactive } from 'vue';
import { useAuthStore } from '../store/store.auth';

const emit = defineEmits(['set-data'])

const auth = useAuthStore();

const props = defineProps({
  cd: { type: String, required: true },
  model: { type: String, required: true },
});

const data = reactive({
  value: props.model,
});

const change = () => {
  console.log(data.value);
  emit('set-data', data.value);
}

onMounted(() => {
 
});

</script>
<style scoped>
</style>
