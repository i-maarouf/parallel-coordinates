<template>
  <Loading v-if="this.loading" />
  <div class="">
    <div class="flex items-center justify-between">
      <span class="font-semibold md"> Scenarios Selected </span>
      <div class="py-2 justify-self-end">
        <UButton
          icon="i-heroicons-star"
          size="sm"
          color="yellow"
          class="favouritesBtn"
          variant="outline"
          :disabled="selected.length > 0 ? false : true"
          label="Add to favourites"
          :trailing="false"
          @click="addToFavourites()"
        />
      </div>
    </div>
    <UCard class="tableCont" id="tableContainer" tabindex="0">
      <UTable
        :rows="rows"
        v-model="selected"
        v-if="selectedData.length > 0"
        :loading="selectedData ? false : true"
        :loading-state="{
          icon: 'i-heroicons-arrow-path-20-solid',
          label: 'Loading...',
        }"
      >
        <!-- <template #select-data="{ checked, change }">
          <input
            type="checkbox"
            :checked="checked"
            @change="(e) => change(e.target.checked)"
          />
        </template> -->
      </UTable>
      <div class="flex justify-between px-3 py-3.5 border-t items-center gap-4">
        <div class="totalRuns">
          Showing {{ (this.page - 1) * this.pageCount + 1 }} to
          {{ Math.min(this.page * this.pageCount, selectedData.length) }} out of
          {{ selectedData.length }} runs
        </div>
        <UPagination
          v-model="page"
          :page-count="pageCount"
          :total="selectedData.length"
        >
        </UPagination>
      </div>
    </UCard>
  </div>
</template>
<script>
import { useArrayStore } from "../stores/useArrayStore";

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
      selected: [],
      loading: false,
      favouritesArr: [],
    };
  },
  computed: {
    formattedData() {
      return this.selectedData.map((item) => ({
        ...item,
      }));
    },
    rows() {
      const start = (this.page - 1) * this.pageCount;
      const end = start + this.pageCount;
      return this.formattedData.slice(start, end);
    },
  },
  watch: {
    selected: {
      handler(newVal) {
        console.log("Selected rows changed:", newVal);

        const arrayStore = useArrayStore();

        arrayStore.setSelectedRows(newVal);
      },
      deep: true,
    },
  },
  methods: {
    areObjectsEqual(obj1, obj2) {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
      if (keys1.length !== keys2.length) return false;
      return keys1.every((key) => obj1[key] === obj2[key]);
    },
    async addToFavourites() {
      const toast = useToast();
      const arrayStore = useArrayStore();
      let existFlag = false;
      let notExistsFlag = false;
      if (arrayStore.myArray.length === 0) {
        this.selected.forEach((obj1) => {
          this.loading = true;
          arrayStore.addItem(obj1);
          setTimeout(() => {
            this.loading = false;
            toast.add({
              id: "added_to_favourites",
              title: "Added to Favourites",
              description: "Navigate to Favourites tab to view them",
              icon: "i-heroicons-star",
              timeout: 5000,
            });
          }, 1000);
        });
      } else {
        this.selected.forEach((obj1) => {
          const keys1 = Object.keys(obj1);
          const exists = arrayStore.myArray.some((obj2) =>
            keys1.every((key) => obj1[key] === obj2[key])
          );
          if (!exists) {
            this.loading = true;
            arrayStore.addItem(obj1);
            notExistsFlag = true;
          } else {
            existFlag = true;
          }
        });
      }

      existFlag && notExistsFlag
        ? setTimeout(() => {
            this.loading = false;
            toast.add({
              id: "some_exists",
              title: "Added to Favourites",
              description:
                "Some of the rows selected already exist in your favourites, the rest have been added.",
              icon: "i-heroicons-star",
              timeout: 5000,
            });
          }, 1000)
        : existFlag && !notExistsFlag
        ? toast.add({
            id: "already_exists",
            title: "Already in Favourites",
            description: "The rows selected already exist in your favourites",
            icon: "i-heroicons-no-symbol",
            timeout: 5000,
          })
        : setTimeout(() => {
            this.loading = false;
            toast.add({
              id: "added_to_favourites",
              title: "Added to Favourites",
              description: "Navigate to Favourites tab to view them",
              icon: "i-heroicons-star",
              timeout: 5000,
            });
          }, 1000);

      this.selected = [];
    },
  },
};
</script>
<style>
.tableCont td {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
/* tr:nth-child(even) {
  background-color: #80808012;
} */
</style>
<style scoped>
.totalRuns {
  font-size: 12px;
  color: #848388;
}
</style>
