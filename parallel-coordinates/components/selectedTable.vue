<template>
  <Loading v-if="this.loading" />
  <div class="py-4">
    <div class="flex items-center justify-between">
      <span class="font-semibold md"> Scenarios Selected </span>
      <div class="py-2 justify-self-end">
        <UButton
          icon="i-heroicons-star"
          size="sm"
          color="yellow"
          variant="outline"
          :disabled="selected.length > 0 ? false : true"
          label="Add to favourites"
          :trailing="false"
          @click="addToFavourites()"
        />
      </div>
    </div>
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
        <!-- <template #select-data="{ checked, change }">
          <input
            type="checkbox"
            :checked="checked"
            @change="(e) => change(e.target.checked)"
          />
        </template> -->
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
  mounted() {},
  computed: {
    formattedData() {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0, // Adjust this if decimals are needed
      });
      return this.selectedData.map((item) => ({
        ...item,
        "Premium $": formatter.format(item["Premium $"]),
      }));
    },
    rows() {
      const start = (this.page - 1) * this.pageCount;

      const end = start + this.pageCount;
      return this.formattedData.slice(start, end);
    },
  },

  methods: {
    areObjectsEqual(obj1, obj2) {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      // Check if the number of properties is the same
      if (keys1.length !== keys2.length) return false;
      const check = keys1.every((key) => obj1[key] === obj2[key]);

      // Check if all values are equal
      return keys1.every((key) => obj1[key] === obj2[key]);
    },
    async addToFavourites() {
      const toast = useToast();
      const arrayStore = useArrayStore();
      let existFlag = false;
      let notExistsFlag = false;
      arrayStore.myArray.length == 0
        ? this.selected.forEach((obj1) => {
            this.loading = true;
            arrayStore.addItem(obj1);
            window.setTimeout(() => {
              this.loading = false;
              toast.add({
                id: "added_to_favourites",
                title: "Added to Favourites",
                description: "Navigate to Favourites tab to view them",
                icon: "i-heroicons-star",
                timeout: 5000,
              });
            }, 1000);
          })
        : this.selected.forEach((obj1) => {
            const keys1 = Object.keys(obj1);
            const exists = arrayStore.myArray.some((obj2) => {
              return keys1.every((key) => obj1[key] === obj2[key]);
            });
            if (!exists) {
              this.loading = true;
              arrayStore.addItem(obj1);
              notExistsFlag = true;
            } else {
              existFlag = true;
            }
          });

      existFlag && notExistsFlag
        ? window.setTimeout(() => {
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
        : window.setTimeout(() => {
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
<style scoped>
/* .tableCont {
  background-color: #fafafa;
} */
</style>
