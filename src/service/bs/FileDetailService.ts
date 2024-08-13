import { apiConfig } from '@src/utils/apiConfig';
import { formApi } from '@src/utils/formApi';

class FileDetailService {
	async getFileDetailList(json?:any) { // 파일상세 리스트 [BS_FILE_DTL]
		const res = await apiConfig('/bo/cr/getFileDetailList', json ? json : {});
		return res.data;
	}
	async getFileDetail(json?:any) { // 파일상세 상세조회 [BS_FILE_DTL]
		const res = await apiConfig('/bo/cr/getFileDetail', json ? json : {});
		return res.data;
	}
	async setFileDetailList(json?:any) { // 파일상세 리스트등록 [BS_FILE_DTL]
		const res = await apiConfig('/bo/cr/setFileDetailList', json ? json : {});
		return res.data;
	}
	async insertFileDetail(formData:FormData) { // 파일상세 등록 [BS_FILE_DTL]
		const res = await formApi('/bo/cr/insertFileDetail', formData);
		return res.data;
	}
	async updateFileDetail(formData:FormData) { // 파일상세 수정 [BS_FILE_DTL]
		const res = await formApi('/bo/cr/updateFileDetail', formData);
		return res.data;
	}
	async deleteFileDetail(formData:FormData) { // 파일상세 삭제 [BS_FILE_DTL]
		const res = await formApi('/bo/cr/getFileDetailList', formData);
		return res.data;
	}
}
export default new FileDetailService();

