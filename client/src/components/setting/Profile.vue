<template>
  <div v-if="props.data" class="px-2.5 md:px-5">
    <div class="grid lg:grid-cols-12 gap-10">
      <div class="lg:col-span-10 flex flex-col gap-2">
        <h3 class="font-semibold text-xl">Profile</h3>
        <div class="mt-5">
          <Form class="flex flex-col gap-4" @submit="changeProfile">
            <div class="flex flex-col gap-2">
              <label for="name" class="text-sm">Name</label>
              <InputText
                v-model="name"
                name="name"
                type="text"
                class="!w-full !text-sm focus:!border-blue-700"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label for="email" class="text-sm">Email</label>
              <InputText
                v-model="email"
                name="email"
                type="email"
                class="!w-full !text-sm focus:!border-blue-700"
              />
            </div>
            <div class="flex flex-col gap-2">
              <span>Password</span>
              <Button
                class="w-35 !text-xs !bg-blue-700 !border-none !transition-all !duration-300 !ease-in-out hover:!bg-blue-900 dark:!text-white"
                label="Change Password"
                type="button"
              />
            </div>
            <div class="text-right">
              <Button
                class="w-40 !text-sm !bg-blue-700 !border-none !transition-all !duration-300 !ease-in-out hover:!bg-blue-900 dark:!text-white"
                label="Save Profile"
                type="submit"
              />
            </div>
          </Form>
        </div>
      </div>
      <div
        class="hidden lg:flex lg:flex-col lg:col-span-2 justify-start items-baseline gap-2"
      >
        <p class="text-sm text-left">Avatar</p>
        <Avatar label="KK" size="xlarge" />
        <FileUpload
          class="!text-sm !bg-blue-700 !border-none !transition-all !duration-300 !ease-in-out hover:!bg-blue-900 dark:!text-white"
          mode="basic"
          name="avatar[]"
          accept="image/*"
          :maxFileSize="1000000"
          chooseLabel="Upload"
        >
          <template #chooseicon>
            <Icon icon="tdesign:upload" />
          </template>
        </FileUpload>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { api } from "@/lib/axios";
import { Form } from "@primevue/forms";
import { Icon } from "@iconify/vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Avatar from "primevue/avatar";
import FileUpload from "primevue/fileupload";
import { useToast } from "primevue/usetoast";
import router from "@/router";

const toast = useToast();

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const name = ref(props.data.data?.name);
const email = ref(props.data.data?.email);
const password = ref("");

async function changeProfile() {
  const data = await api.patch("/api/user", { name: name.value, email: email.value });
  if (data.status === 500) {
    toast.add({
      summary: "Failed",
      detail: data.data?.message,
      severity: "error",
      life: 3000,
    });
  }

  if (data.status === 200) {
    toast.add({
      summary: "Change Profile Success",
      detail: data.data?.message,
      severity: "success",
      life: 3000,
    });

    router.push("/settings#profile");
    router.go(0);
  }
}
</script>
<style></style>
