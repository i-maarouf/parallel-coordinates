<template>
  <div class="comparison grid grid-cols-1 gap-6 pt-36 pb-10 px-6">
    <div class="grid grid-cols-2 gap-6">
      <UCard class="space-y-4 p-1">
        <div
          class="grid grid-cols-1 gap-2 text-sm"
          v-if="Object.keys(scenario1).length > 0"
        >
          <h3
            class="text-md font-semibold text-blue-400 dark:text-white scenario1 px-2 py-1 w-fit"
          >
            Scenario 1
          </h3>
          <div class="cards grid grid-cols-3 gap-7 mt-3">
            <div
              v-for="(item, key, index) in computedScenario1"
              :class="
                item > 0
                  ? 'posCard card flex flex-col gap-2 py-5 px-3'
                  : item < 0
                  ? 'negCard card flex flex-col gap-2 py-5 px-3'
                  : 'card flex flex-col gap-2 py-5 px-3'
              "
            >
              <div class="cardHeader">{{ columns[index].label }}</div>
              <div class="numbDetails flex justify-between">
                <div class="numberCont flex flex-col">
                  <div class="flex items-baseline gap-1">
                    <div class="number">{{ parseFloat(scenario1[key]) }}</div>
                    <div class="unit">{{ columns[index].unit }}</div>
                  </div>
                </div>

                <div
                  :class="
                    item > 0 && key != 'En Saving %' && key != 'GHG Saving%'
                      ? 'negDiff diff flex flex-col'
                      : item < 0 && key != 'En Saving %' && key != 'GHG Saving%'
                      ? 'posDiff diff flex flex-col'
                      : item > 0
                      ? 'posDiff diff flex flex-col'
                      : 'negDiff diff flex flex-col'
                  "
                  v-if="item"
                >
                  <!-- <UIcon
                    :name="
                      item > 0 ? 'i-heroicons-arrow-up' : 'i-heroicons-arrow-down'
                    "
                    class="w-3 h-3"
                  /> -->
                  {{ item > 0 ? `+` + item : item }}
                </div>
              </div>

              <UMeter
                :value="parseFloat(scenario1[key])"
                :min="0"
                :max="this.minMaxMap[key]?.max"
              />
            </div>
          </div>
        </div>
        <div class="addButton w-full mt-3">
          <UAccordion
            color="black"
            v-model="openAccordion1"
            variant="outline"
            :open-icon="
              Object.keys(computedScenario1).length > 0
                ? 'i-heroicons-arrow-path'
                : 'i-heroicons-plus'
            "
            close-icon="i-heroicons-minus"
            size="xl"
            :items="
              Object.keys(computedScenario1).length > 0
                ? updatedAccordionItems
                : accordionItems
            "
            class="mb-6"
          >
            <template #item="{ item }">
              <div class="table-wrapper">
                <UTable
                  :rows="favourites"
                  :columns="columns"
                  v-model="selected"
                  :sort="sort"
                  style="overflow: unset"
                  :single-select="true"
                  :empty-state="{
                    icon: 'i-heroicons-circle-stack-20-solid',
                    label: 'No scenarios found. Start by adding to favourites.',
                  }"
                >
                </UTable>
              </div>
              <UButton
                icon="i-heroicons-plus"
                size="sm"
                color="black"
                variant="solid"
                class="w-full items-center justify-center"
                :disabled="selected.length > 0 ? false : true"
                label="Select"
                :trailing="true"
                @click="addScenario(1)"
              />
            </template>
          </UAccordion>
        </div>
      </UCard>

      <UCard class="space-y-4 p-1">
        <div
          class="grid grid-cols-1 gap-2 text-sm"
          v-if="scenario2[columns[0].key]"
        >
          <h3
            class="text-md font-semibold text-rose-500 dark:text-white scenario2 px-2 py-1 w-fit"
          >
            Scenario 2
          </h3>
          <div class="cards grid grid-cols-3 gap-7 mt-3">
            <div
              v-for="(item, key, index) in computedScenario2"
              :class="
                item > 0
                  ? 'posCard card flex flex-col gap-2 py-5 px-3'
                  : item < 0
                  ? 'negCard card flex flex-col gap-2 py-5 px-3'
                  : 'card flex flex-col gap-2 py-5 px-3'
              "
            >
              <div class="cardHeader">{{ columns[index].label }}</div>
              <div class="numbDetails flex justify-between">
                <div class="numberCont flex flex-col">
                  <div class="flex items-baseline gap-1">
                    <div class="number">{{ parseFloat(scenario2[key]) }}</div>
                    <div class="unit">{{ columns[index].unit }}</div>
                  </div>
                </div>

                <div
                  :class="
                    item > 0 && key != 'En Saving %' && key != 'GHG Saving%'
                      ? 'negDiff diff flex flex-col'
                      : item < 0 && key != 'En Saving %' && key != 'GHG Saving%'
                      ? 'posDiff diff flex flex-col'
                      : item > 0
                      ? 'posDiff diff flex flex-col'
                      : 'negDiff diff flex flex-col'
                  "
                  v-if="item"
                >
                  <!-- <UIcon
                  :name="
                    item > 0 ? 'i-heroicons-arrow-up' : 'i-heroicons-arrow-down'
                  "
                  class="w-3 h-3"
                /> -->
                  {{ item > 0 ? `+` + item : item }}
                </div>
              </div>

              <UMeter
                :value="parseFloat(scenario2[key])"
                :min="0"
                :max="this.minMaxMap[key]?.max"
              />
            </div>
          </div>
        </div>
        <div class="addButton w-full mt-3">
          <UAccordion
            color="black"
            variant="outline"
            :defaultOpen="false"
            :open-icon="
              Object.keys(computedScenario2).length > 0
                ? 'i-heroicons-arrow-path'
                : 'i-heroicons-plus'
            "
            close-icon="i-heroicons-minus"
            size="xl"
            :items="
              Object.keys(computedScenario2).length > 0
                ? updatedAccordionItems2
                : accordionItems2
            "
            class="mb-6"
          >
            <template #item="{ item }">
              <div class="table-wrapper">
                <UTable
                  :rows="favourites"
                  :columns="columns"
                  style="overflow: unset"
                  v-model="selected2"
                  :single-select="true"
                  :empty-state="{
                    icon: 'i-heroicons-circle-stack-20-solid',
                    label: 'No scenarios found. Start by adding to favourites.',
                  }"
                >
                </UTable>
              </div>
              <UButton
                icon="i-heroicons-plus"
                size="sm"
                color="black"
                variant="solid"
                class="w-full items-center justify-center"
                :disabled="selected2.length > 0 ? false : true"
                label="Select"
                :trailing="true"
                @click="addScenario(2)"
              />
            </template>
          </UAccordion>
        </div>
      </UCard>
    </div>

    <div
      class="grid grid-cols-2 gap-6 text-sm"
      v-if="selectedScenarios.length > 1"
    >
      <UCard class="p-4 space-y-2">
        <h4 class="font-semibold">Scenario 1 - Details</h4>
        <div>Cooling Type: {{ scenario1["HVAC System"] }}</div>
        <div>Wall Insulation: {{ scenario1["Spandrels R(ft2·°F·h/BTU)"] }}</div>
        <div>Lighting Power Density: {{ scenario1["LPD"] }}</div>
      </UCard>

      <UCard class="p-4 space-y-2">
        <h4 class="font-semibold">Scenario 2 - Details</h4>
        <div>Cooling Type: {{ scenario2["HVAC System"] }}</div>
        <div>Wall Insulation: {{ scenario2["Spandrels R(ft2·°F·h/BTU)"] }}</div>
        <div>Lighting Power Density: {{ scenario2["LPD"] }}</div>
      </UCard>
    </div>
    <!-- <div id="radarChart" class="w-full h-96"></div> -->
    <div class="graphs grid grid-cols-3 gap-6">
      <UCard :ui="{ body: 'p-0' }">
        <h4 class="font-semibold px-4 py-5">Scenario 1 - Details</h4>
        <UDivider />
        <BarChart
          :data="barChartData"
          :height="275"
          style="padding: 1rem"
          :categories="barCategories"
          :y-axis="['scenario1', 'scenario2']"
          :group-padding="0"
          :bar-padding="0.3"
          :xNumTicks="10"
          :radius="5"
          :x-formatter="xFormatter"
          :color="color"
          :y-formatter="yFormatter"
          :legend-position="LegendPosition.Top"
        />
      </UCard>
      <UCard class="p-4 space-y-2">
        <BarChart
          :data="barChartData"
          :height="275"
          :categories="barCategories"
          :y-axis="['scenario1', 'scenario2']"
          :group-padding="0"
          :bar-padding="0.3"
          :xNumTicks="10"
          :stacked="true"
          :radius="5"
          :x-formatter="xFormatter"
          :y-formatter="yFormatter"
          :legend-position="LegendPosition.Top"
        />
      </UCard>
    </div>
  </div>
</template>

<script>
import { useArrayStore } from "../stores/useArrayStore";
import Plotly from "plotly.js-dist-min";
// import { BarChart, LegendPosition } from "nuxt-chart";
import { BarChart } from "vue-chrts";

definePageMeta({
  layout: "dashboard layout",
});

export default {
  components: {
    BarChart,
  },
  data() {
    return {
      selectedScenarios: [],
      columns: [
        { key: "TEUI kWh/m²", label: "TEUI", unit: "kWh/m²" },
        { key: "TEDI kWh/m²", label: "TEDI", unit: "kWh/m²" },
        { key: "GHGI kgCO2/m²", label: "GHGI", unit: "kgCO2/m²" },
        { key: "En Saving %", label: "Energy Savings", unit: "%" },
        { key: "GHG Saving%", label: "GHG Savings", unit: "%" },
      ],
      selected: [],
      selected2: [],
      accordionItems: [
        {
          label: "Select Scenario 1",
        },
      ],
      accordionItems2: [
        {
          label: "Select Scenario 2",
        },
      ],
      updatedAccordionItems: [
        {
          label: "Change Scenario 1",
        },
      ],
      updatedAccordionItems2: [
        {
          label: "Change Scenario 2",
        },
      ],
      scenario1: useArrayStore().scenario1,
      scenario2: useArrayStore().scenario2,
      dataSet: useArrayStore().dataSet,
      minMaxMap: {},
      color: ["#04c0c7", "#5144d3", "#da348f"],
      scenario1Calc: {},
      scenario2Calc: {},
      computedScenario1: {},
      computedScenario2: {},
      sort: {
        column: "TEUI",
        direction: "desc",
      },
      openAccordion1: null,
    };
  },
  name: "Comparison",
  computed: {
    favourites() {
      return useArrayStore().myArray;
    },
    // scenario1() {
    //   return useArrayStore().scneario1;
    // },
    // scenario2() {
    //   return useArrayStore().scneario2;
    // },
    barChartData() {
      if (!this.scenario1 || !this.scenario2) return [];
      let percColumns = ["En Saving %", "GHG Saving%"];
      const newColumns = this.columns.filter(
        (column) => !percColumns.includes(column.key)
      );
      console.log("newColumns", newColumns);

      return this.columns.map((column) => {
        const val1 = this.scenario1[column.key];
        const val2 = this.scenario2[column.key];
        const parsed1 = isNaN(val1) ? val1 : parseFloat(val1);
        const parsed2 = isNaN(val2) ? val2 : parseFloat(val2);

        return {
          metric: column.label,
          scenario1: parsed1,
          scenario2: parsed2,
        };
      });
    },
    barChartData2() {
      if (!this.scenario1 || !this.scenario2) return [];
      let nonPercColumns = ["TEUI kWh/m²", "TEDI kWh/m²", "GHGI kgCO2/m²"];
      const newColumns = this.columns.filter(
        (column) => !nonPercColumns.includes(column.key)
      );
      console.log("newColumns", newColumns);

      return newColumns.map((column) => {
        const val1 = this.scenario1[column.key];
        const val2 = this.scenario2[column.key];
        const parsed1 = parseFloat(val1);
        const parsed2 = parseFloat(val2);

        return {
          metric: column.label,
          scenario1: parsed1,
          scenario2: parsed2,
        };
      });
    },
    barCategories() {
      return {
        scenario1: { name: "Scenario 1" },
        scenario2: { name: "Scenario 2" },
      };
    },
  },
  mounted() {
    this.calcualteDifference();
    this.computeColumnMinMax();
    // if (this.scenario1 && this.scenario2) {
    //   this.renderPlot();
    // }
  },
  methods: {
    computeColumnMinMax() {
      this.columns.forEach((column) => {
        const values = this.dataSet
          .map((row) => parseFloat(row[column.key]))
          .filter((val) => !isNaN(val));

        if (values.length > 0) {
          this.minMaxMap[column.key] = {
            min: Math.min(...values),
            max: Math.max(...values),
          };
        } else {
          this.minMaxMap[column.key] = { min: null, max: null };
        }
      });

      // console.log("Column Min/Max Map:", minMaxMap);
    },
    addScenario(index) {
      const arrayStore = useArrayStore();
      if (index == 1) {
        arrayStore.addScenario1(this.selected[0]);
        this.scenario1 = this.selected[0];
        console.log("this.arrayStore.scenario1", arrayStore.scenario1);

        this.openAccordion1 = null; // Close accordion
      } else {
        arrayStore.addScenario2(this.selected2[0]);

        this.scenario2 = this.selected2[0];
      }

      if (this.scenario1 && this.scenario2) {
        this.calcualteDifference();
        // this.renderPlot();
      }
    },
    interpolateColor(pct) {
      let r, g, b;
      if (pct <= 0.5) {
        pct *= 2;
        r = Math.floor(255 * pct);
        g = 255;
        b = 0;
      } else {
        pct = (pct - 0.5) * 2;
        r = 255;
        g = Math.floor(255 * (1 - pct));
        b = 0;
      }
      return `rgb(${r},${g},${b})`;
    },
    getDynamicTailwindColor(value, key) {
      const min = 0;
      const max = this.minMaxMap[key]?.max || 100;
      const pct = Math.min(Math.max((value - min) / (max - min), 0), 1);

      const inverseKeys = ["TEUI kWh/m²", "TEDI kWh/m²", "GHGI kgCO2/m²"];
      const isInverse = inverseKeys.includes(key);
      const normalized = isInverse ? pct : 1 - pct;

      // Return Tailwind class based on normalized scale
      if (normalized < 0.33) return "bg-green-500";
      if (normalized < 0.66) return "bg-yellow-400";
      return "bg-red-500";
    },

    getGradientColor(value, key) {
      const min = 0;
      const max = this.minMaxMap[key]?.max || 100;
      const pct = Math.min(Math.max((value - min) / (max - min), 0), 1);

      // Inverse keys: higher is worse → red at high pct
      const inverseKeys = ["TEUI kWh/m²", "TEDI kWh/m²", "GHGI kgCO2/m²"];
      const isInverse = inverseKeys.includes(key);

      // For inverse: 0 (green) → 1 (red)
      const normalized = isInverse ? pct : 1 - pct;

      return this.interpolateColor(normalized);
    },
    calcualteDifference() {
      Object.keys(this.scenario1).forEach((key) => {
        if (
          !isNaN(parseFloat(this.scenario1[key])) &&
          !isNaN(parseFloat(this.scenario2[key])) &&
          key != "__index"
        ) {
          this.scenario1Calc[key] =
            parseFloat(this.scenario1[key]) - parseFloat(this.scenario2[key]);

          this.scenario1Calc[key] = this.scenario1Calc[key].toLocaleString(
            undefined,
            {
              maximumFractionDigits: 1,
            }
          );
        }

        this.columns.forEach((column) => {
          if (key === column.key) {
            this.computedScenario1[key] = this.scenario1Calc[key];
          }
        });
      });
      Object.keys(this.scenario2).forEach((key) => {
        if (
          !isNaN(parseFloat(this.scenario1[key])) &&
          !isNaN(parseFloat(this.scenario2[key])) &&
          key != "__index"
        ) {
          this.scenario2Calc[key] =
            parseFloat(this.scenario2[key]) - parseFloat(this.scenario1[key]);

          this.scenario2Calc[key] = this.scenario2Calc[key].toLocaleString(
            undefined,
            {
              maximumFractionDigits: 1,
            }
          );
        }

        this.columns.forEach((column) => {
          if (key === column.key) {
            this.computedScenario2[key] = this.scenario2Calc[key];
          }
        });
      });
    },
    // renderPlot() {
    //   const trace1 = {
    //     type: "scatterpolar",
    //     r: [
    //       this.scenario1["En Saving %"],
    //       this.scenario1["GHG Saving%"],
    //       this.scenario1["TEUI kWh/m²"],
    //       this.scenario1["GHGI kgCO2/m²"],
    //       this.scenario1["TEDI kWh/m²"],
    //     ],
    //     theta: ["Energy Savings", "GHG Savings", "TEUI", "GHGI", "TEDI"],
    //     fill: "toself",
    //     name: "Scenario 1",
    //   };

    //   const trace2 = {
    //     type: "scatterpolar",
    //     r: [
    //       this.scenario2["En Saving %"],
    //       this.scenario2["GHG Saving%"],
    //       this.scenario2["TEUI kWh/m²"],
    //       this.scenario2["GHGI kgCO2/m²"],
    //       this.scenario2["TEDI kWh/m²"],
    //       this.scenario2["TEDI kWh/m²"],
    //     ],
    //     theta: ["Energy Savings", "GHG Savings", "TEUI", "GHGI", "TEDI"],
    //     fill: "toself",
    //     name: "Scenario 2",
    //   };

    //   const layout = {
    //     polar: {
    //       radialaxis: {
    //         visible: true,
    //         range: [0, 220],
    //       },
    //     },
    //     showlegend: true,
    //   };

    //   Plotly.newPlot("radarChart", [trace1, trace2], layout);
    // },
    // mapColumnUnits(){
    //     this.columns.forEach((column) => {
    //         if (column.key === "TEUI kWh/m²") {
    //         column.label = "TEUI (kWh/m²)";
    //         } else if (column.key === "TEDI kWh/m²") {
    //         column.label = "TEDI (kWh/m²)";
    //         } else if (column.key === "GHGI kgCO2/m²") {
    //         column.label = "GHGI (kgCO2/m²)";
    //         } else if (column.key === "En Saving %") {
    //         column.label = "Energy Savings (%)";
    //         } else if (column.key === "GHG Saving%") {
    //         column.label = "GHG Savings (%)";
    //         }
    //     });
    // }
    xFormatter(i) {
      return this.barChartData[i]?.metric || "";
    },
    xFormatter2(i) {
      return this.barChartData2[i]?.metric || "";
    },
    yFormatter(i) {
      return i;
    },
  },
};
</script>

<style scoped>
.comparison {
  /* max-width: 1200px; */
  margin: 0 auto;
}
.scenario1 {
  background-color: #eff6ff;

  border-radius: 5px;
}
.scenario2 {
  background-color: #f6dee2;
  border-radius: 5px;
}
.table-wrapper {
  max-height: 300px;
  overflow-y: auto;
}
.table-wrapper table {
  border-collapse: separate;
  border-spacing: 0;
}
.table-wrapper :deep(thead) {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 9;
}
.card {
  /* From https://css.glass */
  background: #eeeeee;
  border-radius: 5px;

  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(13px);
  -webkit-backdrop-filter: blur(13px);
  /* width: 200px; */
}
.cardHeader {
  font-size: 14px;
  /* font-weight: bold; */
  color: #808080;
}
.number {
  font-size: 26px;
  font-weight: bold;
}
.posDiff {
  color: green;
  font-size: 12px;
}
.negDiff {
  color: red;
  font-size: 12px;
}
.negCard {
  background: #eeeeee;
}
.posCard {
  background: #eeeeee;
}
:root {
  --vis-color0: oklch(0.72 0.192 149.58) !important;
  --vis-color1: oklch(0.63 0.1963 157.86) !important;

  --tooltip-label-color: rgba(255, 255, 255, 0.5) !important;
  --tooltip-value-color: rgba(255, 255, 255, 1) !important;

  --vis-axis-grid-color: rgba(255, 255, 255, 0.1) !important;
  --vis-tooltip-background-color: #121212 !important;
  --vis-tooltip-border-color: none !important;
  --vis-tooltip-text-color: rgba(255, 255, 255, 0.5) !important;
  --vis-axis-tick-label-color: rgba(255, 255, 255, 0.5) !important;
  --vis-legend-label-color: rgba(255, 255, 255, 0.75) !important;

  --vis-axis-label-color: rgba(255, 255, 255, 0.5) !important;
  --vis-legend-label-color: rgba(255, 255, 255, 0.5) !important;
}

.dark {
  --vis-color0: oklch(0.72 0.192 149.58) !important;
  --vis-color1: oklch(0.63 0.1963 157.86) !important;
}
</style>
