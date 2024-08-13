import { defineStore } from 'pinia';
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const settings = cookies.get('settings');
// const hash = location.hash.replace("#", '');
const structure = {
  id: '',
  menu: {
    active: false,
  },
  hash: '',
  tab: {
    idx: 0,
  },
  favList: []
};

export const useSettingStore = defineStore('setting', {
  state: () => (settings ? settings : structure) as any,
  actions: {
    setState() {
      cookies.set('settings', JSON.stringify(settings ? settings : structure) || '{}');
    },
  },
});

