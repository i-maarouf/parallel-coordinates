import { defineStore } from "pinia";

export const useArrayStore = defineStore("arrayStore", {
  state: () => ({
    myArray: [],
    selectedRows: [],
    scenario1: {},
    scenario2: {},
    dataSet: [],
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
    setSelectedRows(rows) {
      this.selectedRows = rows;
    },
    setDataSet(data) {
      this.dataSet = data;
    },
    addScenario1(scenario) {
      this.scenario1 = scenario;
    },
    addScenario2(scenario) {
      this.scenario2 = scenario;
    },
  },
});
