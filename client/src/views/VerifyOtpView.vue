<template>
  <div class="flex flex-col justify-center items-center min-h-screen">
    <Image src="" />
    <div class="mb-4">
      <h2 class="text-center text-2xl font-bold mb-2">Verify OTP</h2>
      <p class="text-center text-gray-600">Enter the OTP sent to your email</p>
    </div>
    <div class="">
      <OtpForm
        v-if="reason == 'register'"
        @verify="onSubmitRegister"
        @resend="resendRegisterOtp"
        :email="email || ''"
        :reason="reason || ''"
      />
      <OtpForm
        v-if="reason == 'change-password'"
        @verify="onSubmitChangePassword"
        @resend="resendChangePasswordOtp"
        :email="email || ''"
        :reason="reason || ''"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useOtpStore } from "@/stores/otp";
import { api } from "@/lib/axios";
import Image from "primevue/image";
import OtpForm from "@/components/OtpForm.vue";
import router from "@/router";

const toast = useToast();
const otpStore = useOtpStore();
const email = otpStore.email;
const reason = otpStore.reason;
const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface inputType {
  otp: string;
}

const resendCountdown = () => {
  otpStore.countdown = 120;
  const interval = setInterval(() => {
    if (otpStore.countdown > 0) {
      otpStore.countdown--;
    } else {
      clearInterval(interval);
    }
  }, 1000);
};

const onSubmitRegister = async (e: any, otp: any) => {
  try {
    // Simulate API call
    const response = await fetch(`${baseUrl}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        otp,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.add({
        severity: "error",
        summary: "Failed",
        detail: `${data.message}`,
        life: 3000,
      });

      return;
    }

    toast.add({
      severity: "success",
      summary: "Success",
      detail: `Account with email ${email} verified successfully!`,
      life: 3000,
    });

    router.push("/login");
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `${(error as Error).message}`,
      life: 3000,
    });
  }
};

const resendRegisterOtp = async () => {
  try {
    const response = await fetch(`${baseUrl}/auth/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.add({
        severity: "error",
        summary: "Failed",
        detail: `${data.message}`,
        life: 3000,
      });

      return;
    }

    toast.add({
      severity: "success",
      summary: "Success",
      detail: `OTP resend to ${email}!`,
      life: 3000,
    });

    resendCountdown();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `${(error as Error).message}`,
      life: 3000,
    });
  }
};

const onSubmitChangePassword = async (e: any, otp: any) => {
  try {
    const response = await api.post("/user/verify-otp", {
      email: email,
      otp,
    });

    if (response.status !== 200) {
      toast.add({
        severity: "error",
        summary: "Failed",
        detail: `${response.data?.message || "Failed to verify OTP."}`,
        life: 3000,
      });

      return;
    }

    toast.add({
      severity: "success",
      summary: "Success",
      detail: `${response.data.message}`,
      life: 3000,
    });

    router.push("/settings/change-password");
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to send otp, try again!",
      life: 3000,
    });
  }
};

const resendChangePasswordOtp = async () => {
  try {
    const response = await api.post("/user/resend-otp", {
      email: email,
    });

    if (response.status != 200) {
      toast.add({
        severity: "error",
        summary: "Failed",
        detail: `${response.data?.message}`,
        life: 3000,
      });

      return;
    }

    toast.add({
      severity: "success",
      summary: "Success",
      detail: `OTP resend to ${email}!`,
      life: 3000,
    });

    resendCountdown();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `${(error as Error).message}`,
      life: 3000,
    });
  }
};

onMounted(() => {
  if (!email) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No email found for OTP verification. Please try again!.",
      life: 3000,
    });
    router.push("/register");
  }

  resendCountdown();
});
</script>
<style></style>
