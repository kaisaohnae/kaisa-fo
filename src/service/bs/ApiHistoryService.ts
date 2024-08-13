import { apiConfig } from '@src/utils/apiConfig';
import { formApi } from '@src/utils/formApi';

class ApiHistoryService {
	async getApiHistoryList(json?:any) { // API이력 리스트 [BS_API_HIST]
		const res = await apiConfig('/bo/cr/getApiHistoryList', json ? json : {});
		return res.data;
	}
	async getApiHistory(json?:any) { // API이력 상세조회 [BS_API_HIST]
		const res = await apiConfig('/bo/cr/getApiHistory', json ? json : {});
		return res.data;
	}
	async setApiHistoryList(json?:any) { // API이력 리스트등록 [BS_API_HIST]
		const res = await apiConfig('/bo/cr/setApiHistoryList', json ? json : {});
		return res.data;
	}
	async insertApiHistory(formData:FormData) { // API이력 등록 [BS_API_HIST]
		const res = await formApi('/bo/cr/insertApiHistory', formData);
		return res.data;
	}
	async updateApiHistory(formData:FormData) { // API이력 수정 [BS_API_HIST]
		const res = await formApi('/bo/cr/updateApiHistory', formData);
		return res.data;
	}
	async deleteApiHistory(formData:FormData) { // API이력 삭제 [BS_API_HIST]
		const res = await formApi('/bo/cr/getApiHistoryList', formData);
		return res.data;
	}
}
export default new ApiHistoryService();

