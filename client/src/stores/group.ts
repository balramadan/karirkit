import { defineStore } from "pinia";
import { ref } from "vue";

export const groupStore = defineStore(
  "group",
  () => {
    const activeGroup = ref();

    /**
     * The function `setGroup` sets the value of `activeGroup` to the provided `id`.
     * @param {string} id - The `id` parameter in the `setGroup` function is a string that represents the
     * identifier of the group that you want to set as the active group.
     */
    function setGroup(id: string) {
      activeGroup.value = id;
    }

    return { activeGroup, setGroup };
  },
  {
    persist: {
      key: "groups",
      storage: localStorage,
    },
  }
);
