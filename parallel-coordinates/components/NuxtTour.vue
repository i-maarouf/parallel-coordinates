<template>
  <div class="flex items-center">
    <VTour ref="tour" :autoStart="true" :trapFocus="false" :steps="steps" />
  </div>
</template>
<script lang="ts" setup>
import type { TourStep } from "#nuxt-tour/props";
import { VTour } from "#components";
const tour = ref<InstanceType<typeof VTour> | null>(null);

const tourStore = useTourStore();

const steps: TourStep[] = [
  {
    target: "#plotContainer",
    body: `This is the Retrofit Tool, you can begin by sliding the sliders on the y-axis to select the scenarios you want to compare.`,
    subText: "Step 1 of 5",
    popperConfig: {
      placement: "top",
    },
    onNext: () => {
      scrollToElement("#tableContainer");
    },
  },
  {
    target: "#tableContainer",
    body: `This will automatically reflect on the table below`,
    subText: "Step 2 of 5",
    popperConfig: {
      placement: "top",
    },
    onPrev: () => {
      scrollToElement("#plotContainer");
    },
    onNext: () => {
      scrollToElement(".favouritesBtn");
    },
  },
  {
    target: ".favouritesBtn",
    body: `You can also select specific scenarios and add them to your favourties for easier access later.`,
    subText: "Step 3 of 5",

    onNext: () => {
      scrollToElement(".test");
    },
    onPrev: () => {
      scrollToElement("#tableContainer");
    },
  },
  {
    target: ".favouritesPage",
    body: `The favourited scenarios will be available to access in the Favourites page by clicking here.`,
    subText: "Step 4 of 5",
    onPrev: () => {
      scrollToElement(".favouritesBtn");
    },
    onNext: () => {
      scrollToElement(".settingsPage");
    },
    popperConfig: {
      placement: "bottom",
    },
  },
  {
    target: ".settingsPage",
    subText: "Step 5 of 5",
    body: `That's it! You can now use the Retrofit Tool. <br> To view this tour again, click the <b>Restart Dashboard Guide </b> button in the settings page.`,
    onPrev: () => {
      scrollToElement(".favouritesPage");
    },
    popperConfig: {
      placement: "bottom",
    },
  },
];
const scrollToElement = async (selector: string) => {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};
watch(
  () => tourStore.restartRequested,
  async (newVal) => {
    if (newVal) {
      tour.value?.resetTour();
      tour.value?.startTour();
      tourStore.clearRestart();
    }
  }
);
// const rerunTour = () => {
//   navigateTo("/dashboard");
//   tour.value?.resetTour();
// };
// const onStepChange = () => {
//   console.log("****");

//   tour.value?.recalculatePopper();
// };
</script>
<style scoped></style>
