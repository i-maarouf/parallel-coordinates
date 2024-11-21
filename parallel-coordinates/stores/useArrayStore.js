import { defineStore } from "pinia";

export const useArrayStore = defineStore("arrayStore", {
  state: () => ({
    myArray: [],
  }),
  actions: {
    addItem(item) {
      this.myArray.push(item);
    },
    removeItem(index) {
      this.myArray.splice(index, 1);
    },
  },
});
