<template>
  <div id="main">

    <ul class="orderStateCount">
      <li v-for="o in data.orderStateCount" v-bind:class="{on : o.cdNm == '예약'}"><p class="cdNm">{{ o.cdNm }}</p><p class="cnt">{{ o.cnt }}</p></li>
    </ul>

    <h2>월별 매출현황</h2>
    <div style="width:100%; padding:10px 0 20px 0; overflow:auto;">
      <Chart :size="{ width: 1200, height: 200 }" :data="data.yearSales" :margin="{ left: 0, top: 10, right: 0, bottom: 0 }" :direction="'horizontal'" :axis="axis">
        <template #layers>
          <Grid strokeDasharray="2,2" />
          <Area :dataKeys="['rsvMon', 'sumPrice']" type="monotone" :areaStyle="{ fill: 'url(#grad)' }" />
          <Line :dataKeys="['rsvMon', 'sumPrice']" type="monotone" :lineStyle="{
            stroke: '#9f7aea'
          }" />
          <Marker :value="1000" label="Mean." color="green" strokeWidth="2" strokeDasharray="6 6" />
          <defs>
            <linearGradient id="grad" gradientTransform="rotate(90)">
              <stop offset="0%" stop-color="#be90ff" stop-opacity="1" />
              <stop offset="100%" stop-color="white" stop-opacity="0.4" />
            </linearGradient>
          </defs>
        </template>
        <template #widgets>
          <Tooltip borderColor="#48CAE4" :config="{
            pl: { color: '#9f7aea' },
          }" />
        </template>
      </Chart>
    </div>
    <div class="totalSales">총 매출: {{ data.totalSales }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, onMounted, reactive } from 'vue'
import { Responsive, Chart, Grid, Line, Pie, Tooltip } from 'vue3-charts'
import MainService from '@src/service/auth/MainService';

const data = reactive({
  yearSales: [
    { rsvMon: '01', sumPrice: 0 },
    { rsvMon: '02', sumPrice: 0 },
    { rsvMon: '03', sumPrice: 0 },
    { rsvMon: '04', sumPrice: 0 },
    { rsvMon: '05', sumPrice: 0 },
    { rsvMon: '06', sumPrice: 0 },
    { rsvMon: '07', sumPrice: 0 },
    { rsvMon: '08', sumPrice: 0 },
    { rsvMon: '09', sumPrice: 0 },
    { rsvMon: '10', sumPrice: 0 },
    { rsvMon: '11', sumPrice: 0 },
    { rsvMon: '12', sumPrice: 0 },
  ],
  orderStateCount: [{ "cnt": 0, "cdNm": "결제완료"},{ "cnt": 0, "cdNm": "취소"},{ "cnt": 0, "cdNm": "예약"},{ "cnt": 0, "cdNm": "결제취소"}],
  totalSales: 0,
});

const axis = ref({
  primary: {
    type: 'band'
  },
  secondary: {
    domain: ['dataMin', 'dataMax + 100'],
    type: 'linear',
    ticks: 8
  }
}) as any;

const setDashboard = () => {
  MainService.getDashboard({}).then(
    (res) => {
      data.yearSales = res.data.yearSales;
      data.orderStateCount = res.data.orderStateCount;
      data.totalSales = res.data.totalSales;
    },
    (err) => {
      console.log(err);
    },
  );
}
onMounted(() => {
  setDashboard();
});
</script>

<style scoped>
h2 {color:#000; font-size:14px; padding:10px 0;}
.orderStateCount {width:100%; clear:both; white-space:nowrap; text-align:center;}
.orderStateCount li {width:25%; display:inline-block; line-height:30px; height:100px; border:1px solid #ddd;}
.orderStateCount li.on {background: #fff3f3; border:1px solid #ff6666;}
.orderStateCount li .cdNm {color:#555; padding-top:10px; font-size:14px;}
.orderStateCount li .cnt {color:#333; font-size:28px; padding-top:10px; font-weight:bold;}
.totalSales {text-align:right; font-size:11px; color:#aaa;}
</style>
