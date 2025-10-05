<template>
  <section class="py-16 sm:py-20 bg-black/5 dark:bg-white/5">
    <div class="px-5 sm:px-6 lg:px-20 xl:px-40 text-center">
      <h2
        class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
      >
        Built with Modern Technology
      </h2>
      <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
        Using a reliable and scalable technology stack for the best experience.
      </p>
      <div
        class="mt-10 flex justify-center items-center gap-8 sm:gap-12 flex-wrap"
      >
        <div
          v-for="tech in techStack"
          :key="tech.name"
          class="flex flex-col items-center gap-2"
        >
          <Icon
            :icon="tech.icon"
            class="text-4xl sm:text-5xl text-gray-500 dark:text-gray-400"
          />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
            tech.name
          }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

const techStack = [
  { name: "Vue.js", icon: "logos:vue" },
  { name: "Node.js", icon: "logos:nodejs-icon" },
  { name: "MongoDB", icon: "logos:mongodb-icon" },
  { name: "Tailwind CSS", icon: "logos:tailwindcss-icon" },
  { name: "PrimeVue", icon: "simple-icons:primevue" },
];
</script>
