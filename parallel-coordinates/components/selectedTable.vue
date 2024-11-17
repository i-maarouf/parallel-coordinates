<template>
  <div class="w-full">
    <UCard>
      <UTable
        :rows="selectedData"
        :loading="selectedData ? false : true"
        :loading-state="{
          icon: 'i-heroicons-arrow-path-20-solid',
          label: 'Loading...',
        }"
      >
        <template #caption>
          <caption>
            Paths Selected
          </caption>
        </template>
      </UTable>
      <div
        class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
      >
        <UPagination
          v-model="page"
          :page-count="pageCount"
          :total="selectedData.length"
        />
      </div>
    </UCard>
  </div>
</template>
<script>
export default {
  props: {
    selectedData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      page: 1,
      pageCount: 5,
    };
  },
  computed: {
    rows() {
      const start = (this.page - 1) * this.pageCount;
      const end = start + this.pageCount;
      return this.selectedData.slice(start, end);
    },
  },
};
</script>
