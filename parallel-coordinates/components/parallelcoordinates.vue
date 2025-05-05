<template>
  <div class="backgroundCont flex flex-col">
    <!-- <NuxtTour /> -->
    <div class="flex justify-end gap-3 my-4" v-if="Plotly">
      <UButton
        size="sm"
        color="primary"
        variant="outline"
        class="flex self-end"
        label="Choose Default Values"
        @click="isOpen = true"
      />
      <UButton
        icon="i-heroicons-x-mark"
        size="sm"
        color="red"
        variant="soft"
        class="flex self-end"
        label="Reset"
        @click="resetPlot()"
      />
    </div>
    <USlideover v-model="isOpen" class="slideOver p-10" :overlay="false">
      <div class="p-4 flex-1">
        <div class="title p-2 text-md text-primary font-semibold">Filters</div>
        <UButton
          color="gray"
          variant="ghost"
          size="sm"
          icon="i-heroicons-x-mark-20-solid"
          class="flex sm:hidden absolute end-5 top-5 z-10"
          square
          padded
          @click="isOpen = false"
        />
        <div class="grid grid-cols-2">
          <UFormGroup label="Cost Schedule" class="p-2" name="cost">
            <UInput v-model="cost" type="number" disabled />
          </UFormGroup>
          <UFormGroup label="Energy Prices" class="p-2" name="EnergyPrices">
            <UInput v-model="energy" type="number" disabled />
          </UFormGroup>
        </div>
        <div class="grid grid-cols-2">
          <UFormGroup label="GHG Rates" class="p-2" name="GHG">
            <UInput v-model="GHG" type="number" />
          </UFormGroup>
          <UFormGroup label="GHG Rates" class="p-2" name="GHG2">
            <UInput v-model="GHG2" type="number" />
          </UFormGroup>
        </div>
        <div class="grid grid-cols-2">
          <UFormGroup label="Plot Color" class="p-2" name="plotColor">
            <UInputMenu
              v-model="plotColor"
              :options="plotColors"
              option-attribute="colorLabel"
              @change="updatePlotColor()"
            >
              <!-- <template #option="{ option: colors }">
                <span class="truncate">{{ colors.colorLabel }}</span>
              </template> -->
            </UInputMenu>
          </UFormGroup>
          <UFormGroup label="Colour by Axis" class="p-2" name="plotAxis">
            <UInputMenu
              v-model="plotAxis"
              :options="plotAxes"
              @change="updatePlotColor()"
            />
          </UFormGroup>
        </div>
        <UFormGroup label="Walls" class="p-2" name="walls">
          <URange :min="0" :max="100" v-model="wallRValue" disabled />
        </UFormGroup>
        <div class="grid grid-cols-1 p-2 gap-3">
          <UButton
            icon="i-heroicons-check"
            size="sm"
            color="primary"
            variant="solid"
            label="Apply Changes"
            :trailing="true"
            block
            @click="applyPlotChanges()"
          />
          <UButton
            icon="i-heroicons-arrow-uturn-left"
            size="sm"
            color="white"
            variant="solid"
            label="Restore Default Values"
            :trailing="true"
            block
            @click="restoreDefaultValues()"
          />
        </div>
      </div>
    </USlideover>
    <div class="flex items-center space-x-4" v-if="!Plotly">
      <!-- <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" /> -->
      <div class="space-y-2 w-full flex items-center flex-col">
        <USkeleton class="h-12 w-1/4" />
        <USkeleton class="h-96 w-full" />
      </div>
    </div>
    <div
      id="plotContainer"
      class="flex flex-col-reverse"
      style="width: 100%; height: 100%"
    >
      <UButton
        size="sm"
        color="primary"
        icon="i-heroicons-arrow-down-tray"
        variant="outline"
        class="flex self-end"
        label="Download Plot"
        @click="downloadPlot()"
      />
    </div>
    <SelectedTable :selectedData="selectedData" />
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import { reactive, watch } from "vue";
import { useArrayStore } from "../stores/useArrayStore";
import { mapState } from "pinia";
export default {
  data() {
    return {
      plotData: [],
      layout: null,
      Plotly: null, // Will hold the Plotly instance
      selectedData: [],
      mappedSCV: [],
      isOpen: false,
      cost: 35,
      energy: 25,
      GHG: 0.17,
      GHG2: 0.19,
      plotColor: "Jet",
      Area: 108510,
      calibratedTEUI: 215.938426157997,
      calibratedGHGI: 38.8483576553635,
      wallRValue: 10,
      plotAxis: "GHG Saving%",
      formattedData: [],
      selectedRowIndex: [],
      arrayStore: useArrayStore(),
      plotColors: [
        {
          colorName: "Jet",
          colorLabel: "Jet",
        },
        {
          colorName: "YlOrRd",
          colorLabel: "Yellow/Red",
        },
        {
          colorName: "YlGnBu",
          colorLabel: "Yellow/Green/Blue",
        },
        {
          colorName: "Portland",
          colorLabel: "Portland",
        },
        {
          colorName: "Hot",
          colorLabel: "Hot",
        },
        // {
        //   colorName: "Blackbody",
        //   colorLabel: "Blackbody",
        // },
        // {
        //   colorName: "Picnic",
        //   colorLabel: "Picnic",
        // },
        // {
        //   colorName: "Electric",
        //   colorLabel: "Electric",
        // },
        // {
        //   colorName: "Earth",
        //   colorLabel: "Earth",
        // },
        {
          colorName: "Bluered",
          colorLabel: "Blue/Red",
        },
      ],
      plotAxes: [
        "GHG Saving%",
        "En Saving %",
        "GHGI kgCO2/m2",
        "TEDI kWh/m2",
        "TEUI kWh/m2",
      ],
      flippedAxes: {}, // e.g., { Age: true, Score: false }
      excludedColumns: [
        "Electricity kWh",
        "Natural Gas kWh",
        "Total Energy kWh",
        "__index",
      ],
      constraints: {}, // To store active constraints for all columns
      mappedColumns: {},
      selectedRanges: {}, // Track selection ranges for each column
      jsonData: [], // Raw data for filtering

      plotColumns: [],
    };
  },
  async mounted() {
    window.addEventListener("resize", this.resizePlot);

    this.layout = reactive({
      title: "TC Energy Tower Retrofit Decision Tool",
      width: null,
      autosize: true, // Makes the chart adjust to container size
      responsive: true, // Enables responsive behavior
      height: 550,
      font: {
        color: this.colorMode === "dark" ? "#ffffff" : "#000000", // Initial color based on current mode
        size: 14,
      },
      paper_bgcolor: "transparent", // Background color of the entire plot
      plot_bgcolor: this.colorMode === "dark" ? "#333333" : "#f0f0f0", // Initial background based on current mode
    });

    if (process.client) {
      var myPlot = document.getElementById("plotContainer");

      // Dynamically import Plotly on the client side
      this.Plotly = await import("plotly.js-dist-min");

      // Fetch and parse Excel file data
      // const response = await fetch("/Bilmar_Sample_Data.xlsx");
      // const response = await fetch("gefdatacost2.xlsx");
      // const response = await fetch("A23P1_Parametric_Results.xlsx");
      const response = await fetch("A23P1_Parametric_Sheet.xlsx");
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { raw: true });
      this.formattedData = XLSX.utils.sheet_to_json(sheet, { raw: false });
      // const colorKey = "Elec Peak kW"; // Change "Age" to any other column name if needed
      const colorKey = this.plotAxis; // Change "Age" to any other column name if needed
      const colorValues = jsonData.map((row) => row[colorKey]); // Extract values for color scaling

      const columnsWithStrings = [
        "Air Leakage",
        "LPD",
        "ERV",
        "Controls",
        "HVAC System",
        "Solar PV",
      ];

      this.jsonData = jsonData;
      this.selectedData = this.formattedData;
      this.plotColumns = jsonData.map((row, rowIndex) => {
        const formattedRow = this.formattedData[rowIndex];
        const merged = {};

        for (const key in row) {
          const rawVal = row[key];
          const formattedVal = formattedRow?.[key];

          // If formatted value has a '%' sign, keep it for ticktext or display
          if (typeof formattedVal === "string" && formattedVal.includes("%")) {
            merged[key] = parseInt(formattedVal);
          } else {
            merged[key] = rawVal;
          }
        }
        // Assign row index for later reference
        merged.__index = rowIndex;
        return merged;
      });

      // this.removeColumns(excludedColumns);
      // this.updateOutputColumns();
      this.dimensionKeys = Object.keys(this.plotColumns[0]).filter(
        (key) => !this.excludedColumns.includes(key)
      ); // Maps Plotly dimension index to column names

      this.generateMappings(columnsWithStrings);
      this.renderPlot();

      this.updateOutputColumns();
    }
  },
  beforeUnmount() {
    // Clean up the resize listener
    window.removeEventListener("resize", this.resizePlot);
  },
  methods: {
    updatePlotColor() {
      var myPlot = document.getElementById("plotContainer");
      var plotColorLabel = this.plotColor;
      console.log("plotColor", this.plotColor);

      if (this.plotColor.colorName) {
        var plotColorLabel = this.plotColor.colorLabel;
        this.plotColor = this.plotColor.colorName;
      }
      const colorKey = this.plotAxis; // Change "Age" to any other column name if needed
      const colorValues = this.plotColumns.map((row) => row[colorKey]); // Extract values for color scaling
      var update = {
        line: {
          color: colorValues, // Set color to array of values from the selected column
          colorscale: this.plotColor, // Choose a color scale, e.g., Viridis, Jet, etc.
          reversescale: true,
          width: 5,
        },
      };
      this.Plotly.restyle(myPlot, update);
      this.plotColor = plotColorLabel;

      // this.resetPlot();
    },
    updateSelectedData(eventData) {
      if (eventData && eventData[0]) {
        Object.entries(eventData[0]).forEach(([dimension, range]) => {
          if (range && range[0]) {
            // Normalize range to ensure it's always an array of ranges
            const newRanges = Array.isArray(range[0]) ? range : [range];

            // Initialize or replace constraints for this dimension
            this.constraints[dimension] = newRanges;
          } else {
            // Remove constraints if the range is invalid
            delete this.constraints[dimension];
          }
        });
      }

      // Filter the dataset based on the constraints
      const selectedRows = this.plotColumns.filter((row) => {
        return Object.entries(this.constraints).every(([dimension, ranges]) => {
          const dimensionIndex = parseInt(
            dimension.match(/dimensions\[(\d+)\]/)[1],
            10
          );
          const columnName = this.dimensionKeys[dimensionIndex];

          const value = row[columnName];
          if (this.mappedColumns[columnName]) {
            // Handle string columns
            const mappedValue = this.mappedColumns[columnName].find(
              (item) => item.label === value
            )?.value;
            return (
              mappedValue !== undefined &&
              ranges.some((range) => {
                if (Array.isArray(range[0])) {
                  // Handle nested ranges for strings
                  return range.some(
                    (subRange) =>
                      Array.isArray(subRange) &&
                      mappedValue >= subRange[0] &&
                      mappedValue <= subRange[1]
                  );
                } else if (Array.isArray(range) && range.length === 2) {
                  // Handle non-nested range
                  return mappedValue >= range[0] && mappedValue <= range[1];
                }
                return false; // Ignore invalid range formats
              })
            );
          } else if (typeof value === "number") {
            // Apply scaling for percentage-based columns
            const isSavingsColumn = columnName.includes("Saving");
            const scaledValue = isSavingsColumn ? value / 100 : value;
            return ranges.some((range) => {
              if (Array.isArray(range[0])) {
                return range.some(
                  (subRange) =>
                    Array.isArray(subRange) &&
                    scaledValue >= subRange[0] &&
                    scaledValue <= subRange[1]
                );
              } else if (Array.isArray(range) && range.length === 2) {
                return scaledValue >= range[0] && scaledValue <= range[1];
              }
              return false;
            });
          } else {
            return false;
          }
        });
      });
      // Update selected data
      this.selectedData = selectedRows
        .map((row) => this.formattedData[row.__index])
        .filter(Boolean);
    },

    resizePlot() {
      this.Plotly.Plots.resize("plotContainer");
    },

    stringToValue(column, rawValue) {
      const mapping = this.mappedColumns[column];
      const match = mapping.find((item) => item.label === rawValue);
      return match ? match.value : null;
    },
    generateMappings(columnsWithStrings) {
      this.mappedColumns = {};

      columnsWithStrings.forEach((column) => {
        const uniqueValues = Array.from(
          new Set(this.plotColumns.map((row) => row[column]))
        );
        this.mappedColumns[column] = uniqueValues.map((label, index) => ({
          label: label,
          value: index,
        }));
      });
    },

    // Method to reset the parallel coordinates plot\
    restoreDefaultValues() {
      this.GHG = 0.17;
      this.GHG2 = 0.19;
      this.applyPlotChanges();
      // this.isOpen = false;
    },
    resetPlot() {
      this.selectedData = this.formattedData;
      this.selectedRanges = {};
      this.constraints = {};
      // this.GHG = 0.17;
      // this.GHG2 = 0.19;
      // Purge the existing graph
      // this.updateOutputColumns();
      this.renderPlot();
      // Prepare fresh data and layout
    },
    applyPlotChanges() {
      // Apply changes to the plot based on user input
      // var myPlot = document.getElementById("plotContainer");
      // this.jsonData.forEach((row) => {
      //   row["GHGI (kg/m2)"] = row["EUI Savings %"] * this.GHG;
      // });

      this.updateOutputColumns();
      this.isOpen = false;
    },
    renderPlot() {
      var myPlot = document.getElementById("plotContainer");
      // this.Plotly.purge(myPlot);
      var config = {
        toImageButtonOptions: {
          format: "svg", // one of png, svg, jpeg, webp
          filename: "custom_image",
          height: 500,
          width: 700,
          scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
        },
      };
      const columnsWithStrings = [
        "Air Leakage",
        "LPD",
        "ERV",
        "Controls",
        "HVAC System",
        "Solar PV",
      ];

      this.generateMappings(columnsWithStrings);

      const freshDimensions = Object.keys(this.plotColumns[0])
        .filter((key) => !this.excludedColumns.includes(key))
        .map((key, index) => {
          const isStringColumn = columnsWithStrings.includes(key);
          const isPercentColumn = key.includes("LPD") || key.includes("ERV");
          const isSavingsColumn = key.includes("Saving");

          const values = this.plotColumns.map((row) => {
            let val = isStringColumn
              ? this.stringToValue(key, row[key])
              : row[key];

            // Scale savings columns by 1/100 so Plotly can format them as percentages
            if (isSavingsColumn && typeof val === "number") {
              val = val / 100;
            }

            return val;
          });
          const shouldReverse = index >= 8 && index <= 10;

          return {
            label:
              index == 0
                ? "Spandrels R<br>(ft²·°F·h/BTU)"
                : index == 1
                ? "Glass R<br>(ft²·°F·h/BTU)"
                : key,
            values,
            ...(isStringColumn && {
              tickvals: this.mappedColumns[key].map((item) => item.value),
              ticktext: this.mappedColumns[key].map((item) => item.label),
            }),

            // Handle ERV / LPD (categorical % values, treat as strings with % label)
            ...(isPercentColumn &&
              !isSavingsColumn && {
                tickvals: this.mappedColumns[key].map((item) => item.value),
                ticktext: this.mappedColumns[key].map((item) => {
                  const val = item.label;
                  return typeof val === "number" ? `${val}%` : val;
                }),
              }),

            // Let Plotly auto-handle Savings columns, just apply % format
            ...(isSavingsColumn &&
              !isStringColumn && {
                tickformat: ".1%", // Adds % sign without affecting scaling
              }),

            ...(shouldReverse && {
              range: [Math.max(...values), Math.min(...values)],
            }),
          };
        });
      var colorScale = 0;
      this.plotColors.forEach((color, index) => {
        if (this.plotColor === color.colorLabel) {
          colorScale = color.colorName;
        }
      });
      // console.log(
      //   "this.plotcolor",
      //   this.plotColumns.map((row) => row[this.plotAxis])
      // );

      const freshPlotData = [
        {
          type: "parcoords",
          line: {
            color: this.plotColumns.map((row) => row[this.plotAxis]),
            colorscale: colorScale,
            reversescale: true,
          },
          unselected: {
            line: {
              color: "#fdfdfd",
            },
          },

          dimensions: freshDimensions,
          customdata: this.plotColumns,
        },
      ];

      // Reinitialize the plot
      this.Plotly.newPlot(myPlot, freshPlotData, this.layout, config);

      myPlot.on("plotly_restyle", (eventData) => {
        console.log("eventData", eventData);
        if (!eventData[0].line && !eventData[0].dimensions) {
          const selectedColumnIndex = Object.keys(eventData[0])[0].match(
            /\d+/
          )[0];
          console.log("selectedColumnIndex", selectedColumnIndex);
          const selectedColumn = freshDimensions[selectedColumnIndex].label;
          let selectedRange =
            eventData[0][`dimensions[${selectedColumnIndex}].constraintrange`];
          console.log("SELECTED RANGE", selectedRange);

          if (selectedRange) {
            this.selectedRanges[selectedColumn] = selectedRange[0]; // Store the selected range
          } else {
            delete this.selectedRanges[selectedColumn]; // Remove if no selection
          }

          // Filter data based on all active selections
          this.updateSelectedData(eventData);
        }
        // else if (eventData[0].dimensions) {
        //   console.log("eventData[0].dimensions", eventData[0].dimensions);
        //   const labelClicked = eventData.points?.[0]?.dimension?.label;
        //   console.log("labelClicked", labelClicked);

        //   // if (labelClicked) {
        //   //   this.toggleAxis(labelClicked);
        //   // }
        // }
      });
      // myPlot.on("plotly_click", (eventData) => {
      //   const labelClicked = eventData.points?.[0]?.dimension?.label;
      //   console.log("labelClicked", labelClicked);

      //   if (labelClicked) {
      //     this.toggleAxis(labelClicked);
      //   }
      // });
    },
    toggleAxis(label) {
      this.flippedAxes[label] = !this.flippedAxes[label];
      this.updatePlot();
    },
    downloadPlot() {
      const myPlot = document.getElementById("plotContainer");
      this.Plotly.downloadImage(myPlot, {
        format: "png",
        filename: "plot",
        height: 500,
        width: 1400,
        scale: 1,
      });
    },

    getUpdatedDimensions() {
      return this.dimensions.map((dim) => {
        const values = dim.values;
        const range = this.flippedAxes[dim.label]
          ? [Math.max(...values), Math.min(...values)]
          : [Math.min(...values), Math.max(...values)];

        return {
          ...dim,
          range,
        };
      });
    },

    updateOutputColumns() {
      const computedColumns = [
        "TEUI kWh/m²",
        "Electricity kWh",
        "Natural Gas kWh",
      ];
      const outputColumns = ["En Saving %", "GHGI kgCO2/m²", "GHG Saving%"];
      let enSavingCalculated, GHGCalculated, GHGICalculated1, GHGICalculated2;
      this.plotColumns.forEach((row) => {
        enSavingCalculated = row[computedColumns[0]] / this.calibratedTEUI;

        GHGICalculated1 = row[computedColumns[1]] * this.GHG;
        GHGICalculated2 = row[computedColumns[2]] * this.GHG2;
        GHGCalculated =
          (GHGICalculated1 + GHGICalculated2) / this.Area / this.calibratedGHGI;
        row[outputColumns[0]] = (1 - enSavingCalculated) * 100;

        row[outputColumns[1]] = (GHGICalculated1 + GHGICalculated2) / this.Area;
        row[outputColumns[2]] = (1 - GHGCalculated) * 100;
      });

      console.log("plotColumns", this.plotColumns);
      // this.updateSelectedData();
      // this.renderPlot();
      this.updateFormattedData();
      this.resetPlot();
    },
    updateFormattedData() {
      this.formattedData = this.plotColumns.map((row, index) => {
        const formattedRow = {};
        for (const key in row) {
          if (this.excludedColumns.includes(key)) continue; // Don't show __index in table

          let value = row[key];
          if (typeof value === "number") {
            if (key.includes("LPD") || key.includes("ERV")) {
              value = value.toFixed(0) + "%";
            } else if (key.includes("Saving")) {
              value = value.toFixed(1) + "%";
            } else if (key.includes("kWh")) {
              value = value.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              });
            } else if (key.includes("kgCO2")) {
              value = value.toFixed(2);
            } else {
              value = value.toFixed(2);
            }
          }

          formattedRow[key] = value;
        }

        // Include __index internally (for selection/highlighting) but not for table
        formattedRow.__index = index;
        return formattedRow;
      });
    },
    highlightSelectedRows() {
      const myPlot = document.getElementById("plotContainer");

      if (!myPlot || !this.Plotly || !Array.isArray(this.plotColumns)) return;

      const colorKey = this.plotAxis;
      if (!colorKey) {
        console.error("plotAxis is not defined");
        return;
      }

      const originalColorValues = this.plotColumns.map(
        (row) => row?.[colorKey] ?? 0
      );
      const selectedIndices = Array.isArray(this.selectedRowIndex)
        ? this.selectedRowIndex
        : [];

      const colorValues = this.plotColumns.map((_, index) =>
        selectedIndices.includes(index) ? originalColorValues[index] : -1
      );

      const viridisWithGray = [
        [-1, "#d3d3d3"], // gray for unselected
        [0, "#440154"],
        [0.111, "#482878"],
        [0.222, "#3E4A89"],
        [0.333, "#31688E"],
        [0.444, "#26838F"],
        [0.555, "#1F9D8A"],
        [0.666, "#6CCE59"],
        [0.777, "#B6DE2B"],
        [0.888, "#FDE725"],
        [1, "#FFFFE0"],
      ];

      this.Plotly.restyle(
        myPlot,
        {
          "line.color": [colorValues],
          "line.colorscale": "Viridis",
          "line.reversescale": [true],
        },
        [0]
      );
    },
  },
  computed: {
    colorMode() {
      // Access the current color mode using the composable
      return useColorMode().preference;
    },
  },
  watch: {
    // Watch for changes in the color mode
    colorMode(newMode) {
      // Dynamically update layout colors based on the color mode
      if (this.layout) {
        this.layout.font.color = newMode === "dark" ? "#ffffff" : "#000000";
        this.layout.plot_bgcolor = newMode === "dark" ? "#333333" : "#f0f0f0";
      }
    },
    // arrayStore: {
    //   handler(newVal) {
    //     console.log("arrayStore", Array.isArray(newVal.selectedRows));
    //     console.log("arrayStore", newVal.selectedRows);

    //     this.selectedRowIndex = newVal.selectedRows.map((row) => row.__index);
    //     console.log("this.selectedRowIndex", this.selectedRowIndex);
    //     if (this.selectedRowIndex.length > 0) {
    //       this.highlightSelectedRows();
    //     }
    //     if (this.selectedRowIndex.length === 0) {
    //       this.resetPlot();
    //     }
    //   },
    //   deep: true,
    // },
  },
};
</script>

<style scoped>
div[ref="plotContainer"] {
  width: 100%;
  height: 100%;
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
.backgroundCont {
  width: 100%;
}
</style>
<style>
line.highlight {
  stroke-width: 20 !important;
  opacity: 0.2 !important;
  stroke: black !important;
}
.slideOver > div {
  background-color: transparent;
  backdrop-filter: blur(50px);
  border-radius: 20px;
  height: fit-content;
}
g.infolayer {
  transform: translate(0px, -30px);
}
g.axis-heading {
  transform: translate(0px, -15px);
}
tbody tr:hover {
  /* --tw-bg-opacity: 1; */
  background-color: #fafafa;
}
</style>
