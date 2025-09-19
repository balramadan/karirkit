<template>
    <div class="grid grid-cols-1 min-h-screen md:grid-cols-12">
      <div
        class="flex flex-col gap-4 justify-center items-start px-20 col-span-1 w-full md:col-span-6 lg:col-span-5"
      >
        <h3 class="font-bold text-2xl">Sign in to your account</h3>
        <p class="text-sm text-black/60">
          Not a member?
          <RouterLink to="/signup" class="text-blue-700"
            >Free to sign up here</RouterLink
          >
        </p>
        <Form v-slot="$form" class="py-5 w-full" :initialValues :resolver="resolver">
          <div class="flex flex-col gap-2">
            <label for="name" class="text-sm">Name</label>
            <InputText name="name" type="text" class="!w-full !text-sm focus:!border-blue-700" />
            <Message v-if="$form.name?.invalid" class="text-xs" severity="error" size="small" variant="simple">{{ $form.name?.error.message }}</Message>
          </div>
        </Form>
      </div>
      <div class="hidden md:block md:col-span-6 lg:col-span-7">
        <Image
          src="/andreas-slotosch-w-BSFRpfTWk-unsplash.jpg"
          imageClass="h-full object-cover"
        />
        <span
          class="text-xs text-white stroke-black/50 absolute flex items-center gap-2 right-0 bottom-0 px-5 py-5"
          ><Icon icon="lets-icons:camera-duotone-line" class="size-4" />From Andreas Slotosch</span
        >
      </div>
    </div>
  </template>
  <script setup lang="ts">
  import { ref } from "vue";
  import { Form } from "@primevue/forms";
  import InputText from 'primevue/inputtext';
  import Message from 'primevue/message';
  import Image from "primevue/image";
  import { Icon } from '@iconify/vue';
  
  interface inputType {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
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
  
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  
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
  </script>
  <style lang=""></style>
  