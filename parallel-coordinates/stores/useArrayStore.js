import { defineStore } from "pinia";

export const useArrayStore = defineStore("arrayStore", {
  state: () => ({
    myArray: [],
  }),
  actions: {
    addItem(item) {
      this.myArray.push(item);
    },
    removeItem(item) {
      const index = this.myArray.indexOf(item);
      if (index !== -1) {
        this.myArray.splice(index, 1);
      }
    },
  },
});
