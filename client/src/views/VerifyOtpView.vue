<template>
  <div class="flex flex-col justify-center items-center min-h-screen">
    <div class="mb-4">
      <h2 class="text-center text-2xl font-bold mb-2">Verify OTP</h2>
      <p class="text-center text-gray-600">Enter the OTP sent to your email</p>
    </div>
    <Form
      v-slot="$form"
      :initialValues
      :resolver="resolver"
      @submit="onSubmit"
      class=""
    >
      <div class="flex flex-col gap-4">
        <Message
          v-if="$form.otp?.invalid"
          class="!text-xs !text-center"
          severity="error"
          size="small"
          >{{ $form.otp?.error.message }}</Message
        >
        <InputOtp
          v-model="otp"
          id="otp"
          name="otp"
          placeholder="Enter OTP"
          input-class="w-full p-3 border border-gray-300 rounded"
          type="numeric"
          required
          :class="{ 'p-invalid': $form.otp?.invalid }"
          :length="6"
        />
      </div>
      <Button
        type="submit"
        label="Verify OTP"
        class="mt-5 !text-sm w-full !bg-blue-600 dark:!bg-blue-500 !border-none !transition-all !duration-300 !ease-in-out dark:!text-white hover:!bg-blue-800 hover:dark:!bg-blue-700"
      />
    </Form>
    <div class="text-center mt-5">
      <p class="text-gray-600">
        Didn't receive the OTP?
        <span v-if="otpStore.countdown > 0" class="text-sm text-gray-500">
          (Resend in {{ otpStore.countdown }}s)</span
        >
        <a
          v-if="otpStore.countdown === 0"
          @click="resendOtp"
          class="text-blue-500 cursor-pointer transition-all duration-300 hover:underline"
          >Resend OTP</a
        >
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Form } from "@primevue/forms";
import { useToast } from "primevue/usetoast";
import { useOtpStore } from "@/stores/otp";
import InputOtp from "primevue/inputotp";
import Button from "primevue/button";
import Message from "primevue/message";
import router from "@/router";

const toast = useToast();
const otpStore = useOtpStore();
const email = otpStore.email;
const otp = ref();

interface inputType {
  otp: string;
}

const initialValues = ref({
  otp: "",
});

const resolver = ({ values }: { values: inputType | Record<string, any> }) => {
  const errors = {
    otp: <object>[],
  };

  if (!values.otp) {
    errors.otp = [{ message: "OTP is required" }];
  }

  return {
    errors,
  };
};

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

const onSubmit = async (e: any) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    console.log(e);

    // Simulate API call
    const response = await fetch(`${baseUrl}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        otp: otp.value,
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

const resendOtp = async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

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

onMounted(() => {
  if (!email) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No email found for OTP verification. Please register first.",
      life: 3000,
    });
    router.push("/register");
  }

  resendCountdown();
});
</script>
<style></style>
