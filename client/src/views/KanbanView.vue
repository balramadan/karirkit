<template>
  <DashboardLayout>
    <template #default>
      <KanbanBoard />
    </template>
  </DashboardLayout>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";
import { useAuthStore } from "@/stores/auth.ts"
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import KanbanBoard from "@/components/kanban/KanbanBoard.vue";

const authStore = useAuthStore()
const nameUser = authStore.nameUser
</script>
<style lang=""></style>
