<template>
  <section class="py-16 sm:py-20 bg-black/5 dark:bg-white/5">
    <div class="px-5 sm:px-6 lg:px-20 xl:px-40">
      <div class="text-center">
        <h2
          class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
        >
          Key Features for Career Fighters
        </h2>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Everything you need to stay organized and motivated.
        </p>
      </div>
      <div
        class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center"
      >
        <div
          v-for="feature in features"
          :key="feature.name"
          class="flex flex-col items-center"
        >
          <div
            class="flex items-center justify-center size-12 rounded-lg bg-blue-600 text-white"
          >
            <Icon :icon="feature.icon" class="size-6" aria-hidden="true" />
          </div>
          <h3 class="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
            {{ feature.name }}
          </h3>
          <p class="mt-2 text-base text-gray-600 dark:text-gray-400">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

const features = [
  {
    name: "Application Management",
    description:
      "Add, view, and manage all your job applications with ease.",
    icon: "tdesign:view-list",
  },
  {
    name: "Status Tracking",
    description:
      "Monitor the status of each application with a visual Kanban board.",
    icon: "tabler:layout-kanban-filled",
  },
  {
    name: "Custom Grouping",
    description:
      "Organize applications into groups based on priority or category.",
    icon: "tdesign:folder-open",
  },
  {
    name: "Drag & Drop",
    description:
      "Change the status or order of applications with just a drag and drop.",
    icon: "tdesign:drag-drop",
  },
];
</script>
