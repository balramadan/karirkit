<template>
  <div class="flex flex-col gap-4 py-5 rounded-xl h-[71.5vh] max-h-full">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-black dark:text-white">
        Job Application
      </h2>
      <div class="flex items-center gap-2">
        <button
          class="rounded-md bg-blue-600 px-3 py-2 text-white cursor-pointer transition-all duration-300 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-60"
          @click="openAddDialog"
          :disabled="creating"
          title="Add"
        >
          + Add
        </button>
        <Icon
          icon="hugeicons:refresh"
          class="rounded-md size-10 bg-transparent px-3 py-2 text-black cursor-pointer border border-solid transition-all duration-300 hover:bg-black/5 dark:bg-white/80 dark:text-black dark:border-white dark:hover:text-black dark:hover:bg-white disabled:opacity-60"
          @click="refresh"
          :disabled="loading"
        />
      </div>
    </div>

    <div v-if="loading" class="flex flex-row gap-4 w-full h-1/2">
      <Skeleton v-for="i in 5" class="!w-64 !h-full" />
    </div>
    <div
      v-else-if="!error"
      id="container-kanban"
      class="flex overflow-x-scroll overflow-auto h-full gap-4"
    >
      <div
        v-for="s in statuses"
        :key="s"
        class="min-w-64 w-64 h-fit shrink-0 border border-black/10 bg-blue-500/5 py-3 rounded-lg dark:border-white/10 dark:bg-darksecond"
      >
        <div
          class="mb-3 flex items-center justify-between border-b border-black/10 pb-2 px-3 dark:border-white/10"
        >
          <div class="font-medium text-black dark:text-white">
            {{ statusLabels[s] }}
            <span class="ml-1 rounded bg-black/5 px-2 text-xs dark:bg-white/10">
              {{ columns[s].length }}
            </span>
          </div>
          <!-- Tidak ada tombol Add per kolom -->
        </div>

        <!-- List -->
        <draggable
          :list="columns[s]"
          item-key="_id"
          :group="{ name: 'kanban', pull: true, put: true }"
          class="flex min-h-10 flex-col gap-2 px-3 cursor-grab transition-all duration-300 ease-in-out"
          ghost-class="opacity-30"
          :data-status="s"
          @change="onDragChange(s, $event)"
        >
          <template #item="{ element }">
            <div
              :class="['rounded-lg border border-black/10 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/5 group transition-opacity', { 'opacity-50': reordering }]"
            >
              <div class="text-sm font-medium text-black dark:text-[#E0E0E0]">
                {{ element.jobTitle }}
              </div>
              <div class="text-xs text-black/60 dark:text-[#A0A0B0]">
                {{ element.companyName }}
              </div>
              <div
                class="hidden group-hover:flex mt-2 items-center justify-between"
              >
                <a
                  v-if="element.jobUrl"
                  :href="element.jobUrl"
                  class="text-xs text-blue-600 hover:underline"
                  target="_blank"
                >
                  Open job
                </a>
                <div class="flex gap-2">
                  <button
                    class="rounded px-2 py-1 text-xs text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                    @click="openEditDialog(element)"
                  >
                    Edit
                  </button>
                  <button
                    class="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-600/10 cursor-pointer"
                    @click="onDelete(element._id, element.status)"
                  >
                    Del
                  </button>
                </div>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- Single Add Dialog -->
    <Dialog
      v-model:visible="addDialogVisible"
      modal
      class="!bg-white dark:!bg-[#1a1a1a] !text-black dark:!text-white"
      :header="`Add to ${addTargetStatus ? statusLabels[addTargetStatus] : ''}`"
      :style="{ width: '28rem' }"
      @hide="closeAddDialog"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <form class="space-y-3 pt-2" @submit.prevent="onCreate">
        <!-- URL + Fetch (opsional) -->
        <div class="flex gap-2">
          <input
            v-model="addForm.jobUrl"
            class="w-full rounded border border-black/10 px-2 py-2 text-sm text-black dark:text-white dark:border-white/10 dark:bg-transparent"
            placeholder="Job URL (optional)"
          />
          <Button
            type="button"
            label="Fetch Details"
            size="small"
            :loading="fetchLoading"
            class="!text-sm !text-white !bg-blue-700 transition-all duration-300 hover:!bg-blue-800 dark:!border-white dark:!bg-[#1a1a1a] dark:hover:!bg-white/10 px-2 py-2 w-50"
            @click="fetchDetailsFromUrl(addForm.jobUrl)"
          />
        </div>

        <input
          v-model="addForm.jobTitle"
          class="w-full rounded border border-black/10 px-2 py-2 text-sm text-black dark:text-white dark:border-white/10 dark:bg-transparent"
          placeholder="Job title"
          required
        />

        <input
          v-model="addForm.companyName"
          class="w-full rounded border border-black/10 px-2 py-2 text-sm text-black dark:text-white dark:border-white/10 dark:bg-transparent"
          placeholder="Company name"
          required
        />

        <!-- Pilih status -->
        <div class="flex items-center gap-2">
          <label class="w-20 text-xs text-black/70 dark:text-white/70"
            >Status</label
          >
          <select
            v-model="addTargetStatus"
            required
            class="w-full rounded border border-black/10 px-2 py-2 text-sm text-black cursor-pointer dark:text-white dark:border-white/10 dark:bg-[#1a1a1a]"
          >
            <option v-for="s in statuses" :key="s" :value="s">
              {{ statusLabels[s] }}
            </option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <label class="w-20 text-xs text-black/70 dark:text-white/70"
            >Applied at</label
          >
          <DatePicker
            v-model="addForm.appliedAt"
            class="w-full"
            inputClass="!border !border-black/10 dark:!border-white/10 !bg-transparent !text-black dark:!text-white focus:!border-black dark:focus:!border-white focus:!outline-none focus:!ring-0"
            showIcon
            fluid
            dateFormat="dd/mm/yy"
            :showOnFocus="false"
          />
        </div>

        <textarea
          v-model="addForm.jobDescription"
          class="w-full rounded border border-black/10 px-2 py-2 text-sm text-black dark:text-white dark:border-white/10 dark:bg-transparent"
          placeholder="Description (auto-filled from URL)"
          rows="4"
        ></textarea>

        <div class="flex justify-between items-center gap-2">
          <CV @change="cvOnChange" />
        </div>

        <textarea
          v-model="addForm.notes"
          class="w-full rounded border border-black/10 px-2 py-2 text-sm text-black dark:text-white dark:border-white/10 dark:bg-transparent"
          placeholder="Notes"
          rows="2"
        ></textarea>

        <div class="flex gap-2 pt-1">
          <button
            type="submit"
            class="rounded bg-blue-600 px-3 py-2 text-xs text-white cursor-pointer dark:bg-[#131313] hover:bg-blue-700 dark:hover:bg-[#000000] disabled:opacity-60"
            :disabled="creating || !addTargetStatus"
            title="Save"
          >
            Save
          </button>
          <button
            type="button"
            class="rounded px-3 py-2 text-xs text-red-500 hover:bg-black/5 dark:hover:bg-white/10"
            @click="closeAddDialog"
          >
            Cancel
          </button>
        </div>
      </form>
    </Dialog>

    <!-- Edit Dialog -->
    <Dialog
      v-model:visible="editDialogVisible"
      modal
      class="!bg-white dark:!bg-[#1a1a1a] !text-black dark:!text-white"
      header="Edit Application"
      :style="{ width: '28rem' }"
      @hide="closeEditDialog"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <form
        v-if="editingItem"
        class="space-y-3 pt-2"
        @submit.prevent="onUpdate"
      >
        <input
          v-model="editForm.jobTitle"
          class="w-full rounded border border-black/10 px-2 py-2 text-sm text-black dark:text-white dark:border-white/10 dark:bg-transparent"
          placeholder="Job title"
          required
        />

        <input
          v-model="editForm.companyName"
          class="w-full rounded border border-black/10 px-2 py-2 text-sm text-black dark:text-white dark:border-white/10 dark:bg-transparent"
          placeholder="Company name"
          required
        />

        <input
          v-model="editForm.jobUrl"
          class="w-full rounded border border-black/10 px-2 py-2 text-sm text-black dark:text-white dark:border-white/10 dark:bg-transparent"
          placeholder="Job URL (optional)"
        />

        <div class="flex items-center gap-2">
          <label class="w-20 text-xs text-black/70 dark:text-white/70"
            >Status</label
          >
          <select
            v-model="editForm.status"
            required
            class="w-full rounded border border-black/10 px-2 py-2 text-sm text-black cursor-pointer dark:text-white dark:border-white/10 dark:bg-[#1a1a1a]"
          >
            <option v-for="s in statuses" :key="s" :value="s">
              {{ statusLabels[s] }}
            </option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <label class="w-20 text-xs text-black/70 dark:text-white/70"
            >Applied at</label
          >
          <DatePicker
            v-model="editForm.appliedAt"
            class="w-full"
            inputClass="!border !border-black/10 dark:!border-white/10 !bg-transparent !text-black dark:!text-white focus:!border-black dark:focus:!border-white focus:!outline-none focus:!ring-0"
            showIcon
            fluid
            dateFormat="dd/mm/yy"
            :showOnFocus="false"
          />
        </div>

        <textarea
          v-model="editForm.jobDescription"
          class="w-full rounded border border-black/10 px-2 py-2 text-sm text-black dark:text-white dark:border-white/10 dark:bg-transparent"
          placeholder="Description"
          rows="4"
        ></textarea>

        <div class="flex justify-between items-center gap-2">
          <CV :default="editForm.cvVersion" @change="cvOnChange" />
        </div>

        <textarea
          v-model="editForm.notes"
          class="w-full rounded border border-black/10 px-2 py-2 text-sm text-black dark:text-white dark:border-white/10 dark:bg-transparent"
          placeholder="Notes"
          rows="2"
        ></textarea>

        <div class="flex gap-2 pt-1">
          <button
            type="submit"
            class="rounded bg-blue-600 px-3 py-2 text-xs text-white cursor-pointer dark:bg-[#131313] hover:bg-blue-700 dark:hover:bg-[#000000] disabled:opacity-60"
            :disabled="updating"
            title="Save Changes"
          >
            Save Changes
          </button>
          <button
            type="button"
            class="rounded px-3 py-2 text-xs text-red-500 hover:bg-black/5 dark:hover:bg-white/10"
            @click="closeEditDialog"
          >
            Cancel
          </button>
        </div>
      </form>
    </Dialog>
    <div v-if="error" class="text-sm text-red-600">Error: {{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch } from "vue";
import { Icon } from "@iconify/vue";
import type { Application, Status } from "@/types/application";
import {
  listByStatus,
  createApplication,
  deleteApplication,
  reorderApplications,
  updateApplication,
} from "@/composables/application";
import { scrapeJob } from "@/composables/scrapeJob";
import { useGroupStore } from "@/stores/group";
import { storeToRefs } from "pinia";
import Skeleton from "primevue/skeleton";
import draggable from "vuedraggable";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import DatePicker from "primevue/datepicker";
import CV from "@/components/select/CV.vue";

const statuses = [
  "backlog",
  "applied",
  "interview",
  "offer",
  "rejected",
] as const;

const statusLabels: Record<Status, string> = {
  backlog: "Backlog",
  applied: "Applied",
  screening: "Screening",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

const columns = reactive<Record<Status, Application[]>>({
  backlog: [],
  applied: [],
  screening: [],
  interview: [],
  offer: [],
  rejected: [],
});

const groupStore = useGroupStore();
const { activeGroup } = storeToRefs(groupStore);

const loading = ref(false);
const fetchLoading = ref(false);
const creating = ref(false);
const updating = ref(false);
const error = ref<string | null>(null);
const reordering = ref(false);

// Dialog Add tunggal
const addDialogVisible = ref(false);
const addTargetStatus = ref<Status | null>(null);
const addForm = reactive({
  jobTitle: "",
  companyName: "",
  jobUrl: "",
  notes: "",
  jobDescription: "",
  appliedAt: null as Date | null,
  cvVersion: "",
});

// Dialog Edit
const editDialogVisible = ref(false);
const editingItem = ref<Application | null>(null);
const editForm = reactive({
  _id: "",
  jobTitle: "",
  companyName: "",
  jobUrl: "",
  notes: "",
  jobDescription: "",
  status: "backlog" as Status,
  appliedAt: null as Date | null,
  cvVersion: "",
});

function openAddDialog() {
  // default ke backlog saat dibuka
  addTargetStatus.value = "backlog";
  addDialogVisible.value = true;
}

function closeAddDialog() {
  addDialogVisible.value = false;
  addTargetStatus.value = null;
  addForm.jobTitle = "";
  addForm.companyName = "";
  addForm.jobUrl = "";
  addForm.notes = "";
  addForm.jobDescription = "";
  addForm.appliedAt = null;
  addForm.cvVersion = "";
}

function openEditDialog(item: Application) {
  editingItem.value = item;
  if (!item) return;

  editForm._id = item._id;
  editForm.jobTitle = item.jobTitle;
  editForm.companyName = item.companyName;
  editForm.jobUrl = item.jobUrl || "";
  editForm.status = item.status;
  editForm.notes = item.notes || "";
  editForm.jobDescription = item.jobDescription || "";
  editForm.appliedAt = item.appliedAt ? new Date(item.appliedAt) : null;
  editForm.cvVersion = item.cvVersion || "";
  editDialogVisible.value = true;
}

function closeEditDialog() {
  editDialogVisible.value = false;
  editingItem.value = null;
}

async function refresh() {
  loading.value = true;
  error.value = null;
  try {
    const results = await Promise.all(
      statuses.map((s) => listByStatus(s, 1000, "position", activeGroup.value))
    );
    statuses.forEach((s, idx) => {
      columns[s].splice(0, columns[s].length, ...results[idx]);
    });
  } catch (e: any) {
    error.value = e?.message ?? "Failed to load";
  } finally {
    loading.value = false;
  }
}

async function fetchDetailsFromUrl(url: string) {
  if (!url.trim()) return;
  try {
    fetchLoading.value = true;
    const details = await scrapeJob(url);
    if (details.title) addForm.jobTitle = details.title;
    if (details.company) addForm.companyName = details.company;
    if ((details as any).description)
      addForm.jobDescription = (details as any).description;
  } catch (e: any) {
    alert(e?.message ?? "Failed to fetch details");
  } finally {
    fetchLoading.value = false;
  }
}

async function onCreate() {
  if (!addTargetStatus.value) return;
  if (!addForm.jobTitle || !addForm.companyName) return;
  creating.value = true;
  const s = addTargetStatus.value;
  try {
    const doc = await createApplication({
      jobTitle: addForm.jobTitle,
      companyName: addForm.companyName,
      jobUrl: addForm.jobUrl || undefined,
      status: s,
      notes: addForm.notes || undefined,
      jobDescription: addForm.jobDescription || undefined,
      position: columns[s].length,
      appliedAt: addForm.appliedAt || undefined,
      groupId: activeGroup.value || undefined,
      cvVersion: addForm.cvVersion || null,
    } as any);
    columns[s].push(doc);
    closeAddDialog();
  } catch (e: any) {
    alert(e?.message ?? "Failed to create");
  } finally {
    creating.value = false;
  }
}

async function onUpdate() {
  if (!editingItem.value) return;
  updating.value = true;
  try {
    const updatedData = {
      jobTitle: editForm.jobTitle,
      companyName: editForm.companyName,
      jobUrl: editForm.jobUrl || undefined,
      status: editForm.status,
      notes: editForm.notes || undefined,
      jobDescription: editForm.jobDescription || undefined,
      appliedAt: editForm.appliedAt?.toISOString() || undefined,
    };

    await updateApplication(editingItem.value._id, updatedData);
    closeEditDialog();
    await refresh(); // Easiest way to reflect changes
  } catch (e: any) {
    alert(e?.message ?? "Failed to update");
  } finally {
    updating.value = false;
  }
}

function buildUpdatesFor(status: Status) {
  return columns[status].map((item, idx) => ({
    id: item._id,
    status,
    position: idx,
  }));
}

async function onDragChange(targetStatus: Status, evt: any) {
  try {
    reordering.value = true;
    const affected = new Set<Status>();
    const fromStatus: Status | undefined = evt?.from?.dataset?.status;
    const toStatus: Status | undefined = evt?.to?.dataset?.status;

    if (evt?.added?.element && toStatus) {
      evt.added.element.status = toStatus;
    }

    if (fromStatus) affected.add(fromStatus as Status);
    if (toStatus) affected.add(toStatus as Status);
    if (!affected.size) affected.add(targetStatus);

    const updates = Array.from(affected).flatMap((s) => buildUpdatesFor(s));
    console.log(updates)
    await reorderApplications(updates);
  } catch (e) {
    await refresh(); // Panggil refresh untuk mengembalikan state yang benar dari server sebagai fallback
  } finally {
    reordering.value = false;
  }
}

async function onDelete(id: string, s: Status) {
  if (!confirm("Delete this application?")) return;
  const idx = columns[s].findIndex((x) => x._id === id);
  if (idx === -1) return;
  const removed = columns[s].splice(idx, 1)[0];
  try {
    await deleteApplication(id);
    const updates = buildUpdatesFor(s);
    if (updates.length) await reorderApplications(updates);
  } catch (e) {
    columns[s].splice(idx, 0, removed);
    // Tampilkan notifikasi error yang lebih informatif
    alert("Failed to delete application. Please try again.");
  }
}

const cvOnChange = (url: string) => {
  addForm.cvVersion = url;
};

onMounted(refresh);

// Pantau perubahan pada activeGroup dan panggil refresh
watch(activeGroup, () => {
  refresh();
});
</script>

<style scoped>
#container-kanban::-webkit-scrollbar {
  display: none;
}
/* optional small tweaks */
</style>
