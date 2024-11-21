<template>
  <div
    class="flex flex-col items-center space-x-4 backgroundCont w-full p-8 row"
  >
    <UCard class="tableCont w-full">
      <div class="py-2 justify-self-end">
        <UButton
          icon="i-heroicons-arrow-up-tray"
          size="sm"
          color="primary"
          variant="soft"
          :disabled="this.arrayStore.myArray.length > 0 ? false : true"
          label="Export as XSLX"
          :trailing="false"
          @click="exportToExcel()"
        />
      </div>
      <UTable
        :rows="rows"
        class="w-full"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No items. Start by adding to favourites in the Home Page',
        }"
        :loading-state="{
          icon: 'i-heroicons-arrow-path-20-solid',
          label: 'Loading...',
        }"
      >
        <template #caption>
          <caption>
            Favourite Paths
          </caption>
        </template>
      </UTable>
      <div class="flex justify-end px-3 py-3.5 border-t">
        <UPagination
          v-model="page"
          :page-count="pageCount"
          :total="this.arrayStore.myArray.length"
        />
      </div>
    </UCard>
  </div>
</template>
<script>
import { useArrayStore } from "../stores/useArrayStore";
import * as XLSX from "xlsx";

// Access the store
export default {
  // props: {
  //   selectedData: {
  //     type: Array,
  //     required: true,
  //   },
  // },
  data() {
    return {
      page: 1,
      arrayStore: useArrayStore(),
      pageCount: 20,
      selected: [],
      selectedData: [],
      // favouritesTable: [],
    };
  },
  mounted() {
    // const arrayStore = useArrayStore();
  },
  computed: {
    rows() {
      const start = (this.page - 1) * this.pageCount;
      const end = start + this.pageCount;
      return this.arrayStore.myArray.slice(start, end);
    },
  },
  methods: {
    exportToExcel() {
      const ws = XLSX.utils.json_to_sheet(this.arrayStore.myArray);

      // Create a new workbook and append the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // Export the workbook to a file
      XLSX.writeFile(wb, "export.xlsx");
    },
  },
};
</script>
<style scoped>
.backgroundCont {
  min-height: 100vh;
}
</style>
