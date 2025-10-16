<template>
  <div class="grid grid-cols-1 min-h-screen md:grid-cols-12">
    <div
      class="flex flex-col gap-4 justify-center items-start px-5 md:px-20 py-5 col-span-1 w-full md:col-span-6 lg:col-span-5"
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
      <h3 class="font-bold text-2xl">Sign in to your account</h3>
      <p class="text-sm text-black/60 dark:text-white/60">
        Not a member?
        <RouterLink to="/register" class="text-blue-700"
          >Free to sign up here</RouterLink
        >
      </p>
      <Form
        v-slot="$form"
        class="py-5 w-full"
        :initialValues
        :resolver="resolver"
        @submit="submitSignIn"
      >
        <div class="flex flex-col gap-2">
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
        <div class="mt-5 flex justify-between">
          <div class=""></div>
          <RouterLink class="text-sm text-blue-700" to=""
            >Forgot password?</RouterLink
          >
        </div>
        <Button
          class="mt-5 !text-sm w-full !bg-blue-700 !border-none !transition-all !duration-300 !ease-in-out dark:!text-white hover:!bg-blue-900"
          label="Sign in"
          type="submit"
        />
      </Form>
      <Divider
        align="center"
        class="!text-sm !bg-transparent"
        :pt="{ content: { class: '!bg-white dark:!bg-darkprimary' } }"
      >
        Or sign in with
      </Divider>
      <div class="w-full">
        <Button
          variant="outlined"
          label="Continue with Google"
          class="!w-full !text-blue-400 dark:text-blue-500 !border-blue-400 dark:!border-blue-500 hover:!bg-black/5 hover:dark:!bg-white/5 hover:!border-blue-600 hover:dark:!border-blue-700"
          @click="signInWithGoogle"
        >
          <template #icon>
            <Icon icon="material-icon-theme:google" />
          </template>
        </Button>
      </div>
    </div>
    <div class="hidden md:block md:col-span-6 lg:col-span-7">
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
import { ref, onMounted } from "vue";
import { Form } from "@primevue/forms";
import { Icon } from "@iconify/vue";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "@/stores/auth";
import InputText from "primevue/inputtext";
import SwitchMode from "@/components/SwitchMode.vue";
import Password from "primevue/password";
import Message from "primevue/message";
import Button from "primevue/button";
import Divider from "primevue/divider";
import Image from "primevue/image";
import router from "@/router";

const toast = useToast();
const authStore = useAuthStore();

interface inputType {
  email: string;
  password: string;
}

const initialValues = ref({
  email: "",
  password: "",
});

const resolver = ({ values }: { values: inputType | Record<string, any> }) => {
  const errors = {
    email: <object>[],
    password: <object>[],
  };

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.email) {
    errors.email = [{ message: "Email is required" }];
  } else if (!regexEmail.test(values.email)) {
    errors.email = [{ message: "Email is not valid" }];
  }

  if (!values.password) {
    errors.password = [{ message: "Password is required" }];
  }

  return {
    errors,
  };
};

const baseurl = import.meta.env.VITE_API_BASE_URL;

const submitSignIn = async (e: any) => {
  try {
    const response = await fetch(`${baseurl}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: e.states.email.value,
        password: e.states.password.value,
      }),
    });

    const data = await response.json();

    // Periksa apakah respons HTTP tidak sukses (misal: status 401, 404, 500)
    if (!response.ok) {
      // Lemparkan error dengan pesan dari server
      throw new Error(data.message || "Sign in failed");
    }

    // Jika sukses, tampilkan notifikasi dan lakukan redirect
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Sign in success",
      life: 3000,
    });

    authStore.setUser(data.id, data.token, data.name, data.photoUrl, "local");
    router.push("/dashboard");
  } catch (err: any) {
    toast.add({
      severity: "error",
      summary: "Failed",
      detail: `${err.message}`,
      life: 3000,
    });
  }
};

const signInWithGoogle = () => {
  // Alih-alih menggunakan fetch, kita arahkan browser langsung ke endpoint otentikasi backend.
  // Backend kemudian akan menangani redirect ke halaman login Google.
  window.location.href = `${baseurl}/auth/google`;
};
</script>
<style lang=""></style>
