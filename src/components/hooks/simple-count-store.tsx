import {create, StoreApi, UseBoundStore} from 'zustand';

interface SimpleCounterStoreType {
  count: number;
  increase: () => void;
}

/**
 * 단순 카운터로 사용할 수 있는 컴포넌트.
 * 현재는 selectbox 컴포넌트에서 강제 리렌더링 용도로 사용 중
 */
export const useSimpleCountStore: UseBoundStore<StoreApi<SimpleCounterStoreType>> = create(set => ({
  count: 0,
  increase: () => set(state => ({count: state.count + 1}))
}));
