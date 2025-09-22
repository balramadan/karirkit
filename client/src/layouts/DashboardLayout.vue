<template>
  <div class="bg-white dark:bg-[#1E1E2C] min-h-screen">
    <HeaderDashboard /> 
    <main class="px-5 sm:px-6 lg:px-16"><slot /></main>
    <footer></footer>
  </div>
</template>
<script setup lang="ts">
import HeaderDashboard from "@/components/header/HeaderDashboard.vue";
</script>
<style lang=""></style>
