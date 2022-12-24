import { useRootStore } from './context';

export const useAuthStore = () => useRootStore().authStore;

export const useUserStore = () => useRootStore().userStore;

export const useCollectionStore = () => useRootStore().collectionStore;

export const useRefStore = () => useRootStore().refStore;

export const useAuthorsStore = () => useRootStore().authorsStore;

export const useMeta = () => useRootStore().meta;
