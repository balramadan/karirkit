<template>
  <div
    class="flex items-center justify-between py-5 px-5 sm:px-6 lg:px-20 shadow-sm"
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
        class="h-8 w-auto light:block dark:hidden"
        height="32"
        width="32"
        src="/KarirKit-light.png"
        alt="Your Company"
      />
      <Image
        class="h-8 w-auto light:hidden dark:block"
        height="32"
        width="32"
        src="/KarirKit-dark.png"
        alt="Your Company"
      />
      <div class="hidden md:ml-6 md:block">
        <Select
          v-model="selectedGroup"
          :options="groups"
          placeholder="Select Group"
          size="small"
          class="!border-blue-500"
          :default-value="groups[0]"
          :pt="{
            option: {
              class: 'aria-selected:!bg-blue-500/20 hover:!bg-blue-500/10',
            },
          }"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value" class="">
              <p class="text-blue-500">{{ slotProps.value.name }}</p>
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
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

      <button
        type="button"
        class="hidden sm:block relative rounded-full p-1 text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 dark:hover:text-white"
      >
        <span class="absolute -inset-1.5" />
        <span class="sr-only">View notifications</span>
        <Icon
          icon="tdesign:notification-filled"
          class="size-6 md:size-4"
          aria-hidden="true"
        />
      </button>

      <div class="">
        <Avatar
          label="P"
          class="!size-9 !cursor-pointer"
          shape="circle"
          @click="toggle"
        />
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
    <Form v-slot="$form" class="w-full">
      <div class="flex flex-col gap-2">
        <label for="name">Group Name</label>
        <InputText name="name" class="w-full" />
      </div>
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
            />
            <Image
              src="/KarirKit-dark.png"
              class="w-auto light:hidden dark:block"
              width="24"
              alt="Logo"
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
            v-ripple
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
import Image from "primevue/image";
import Select from "primevue/select";
import Dialog from "primevue/dialog";
import Drawer from "primevue/drawer";
import Button from "primevue/button";
import Avatar from "primevue/avatar";
import Menu from "primevue/menu";
import InputText from "primevue/inputtext"
import SwitchMode from "@/components/SwitchMode.vue";

const menu = ref();
const selectedGroup = ref();
const groups = ref([{ name: "All" }]);
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

const drawer = ref(false);
const toggle = (event: any) => {
  menu.value.toggle(event);
};

onMounted(async () => {
  await getGroups();
});

const getGroups = async () => {
  try {
    const { data } = await api.get("/v1/group");

    groups.value.push = data;
  } catch (err) {
    console.error(err);
  }
};

const addGroup = async (e: any) => {
  try {
    console.log(e)
  } catch (err) {
    console.error(err)
  }
}
</script>
<style scoped></style>
