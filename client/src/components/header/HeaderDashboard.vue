<template>
  <div
    class="flex items-center justify-between py-2.5 px-5 sm:px-6 lg:px-20 xl:px-40 shadow-sm"
  >
    <div class="relative flex md:hidden items-center justify-between">
      <Icon
        icon="tdesign:menu-fold"
        class="block size-5"
        aria-hidden="true"
        @click="drawer = true"
      />
    </div>
    <div
      class="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
    >
      <Image
        class="h-8 w-auto cursor-pointer light:block dark:hidden"
        height="32"
        width="32"
        src="/KarirKit-light.png"
        alt="Your Company"
        @click="toDashboard"
      />
      <Image
        class="h-8 w-auto cursor-pointer light:hidden dark:block"
        height="32"
        width="32"
        src="/KarirKit-dark.png"
        alt="Your Company"
        @click="toDashboard"
      />
      <div class="hidden md:ml-6 md:block gap-5">
        <Skeleton v-if="isGroupLoading" class="!w-36 !h-full" shape="square" />
        <Select
          v-else
          v-model="selectedGroup"
          @change="changeGroup"
          :options="groups"
          option-label="name"
          option-value="_id"
          placeholder="Select Group"
          size="small"
          class="!border-blue-600 dark:!border-white"
          showClear
          :pt="{
            label: {
              class: '!text-blue-500 dark:!text-white',
            },
            option: {
              class: 'aria-selected:!bg-blue-600/20 hover:!bg-blue-600/10',
            },
          }"
        >
          <template #option="slotProps">
            <div :class="['flex items-center']">
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>
          <template #footer>
            <div class="p-2.5">
              <Button
                @click="addGroupDialog = true"
                label="Add New"
                severity="secondary"
                variant="text"
                size="small"
                fluid
              >
                <template #icon>
                  <Icon icon="tdesign:folder-add-1" />
                </template>
              </Button>
            </div>
          </template>
        </Select>
      </div>
    </div>
    <div
      class="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:flex md:gap-4 md:inset-auto md:ml-6 md:pr-0"
    >
      <SwitchMode class="hidden sm:block" />

      <div
        class="flex flex-row gap-2 items-center px-2.5 py-2.5 cursor-pointer rounded-full group hover:bg-blue-600/5 hover:bg-white/5 transition-all duration-300 ease-in-out"
        @click="toggle"
      >
        <Avatar
          v-if="props.dataUser?.photoUrl"
          :image="props.dataUser?.photoUrl"
          class="!size-9"
          shape="circle"
        />
        <Avatar
          v-else
          :label="initial"
          class="!size-9"
          shape="circle"
        />
        <p>{{ props.dataUser?.name }}</p>
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
          <template #item="{ item, props }">
            <RouterLink
              v-if="item.url"
              :to="item.url"
              class="flex items-center"
              v-bind="props.action"
            >
              <Icon
                v-if="item.icon"
                :icon="item.icon"
                :class="[{ '!text-red-500': item.url === '/logout' }]"
              />
              <span :class="[{ 'text-red-500': item.url === '/logout' }]">{{
                item.label
              }}</span>
            </RouterLink>
          </template>
        </Menu>
      </div>
    </div>
  </div>

  <Dialog
    v-model:visible="addGroupDialog"
    header="Add New Group"
    class="w-[25rem]"
    closable
    draggable
    modal
  >
    <Form v-slot="$form" class="w-full" @submit="addGroup">
      <div class="flex flex-col gap-2">
        <label for="groupName">Group Name</label>
        <InputText
          name="groupName"
          class="!w-full !text-sm focus:!border-blue-700"
        />
      </div>
      <Button
        type="submit"
        class="mt-5 !text-sm w-full !bg-blue-600 !border-none !transition-all !duration-300 !ease-in-out dark:!text-white dark:!bg-blue-700 hover:!bg-blue-700 dark:hover:!bg-blue-800"
        label="Add"
      />
    </Form>
  </Dialog>

  <Drawer v-model:visible="drawer">
    <template #container="{ closeCallback }">
      <div class="flex flex-col h-full gap-4">
        <div class="flex items-center justify-between px-5 mt-4 shrink-0">
          <span class="flex flex-row items-center gap-2">
            <Image
              src="/KarirKit-light.png"
              class="w-auto light:block dark:hidden"
              width="24"
              alt="Logo"
              @click="toDashboard"
            />
            <Image
              src="/KarirKit-dark.png"
              class="w-auto light:hidden dark:block"
              width="24"
              alt="Logo"
              @click="toDashboard"
            />
            <span class="font-semibold text-xl text-primary">KarirKit</span>
          </span>
          <span>
            <Button
              type="button"
              @click="closeCallback"
              class="!text-black !border-black dark:!text-white dark:!border-white"
              rounded
              variant="outlined"
            >
              <template #icon>
                <Icon icon="tdesign:close" />
              </template>
            </Button>
          </span>
        </div>
        <div class="overflow-y-auto flex flex-col px-5"></div>
        <div class="mt-auto">
          <hr
            class="mb-4 mx-4 border-t border-0 border-surface-200 dark:border-surface-700"
          />
          <a
            class="m-4 flex items-center cursor-pointer p-4 gap-2 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple"
          >
            <Avatar image="/images/avatar/amyelsner.png" shape="circle" />
            <span class="font-bold">Amy Elsner</span>
          </a>
        </div>
      </div>
    </template>
  </Drawer>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { api } from "@/lib/axios";
import { Form } from "@primevue/forms";
import { useToast } from "primevue/usetoast";
import { useGroupStore } from "@/stores/group";
import { getInitials } from "@/composables/text"
import Skeleton from "primevue/skeleton";
import Image from "primevue/image";
import Select from "primevue/select";
import Dialog from "primevue/dialog";
import Drawer from "primevue/drawer";
import Button from "primevue/button";
import Avatar from "primevue/avatar";
import Menu from "primevue/menu";
import InputText from "primevue/inputtext";
import SwitchMode from "@/components/SwitchMode.vue";
import router from "@/router";

const props = defineProps({
  dataUser: {
    type: Object,
  },
});

const isGroupLoading = ref(true);
const isProfileLoading = ref(false);

const menu = ref();
const selectedGroup = ref();
const groups = ref();
const addGroupDialog = ref(false);
const items = ref([
  {
    label: "Settings",
    icon: "tdesign:setting",
    url: "/settings#profile",
  },
  {
    label: "Logout",
    icon: "tdesign:logout",
    url: "/logout",
  },
]);

const groupStore = useGroupStore();
const toast = useToast();
const drawer = ref(false);
const toggle = (event: any) => {
  menu.value.toggle(event);
};
const initial = getInitials(props.dataUser?.name)

const getGroups = async () => {
  try {
    isGroupLoading.value = true;

    await groupStore.getGroups();
    groups.value = groupStore.groups;
  } catch (error) {
    console.error("Failed to get data group:", error);
  } finally {
    isGroupLoading.value = false;
  }
};

const changeGroup = () => {
  if (!selectedGroup.value) {
    return groupStore.clearGroup();
  }
  groupStore.setGroup(selectedGroup.value);
  console.log("Group change");
};

const addGroup = async (e: any) => {
  try {
    console.log(e?.states.groupName.value);
    const response = await api.post(
      "/v1/group",
      {
        name: e?.states.groupName.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 201) {
      toast.add({
        severity: "error",
        summary: "Failed",
        detail: response.data?.message,
        life: 3000,
      });
    }

    await getGroups();
    toast.add({
      severity: "success",
      summary: "Success",
      detail: response.data?.message,
      life: 3000,
    });
  } catch (err) {
    console.error(err);
  }
};

const toDashboard = () => {
  router.push("/dashboard");
};

onMounted(async () => {
  await getGroups();
  if (groupStore.activeGroup) {
    selectedGroup.value = groupStore.activeGroup;
  }
});
</script>
<style scoped></style>
