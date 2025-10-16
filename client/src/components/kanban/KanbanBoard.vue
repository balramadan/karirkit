<template>
  <ConfirmDialog></ConfirmDialog>
  <div class="flex flex-col gap-4 py-5 rounded-xl h-[80vh] max-h-full">
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
    >
      <h2 class="md:text-lg font-semibold text-black dark:text-white">
        Job Application
      </h2>
      <div class="flex items-center gap-2">
        <button
          class="text-sm md:text-base rounded-md bg-blue-600 px-3 py-2 text-white cursor-pointer transition-all duration-300 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500 disabled:opacity-60"
          @click="openAddDialog"
          :disabled="creating"
          title="Add"
        >
          + Add
        </button>
        <Icon
          icon="hugeicons:refresh"
          class="rounded-md size-9 md:size-10 bg-transparent px-3 py-2 text-black cursor-pointer border border-solid transition-all duration-300 hover:bg-black/5 dark:bg-white/80 dark:text-black dark:border-white dark:hover:text-black dark:hover:bg-white disabled:opacity-60"
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
      class="flex flex-col sm:flex-row overflow-x-scroll overflow-auto h-full gap-4"
    >
      <div
        v-for="s in statuses"
        :key="s"
        class="min-w-64 w-full sm:w-64 h-fit shrink-0 border border-black/10 bg-blue-500/5 py-3 rounded-lg dark:border-white/10 dark:bg-darksecond select-none"
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
          @end="onDragEnd"
        >
          <template #item="{ element }">
            <div
              :class="[
                'rounded-lg border border-black/10 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/5 group transition-opacity',
                { 'opacity-50': reordering },
              ]"
            >
              <div class="text-sm font-medium text-black dark:text-[#E0E0E0]">
                {{ element.jobTitle }}
              </div>
              <div class="text-xs text-black/60 dark:text-[#A0A0B0]">
                {{ element.companyName }}
              </div>
              <div
                class="flex md:hidden group-hover:flex mt-2 items-center justify-between"
              >
                <a
                  v-if="element.jobUrl"
                  :href="element.jobUrl"
                  class="text-xs text-blue-600 dark:text-blue-400 hover:underline"
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
            class="!text-sm !text-white !bg-blue-500 transition-all duration-300 hover:!bg-blue-700 light:!border-none dark:!border-white dark:!bg-[#1a1a1a] dark:hover:!bg-white/10 px-2 py-2 w-50"
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

        <div class="flex flex-col justify-between items-center gap-2">
          <CV @change="cvOnChange" />
          <CoverLetter @change="coverLetterOnChange" />
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

        <div class="flex flex-col justify-between items-center gap-2">
          <CV :default="editForm.cvVersion" @change="cvOnChange" />
          <CoverLetter
            :default="editForm.coverLetterVersion"
            @change="coverLetterOnChange"
          />
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
import { useConfirm } from "primevue/useconfirm";
import Skeleton from "primevue/skeleton";
import draggable from "vuedraggable";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import DatePicker from "primevue/datepicker";
import CV from "@/components/select/CV.vue";
import CoverLetter from "@/components/select/CoverLetter.vue";

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
const confirm = useConfirm();

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
  coverLetterVersion: "",
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
  coverLetterVersion: "",
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
  addForm.coverLetterVersion = "";
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
  editForm.coverLetterVersion = item.coverLetterVersion || "";
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
      coverLetterVersion: addForm.coverLetterVersion || null,
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
      groupId: activeGroup.value || undefined,
      cvVersion: editForm.cvVersion || undefined,
      coverLetterVersion: editForm.coverLetterVersion || undefined,
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

// Gunakan event @end yang hanya dipicu sekali di akhir drag
async function onDragEnd(evt: any) {
  const fromStatus = evt.from.dataset.status as Status | undefined;
  const toStatus = evt.to.dataset.status as Status | undefined;

  // Jika tidak ada perpindahan kolom atau status, hentikan fungsi
  if (!fromStatus || !toStatus) return;

  // 1. Perbarui status item yang dipindahkan secara lokal
  // Ini adalah kunci untuk memperbaiki bug pada form edit
  if (fromStatus !== toStatus) {
    const itemIndex = evt.newIndex; // Index item di kolom tujuan
    if (columns[toStatus][itemIndex]) {
      columns[toStatus][itemIndex].status = toStatus;
    }
  }

  // 2. Kirim pembaruan ke backend
  try {
    reordering.value = true;
    const affected = new Set([fromStatus, toStatus]);
    const updates = Array.from(affected).flatMap((s) => buildUpdatesFor(s));
    if (updates.length > 0) await reorderApplications(updates);
  } catch (e) {
    console.error("Failed to save reorder:", e);
    await refresh(); // Panggil refresh untuk mengembalikan state yang benar dari server sebagai fallback
  } finally {
    reordering.value = false;
  }
}

async function onDelete(id: string, s: Status) {
  confirm.require({
    message: "Are you sure you want to delete this?",
    header: "Delete",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept: async () => {
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
    },
    reject: () => {},
  });
}

const cvOnChange = (url: string) => {
  if (addDialogVisible.value) addForm.cvVersion = url;
  if (editDialogVisible.value) editForm.cvVersion = url;
};

const coverLetterOnChange = (url: string) => {
  if (addDialogVisible.value) addForm.coverLetterVersion = url;
  if (editDialogVisible.value) editForm.coverLetterVersion = url;
};

onMounted(refresh);

// Pantau perubahan pada activeGroup dan panggil refresh
watch(activeGroup, () => {
  refresh();
});
</script>

<style scoped>
#container-kanban::-webkit-scrollbar {
  width: 8px; /* Lebar untuk scrollbar vertikal */
  height: 8px; /* Tinggi untuk scrollbar horizontal */
}

/* Bagian track (latar belakang scrollbar) */
#container-kanban::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}

/* Bagian thumb (handle yang bisa digeser) */
#container-kanban::-webkit-scrollbar-thumb {
  background-color: #c1c1c1; /* Warna default untuk light mode */
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: content-box;
}

/* Efek hover pada thumb */
#container-kanban::-webkit-scrollbar-thumb:hover {
  background-color: #a8a8a8;
}
</style>
