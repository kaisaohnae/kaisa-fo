<template>
	<div id="dirctionary">
		<form class="search" @submit="getList" @keyup.enter="getList">
			<fieldset>
				<legend>검색</legend>
				<table>
					<colgroup>
						<col width="100" />
						<col width="*" />
						<col width="100" />
						<col width="*" />
					</colgroup>
					<tbody>
						<tr>
							<th class="required">약어</th>
							<td colspan="2"><input type="text" v-model="search.abb" /></td>
						</tr>
					</tbody>
					<tbody class="audit" v-show="data.audit">
						<tr>
							<th>수정기간</th>
							<td colspan="2">
								<SelectGroupDate
									:name="['startModDt', 'endModDt']"
									:format="'YYYY-MM-DD'"
									:date="[search.startModDt, search.endModDt]"
									@set-start-date="(o: any) => {
										search.startModDt = o.date;
									}"
									@set-end-date="(o: any) => {
										search.endModDt = o.date;
									}"
								/>
							</td>
						</tr>
						<tr>
							<th>등록일</th>
							<td colspan="2">
								<SelectDate
									:name="['regDt']"
									:format="'YYYY-MM-DD'"
									:date="[search.regDt]"
									@set-start-date="(o) => {
										search.regDt = o.date;
									}"
								/>
							</td>
						</tr>
						<tr>
							<th>수정ID</th>
							<td><input type="text" v-model="search.modId" /></td>
							<th>등록ID</th>
							<td><input type="text" v-model="search.regId" /></td>
						</tr>
					</tbody>
				</table>
			</fieldset>
			<div class="btnWrap">
				<span class="crud">
					<button type="button" class="button add" @click="add"><span class="icon">&#xe813;</span>추가</button>
					<button type="button" class="button del" @click="del"><span class="icon">&#xe815;</span>삭제</button>
					<button type="button" class="button save" @click="save"><span class="icon">&#xe814;</span>저장</button>
				</span>
				<button type="button" class="audit" @click="data.audit = !data.audit">상세조회</button>
				<button type="submit" class="button3"><span class="icon">&#xe096;</span></button>
				<button type="reset" @click="gridUtil.reload()"><span class="icon">&#x22;</span></button>
				<button type="button" class="button excel" @click="gridUtil.excelExport(data.grid, '사전')"><span class="icon">&#xf1c3;</span></button>
				<div class="totalCount">총 {{ data.totalCount }}건</div>
			</div>
		</form>

		<div id="grid"></div>

	</div>
</template>
<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import Grid from 'tui-grid';
import DictionaryService from '@src/service/bs/DictionaryService';
import SelectDate from '@src/components/SelectDate.vue';
import SelectGroupDate from '@src/components/SelectGroupDate.vue';
import { useAuthStore } from '@src/store/store.auth';
import gridUtil from '@src/utils/gridUtil';

const auth = useAuthStore();
const search = reactive({
	abb: '',
	startModDt: '', // dateUtil.format(new Date().setMonth(new Date().getMonth() - 1), 'YYYY-MM-DD'),
	endModDt: '', // dateUtil.format(new Date(),'YYYY-MM-DD'),
	regDt: '', // dateUtil.format(new Date(),'YYYY-MM-DD'),
	regId: '',
	modId: '',
});
const data = reactive({
	required: ['abb', 'ko', 'en'],
	grid: {} as Grid,
	totalCount: 0,
	list: [] as any,
	audit: false,
});
const getList = () => {
	data.totalCount = 0;
	DictionaryService.getDictionaryList(search).then(
		(res) => {
			data.totalCount = 0; // (res.count) ? res.count : 0;
			data.list = res.data;
			data.grid.resetData(data.list, {});
		},
		(err) => {
			console.log(err);
		},
	);
}
const add = () => {
	data.grid.appendRow({}, {at: 0});
}
const del = () => {
	let selectRow = data.grid.getFocusedCell();
	if(selectRow.rowKey == null || selectRow.rowKey == undefined) {
		alert('행을 먼저 선택해주세요.');
		return;
	}
	if (confirm('선택한 행을 정말 삭제하시겠습니까?')) {
		data.grid.removeRow(selectRow.rowKey);
	}
}
const refresh = () => {
	location.reload();
}
const valid = (o:any) => {
	for(let c in o) {
		for(let r of data.required) {
			if(c == r && !o[c]) {
				alert('필수값이 없습니다.');
				return false;
			}
		}
	}
	return true;
}
const save = () => {
	data.grid.blur();
	let saveList = [];
	let count = [0, 0, 0];
	for(let o of data.grid.getModifiedRows().createdRows as any) {
		o.crud = 'C';
		if(!valid(o)) {
			return;
		}
		saveList.push(o);
		count[0]++;
	}
	for(let o of data.grid.getModifiedRows().updatedRows as any) {
		o.crud = 'U';
		if(!valid(o)) {
			return;
		}
		saveList.push(o as any);
		count[1]++;
	}
	for(let o of data.grid.getModifiedRows().deletedRows as any) {
		o.crud = 'D';
		saveList.push(o);
		count[2]++;
	}
	if(count[0] == 0 && count[1] == 0 && count[2] == 0) {
		alert('변경사항이 없습니다.');
		return;
	}
	if(confirm('등록 ' + count[0] + '건, 수정 ' + count[1] + '건, 삭제 ' + count[2] + '건을 정말 저장하시겠습니까?')) {
		DictionaryService.setDictionaryList(saveList).then(
			(res) => {
				location.reload();
			},
			(err) => {
				console.log(err);
			},
		);
	}
}
onMounted(() => {
	data.grid = new Grid({
		el: document.getElementById('grid') as HTMLElement,
		//rowHeaders: ['checkbox'],
		columns: [
			{header: '약어', name: 'abb', editor: 'text', sortable: true, align: 'left', validation: { dataType: 'string' , required: true } },
			{header: '한국어', name: 'ko', hidden: false, editor: 'text', validation: { dataType: 'string' , required: true } },
			{header: '영어', name: 'en', editor: 'text', validation: { dataType: 'string' , required: true } },
			{header: '설명', name: 'dsc', editor: 'text', validation: { dataType: 'string' , required: false } },
			{header: '연동참조', name: 'linkRef', editor: 'text', hidden: true, defaultValue: '', width: 150},
			{header: '수정일시', name: 'modDt', disabled: true },
		],
		scrollX: true,
		scrollY: true,
		minBodyHeight: 200,
		bodyHeight: 468,
		columnOptions: {
			resizable: true,
		},
		minRowHeight : 40,
		rowHeight : 40,
		header : {
			height: 40,
		},
	});
	data.grid.on('click', (e:any) => {
		if( e.columnName === 'abb') {
			//console.log('click')
		}
	});
	getList();
});
</script>
<style scoped>
#dirctionary {width: 100%;}
</style>

