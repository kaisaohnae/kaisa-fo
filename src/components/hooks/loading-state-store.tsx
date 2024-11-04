import {create, StoreApi, UseBoundStore} from 'zustand';

interface LoadingStateStoreType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

/**
 * 데이터 불러오는 상태를 표현하는 로딩 스피너
 */
export const useLoadingStateStore: UseBoundStore<StoreApi<LoadingStateStoreType>> = create(set => ({
  isLoading: true,
  startLoading() {
    set({isLoading: true});
  },
  stopLoading() {
    set({isLoading: false});
  }
}));

/**
 * 로딩 시작
 * 리액트 컴포넌트 밖에서 사용할 수 있도록 만든 메서드 #1
 */
export const startLoading = () => {
  const {startLoading} = useLoadingStateStore.getState();
  startLoading();
};

/**
 * 로딩 중지
 * 리액트 컴포넌트 밖에서 사용할 수 있도록 만든 메서드 #2
 */
export const stopLoading = () => {
  const {stopLoading} = useLoadingStateStore.getState();
  stopLoading();
};
