<template>
  <DashboardLayout>
    <template #default>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-5 my-5">
        <div class="md:col-span-3 lg:col-span-2">
          <Settings />
        </div>
        <div v-if="isLoading" class="md:col-span-9 lg:col-span-10">
          <Skeleton width="w-full" height="20rem" class="ml-5" />
        </div>
        <div v-else class="md:col-span-9 lg:col-span-10">
          <Profile
            v-if="activeTab === 'profile' && userData"
            :data="userData"
            @profile-updated="fetchUserData"
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
import Skeleton from "primevue/skeleton";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import Settings from "@/components/menu/Settings.vue";
import Profile from "@/components/setting/Profile.vue";
import Appearance from "@/components/setting/Appearance.vue";

const isLoading = ref(false);
const userData = ref();

const route = useRoute();

const activeTab = computed(() => {
  return route.hash.replace("#", "");
});

const fetchUserData = async () => {
  try {
    isLoading.value = true;
    const response = await api.get("/user");
    userData.value = response.data;
  } catch (error) {
    console.error("Failed to fetch data user:", error);
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => route.hash,
  (newHash, oldHash) => {
    console.log(`Tab berubah ke ${newHash} dari ${oldHash}`);
  }
);

onMounted(fetchUserData);
</script>
<style lang=""></style>
