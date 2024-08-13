<template>
  <span class="selectCompanyWrap">
    <!-- 사업자 자동완성 : @input 은 v-model 을 사용할경우 한글은 한템포가 느리기때문에 e.target.value 를 사용 -->
    <input type="text" class="cmpId" placeholder="업체ID를 입력하세요" v-bind:required="required" v-model="data.cmpId" @input="inputCompany" @focusout="focusOut" @keydown="clickCompany($event)" />
    <div class="layerCompany" v-show="data.active && data.companyList.length > 0">
      <ul>
        <li v-for="(o, idx) in data.searchList" :key="idx" v-bind:class="[data.idx == idx ? 'on' : '']" @click="clickCompany(o)">
          {{ o.cmpId }}
        </li>
      </ul>
    </div>
  </span>
</template>
<script setup lang="ts">
import { onMounted, ref, reactive, popScopeId } from 'vue';
import { useAuthStore } from '../store/store.auth';

const auth = useAuthStore();
const emit = defineEmits(['set-company']);

const props = defineProps({
  cmpId: { type: String, required: false },
  required: { type: Boolean, required: false },
});

// reactive 는 수정가능한...ref 는 수정불가한...
const data = reactive({
  active: false,
  idx: 0,
  cmpId: props.cmpId,
  companyList: (auth.userInfo.cmpId === 'kaisa') ? JSON.parse(localStorage.getItem('companyList') || '[]') : [{ cmpId : auth.userInfo.cmpId, cmpNm : auth.userInfo.cmpNm }],
  searchList: [],
}) as any;

const inputCompany = (e: any) => {
  data.searchList = [];
  if(e.target.value) {
    let existsCount = 0;
    for(let o of data.companyList) {
      if(existsCount > 5) {
        break;
      }
      if(o.cmpId.match(e.target.value)) {
        data.searchList.push({cmpId : o.cmpId, cmpNm: o.cmpNm});
        existsCount++;
      }
    }
    if(data.searchList.length > 0) {
      data.active = true;
    } else {
      data.active = false;
    }
  } else {
    data.active = false;
  }
}
const focusOut = () => {
  emit('set-company', data.cmpId);
  setTimeout(()=>{
    data.active = false; // 바로 감추면 클릭이 안됨
  },100);
}
const clickCompany = (o: any) => {
  let isSelected = false;
  if(o.key) {
    if(o.key === 'Enter') {
      o = data.searchList[data.idx];
      isSelected = true;
    } else {
      if(o.key === 'ArrowUp') {
        if(data.idx > 0) {
          data.idx--;
        }
      }
      if(o.key === 'ArrowDown') {
        if((data.searchList.length - 1) > data.idx) {
          data.idx++;
        }
      }
      // $(o.srcElement).next().find('ul').scrollTop(data.idx * 35);
    }
    if(!isSelected) {
      return false;
    }
  }
  if(!data) {
    return false;
  }
  data.cmpId = o.cmpId;
  data.cmpNm = o.cmpNm;
  data.active = false;
  emit('set-company', {cmpId: data.cmpId});
}
onMounted(() => {
});

</script>
<style scoped>
.selectCompanyWrap {line-height:40px;}
input.cmpId {width:85px; margin-bottom:0;}
input.cmpId {width:206px; background-color:#ffeded; margin-bottom:0;}
select.csList,
select.chgrList {margin-bottom:0;}
div.layerCompany {white-space:nowrap; display:inline-block; position:relative; z-index:100;}
div.layerCompany ul {min-width:206px; position:absolute; left:-209px; top:10px; overflow:auto; background:#fff; border:0.5px solid #000; box-shadow:3px 3px 3px rgba(0,0,0,0.1);}
div.layerCompany ul li {display:block; cursor: pointer; height:35px; padding:0 10px; line-height:35px; border-bottom:0.5px solid #ddd;}
div.layerCompany ul li.on {background:#000; color:#83cdff;}
div.layerCompany ul li:hover {background:#666; color:#fff;}
</style>
