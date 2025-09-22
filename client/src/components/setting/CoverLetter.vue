<template>
  <DashboardLayout>
    <template #default>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 my-5">
        <div class="sm:col-span-3 lg:col-span-2">
          <Settings />
        </div>
        <div class="sm:col-span-9 lg:col-span-10 px-2.5 md:px-5">
          <h3 class="font-bold">Cover Letter</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Upload and manage all your cover letter here. You can select the
            relevant cover letter when applying for a job.
          </p>
          <div class="mt-4">
            <Form
              @submit="handleUploadCoverLetter"
              class="flex flex-col md:flex-row justify-center md:justify-between items-center"
            >
              <div class="mb-4">
                <input
                  id="coverletter-upload"
                  type="file"
                  @change="handleFileChange"
                  accept=".pdf,.doc,.docx"
                  class="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-700 dark:file:text-white hover:file:bg-blue-900 file:cursor-pointer"
                />
              </div>

              <Button
                type="submit"
                :disabled="!selectedFile || isLoading"
                class="!cursor-pointer !inline-flex !justify-center !py-2 !px-4 !border !border-transparent !shadow-sm !text-sm !font-medium !rounded-md !text-white !bg-blue-600 hover:!bg-blue-700 focus:!outline-none focus:!ring-2 focus:!ring-offset-2 focus:!ring-blue-500 disabled:!bg-gray-400 disabled:!cursor-not-allowed"
              >
                <span v-if="isLoading">Uploading...</span>
                <span v-else>Upload Document</span>
              </Button>
            </Form>

            <hr class="my-4 border-gray-200 dark:border-gray-700" />

            <h4 class="font-bold text-lg mb-4">Saved Cover Letter</h4>
            <div v-if="isLoadingCoverLetters" class="text-center text-gray-500">
              Loading cover letters list...
            </div>
            <div
              v-else-if="coverLetterList.length === 0"
              class="text-center text-gray-500 p-4 bg-black/5 dark:bg-white/10 rounded-lg"
            >
              You have not uploaded your cover letter.
            </div>
            <ul v-else class="space-y-3">
              <li
                v-for="coverLetter in coverLetterList"
                :key="coverLetter._id"
                class="flex items-center justify-between p-3 bg-black/5 dark:bg-white/10 rounded-lg"
              >
                <div class="flex items-center gap-2">
                  <Icon icon="tdesign:file" />
                  <span
                    class="text-sm font-medium text-gray-800 dark:text-gray-200"
                    >{{ coverLetter.filename }}</span
                  >
                </div>
                <div class="flex items-center space-x-3">
                  <a
                    :href="coverLetter.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium cursor-pointer"
                    >Look</a
                  >
                  <button
                    @click="handleDeleteCoverLetter(coverLetter._id)"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>

  <Dialog
    v-model:visible="dialogDelete"
    modal
    header="Delete Cover Letter?"
    :style="{ width: '25rem' }"
  >
    <span class="text-gray-700 dark:text-gray-300"
      >Are you sure you want to delete this CV? This action cannot be
      undone.</span
    >
    <div class="flex justify-end gap-2 mt-4">
      <Button
        label="Batal"
        severity="secondary"
        @click="dialogDelete = false"
      />
      <Button label="Hapus" severity="danger" @click="confirmDelete" />
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import Settings from "@/components/menu/Settings.vue";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { Form } from "@primevue/forms";
import { Icon } from "@iconify/vue";
import {
  uploadCoverLetter,
  getCoverLetter,
  deleteCoverLetter,
} from "@/lib/storage";

interface CoverLetter {
  _id: string;
  url: string;
  filename: string;
  uploadedAt?: string;
}

const toast = useToast();

const selectedFile = ref<File | null>(null);
const isLoading = ref(false);
const message = ref("");
const isError = ref(false);

const coverLetterList = ref<CoverLetter[]>([]);
const isLoadingCoverLetters = ref(true);
const dialogDelete = ref(false);
const itemToDeleteId = ref<string | null>(null);

onMounted(async () => {
  try {
    isLoadingCoverLetters.value = true;
    const data = await getCoverLetter();
    // @ts-ignore
    coverLetterList.value = data.coverLetters;
  } catch (error) {
    console.error("Failed to fetch CVs:", error);
    message.value = "Gagal memuat daftar CV yang sudah ada.";
    isError.value = true;
  } finally {
    isLoadingCoverLetters.value = false;
  }
});

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
    message.value = "";
    isError.value = false;
  }
};

const handleUploadCoverLetter = async () => {
  if (!selectedFile.value) {
    message.value = "Silakan pilih file terlebih dahulu.";
    isError.value = true;
    return;
  }

  isLoading.value = true;
  message.value = "";
  isError.value = false;

  try {
    const response = await uploadCoverLetter(selectedFile.value);
    coverLetterList.value.push(response.coverLetter);
    message.value = `File "${response.coverLetter.filename}" berhasil diunggah!`;
    toast.add({
      severity: "success",
      summary: "Success",
      detail: message.value,
      life: 3000,
    });
    isError.value = false;
    // Reset input file setelah berhasil unggah
    selectedFile.value = null;
    // @ts-ignore
    const fileInput = document.getElementById(
      "coverletter-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  } catch (error: any) {
    console.error("Upload failed:", error);
    message.value =
      error.response?.data?.message ||
      "Gagal mengunggah file. Silakan coba lagi.";
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const handleDeleteCoverLetter = (id: string) => {
  itemToDeleteId.value = id;
  dialogDelete.value = true;
};

const confirmDelete = async () => {
  if (!itemToDeleteId.value) return;

  dialogDelete.value = false;
  try {
    await deleteCoverLetter(itemToDeleteId.value);
    coverLetterList.value = coverLetterList.value.filter(
      (cl) => cl._id !== itemToDeleteId.value
    );
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Cover letter deleted successfully.",
      life: 3000,
    });
    itemToDeleteId.value = null;
  } catch (error: any) {
    console.error("Delete failed:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.response?.data?.message || "Failed to delete cover letter.",
      life: 3000,
    });
  }
};
</script>
<style lang=""></style>
