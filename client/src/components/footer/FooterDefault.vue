<template>
  <footer class="flex flex-col">
    <div
      class="bg-blue-100 dark:bg-[#0E34A4] w-full flex flex-col gap-1 ml-auto mr-0 items-baseline-last justify-center rounded-t-2xl py-5 px-5 sm:px-6 lg:px-20 xl:px-40"
    >
      <h4 class="text-[12px] font-bold">Other Links</h4>
      <RouterLink
        v-for="(item, index) in otherLinks"
        class="text-[12px] border-b"
        :to="item.url"
        :key="index"
        >{{ item.label }}</RouterLink
      >
    </div>
    <div
      class="bg-blue-300 dark:bg-blue-900 text-sm flex flex-col sm:flex-row justify-center sm:justify-between items-center py-5 px-5 sm:px-6 lg:px-20 xl:px-40"
    >
      <div class="mb-4 sm:mb-0">Made with ❤️ for career fighters.</div>
      <div class="flex items-center gap-4">
        <a
          href="https://iqbalramadan.link/pay"
          target="_blank"
          class="hover:text-blue-600 dark:hover:text-blue-400"
          >Donate</a
        >
        <p>|</p>
        <a
          href="https://github.com/balramadan/karirkit"
          target="_blank"
          class="group"
        >
          <Icon
            icon="tdesign:logo-github-filled"
            class="size-6 group-hover:text-blue-600 group-hover:dark:text-blue-400"
          />
        </a>
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";

const otherLinks = ref([
  {
    label: "Terms of Service",
    url: "/terms-of-service",
  },
  {
    label: "Privacy Policy",
    url: "/privacy-policy",
  },
]);
</script>
