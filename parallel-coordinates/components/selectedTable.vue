<template>
  <div class="p-4">
    <UCard class="tableCont">
      <UTable
        :rows="rows"
        v-model="selected"
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
      <div class="flex justify-end px-3 py-3.5 border-t">
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
      pageCount: 20,
      selected: this.selectedData,
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
<style scoped>
/* .tableCont {
  background-color: #fafafa;
} */
</style>
