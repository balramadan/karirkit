<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4"
  >
    <h1
      class="text-6xl font-extrabold text-blue-400 dark:text-blue-500 mb-4 animate-bounce"
    >
      404
    </h1>
    <p
      class="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6"
    >
      Page Not Found
    </p>
    <p
      class="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md"
    >
      Oops! The page you're looking for doesn't exist. It might have been moved
      or deleted.
    </p>
    <RouterLink
      to="/"
      class="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
    >
      Go to Home
    </RouterLink>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
/* Keyframe for bounce animation */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>
