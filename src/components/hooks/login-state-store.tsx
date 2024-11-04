import {create, StoreApi, UseBoundStore} from 'zustand';

interface LoginStateStoreType {
  // loggedIn: boolean;
  isLogin: () => boolean;
  login: () => void;
  logout: () => void;
}

export const useLoginStateStore: UseBoundStore<StoreApi<LoginStateStoreType>> = create(set => ({
  // loggedIn: false,
  isLogin() {
    // const isUserLoggedIn = localStorage.getItem('loggedIn') === 'true';
    // set({loggedIn: isUserLoggedIn});
    return localStorage.getItem('loggedIn') === 'true';
  },
  login() {
    // set({loggedIn: true});
    localStorage.setItem('loggedIn', 'true');
  },
  logout() {
    // set({loggedIn: false});
    localStorage.setItem('loggedIn', 'false');
  }
}));
