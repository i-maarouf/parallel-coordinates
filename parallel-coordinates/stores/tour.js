// stores/tour.ts
import { defineStore } from "pinia";

export const useTourStore = defineStore("tour", {
  state: () => ({
    restartRequested: false,
  }),
  actions: {
    requestRestart() {
      console.log("Requesting restart");

      this.restartRequested = true;
    },
    clearRestart() {
      this.restartRequested = false;
    },
  },
});
