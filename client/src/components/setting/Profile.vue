<template>
  <div v-if="props.data" class="pl-2.5 md:pl-5">
    <div class="grid lg:grid-cols-12 gap-10">
      <div class="lg:col-span-10 flex flex-col gap-2">
        <h3 class="font-semibold text-xl">Profile</h3>
        <div class="mt-5">
          <Form class="flex flex-col gap-4" @submit="changeProfile">
            <div class="flex flex-col gap-2">
              <label for="name" class="text-sm">Name</label>
              <Skeleton v-if="isLoading" class="!w-full !h-10" />
              <InputText
                v-else
                v-model="name"
                name="name"
                type="text"
                class="!w-full !text-sm focus:!border-blue-700"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label for="email" class="text-sm">Email</label>
              <Skeleton v-if="isLoading" class="!w-full !h-10" />
              <InputText
                v-else
                v-model="email"
                name="email"
                type="email"
                class="!w-full !text-sm focus:!border-blue-700"
                disabled
              />
            </div>
            <div
              v-if="authStore.authWith === 'local'"
              class="flex flex-col gap-2"
            >
              <span>Password</span>
              <!-- TODO: Tambahkan fitur ganti password -->
              <Button
                class="w-35 !text-xs !bg-blue-700 !border-none !transition-all !duration-300 !ease-in-out hover:!bg-blue-900 dark:!text-white"
                label="Change Password"
                type="button"
                @click="changePassword"
              />
            </div>
            <div class="text-right">
              <Button
                class="w-40 !text-sm !bg-blue-700 !border-none !transition-all !duration-300 !ease-in-out hover:!bg-blue-900 dark:!text-white"
                type="submit"
                :label="isLoading ? 'Saving...' : 'Save Profile'"
                :disabled="isLoading"
              />
            </div>
          </Form>
        </div>
      </div>
      <div
        class="lg:col-span-2 flex flex-col items-center lg:items-start gap-2"
      >
        <p class="text-sm text-left w-full">Avatar</p>
        <Avatar
          v-if="avatarPreviewUrl || props.data.data.photoUrl"
          :image="avatarPreviewUrl || props.data.data.photoUrl"
          size="xlarge"
          shape="circle"
          class=""
          :pt="{ image: { class: 'object-cover w-full h-full' } }"
        />
        <Avatar
          v-else
          :label="initial"
          size="xlarge"
          shape="circle"
          class=""
          :pt="{ image: { class: 'object-cover w-full h-full' } }"
        />
        <FileUpload
          class="!text-sm !bg-blue-700 !border-none !transition-all !duration-300 !ease-in-out hover:!bg-blue-900 dark:!text-white"
          mode="basic"
          name="avatar[]"
          accept="image/*"
          :maxFileSize="1000000"
          chooseLabel="Change"
          @select="onFileSelect"
          :auto="true"
          :customUpload="true"
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
import { ref, onUnmounted } from "vue";
import { Form } from "@primevue/forms";
import { Icon } from "@iconify/vue";
import { useToast } from "primevue/usetoast";
import { uploadAvatar } from "@/lib/storage";
import { api } from "@/lib/axios";
import { getInitials } from "@/composables/text";
import type { FileUploadSelectEvent } from "primevue/fileupload";
import { useAuthStore } from "@/stores/auth";
import { useOtpStore } from "@/stores/otp";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Avatar from "primevue/avatar";
import FileUpload from "primevue/fileupload";
import router from "@/router";
import Skeleton from "primevue/skeleton";

const toast = useToast();
const authStore = useAuthStore();
const otpStore = useOtpStore();
const loadingChangePassword = ref(false);

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["profileUpdated"]);

const name = ref(props.data?.data.name);
const email = ref(props.data?.data.email);
const selectedAvatarFile = ref<File | null>(null);
const avatarPreviewUrl = ref<string | null>(null);
const isLoading = ref(false);

const initial = getInitials(name.value);

const onFileSelect = (event: FileUploadSelectEvent) => {
  const file = event.files[0];
  if (file) {
    selectedAvatarFile.value = file;
    avatarPreviewUrl.value = URL.createObjectURL(file); // This is correct
  }
};

// Clean up the object URL to prevent memory leaks
onUnmounted(() => {
  if (avatarPreviewUrl.value) {
    URL.revokeObjectURL(avatarPreviewUrl.value);
  }
});

const changeProfile = async () => {
  isLoading.value = true;
  try {
    if (selectedAvatarFile.value) {
      await uploadAvatar(selectedAvatarFile.value);
    }

    const { data } = await api.patch("/user", {
      name: name.value,
      email: email.value,
    });

    toast.add({
      summary: "Success",
      detail: "Profile updated successfully!",
      severity: "success",
      life: 3000,
    });

    authStore.setUser(null, null, data.name, data.photoUrl, null);

    // Beri tahu parent component untuk memuat ulang data
    emit("profileUpdated");
  } catch (error: any) {
    console.error("Failed to update profile:", error);
    toast.add({
      summary: "Error",
      detail: error.response?.data?.message || "Failed to update profile.",
      severity: "error",
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

const changePassword = async () => {
  try {
    loadingChangePassword.value = true;

    const { data } = await api.post("/user/send-verification");

    if (!data) {
      toast.add({
        summary: "Error",
        detail: `${data.message}}`,
        severity: "error",
        life: 3000,
      });
      return;
    }

    toast.add({
      summary: "Success",
      detail: `${data.message}`,
      severity: "success",
      life: 3000,
    });

    otpStore.forVerify(data.email, "change-password");

    router.push("/verify");
  } catch (error) {
    console.error("Failed to change password:", error);
  }
};
</script>
<style></style>
