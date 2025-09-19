import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const idUser = ref<string | null>(null);
    const token = ref<string | null>(null);
    const isAuthenticated = computed(() => !!token.value);

    function setUser(id: string | null, newToken: string | null) {
      idUser.value = id;
      token.value = newToken;
    }

    function clearUser() {
      idUser.value = null;
      token.value = null;
    }

    return { idUser, token, isAuthenticated, setUser, clearUser };
  },
  {
    persist: {
      key: "authUser",
      storage: localStorage,
    }, // This enables persistence for this store
  }
);
