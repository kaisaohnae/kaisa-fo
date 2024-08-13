<template>
  <span class="selectJusoWrap">
    <input type="text" placeholder="주소를 입력하세요" style="width:250px;" v-bind:required="required" v-model="data.addr" />
    <button type="button" @click="searchJuso" class="button3">주소검색</button>
    <div class="layerJuso" v-show="data.jusoList.length > 0 && data.active">
      <div class="close" @click="close"><span class="icon">&#xe042;</span></div>
      <ul>
        <li v-for="(o, idx) in data.jusoList" :key="idx" @click="clickJuso(o)">
          {{ o.roadAddr }}
        </li>
      </ul>
    </div>
  </span>
</template>
<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import JusoService from '../service/common/JusoService';

const emit = defineEmits(['set-addr']);
const props = defineProps({
  addr: { type: String, required: true },
  required: { type: Boolean, required: false },
  maxlength: { type: Number, required: false, default: 200 },
});

// reactive 는 수정가능한...ref 는 수정불가한...
const data = reactive({
  active: false,
  idx: 0,
  addr: props.addr,
  jusoList: [],
}) as any;

const close = () => {
  data.active = false;
}

const searchJuso = () => {
  data.active = true;
  let formData = new FormData();
	formData.append('addr', data.addr + '');
  JusoService.getJuso(formData).then(
    (res: any) => {
      if(res && res.success && res.data?.results?.juso) {
        data.jusoList = res.data.results.juso;
        if(data.jusoList.length == 0) {
          alert('결과값이 없습니다.')
        }
      } else {
        if(res.data.results.common.errorMessage != '정상') {
          alert(res.data.results.common.errorMessage);
        } else {
          alert('조회시 오류가 발생했습니다. 관리자에게 문의해주세요.');
        }
      }
    },
    (err) => {
      console.log(err);
    },
  );
}
const clickJuso = (o: any) => {
  if(o.roadAddr) {
    data.addr = o.roadAddr;
    let formData = new FormData();
    formData.append('roadAddr', o.roadAddr + '');
    formData.append('admCd', o.admCd + ''); // 행정구역코드
    formData.append('rnMgtSn', o.rnMgtSn + ''); // 도로명코드
    formData.append('udrtYn', o.udrtYn + ''); // 지하여부
    formData.append('buldMnnm', o.buldMnnm + ''); // 건물본번
    formData.append('buldSlno', o.buldSlno + ''); // 건물부번
    JusoService.getPosition(formData).then(
      (res) => {
        data.active = false;
        if(res.data) {
          data.addr = o.roadAddr;
          emit('set-addr', res.data);
        } else {
          console.log(res);
        }
      },
      (err) => {
        console.log(err);
      },
    );
  }
}
onMounted(() => {
});
</script>
<style scoped>
.selectJusoWrap {line-height:40px; position:relative;}
div.layerJuso {white-space:nowrap; display:inline-block; position:absolute; left:0; top:28px; z-index:100; width:500px;}
div.layerJuso .close {width:40px; position:absolute; right:0; top:-20px; font-size:40px;}
div.layerJuso ul {width:460px; background:#fff; border:0.5px solid #000; box-shadow:3px 3px 3px rgba(0,0,0,0.1);}
div.layerJuso ul li {width:100%; overflow:hidden; text-overflow: ellipsis; display:block; cursor: pointer; height:35px; padding:0 10px; line-height:35px; border-bottom:0.5px solid #ddd;}
div.layerJuso ul li.on {background:#000; color:#83cdff;}
div.layerJuso ul li:hover {background:#666; color:#fff;}
</style>
