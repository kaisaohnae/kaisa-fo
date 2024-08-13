import { apiConfig } from '@src/utils/apiConfig';
import { formApi } from '@src/utils/formApi';

class BatchHistoryService {
	async getBatchHistoryList(json?:any) { // 배치이력 리스트 [BS_BTCH_HIST]
		const res = await apiConfig('/bo/cr/getBatchHistoryList', json ? json : {});
		return res.data;
	}
	async getBatchHistory(json?:any) { // 배치이력 상세조회 [BS_BTCH_HIST]
		const res = await apiConfig('/bo/cr/getBatchHistory', json ? json : {});
		return res.data;
	}
	async setBatchHistoryList(json?:any) { // 배치이력 리스트등록 [BS_BTCH_HIST]
		const res = await apiConfig('/bo/cr/setBatchHistoryList', json ? json : {});
		return res.data;
	}
	async insertBatchHistory(formData:FormData) { // 배치이력 등록 [BS_BTCH_HIST]
		const res = await formApi('/bo/cr/insertBatchHistory', formData);
		return res.data;
	}
	async updateBatchHistory(formData:FormData) { // 배치이력 수정 [BS_BTCH_HIST]
		const res = await formApi('/bo/cr/updateBatchHistory', formData);
		return res.data;
	}
	async deleteBatchHistory(formData:FormData) { // 배치이력 삭제 [BS_BTCH_HIST]
		const res = await formApi('/bo/cr/getBatchHistoryList', formData);
		return res.data;
	}
}
export default new BatchHistoryService();

