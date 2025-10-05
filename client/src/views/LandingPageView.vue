<template>
    <DefaultLayout>
        <template #default>
            <SectionOne />
            <SectionTwo />
            <SectionThree />
            <SectionFour />
            <SectionFive />
        </template>
    </DefaultLayout>
</template>
<script setup lang="ts">
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import SectionOne from "@/components/landing/SectionOne.vue";
import SectionTwo from "@/components/landing/SectionTwo.vue";
import SectionThree from "@/components/landing/SectionThree.vue";
import SectionFour from "@/components/landing/SectionFour.vue";
import SectionFive from "@/components/landing/SectionFive.vue";
</script>
<style></style>