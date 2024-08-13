<template>
  <span class="termWrap">
    <label v-show="isAll"><input type="checkbox" v-model="data.clickChecked" @click="clickChecked" /> 전체</label>
  </span>
  <span class="pickerWrap" v-show="!data.clickChecked">
    <input type="text" v-bind:style="{width: props.format == 'YYYY-MM-DD' ? '100px' : '150px'}" class="input" v-bind:id="props.name[0] + 'Picker'" v-model="props.date[0]" v-bind:name="props.name[0] + ''" readonly />
    <span class="icon pointer" v-bind:id="props.name[0] + 'Opener'">&#xf0ce;</span>
    <div v-bind:id="props.name[0] + 'Container'" class="container"></div>
  </span>
</template>
<script setup lang="ts">
/* eslint-disable no-debugger */
import DatePicker from 'tui-date-picker';
import { onMounted, ref, reactive } from 'vue';
import dateUtil from '@src/utils/dateUtil';

const emit = defineEmits(['set-start-date', 'set-end-date'])

const props = defineProps({
  name: { type: Array, required: true },
  date: { type: Array, required: false, default: [
      dateUtil.format(new Date(),'YYYY-MM-DD'),
    ]
  },
  format: { type: String, required: false },
  selectableRanges1: { type: [], required: false },
  selectableRanges2: { type: [], required: false },
  isAll: { type: Boolean, required: false, default: true },
  timer: { type: Boolean, required: false, default: false },
});

const data = reactive({
  clickChecked: props.isAll,
});

const clickChecked = () => {
  data.clickChecked = !data.clickChecked;
  if (data.clickChecked) {
    props.date[0] = '';
    emit('set-start-date', { date: props.date[0] });
  } else {
    props.date[0] = dateUtil.format(new Date(), props.format);
    emit('set-start-date', { date: props.date[0] });
  }
}

if(!props.date[0]) {
  props.date[0] = dateUtil.format(new Date(), props.format);
}

// 옵션 1
let startObject = {
  language: 'ko',
  date: props.date[0] as Date,
  input: {
    element: document.getElementById(props.name[0] + 'Picker') as HTMLElement,
  },
  selectableRanges: [[new Date(2022, 5, 30), new Date(2090, 12, 31)]], // 시작일의 경우 미래를 선택할수 없는 고정값
  openers: ['#' + props.name[0] + 'Picker', '#' + props.name[0] + 'Opener'],
};

if (props.timer) {
  Object.assign(startObject).timePicker = {
    layoutType: 'tab',
    inputType: 'spinbox'
  };
}

const setDatepick = () => {
  const startPicker = new DatePicker(document.getElementById(props.name[0] + 'Container') as any, startObject as any); // HTMLElement
  startPicker.on('open', () => {
    startPicker.setDate(new Date((props.date[0]) as string));
  });
  startPicker.on('change', () => {
    if (startPicker.getDate()) {
      emit('set-start-date', { date: dateUtil.format(startPicker.getDate(), props.format) });
    }
  });
}

onMounted(() => {
  setDatepick();
});

</script>
<style scoped>
.pickerWrap {position:relative; display:inline-block;}
.pickerWrap .icon {font-size:30px; line-height:30px; vertical-align:middle; width:30px; margin:4px 10px 0 -0; color:#aaa;}
.pickerWrap input.input {width:100px; vertical-align:middle;}
.pickerWrap div.container {position:absolute; left:0; top:39px; background:#fff; z-index:200;}
</style>
@src/utils/dateUtil
