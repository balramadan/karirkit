<template>
  <div class="grid grid-cols-1 min-h-screen md:grid-cols-12">
    <div
      class="flex flex-col gap-4 justify-center items-start px-5 md:px-20 py-5 col-span-1 w-full md:col-span-6 lg:col-span-5"
    >
      <h3 class="font-bold text-2xl">Sign in to your account</h3>
      <p class="text-sm text-black/60 dark:text-white/60">
        Not a member?
        <RouterLink to="/signup" class="text-blue-700"
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
          <label for="email" class="text-sm">Email</label>
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
          <label for="password" class="text-sm">Password</label>
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
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Form } from "@primevue/forms";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Message from "primevue/message";
import Button from "primevue/button";
import Image from "primevue/image";
import { Icon } from "@iconify/vue";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "@/stores/auth";
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
    const response = await fetch(`${baseurl}/v1/auth/signin`, {
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

    authStore.setUser(data.id, data.token);
    router.push("/kanban");
  } catch (err: any) {
    toast.add({
      severity: "error",
      summary: "Failed",
      detail: `${err.message}`,
      life: 3000,
    });
  }
};
</script>
<style lang=""></style>
