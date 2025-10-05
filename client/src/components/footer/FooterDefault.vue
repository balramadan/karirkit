<template>
  <footer class="">
    <div
      class="text-sm flex flex-row justify-between items-center py-5 px-5 sm:px-6 lg:px-20 xl:px-40"
    >
      <div class="mb-4 sm:mb-0">KarirKit &copy; {{ year }}</div>
      <div class="flex items-center gap-4">
        <a href="https://iqbalramadan.link/pay" target="_blank" class="hover:text-blue-600 dark:hover:text-blue-400">Donasi</a>
        <a href="https://github.com/balramadan/karirkit" target="_blank" class="hover:text-gray-900 dark:hover:text-white">
          <Icon icon="tdesign:logo-github-filled" class="size-6" />
        </a>
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";

const year = ref(new Date().getFullYear());
</script>