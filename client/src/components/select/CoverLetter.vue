<template>
  <div :class="['flex flex-col gap-2 w-full', { 'flex-row': props.row }]">
    <label class="text-xs">Cover Letter</label>
    <Select
      v-model="selectedCoverLetter"
      :options="coverLetterList"
      optionLabel="filename"
      optionValue="url"
      placeholder="Select Cover Letter"
      size="small"
      class="!border-blue-600/20 dark:!border-white/20 !w-full !bg-transparent"
      showClear
      @change="onChange"
      :pt="{
        label: {
          class: '!text-blue-600 dark:!text-white',
        },
        option: {
          class: 'aria-selected:!bg-blue-600/20 hover:!bg-blue-600/10',
        },
      }"
    >
      <template #option="slotProps">
        <div :class="['flex items-center']">
          <div>{{ slotProps.option.filename }}</div>
        </div>
      </template>
    </Select>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { getCoverLetter } from "@/lib/storage";
import Select from "primevue/select";

const coverLetterList = ref();
const selectedCoverLetter = ref("");
const isLoading = ref(false);
const emit = defineEmits(["change"]);

const props = defineProps({
  row: {
    type: Boolean,
    default: false,
  },
  default: {
    type: String,
    default: "",
  },
});

selectedCoverLetter.value = props.default;

const onChange = () => {
  emit("change", selectedCoverLetter.value);
};

onMounted(async () => {
  try {
    isLoading.value = true;
    const data = await getCoverLetter();
    coverLetterList.value = data.coverLetters;
  } catch (error) {
    console.error("Failed to fetch Cover Letters:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>
<style></style>
