import { useRootStore } from './context';

export const useAuthStore = () => useRootStore().authStore;

export const useUserStore = () => useRootStore().userStore;
