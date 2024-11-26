<template>
  <Loading v-if="this.loading" />
  <div
    class="flex flex-col items-center backgroundCont w-full p-8 row overflow-y-auto"
  >
    <div class="buttonsContainer items-center flex justify-between w-full">
      <span class="font-semibold md"> Favourite Paths </span>
      <div class="py-2 justify-self-end">
        <UButton
          icon="i-heroicons-arrow-up-tray"
          size="sm"
          color="primary"
          variant="outline"
          :disabled="arrayStore.myArray.length > 0 ? false : true"
          label="Export as XSLX"
          :trailing="false"
          @click="exportToExcel()"
        />
      </div>
    </div>
    <UCard class="tableCont w-full">
      <UTable
        :rows="rows"
        v-model="selected"
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
      </UTable>
      <div class="flex justify-between px-3 py-3.5 border-t">
        <div class="py-2 justify-self-start">
          <UButton
            icon="i-heroicons-archive-box-x-mark"
            size="sm"
            color="red"
            variant="soft"
            :disabled="selected.length > 0 ? false : true"
            label="Remove"
            :trailing="false"
            @click="removeFromFavourites()"
          />
        </div>
        <UPagination
          v-model="page"
          :page-count="pageCount"
          :total="arrayStore.myArray.length"
        />
      </div>
    </UCard>
  </div>
</template>
<script>
import { useArrayStore } from "../stores/useArrayStore";
import * as XLSX from "xlsx";

export default {
  data() {
    return {
      page: 1,
      arrayStore: useArrayStore(),
      pageCount: 20,
      loading: false,
      selected: [],

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
    removeFromFavourites() {
      this.loading = true;
      const toast = useToast();
      const arrayStore = useArrayStore();
      for (let i = 0; i < this.selected.length; i++) {
        // console.log("this.selected [" + i + "]", this.selected[i]);
        // console.log(arrayStore.myArray.includes(this.selected[i]));
        arrayStore.removeItem(this.selected[i]);
      }

      window.setTimeout(() => {
        this.loading = false;
        toast.add({
          id: "removed_successfuly",
          title: "Removed from Favourites",
          // description: "Data exported to downloads folder.",
          icon: "i-heroicons-check-circle",
          timeout: 5000,
        });
      }, 1000);
      this.selected = [];
    },
    exportToExcel() {
      const toast = useToast();
      const ws = XLSX.utils.json_to_sheet(this.arrayStore.myArray);

      // Create a new workbook and append the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // Export the workbook to a file
      XLSX.writeFile(wb, "export.xlsx");
      toast.add({
        id: "export_successful",
        title: "Table exported successfully",
        // description: "Data exported to downloads folder.",
        icon: "i-heroicons-check-circle",
        timeout: 5000,
      });
    },
  },
};
</script>
<style scoped>
.backgroundCont {
  min-height: 100vh;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 8px;
  text-align: left;
}
</style>
