<template>
  <section class="py-20 sm:py-24">
    <div
      class="px-5 sm:px-6 lg:px-20 xl:px-40 text-center bg-black/5 dark:bg-white/5 py-16 shadow-sm rounded-xl max-w-5xl mx-auto"
    >
      <h2
        class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
      >
        Ready to take control of your job search?
      </h2>
      <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
        Sign up now and start tracking your job applications efficiently.
      </p>
      <div class="mt-8">
        <RouterLink to="/register">
          <Button
            class="!bg-blue-600 dark:!bg-white/70 hover:!bg-blue-800 hover:dark:!bg-white !border-none"
            label="Sign up now, it's free!"
            size="large"
          />
        </RouterLink>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import Button from "primevue/button";
</script>
