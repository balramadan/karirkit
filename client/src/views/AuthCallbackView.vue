<template>
  <div class="flex items-center justify-center h-screen">
    <div class="text-center">
      <p>Authenticating, please wait...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "primevue/usetoast";
import { jwtDecode } from "jwt-decode";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

interface DecodedToken {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  iat: number;
  exp: number;
}

onMounted(() => {
  const token = route.query.token as string | null;

  if (token) {
    try {
      // Decode token untuk mendapatkan informasi pengguna
      const decoded = jwtDecode<DecodedToken>(token);

      // Simpan data pengguna dan token ke Pinia store
      authStore.setUser(
        decoded.id,
        token,
        decoded.name,
        decoded.photoUrl || "",
        "google"
      );

      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Sign in successful!",
        life: 3000,
      });

      // Arahkan ke dasbor setelah berhasil login
      router.push("/dashboard");
    } catch (error) {
      console.error("Invalid token:", error);
      toast.add({
        severity: "error",
        summary: "Authentication Failed",
        detail: "Invalid authentication token. Please try again.",
        life: 3000,
      });
      router.push("/login");
    }
  } else {
    // Jika tidak ada token, kembalikan ke halaman login
    toast.add({
      severity: "error",
      summary: "Authentication Failed",
      detail: "Authentication token not found. Please try again.",
      life: 3000,
    });
    router.push("/login");
  }
});
</script>
