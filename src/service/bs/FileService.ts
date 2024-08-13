import { apiConfig } from '@src/utils/apiConfig';
import { formApi } from '@src/utils/formApi';

class FileService {
	async getFileList(json?:any) { // 파일 리스트 [BS_FILE]
		const res = await apiConfig('/bo/cr/getFileList', json ? json : {});
		return res.data;
	}
	async getFile(json?:any) { // 파일 상세조회 [BS_FILE]
		const res = await apiConfig('/bo/cr/getFile', json ? json : {});
		return res.data;
	}
	async setFileList(json?:any) { // 파일 리스트등록 [BS_FILE]
		const res = await apiConfig('/bo/cr/setFileList', json ? json : {});
		return res.data;
	}
	async insertFile(formData:FormData) { // 파일 등록 [BS_FILE]
		const res = await formApi('/bo/cr/insertFile', formData);
		return res.data;
	}
	async updateFile(formData:FormData) { // 파일 수정 [BS_FILE]
		const res = await formApi('/bo/cr/updateFile', formData);
		return res.data;
	}
	async deleteFile(formData:FormData) { // 파일 삭제 [BS_FILE]
		const res = await formApi('/bo/cr/getFileList', formData);
		return res.data;
	}
}
export default new FileService();

