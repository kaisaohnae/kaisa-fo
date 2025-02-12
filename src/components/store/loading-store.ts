import { create } from 'zustand';

type State = {
  loading: boolean;
  target: string;
};

type Actions = {
  startLoading: () => void;
  stopLoading: () => void;
};

const loadingStore = create<State & Actions>((set) => ({
  loading: false,
  target: '',
  startLoading: (o?: any) => {
    set(() => ({
      loading: true,
      target: (o && o.target) ? o.target : ''
    }));
  },
  stopLoading: () => {
    set(() => ({
      loading: false,
      initLoading: false,
      target: ''
    }));
  },
}));
export default loadingStore;
