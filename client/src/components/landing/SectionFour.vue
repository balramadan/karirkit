<template>
  <section class="py-16 sm:py-20 bg-black/5 dark:bg-white/5">
    <div class="px-5 sm:px-6 lg:px-20 xl:px-40 mx-auto">
      <div class="text-center">
        <h2
          class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
        >
          Mulai dalam 3 Langkah Mudah
        </h2>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Ikuti alur sederhana ini untuk mengorganisir pencarian kerja Anda.
        </p>
      </div>
      <div class="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <!-- Step -->
        <div
          v-for="step in steps"
          :key="step.title"
          class="flex flex-col items-center text-center p-6 rounded-lg"
        >
          <div
            class="flex items-center justify-center size-16 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-5"
          >
            <Icon
              :icon="step.icon"
              class="text-3xl text-blue-600 dark:text-blue-400"
            />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ step.title }}
          </h3>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            {{ step.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

const steps = [
  {
    title: "1. Buat Akun Gratis",
    description:
      "Daftarkan diri Anda dalam sekejap untuk mulai menyimpan dan mengelola semua lamaran pekerjaan.",
    icon: "fe:user-plus",
  },
  {
    title: "2. Tambah Lamaran",
    description:
      "Masukkan detail lowongan pekerjaan yang Anda lamar, atau ambil data otomatis dari URL.",
    icon: "fluent:document-add-24-regular",
  },
  {
    title: "3. Lacak Progres",
    description:
      "Gunakan papan Kanban visual untuk memindahkan lamaran sesuai progresnya, dari dilamar hingga diterima.",
    icon: "material-symbols:view-kanban-outline",
  },
];
</script>
