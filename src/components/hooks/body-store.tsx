import {create} from 'zustand';

// zustand 상태 생성
interface BodyClassState {
  onPopupOpen: () => void;
  onPopupClose: () => void;
}

export const useBodyClassStore = create<BodyClassState>((set) => ({
  onPopupOpen: () => {
    document.body.classList.add('mnuopen');
  },
  onPopupClose: () => {
    document.body.classList.remove('mnuopen');
  },
}));
