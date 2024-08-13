<template>
  <div id="calendar">

    <table class="calendar">
      <thead>
        <th colspan="7">
          <h2><span class="icon" @click="move('prev')">&#xe046;</span><span> {{ calendar.year }} </span>년 <span> {{ calendar.month }} </span>월<span class="icon" @click="move('next')">&#xe048;</span></h2>
        </th>
      </thead>
      <thead>
        <th>일</th>
        <th>월</th>
        <th>화</th>
        <th>수</th>
        <th>목</th>
        <th>금</th>
        <th>토</th>
      </thead>
      <tbody>
        <tr>
          <td v-for="o in calendar.dateArray[0]" v-bind:class="{off : o.rsvList.length == 0}">
            {{ o.day }}
            <p v-for="i in o.rsvList">{{ i.prodNm }} : {{ i.ordStatCd }}</p>
          </td>
        </tr>
        <tr>
          <td v-for="o in calendar.dateArray[1]" v-bind:class="{off : o.rsvList.length == 0}">
            {{ o.day }}
            <p v-for="i in o.rsvList">{{ i.prodNm }} : {{ i.ordStatCd }}</p>
          </td>
        </tr>
        <tr>
          <td v-for="o in calendar.dateArray[2]" v-bind:class="{off : o.rsvList.length == 0}">
            {{ o.day }}
            <p v-for="i in o.rsvList">{{ i.prodNm }} : {{ i.ordStatCd }}</p>
          </td>
        </tr>
        <tr>
          <td v-for="o in calendar.dateArray[3]" v-bind:class="{off : o.rsvList.length == 0}">
            {{ o.day }}
            <p v-for="i in o.rsvList">{{ i.prodNm }} : {{ i.ordStatCd }}</p>
          </td>
        </tr>
        <tr>
          <td v-for="o in calendar.dateArray[4]" v-bind:class="{off : o.rsvList.length == 0}">
            {{ o.day }}
            <p v-for="i in o.rsvList">{{ i.prodNm }} : {{ i.ordStatCd }}</p>
          </td>
        </tr>
        <tr>
          <td v-for="o in calendar.dateArray[5]" v-bind:class="{off : o.rsvList.length == 0}">
            {{ o.day }}
            <p v-for="i in o.rsvList">{{ i.prodNm }} : {{ i.ordStatCd }}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import dateUtil from '@src/utils/dateUtil';
import MainService from '@src/service/auth/MainService';

//rvCalendar
const calendar = reactive({
  date: new Date(),
  year: dateUtil.format(new Date(), 'YYYY'),
  month: dateUtil.format(new Date(), 'MM'),
  dateArray: [
    [{
      day: '',
      date: '',
      rsvList: [
        { dd: '', prodNo: 0, prodNm: null, ordStatCd: null, hldNm: null, price: 0 }
      ],
    }],
  ],
});

const move = (str:string) => {
  if(str === 'prev') {
    calendar.date.setMonth(calendar.date.getMonth() - 1);
  } else {
    calendar.date.setMonth(calendar.date.getMonth() + 1);
  }
  calendar.year = dateUtil.format(calendar.date, 'YYYY');
  calendar.month = dateUtil.format(calendar.date, 'MM');
  getList();
}
const getFirstDay = () => {
  return new Date(calendar.date.getFullYear(), calendar.date.getMonth(), 1).getDay();
}
const getList = () => {
  MainService.getCalendar({ year: calendar.year, month: calendar.month }).then(
    (res) => {
      // console.log(res.data);
      let firstDay = getFirstDay();
      calendar.dateArray = [];
      let array = [];
      for (let i = 1; i < 43; i++) {
        let date = new Date(calendar.date.getFullYear(), calendar.date.getMonth()).setDate(i - firstDay);
        let YYYYMMDD = dateUtil.format(date, 'YYYY-MM-DD');
        console.log(YYYYMMDD);
        let rsvList = [];
        let idx = 0;
        for (let o of res.data) {
          if(idx > 2) {
            break;
          }
          if (o.dd == YYYYMMDD) {
            rsvList.push(o);
            idx++;
          }
        }
        array.push({
          day: dateUtil.format(date, 'D'),
          date: YYYYMMDD,
          rsvList: rsvList,
        });
        if (i % 7 == 0) {
          calendar.dateArray.push(array);
          array = [];
        }
      }

    },
    (err) => {
      console.log(err);
    },
  );
}

onMounted(() => {
  getList();
});

</script>

<style scoped>
#calendar {width: 100%;}
table.calendar {width: 100%;}
table.calendar h2 {font-size:20px; color:#333; padding:20px 0 10px 0;}
table.calendar h2 .icon {font-size:20px; color:#333;}
table.calendar th {width: 14%;text-align: center; padding:10px 0;}
table.calendar td {text-align:left; vertical-align:top; height:110px; padding:10px 0; white-space:nowrap;}
table.calendar td.off {color:#ccc; background:#f2f2f2;}
</style>
@src/utils/dateUtil
