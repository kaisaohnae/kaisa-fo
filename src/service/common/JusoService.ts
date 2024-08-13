import { formApi } from '@src/utils/formApi';

class JusoService {
	/**
	 * 주소정보
	 * @param form 
	 * @returns 
	 */
	async getJuso(form?:any) {
		const res = await formApi('/bo/juso/getJuso', form ? form : {});
		return res.data;
	}
	/**
	 * 주소/좌표 정보
	 * @param form 
	 * @returns 
	 */
	async getPosition(form?:any) {
		const res = await formApi('/bo/juso/getPosition', form ? form : {});
		return res.data;
	}
}
export default new JusoService();

