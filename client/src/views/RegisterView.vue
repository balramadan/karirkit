<template>
  <div class="grid grid-cols-1 min-h-screen md:grid-cols-12">
    <div
      class="flex flex-col gap-4 justify-center items-start px-5 md:px-20 py-5 col-span-1 w-full md:col-span-6 lg:col-span-5"
    >
      <h3 class="font-bold text-2xl">Sign up for free</h3>
      <p class="text-sm text-black/60 dark:text-white/60">
        Already have an account?
        <RouterLink to="/login" class="text-blue-600 dark:text-blue-500">Sign in here</RouterLink>
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
        <Button
          class="mt-8 !text-sm w-full !bg-blue-600 dark:!bg-blue-500 !border-none !transition-all !duration-300 !ease-in-out dark:!text-white hover:!bg-blue-800 hover:dark:!bg-blue-700"
          label="Sign up"
          type="submit"
        />
      </Form>

      <!-- <Divider class="!text-sm !my-0" align="center" type="solid">
        <b>SSO</b>
      </Divider> -->
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
import { ref } from "vue";
import { Form } from "@primevue/forms";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Message from "primevue/message";
import Button from "primevue/button";
import Divider from "primevue/divider";
import Image from "primevue/image";
import { Icon } from "@iconify/vue";
import { useToast } from "primevue/usetoast";
import router from "@/router";

interface inputType {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const toast = useToast();

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
    const response = await fetch(`https://karirkit-api.vercel.app/api/auth/signup`, {
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
      detail: "Sign in success",
      life: 3000,
    });

    router.push("/login");
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
