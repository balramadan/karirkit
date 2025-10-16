<template>
  <div class="grid grid-cols-1 h-screen overflow-hidden md:grid-cols-12">
    <div
      class="flex flex-col gap-3 items-start px-5 md:px-20 py-10 col-span-1 w-full md:col-span-6 lg:col-span-5 overflow-y-auto"
    >
      <RouterLink to="/" class="flex mx-auto">
        <Image
          src="/KarirKit-light.png"
          class="flex mx-auto light:block dark:hidden"
          width="48"
          alt="Logo"
        />
        <Image
          src="/KarirKit-dark.png"
          class="flex mx-auto light:hidden dark:block"
          width="48"
          alt="Logo"
        />
      </RouterLink>
      <h3 class="font-bold text-2xl">Sign up for free</h3>
      <p class="text-sm text-black/60 dark:text-white/60">
        Already have an account?
        <RouterLink to="/login" class="text-blue-600 dark:text-blue-500"
          >Sign in here</RouterLink
        >
      </p>
      <Form
        v-slot="$form"
        class="py-5 w-full"
        :initialValues
        :resolver="resolver"
        @submit="submitSignUp"
      >
        <div class="flex flex-col gap-2">
          <div class="flex flex-row gap-2">
            <label for="name" class="text-sm">Name</label>
            <span class="text-red-500 text-sm">*</span>
          </div>
          <InputText
            name="name"
            type="text"
            class="!w-full !text-sm focus:!border-blue-700"
          />
          <Message
            v-if="$form.name?.invalid"
            class="text-xs"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.name?.error.message }}</Message
          >
        </div>
        <div class="flex flex-col gap-2 mt-5">
          <div class="flex flex-row gap-2">
            <label for="email" class="text-sm">Email</label>
            <span class="text-red-500 text-sm">*</span>
          </div>
          <InputText
            name="email"
            type="email"
            class="!w-full !text-sm focus:!border-blue-700"
          />
          <Message
            v-if="$form.email?.invalid"
            class="text-xs"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.email?.error.message }}</Message
          >
        </div>
        <div class="flex flex-col gap-2 mt-5">
          <div class="flex flex-row gap-2">
            <label for="password" class="text-sm">Password</label>
            <span class="text-red-500 text-sm">*</span>
          </div>
          <Password
            name="password"
            inputClass="!w-full !text-sm focus:!border-blue-700"
            toggleMask
            :feedback="false"
          />
          <Message
            v-if="$form.password?.invalid"
            class="text-xs"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.password?.error.message }}</Message
          >
        </div>
        <div class="flex flex-col gap-2 mt-5">
          <div class="flex flex-row gap-2">
            <label for="confirmPassword" class="text-sm"
              >Confirm Password</label
            >
            <span class="text-red-500 text-sm">*</span>
          </div>
          <Password
            name="confirmPassword"
            inputClass="!w-full !text-sm focus:!border-blue-700"
            toggleMask
            :feedback="false"
          />
          <Message
            v-if="$form.confirmPassword?.invalid"
            class="text-xs"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.confirmPassword?.error.message }}</Message
          >
        </div>
        <p class="mt-5 text-sm">
          By signing up, you agree to our
          <RouterLink
            to="/terms-of-service"
            class="text-blue-600 dark:text-blue-500"
            >Terms of Service</RouterLink
          >
          and
          <RouterLink
            to="/privacy-policy"
            class="text-blue-600 dark:text-blue-500"
            >Privacy Policy</RouterLink
          >.
        </p>
        <Button
          class="mt-8 !text-sm w-full !bg-blue-600 dark:!bg-blue-500 !border-none !transition-all !duration-300 !ease-in-out dark:!text-white hover:!bg-blue-800 hover:dark:!bg-blue-700"
          label="Sign up"
          type="submit"
        />
      </Form>
      <Divider
        align="center"
        class="!text-sm !bg-transparent"
        :pt="{ content: { class: '!bg-white dark:!bg-darkprimary' } }"
      >
        Or sign up with
      </Divider>
      <div class="w-full">
        <Button
          variant="outlined"
          label="Continue with Google"
          class="!w-full !text-blue-400 dark:text-blue-500 !border-blue-400 dark:!border-blue-500 hover:!bg-black/5 hover:dark:!bg-white/5 hover:!border-blue-600 hover:dark:!border-blue-700"
          @click="signUpWithGoogle"
        >
          <template #icon>
            <Icon icon="material-icon-theme:google" />
          </template>
        </Button>
      </div>
    </div>
    <div class="hidden md:block md:col-span-6 lg:col-span-7 relative">
      <Image
        src="/andreas-slotosch-w-BSFRpfTWk-unsplash.jpg"
        imageClass="h-full object-cover"
      />
      <span
        class="text-xs text-white stroke-black/50 absolute flex items-center gap-2 right-0 bottom-0 px-5 py-5"
        ><Icon icon="lets-icons:camera-duotone-line" class="size-4" />From
        Andreas Slotosch</span
      >
    </div>
  </div>
  <SwitchMode class="hidden" />
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Form } from "@primevue/forms";
import { Icon } from "@iconify/vue";
import { useToast } from "primevue/usetoast";
import { useOtpStore } from "@/stores/otp";
import InputText from "primevue/inputtext";
import SwitchMode from "@/components/SwitchMode.vue";
import Password from "primevue/password";
import Message from "primevue/message";
import Button from "primevue/button";
import Divider from "primevue/divider";
import Image from "primevue/image";
import router from "@/router";

interface inputType {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const toast = useToast();
const otpStore = useOtpStore();

const initialValues = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const resolver = ({ values }: { values: inputType | Record<string, any> }) => {
  const errors = {
    name: <object>[],
    email: <object>[],
    password: <object>[],
    confirmPassword: <object>[],
  };

  if (!values.name) {
    errors.name = [{ message: "Name is required" }];
  }

  if (!values.email) {
    errors.email = [{ message: "Email is required" }];
  }

  const regexPassword =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  if (!values.password) {
    errors.password = [{ message: "Password is required" }];
  } else if (!regexPassword.test(values.password)) {
    errors.password = [
      {
        message:
          "Password must be at least 8 characters long and contain at least one letter, one number, and one special character.",
      },
    ];
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = [{ message: "Confirm Password is required" }];
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = [{ message: "Passwords do not match" }];
  }

  return {
    errors,
  };
};

const baseurl = import.meta.env.VITE_API_BASE_URL;

const submitSignUp = async (e: any) => {
  try {
    const response = await fetch(`${baseurl}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: e.states.name.value,
        email: e.states.email.value,
        password: e.states.password.value,
      }),
    });

    const data = await response.json();

    // Periksa apakah respons HTTP tidak sukses (misal: status 401, 404, 500)
    if (!response.ok) {
      // Lemparkan error dengan pesan dari server
      throw new Error(data.message || "Sign up failed");
    }

    // Jika sukses, tampilkan notifikasi dan lakukan redirect
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Check email for OTP verification",
      life: 3000,
    });

    otpStore.forVerify(data.email, "register");

    router.push("/verify");
  } catch (err: any) {
    toast.add({
      severity: "error",
      summary: "Failed",
      detail: `${err.message}`,
      life: 3000,
    });
  }
};

const signUpWithGoogle = () => {
  // Alih-alih menggunakan fetch, kita arahkan browser langsung ke endpoint otentikasi backend.
  // Backend kemudian akan menangani redirect ke halaman login Google.
  window.location.href = `${baseurl}/auth/google`;
};
</script>
<style lang=""></style>
