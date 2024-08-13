import { apiConfig } from '@src/utils/apiConfig';
import { formApi } from '@src/utils/formApi';

class FtpService {
	/**
	 * file & 정보저장전에 최종으로 파일 업로드
	 *
	 * @param formData
	 * @returns
	 */
	async uploadList(formData:FormData) {
		const res = await formApi('/file/uploadList', formData);
		return res.data;
	}
}
export default new FtpService();

