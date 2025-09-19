<template>
  <DashboardLayout>
    <template #default>
      <KanbanBoard />
    </template>
  </DashboardLayout>
</template>
<script setup lang="ts">
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import KanbanBoard from "@/components/kanban/KanbanBoard.vue";
</script>
<style lang=""></style>
