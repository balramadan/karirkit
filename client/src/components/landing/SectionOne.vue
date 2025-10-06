<template>
  <section
    class="py-20 sm:py-24 lg:py-32 px-5 sm:px-6 lg:px-20 xl:px-40 text-center"
  >
    <h2
      class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight"
    >
      Track Your Job Applications in<br />One Place
    </h2>
    <p class="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
      KarirKit helps you manage every step of the job search process, from
      ‘Applied’ to ‘Accepted’, with a simple and intuitive interface.
    </p>
    <div class="mt-8 flex justify-center gap-4">
      <RouterLink to="/register">
        <Button class="!text-white !bg-blue-600 dark:!bg-blue-700 hover:!bg-blue-800 hover:dark:!bg-blue-900 transition-all ease-in-out duration-300 !border-none" label="Sign up for free" size="large" />
      </RouterLink>
    </div>
  </section>
</template>
<script setup lang="ts">
import Button from "primevue/button";
</script>
