import { apiConfig } from '@src/utils/apiConfig';
import { formApi } from '@src/utils/formApi';

class MenuService {
	async getMenuList(json?:any) { // 메뉴 리스트 [BS_MENU]
		const res = await apiConfig('/bo/cr/getMenuList', json ? json : {});
		return res.data;
	}
	async getMenu(json?:any) { // 메뉴 상세조회 [BS_MENU]
		const res = await apiConfig('/bo/cr/getMenu', json ? json : {});
		return res.data;
	}
	async setMenuList(json?:any) { // 메뉴 리스트등록 [BS_MENU]
		const res = await apiConfig('/bo/cr/setMenuList', json ? json : {});
		return res.data;
	}
	async insertMenu(formData:FormData) { // 메뉴 등록 [BS_MENU]
		const res = await formApi('/bo/cr/insertMenu', formData);
		return res.data;
	}
	async updateMenu(formData:FormData) { // 메뉴 수정 [BS_MENU]
		const res = await formApi('/bo/cr/updateMenu', formData);
		return res.data;
	}
	async deleteMenu(formData:FormData) { // 메뉴 삭제 [BS_MENU]
		const res = await formApi('/bo/cr/getMenuList', formData);
		return res.data;
	}
}
export default new MenuService();

