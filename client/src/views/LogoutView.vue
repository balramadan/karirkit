<template>
  <div></div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const baseurl = import.meta.env.VITE_API_BASE_URL;

onMounted(() => {
  authStore.clearUser();
  if (authStore.authWith === "google") {
    window.location.href = `${baseurl}/auth/logout`;
  } else {
    router.push("/login");
  }
});
</script>
<style lang=""></style>
