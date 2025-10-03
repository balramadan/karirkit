import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const idUser = ref<string | null>(null);
    const nameUser = ref<string | null>(null);
    const photoUrlUser = ref<string | null>(null);
    const token = ref<string | null>(null);
    const isAuthenticated = computed(() => !!token.value);

    /**
     * The function `setUser` assigns values to user-related variables based on the provided
     * parameters.
     * @param {string | null} id - The `id` parameter is a string that represents the user's ID. It can
     * be either a valid string value or `null`.
     * @param {string | null} newToken - The `newToken` parameter in the `setUser` function is a string
     * that represents the new token value for the user. This token can be used for authentication or
     * authorization purposes in the application.
     * @param {string | null} name - The `name` parameter in the `setUser` function is a string that
     * represents the name of the user.
     * @param {string | null} photoUrl - The `photoUrl` parameter in the `setUser` function is a string
     * that represents the URL of the user's photo. It can be used to store and display the user's
     * profile picture.
     */
    function setUser(
      id: string | null,
      newToken: string | null,
      name: string | null,
      photoUrl: string | null
    ) {
      idUser.value = id;
      token.value = newToken;
      nameUser.value = name;
      photoUrlUser.value = photoUrl;
    }

    /**
     * The function `getUser` returns an object with properties `id`, `name`, and `photoUrl` based on
     * input values.
     * @returns An object with properties `id`, `name`, and `photoUrl` is being returned. The values of
     * these properties are taken from the variables `idUser.value`, `nameUser.value`, and
     * `photoUrlUser.value` respectively.
     */
    function getUser() {
      return {
        id: idUser.value,
        name: nameUser.value,
        photoUrl: photoUrlUser.value,
      };
    }

    /**
     * The function clearUser sets the values of idUser and token to null.
     */
    function clearUser() {
      idUser.value = null;
      nameUser.value = null;
      photoUrlUser.value = null;
      token.value = null;
    }

    return { idUser, nameUser, photoUrlUser, token, isAuthenticated, setUser, getUser, clearUser };
  },
  {
    persist: {
      key: "authUser",
      storage: localStorage,
    }, // This enables persistence for this store
  }
);
