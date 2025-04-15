<template>
  <div
    class="flex flex-col items-start space-x-2 w-full pt-36 pb-10 px-5 overflow-y-auto"
  >
    <UButton
      icon="i-heroicons-arrow-path"
      trailing
      size="sm"
      variant="outline"
      @click="triggerTour"
      >Restart Dashboard Guide</UButton
    >
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: "dashboard layout",
});
import { useTourStore } from "~/stores/tour";

const tourStore = useTourStore();

const triggerTour = async () => {
  if (window.location.pathname !== "/dashboard") {
    await navigateTo("/dashboard");
    // Let the dashboard fully mount before triggering the tour
    tourStore.requestRestart();

    setTimeout(() => {
      tourStore.requestRestart();
    }, 300);
  } else {
    tourStore.requestRestart();
  }
};
</script>
