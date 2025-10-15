<template>
  <div
    class="flex items-center justify-between py-5 px-5 sm:px-6 lg:px-20 xl:px-40"
  >
    <div class="relative hidden md:hidden items-center justify-between">
      <Icon icon="tdesign:menu-fold" class="block size-5" aria-hidden="true" />
    </div>
    <div
      class="flex items-center justify-center md:items-stretch md:justify-start"
    >
      <Image
        class="h-8 w-auto cursor-pointer light:block dark:hidden"
        height="32"
        width="32"
        src="/KarirKit-light.png"
        alt="KarirKit"
        @click="toHome"
      />
      <Image
        class="h-8 w-auto cursor-pointer light:hidden dark:block"
        height="32"
        width="32"
        src="/KarirKit-dark.png"
        alt="KarirKit"
        @click="toHome"
      />
      <div class="hidden md:ml-6 md:block gap-5"></div>
    </div>
    <div
      class="flex items-center pr-2 gap-2 md:static md:flex md:gap-4 md:inset-auto md:ml-6 md:pr-0"
    >
      <SwitchMode class="" />

      <Button
        v-if="isAuthenticate"
        class="block !px-5 !text-sm !bg-blue-600 dark:!bg-blue-700 !border-none !transition-all !duration-300 !ease-in-out hover:!bg-blue-800 hover:dark:!bg-blue-900 dark:!text-white"
        label="Dashboard"
        @click="toDashboard"
      />
      <div v-else class="flex gap-2.5 items-center">
        <RouterLink to="/login">
          <Button
            class="!text-sm md:!text-base !text-blue-600/60 dark:!text-white/60 !py-1.5 !px-5 !bg-transparent !border !border-blue-600/60 dark:!border-white/60 hover:!text-blue-800 hover:dark:!text-white hover:!border-blue-800 hover:dark:!border-white !transition-all !duration-300 !ease-in-out"
            label="Sign in"
          />
        </RouterLink>
        <RouterLink to="/register">
          <Button
            class="!text-sm md:!text-base !text-white-600 dark:!text-blue-700 !py-1.8 !px-5 !border-none !bg-blue-600 dark:!bg-white hover:!text-white hover:dark:!text-white hover:!bg-blue-900 hover:dark:!bg-blue-900 !transition-all !duration-300 !ease-in-out"
            label="Sign up"
          />
        </RouterLink>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import router from "@/router";
import Image from "primevue/image";
import SwitchMode from "@/components/SwitchMode.vue";
import Button from "primevue/button";

const authStore = useAuthStore();
const isAuthenticate = authStore.isAuthenticated;

const toHome = () => {
  router.push("/");
};

const toDashboard = () => {
  router.push("/dashboard");
};
</script>
<style></style>
