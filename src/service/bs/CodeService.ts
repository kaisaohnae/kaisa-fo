import { apiConfig } from '@src/utils/apiConfig';
import { formApi } from '@src/utils/formApi';

class CodeService {
	async getCodeList(json?:any) { // 코드 리스트 [BS_CD]
		const res = await apiConfig('/bo/cr/getCodeList', json ? json : {});
		return res.data;
	}
	async getCode(json?:any) { // 코드 상세조회 [BS_CD]
		const res = await apiConfig('/bo/cr/getCode', json ? json : {});
		return res.data;
	}
	async setCodeList(json?:any) { // 코드 리스트등록 [BS_CD]
		const res = await apiConfig('/bo/cr/setCodeList', json ? json : {});
		return res.data;
	}
	async insertCode(formData:FormData) { // 코드 등록 [BS_CD]
		const res = await formApi('/bo/cr/insertCode', formData);
		return res.data;
	}
	async updateCode(formData:FormData) { // 코드 수정 [BS_CD]
		const res = await formApi('/bo/cr/updateCode', formData);
		return res.data;
	}
	async deleteCode(formData:FormData) { // 코드 삭제 [BS_CD]
		const res = await formApi('/bo/cr/getCodeList', formData);
		return res.data;
	}
}
export default new CodeService();

