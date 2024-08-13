<template>
    <span class="termWrap" v-show="props.isTerm">
      <label v-show="isAll"><input type="checkbox" v-model="data.allChecked" @click="allChecked" /> 전체</label>
      <button type="button" class="button small gray" v-bind:class="{on: data.term == 1}" @click="term(1)">1주일</button>
      <button type="button" class="button small gray" v-bind:class="{on: data.term == 2}" @click="term(2)">3개월</button>
      <button type="button" class="button small gray" v-bind:class="{on: data.term == 3}" @click="term(3)">6개월</button>
    </span>
    <span class="pickerWrap" v-show="!data.allChecked">
      <input type="text" class="input" v-bind:style="{width: props.format == 'YYYY-MM-DD' ? '100px' : '150px'}" v-bind:id="props.name[0] + 'Picker'" v-model="props.date[0]" v-bind:name="props.name[0] + ''" readonly />
      <span class="icon pointer" v-bind:id="props.name[0] + 'Opener'">&#xf0ce;</span>
      <div v-bind:id="props.name[0] + 'Container'" class="container"></div>
    </span>
    <span class="pickerWrap" v-show="!data.allChecked">
      <input type="text" class="input" v-bind:style="{width: props.format == 'YYYY-MM-DD' ? '100px' : '150px'}" v-bind:id="props.name[1] + 'Picker'" v-model="props.date[1]" v-bind:name="props.name[1] + ''" readonly />
      <span class="icon pointer" v-bind:id="props.name[1] + 'Opener'">&#xf0ce;</span>
      <div v-bind:id="props.name[1] + 'Container'" class="container"></div>
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
  date: { type: Array, required: true },
  format: { type: String, required: false },
  selectableRanges1: { type: [], required: false },
  selectableRanges2: { type: [], required: false },
  isAll: { type: Boolean, required: false, default: true },
  isTerm: { type: Boolean, required: false, default: true },
  term: { type: Number, required: false, default: 0 },
  timer: { type: Boolean, required: false, default: false },
});

const data = reactive({
	term: props.term,
  allChecked: props.isAll,
});

const term = (n:number) => {
  data.term = n;
  let date:Date = new Date();
  switch (n) {
    case 1: // 1주일
      date.setDate(new Date().getDate() - 7);
      break;
    case 2: // 3개월
      date.setMonth(new Date().getMonth() - 3);
      break;
    case 3: // 6개월
      date.setMonth(new Date().getMonth() - 6);
      break;
    default:
      break;
  }
  data.allChecked = false;
  props.date[0] = dateUtil.format(date, props.format);
  emit('set-start-date', { date: props.date[0] });
  props.date[1] = dateUtil.format(new Date(), props.format);
  emit('set-end-date', { date: props.date[1] });
}

const allChecked = () => {
  data.term = 0;
  data.allChecked = !data.allChecked;
  if(data.allChecked) {
    props.date[0] = '';
    emit('set-start-date', { date: props.date[0] });
    props.date[1] = '';
    emit('set-end-date', { date: props.date[1] });
  } else {
    term(1);
  }
}

if(!props.date[0]) {
  props.date[0] = dateUtil.format(new Date(), props.format);
}
if(!props.date[1]) {
  props.date[1] = dateUtil.format(new Date(), props.format);
}

// 옵션 1
let startObject = {
  language: 'ko',
  date: props.date[0] as Date,
  input: {
    element: document.getElementById(props.name[0] + 'Picker') as HTMLElement,
  },
  selectableRanges: [[new Date(1090, 11, 30), new Date()]], // 시작일의 경우 미래를 선택할수 없는 고정값
  openers: ['#' + props.name[0] + 'Picker', '#' + props.name[0] + 'Opener'],
};

if (props.selectableRanges1) {
  startObject.selectableRanges = props.selectableRanges1;
}

// 옵션 2
let endObject = {
  language: 'ko',
  date: props.date[1] as Date,
  input: {
    element: document.getElementById(props.name[1] + 'Picker') as HTMLElement,
  },
  selectableRanges: [[props.date[0], new Date(2090, 11, 30)]], // 종료일경우 시작일에 따른 변동값
  openers: ['#' + props.name[1] + 'Picker', '#' + props.name[1] + 'Opener'],
};

if (props.selectableRanges2) {
  endObject.selectableRanges = props.selectableRanges2;
}

if (props.timer) {
  Object.assign(startObject).timePicker = {
    layoutType: 'tab',
    inputType: 'spinbox'
  };
  Object.assign(endObject).timePicker = {
    layoutType: 'tab',
    inputType: 'spinbox'
  };
}

const setDatepick = () => {
  const startPicker = new DatePicker(document.getElementById(props.name[0] + 'Container') as any, startObject as any); // HTMLElement
  const endPicker = new DatePicker(document.getElementById(props.name[1] + 'Container') as any, endObject as any);

  startPicker.on('open', () => {
    startPicker.setDate(new Date((props.date[0]) as string));
  });
  endPicker.on('open', () => {
    endPicker.setDate(new Date((props.date[1]) as string));
  });
  startPicker.on('change', () => {
    if (startPicker.getDate() > endPicker.getDate()) {
      endPicker.setDate(dateUtil.format(startPicker.getDate(), props.format));
    }
    endPicker.setRanges([
      [startPicker.getDate(), new Date(2090, 11, 30)] // 종료일경우 시작일에 따른 변동값
    ]);
    if(startPicker.getDate()) {
      emit('set-start-date', { date: dateUtil.format(startPicker.getDate(), props.format) });
    }
    if(endPicker.getDate()) {
      emit('set-end-date', { date: dateUtil.format(endPicker.getDate(), props.format) });
    }
  });
  endPicker.on('change', () => {
    if(startPicker.getDate()) {
      emit('set-start-date', { date: dateUtil.format(startPicker.getDate(), props.format) });
    }
    if(endPicker.getDate()) {
      emit('set-end-date', { date: dateUtil.format(endPicker.getDate(), props.format) });
    }
  });
}

onMounted(() => {
  setDatepick();
});

</script>
<style scoped>
.termWrap {display:inline-block; padding-right:5px;}
.pickerWrap {position:relative; display:inline-block;}
.pickerWrap .icon {font-size:30px; line-height:30px; vertical-align:middle; width:30px; margin:4px 10px 0 -0; color:#aaa;}
.pickerWrap input.input {width:100px; vertical-align:middle;}
.pickerWrap div.container {position:absolute; left:0; top:39px; background:#fff; z-index:200;}
</style>
@src/utils/dateUtil
