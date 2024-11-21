<template>
  <Loading v-if="this.loading" />
  <div class="p-4">
    <UCard class="tableCont">
      <div class="py-2 justify-self-end">
        <UButton
          icon="i-heroicons-star"
          size="sm"
          color="yellow"
          variant="soft"
          :disabled="selected.length > 0 ? false : true"
          label="Add to favourites"
          :trailing="false"
          @click="addToFavourites()"
        />
      </div>
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
  mounted() {
    const arrayStore = useArrayStore();
    console.log("arrayStore", arrayStore.myArray);
  },
  computed: {
    rows() {
      const start = (this.page - 1) * this.pageCount;
      const end = start + this.pageCount;
      return this.selectedData.slice(start, end);
    },
  },

  methods: {
    areObjectsEqual(obj1, obj2) {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      // Check if the number of properties is the same
      if (keys1.length !== keys2.length) return false;

      // Check if all values are equal
      return keys1.every((key) => obj1[key] === obj2[key]);
    },
    async addToFavourites() {
      // const arrayStore = useArrayStore();
      const toast = useToast();
      const arrayStore = useArrayStore();

      const exists = this.selected.some((obj1) =>
        arrayStore.myArray.some((obj2) => this.areObjectsEqual(obj1, obj2))
      );
      // this.favouritesArr = arrayStore.myArray;
      // console.log("selected", this.selected);
      // console.log("arrayStore", arrayStore.myArray);
      // console.log("arrayStore", this.arrayStore.myArray);

      for (let i = 0; i < this.selected.length; i++) {
        console.log("this.selected [" + i + "]", this.selected[i]);
        console.log(arrayStore.myArray.includes(this.selected[i]));

        if (!exists) {
          this.loading = true;
          // this.favouritesArr.push(this.selected[i]);
          arrayStore.addItem(this.selected[i]);

          toast.add({
            id: "added_to_favourites",
            title: "Added to Favourites.",
            description: "Navigate to Favourites tab to view them.",
            icon: "i-heroicons-star",
            timeout: 5000,
          });
        } else {
          toast.add({
            id: "already_exists",
            title: "Already in Favourites.",
            description: "The rows selected already exist in your favourites.",
            icon: "i-heroicons-no-symbol",
            timeout: 5000,
          });
        }
      }
      window.setTimeout(() => {
        this.loading = false;
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
