<template>
  <div>
    <!-- <UHeader /> -->

    <NuxtLayout>
      <UModal v-model="isOpen" prevent-close>
        <UCard
          :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          }"
          class="items-center justify-center flex flex-col"
        >
          <template #header>
            <div class="flex items-center justify-center">
              <h3
                class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
              >
                Modal
              </h3>
            </div>
          </template>
          <div class="flex flex-col items-center justify-center gap-4">
            <div class="text-md">
              Please note that this dashboard is for demo purposes only.
            </div>

            <UButton
              color="primary"
              variant="soft"
              label="Acknowledge"
              icon="i-heroicons-check"
              :trailing="true"
              @click="isOpen = false"
            />
          </div>
        </UCard>
      </UModal>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
    <!-- <UFooter /> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      isOpen: true,
    };
  },
};
</script>
<style>
.modebar-container {
  display: none;
}
</style>
