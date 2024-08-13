import { apiConfig } from '@src/utils/apiConfig';
import { formApi } from '@src/utils/formApi';

class MenuRoleService {
	async getMenuRoleList(json?:any) { // 업체메뉴권한 리스트 [BS_MENU_ROLE]
		const res = await apiConfig('/bo/cr/getMenuRoleList', json ? json : {});
		return res.data;
	}
	async getMenuRole(json?:any) { // 업체메뉴권한 상세조회 [BS_MENU_ROLE]
		const res = await apiConfig('/bo/cr/getMenuRole', json ? json : {});
		return res.data;
	}
	async setMenuRoleList(json?:any) { // 업체메뉴권한 리스트등록 [BS_MENU_ROLE]
		const res = await apiConfig('/bo/cr/setMenuRoleList', json ? json : {});
		return res.data;
	}
	async insertMenuRole(formData:FormData) { // 업체메뉴권한 등록 [BS_MENU_ROLE]
		const res = await formApi('/bo/cr/insertMenuRole', formData);
		return res.data;
	}
	async updateMenuRole(formData:FormData) { // 업체메뉴권한 수정 [BS_MENU_ROLE]
		const res = await formApi('/bo/cr/updateMenuRole', formData);
		return res.data;
	}
	async deleteMenuRole(formData:FormData) { // 업체메뉴권한 삭제 [BS_MENU_ROLE]
		const res = await formApi('/bo/cr/getMenuRoleList', formData);
		return res.data;
	}
}
export default new MenuRoleService();

