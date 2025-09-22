import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const idUser = ref<string | null>(null);
    const token = ref<string | null>(null);
    const isAuthenticated = computed(() => !!token.value);

    /**
     * The function setUser sets the user ID and token values based on the provided parameters.
     * @param {string | null} id - The `id` parameter in the `setUser` function is a string that
     * represents the user's ID. It can also be `null` if there is no user ID available.
     * @param {string | null} newToken - The `newToken` parameter is a string that represents a new
     * token value.
     */
    function setUser(id: string | null, newToken: string | null) {
      idUser.value = id;
      token.value = newToken;
    }

    /**
     * The function clearUser sets the values of idUser and token to null.
     */
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
