import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "@/lib/axios";

export const useGroupStore = defineStore(
  "group",
  () => {
    const groups = ref();
    const activeGroup = ref();

    /**
     * The function `setGroup` sets the value of `activeGroup` to the provided `id`.
     * @param {string} id - The `id` parameter in the `setGroup` function is a string that represents the
     * identifier of the group that you want to set as the active group.
     */
    function setGroup(id: string) {
      activeGroup.value = id;
    }

    /**
     * The function `clearGroup` sets the value of `activeGroup` to `null`.
     */
    function clearGroup() {
      activeGroup.value = null;
    }

    /**
     * The function `getGroups` asynchronously fetches group data from an API endpoint and updates the
     * `groups` value with the retrieved data, handling errors with a try-catch block.
     */
    async function getGroups() {
      try {
        const { data } = await api.get("/group");

        groups.value = data;
      } catch (err) {
        console.error(err);
      }
    }

    /**
     * This TypeScript function asynchronously deletes a group using an API call and returns the
     * response or throws an error if there is any.
     * @param {String} id - The `id` parameter in the `deleteGroup` function is a string that
     * represents the unique identifier of the group that you want to delete.
     * @returns The `deleteGroup` function is returning the response from the API call made to delete
     * the group with the specified `id`.
     */
    async function deleteGroup(id: String) {
      try {
        const response = await api.delete(`/group/${id}`);

        return response;
      } catch (err) {
        throw err;
      }
    }

    return { groups, activeGroup, setGroup, clearGroup, getGroups, deleteGroup };
  },
  {
    persist: {
      key: "groups",
      storage: localStorage,
    },
  }
);
