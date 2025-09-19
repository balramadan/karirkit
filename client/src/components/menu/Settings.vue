<template>
  <div>
    <Menu :model="mainMenus" class="!border-none !text-sm dark:!bg-[#131313]">
      <template #item="{ item, props }">
        <a
          :href="item.url"
          :class="[
            'flex flex-row items-center gap-2 cursor-pointer p-2 rounded-lg',
            {
              'bg-black/5 dark:bg-white/10 font-semibold': isActive(item),
            },
          ]"
        >
          <Icon :icon="`${item.icon}`" />
          <span class="text-sm">{{ item.label }}</span>
        </a>
      </template>
    </Menu>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import Menu from "primevue/menu";
import { Icon } from "@iconify/vue";

const route = useRoute();

const activeTab = computed(() => {
  return route.hash.replace("#", "");
});

const activeRoute = computed(() => {
  return route.path.split("/")[2];
});

const isActive = (item: any) => {
  if (item.url?.includes("#")) {
    return activeTab.value === item.url?.split("#")[1];
  } else if (item.url?.includes("/")) {
    return activeRoute.value === item.url?.split("/")[2];
  }
  // Default to false if neither condition is met
  return false;
};

const mainMenus = ref([
  { label: "Profile", icon: "tdesign:user", url: "/settings#profile" },
  { label: "Appearance", icon: "tdesign:palette", url: "/settings#appearance" },
  {
    label: "Documents",
    items: [
      {
        label: "Curriculum Vitae",
        icon: "tdesign:file-1",
        url: "/settings/cv",
      },
      {
        label: "Cover Letter",
        icon: "tdesign:file",
        url: "/settings/cover-letter",
      },
    ],
  },
]);
</script>
<style lang=""></style>
