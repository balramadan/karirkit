<template>
  <DashboardLayout>
    <template #default>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-5 my-5">
        <div class="sm:col-span-3 lg:col-span-2">
          <Settings />
        </div>
        <div class="sm:col-span-9 lg:col-span-10 px-2.5 md:px-5">
          <div class="mb-4">
            <h3 class="font-bold">Change Password</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Create a new password for your account
            </p>
          </div>
          <div class="">
            <Form
              v-slot="$form"
              class="w-full"
              :initialValues
              :resolver="resolver"
            >
              <div class="flex flex-col w-full gap-2">
                <Password
                  name="newPassword"
                  inputClass="!w-full !text-sm focus:!border-blue-700"
                  placeholder="New Password"
                  toggleMask
                  required
                  :feedback="false"
                />
                <Message
                  v-if="$form.newPassword?.invalid"
                  class="text-xs"
                  severity="error"
                  size="small"
                  variant="simple"
                  >{{ $form.newPassword?.error.message }}</Message
                >
              </div>
              <div class="flex flex-col w-full gap-2 mt-3">
                <Password
                  name="confirmPassword"
                  inputClass="!w-full !text-sm focus:!border-blue-700"
                  placeholder="Confirm Password"
                  toggleMask
                  required
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
              <div class="text-right">
                <Button
                  type="submit"
                  label="Change Password"
                  class="mt-8 !text-sm !bg-blue-600 dark:!bg-blue-500 !border-none !transition-all !duration-300 !ease-in-out dark:!text-white hover:!bg-blue-800 hover:dark:!bg-blue-700"
                />
              </div>
            </Form>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Form } from "@primevue/forms";
import { useOtpStore } from "@/stores/otp";
import { useToast } from "primevue/usetoast";
import { api } from "@/lib/axios";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import Settings from "@/components/menu/Settings.vue";
import Password from "primevue/password";
import Message from "primevue/message";
import Button from "primevue/button";
import router from "@/router";

interface InputType {
  newPassword: string;
  confirmPassword: string;
}

const otpStore = useOtpStore();
const toast = useToast();

const initialValues = ref({
  newPassword: "",
  confirmPassword: "",
});

const resolver = ({ values }: { values: InputType | Record<string, any> }) => {
  const errors = {
    newPassword: <object>[],
    confirmPassword: <object>[],
  };

  const regexPassword =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  if (!values.newPassword) {
    errors.newPassword = [{ message: "Password is required" }];
  } else if (!regexPassword.test(values.newPassword)) {
    errors.newPassword = [
      {
        message:
          "Password must be at least 8 characters long and contain at least one letter, one number, and one special character.",
      },
    ];
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = [{ message: "Confirm Password is required" }];
  } else if (values.confirmPassword !== values.newPassword) {
    errors.confirmPassword = [{ message: "Passwords do not match" }];
  }

  return {
    errors,
  };
};

const submitChangePassword = async (e: any) => {
  try {
    const response = await api.patch("/user/change-password", {
      newPassword: e.states.newPassword.value,
    });

    if (response.status !== 200) {
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
      detail: `${response.data.message}`,
      life: 3000,
    });

    router.push("/settings#profile");
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed tp change password, try again!",
      life: 3000,
    });
  }
};

onMounted(() => {
  if (!otpStore.email) {
    router.push("/settings#profile");
  }
});
</script>
<style></style>
