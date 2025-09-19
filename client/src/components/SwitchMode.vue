<template>
  <div @click="toggleMode" class="cursor-pointer rounded-full p-2 light:text-black dark:text-white">
    <Icon v-if="mode === 'light'" icon="tdesign:sunny-filled" class="size-6 md:size-4" />
    <Icon v-if="mode === 'dark'" icon="tdesign:moon-filled" class="size-6 md:size-4" />
  </div>
</template>
<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { Icon } from "@iconify/vue";

const mode = useColorMode();
function toggleMode() {
  mode.value = mode.value === "dark" ? "light" : "dark";
}
</script>
<style lang=""></style>
