<template>
  <section class="py-16 sm:py-20">
    <div class="px-5 sm:px-6 lg:px-20 xl:px-40 text-center">
      <h2
        class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
      >
        Visualize Your Career Progress
      </h2>
      <p
        class="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400"
      >
        With the Kanban board view, you can clearly see the job application flow
        from start to finish.
      </p>
      <div class="mt-10">
        <Image
          src="/kanban-light.png"
          alt="Kanban board view"
          class="light:block dark:hidden shadow-xl mx-auto"
          :pt="{ image: { class: 'rounded-lg' } }"
        />
        <Image
          src="/kanban-dark.png"
          alt="Kanban board view"
          class="light:hidden dark:block shadow-xl mx-auto"
          :pt="{ image: { class: 'rounded-lg' } }"
        />
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import Image from "primevue/image";
</script>
