<template>
  <div
    class="text-sm flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2.5 py-5 px-5 sm:px-6 lg:px-20 xl:px-40"
  >
    <div class="">Iqbal Ramadan &copy; {{ year }}</div>
    <div class="flex flex-row items-center gap-2">
      <a
        href="https://iqbalramadan.link/pay"
        target="_blank"
        class="hover:text-blue-600 dark:hover:text-blue-400"
        >Donate</a
      >
      <p>|</p>
      <a href="https://github.com/balramadan/karirkit" target="_blank">
        <Icon icon="tdesign:logo-github-filled" class="size-5" />
      </a>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";

const year = ref();

onMounted(() => {
  year.value = new Date().getFullYear();
});
</script>
<style></style>
