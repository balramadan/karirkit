<template>
  <DashboardLayout>
    <template #default>
      <Breadcrumb
        class="mt-5"
        :home="home"
        :model="items"
        :pt="{ root: { class: '!px-0 !py-2 !text-sm dark:!bg-darkprimary' } }"
      >
        <template #item="{ item }">
          <router-link v-if="item.url" class="cursor-pointer" :to="item.url">
            <Icon v-if="item.icon" :icon="item.icon" />
            <p>{{ item.label }}</p>
          </router-link>
        </template>
      </Breadcrumb>
      <KanbanBoard />
    </template>
  </DashboardLayout>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import Breadcrumb from "primevue/breadcrumb";
import { Icon } from "@iconify/vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import KanbanBoard from "@/components/kanban/KanbanBoard.vue";

const home = ref({ icon: "tdesign:home", url: "/" });
const items = ref([{ label: "Dashboard", url: "/dashboard" }]);
</script>
<style lang=""></style>
