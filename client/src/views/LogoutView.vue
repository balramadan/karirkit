<template>
  <div></div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  authStore.clearUser();
  router.push("/");
});
</script>
<style lang=""></style>
