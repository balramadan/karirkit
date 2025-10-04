<template>
  <div class="bg-white dark:bg-darkprimary min-h-screen">
    <HeaderDashboard :data-user="dataUser" />
    <main class="px-5 sm:px-6 lg:px-20 xl:px-40"><slot /></main>
    <FooterDashboard />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import HeaderDashboard from "@/components/header/HeaderDashboard.vue"; 
import FooterDashboard from "@/components/footer/FooterDashboard.vue";

const authStore = useAuthStore();
const dataUser = ref();

const getUserInfo = () => {
  dataUser.value = authStore.getUser();
};

onMounted(getUserInfo);
</script>
<style lang=""></style>
