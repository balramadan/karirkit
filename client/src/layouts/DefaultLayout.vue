<template>
  <div class="bg-white dark:bg-darkprimary min-h-screen">
    <HeaderDefault />
    <main><slot /></main> 
    <FooterDefault />
  </div>
</template>
<script setup lang="ts">
import HeaderDefault from '@/components/header/HeaderDefault.vue';
import FooterDefault from '@/components/footer/FooterDefault.vue';
</script>
<style></style>
