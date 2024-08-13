import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state : () => ({ 
    active: false,
    menuList: JSON.parse(localStorage.getItem('menuList') || '[]'),
    companyList: JSON.parse(localStorage.getItem('companyList') || '[]'),
    codeList: JSON.parse(localStorage.getItem('codeList') || '{}'),
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
    count: 0,
  }),
	actions: {
    loginSuccess(info:any) {
      if(info && info.token) {
        const userInfo = {
          id: info.id,
          cmpId: info.cmpId,
          cmpNm: info.cmpNm,
          token: info.token,
          nm: info.nm,
        }
        localStorage.setItem('menuList', JSON.stringify(info.menuList) || '[]');
        localStorage.setItem('companyList', JSON.stringify(info.companyList) || '[]');
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        this.userInfo = userInfo;
      }
      let groupCodeArr:any = {};
      for(let o of info.codeList) {
        let codeArr:any = [];
        for(let c of o.cdList) {
          codeArr.push({ text: c.cdNm, value: c.cd, dataType: 'string'});
        }
        groupCodeArr[o.grpCd] = codeArr;
      }
      localStorage.setItem('codeList', JSON.stringify(groupCodeArr) || '{}');

      this.count = 0;
      
			this.active = true;
			this.menuList = info.menuList;
			this.companyList = info.companyList;
			this.codeList = info.codeList; // 이곳에 안담으면 아래 setTimeout을해도 문제가 생김...
      
      location.href = '/';
		},
    loginFail() {
      this.removeSession();
      this.count++;
    },
    removeSession() {
      localStorage.removeItem('menuList');
      localStorage.removeItem('companyList');
      localStorage.removeItem('codeList');
      localStorage.removeItem('userInfo');
			this.active = false;
      this.userInfo = {};
    },
		logout() {
      this.removeSession();
      location.href = '/';
		},
	}
});