import { defineStore } from "pinia";

export const houseSelectStore = defineStore("houseStore", {
  state: () => ({
    houseSelected: 1,
  }),
  actions: {
    houseSelect(number) {
      this.houseSelected = number;
      // this.selected=true;
    },
  },
});
