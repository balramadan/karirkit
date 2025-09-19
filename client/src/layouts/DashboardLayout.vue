<template>
  <div class="bg-white dark:bg-[#131313]">
    <HeaderDashboard /> 
    <main class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8"><slot /></main>
    <footer></footer>
  </div>
</template>
<script setup lang="ts">
import HeaderDashboard from "@/components/header/HeaderDashboard.vue";
</script>
<style lang=""></style>
