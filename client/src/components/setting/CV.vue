<template>
  <DashboardLayout>
    <template #default>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-5 my-5">
        <div class="sm:col-span-3 lg:col-span-2">
          <Settings />
        </div>
        <div class="sm:col-span-9 lg:col-span-10 px-2.5 md:px-5">
          <h3 class="font-bold">Curriculum Vitae</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Upload and manage all your curriculum vitae here. You can select the
            relevant curriculum vitae when applying for a job.
          </p>
          <div class="mt-4">
            <Form
              @submit="handleUploadCv"
              class="flex flex-col md:flex-row justify-center md:justify-between items-center"
            >
              <div class="mb-4">
                <input
                  id="cv-upload"
                  type="file"
                  @change="handleFileChange"
                  accept=".pdf,.doc,.docx"
                  class="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 dark:file:bg-blue-700 dark:file:text-white hover:file:bg-blue-700 hover:dark:file:bg-blue-800 file:cursor-pointer"
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

            <h4 class="font-bold text-lg mb-4">Saved Curriculum Vitae</h4>
            <div v-if="isLoadingCvs" class="text-center text-gray-500">
              Loading CV's list...
            </div>
            <div
              v-else-if="cvList.length === 0"
              class="text-center text-gray-500 p-4 bg-black/5 dark:bg-white/10 rounded-lg"
            >
              You have not uploaded your resume.
            </div>
            <ul v-else class="space-y-3">
              <li
                v-for="cv in cvList"
                :key="cv._id"
                class="flex items-center justify-between p-3 bg-black/5 dark:bg-white/10 rounded-lg"
              >
                <div class="flex items-center gap-2">
                  <Icon icon="tdesign:file-1" />
                  <span
                    class="text-sm font-medium text-gray-800 dark:text-gray-200"
                    >{{ cv.filename }}</span
                  >
                </div>
                <div class="flex items-center space-x-3">
                  <a
                    :href="cv.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium cursor-pointer"
                    >Look</a
                  >
                  <button
                    @click="handleDeleteCv(cv._id)"
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
    header="Delete CV?"
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
import { useToast } from "primevue/usetoast";
import { Form } from "@primevue/forms";
import { Icon } from "@iconify/vue";
import { uploadCv, getCvs, deleteCv } from "@/lib/storage";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import Settings from "@/components/menu/Settings.vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";

interface CV {
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

const cvList = ref<CV[]>([]);
const isLoadingCvs = ref(true);
const dialogDelete = ref(false);
const cvToDeleteId = ref<string | null>(null);

onMounted(async () => {
  try {
    isLoadingCvs.value = true;
    const data = await getCvs();
    cvList.value = data.cvs;
  } catch (error) {
    console.error("Failed to fetch CVs:", error);
    message.value = "Gagal memuat daftar CV yang sudah ada.";
    isError.value = true;
  } finally {
    isLoadingCvs.value = false;
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

const handleUploadCv = async () => {
  if (!selectedFile.value) {
    message.value = "Silakan pilih file terlebih dahulu.";
    isError.value = true;
    return;
  }

  isLoading.value = true;
  message.value = "";
  isError.value = false;

  try {
    const response = await uploadCv(selectedFile.value); // Backend harus mengembalikan CV yang baru dibuat
    cvList.value.push(response.cv);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: message.value,
      life: 3000,
    });
    isError.value = false;
    // Reset input file setelah berhasil unggah
    selectedFile.value = null;
    const fileInput = document.getElementById("cv-upload") as HTMLInputElement;
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

const handleDeleteCv = (cvId: string) => {
  cvToDeleteId.value = cvId;
  dialogDelete.value = true;
};

const confirmDelete = async () => {
  if (!cvToDeleteId.value) return;

  dialogDelete.value = false; // Tutup dialog
  try {
    await deleteCv(cvToDeleteId.value);
    // Hapus CV dari list di frontend
    cvList.value = cvList.value.filter((cv) => cv._id !== cvToDeleteId.value);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "CV berhasil dihapus.",
      life: 3000,
    });
    isError.value = false; // Reset error state
    cvToDeleteId.value = null; // Reset ID CV yang akan dihapus
  } catch (error: any) {
    console.error("Delete failed:", error);
    message.value = error.response?.data?.message || "Gagal menghapus CV.";
    isError.value = true;
  }
};
</script>
<style lang=""></style>
