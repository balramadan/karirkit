<template>
  <div :class="['flex flex-col gap-2 w-full', { 'flex-row': props.row }]">
    <label class="text-xs">Curriculum Vitae</label>
    <Select
      v-model="selectedCv"
      :options="cvList"
      @change="onChange"
      optionLabel="filename"
      optionValue="url"
      placeholder="Select CV"
      size="small"
      class="!border-blue-500 !w-full"
      showClear
      :defaultValue="props.default"
      :pt="{
        label: {
          class: '!text-blue-500',
        },
        option: {
          class: 'aria-selected:!bg-blue-500/20 hover:!bg-blue-500/10',
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
import { onMounted, ref } from "vue";
import { getCvs } from "@/lib/storage";
import Select from "primevue/select";

const cvList = ref();
const selectedCv = ref();
const isLoading = ref(false);
const emit = defineEmits(["change"]);

const onChange = () => {
  emit('change', selectedCv.value);
};

onMounted(async () => {
  try {
    isLoading.value = true;
    const data = await getCvs();
    cvList.value = data.cvs;
  } catch (error) {
    console.error("Failed to fetch CVs:", error);
  } finally {
    isLoading.value = false;
  }
});

const props = defineProps({
  row: {
    type: Boolean,
    default: false,
  },
  default: {
    type: String,
    default: "",
  }
});
</script>
<style lang=""></style>
