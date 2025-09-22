<template>
  <DashboardLayout>
    <template #default>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 my-5">
        <div class="sm:col-span-3 lg:col-span-2">
          <Settings />
        </div>
        <div class="sm:col-span-9 lg:col-span-10">
          <Profile
            v-if="activeTab === 'profile' && userData"
            :data="userData"
          />
          <Appearance v-if="activeTab === 'appearance'" />
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { api } from "@/lib/axios";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import Settings from "@/components/menu/Settings.vue";
import Profile from "@/components/setting/Profile.vue";
import Appearance from "@/components/setting/Appearance.vue";

const userData = ref();
const API_URL = import.meta.env.VITE_API_BASE_URL;

const route = useRoute();

const activeTab = computed(() => {
  return route.hash.replace("#", "");
});

watch(
  () => route.hash,
  (newHash, oldHash) => {
    console.log(`Tab berubah ke ${newHash} dari ${oldHash}`);
  }
);

onMounted(async () => {
  const response = await api.get(`${API_URL}/v1/user`);

  userData.value = response.data;
});
</script>
<style lang=""></style>
