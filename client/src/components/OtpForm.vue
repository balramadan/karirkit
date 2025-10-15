<template>
  <div class="">
    <Form
      v-slot="$form"
      :initialValues
      :resolver="resolver"
      @submit="$emit('verify', 'click', otp)"
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
          @click="$emit('resend')"
          class="text-blue-500 cursor-pointer transition-all duration-300 hover:underline"
          >Resend OTP</a
        >
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useOtpStore } from "@/stores/otp";
import { Form } from "@primevue/forms";
import InputOtp from "primevue/inputotp";
import Message from "primevue/message";
import Button from "primevue/button";

interface inputType {
  otp: string;
}

const otp = ref();
const otpStore = useOtpStore();

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

const props = defineProps({
  email: {
    type: String,
  },
  reason: {
    type: String,
  },
});

const emit = defineEmits(["verify", "resend"]);

onMounted(() => {
  resendCountdown();
});
</script>
<style></style>
