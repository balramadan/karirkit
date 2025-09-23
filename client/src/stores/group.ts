import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "@/lib/axios";

export const useGroupStore = defineStore(
  "group",
  () => {
    const groups = ref()
    const activeGroup = ref();

    /**
     * The function `setGroup` sets the value of `activeGroup` to the provided `id`.
     * @param {string} id - The `id` parameter in the `setGroup` function is a string that represents the
     * identifier of the group that you want to set as the active group.
     */
    function setGroup(id: string) {
      activeGroup.value = id;
    }

    function clearGroup() {
      activeGroup.value = null
    }

    async function getGroups() {
      try {
        const { data } = await api.get("/v1/group");
    
        groups.value = data;
      } catch (err) {
        console.error(err);
      }
    }

    return { groups, activeGroup, setGroup, clearGroup, getGroups};
  },
  {
    persist: {
      key: "groups",
      storage: localStorage,
    },
  }
);
