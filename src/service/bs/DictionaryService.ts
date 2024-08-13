import { apiConfig } from '@src/utils/apiConfig';
import { formApi } from '@src/utils/formApi';

class DictionaryService {
	async getDictionaryList(json?:any) { // 사전 리스트
		const res = await apiConfig('/bo/cr/getDictionaryList', json ? json : {});
		return res.data;
	}
	async setDictionaryList(json?:any) { // 사전 리스트등록
		const res = await apiConfig('/bo/cr/setDictionaryList', json ? json : {});
		return res.data;
	}
}
export default new DictionaryService();

