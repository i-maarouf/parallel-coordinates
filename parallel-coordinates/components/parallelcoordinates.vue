<template>
  <div class="backgroundCont flex flex-col">
    <!-- <NuxtTour /> -->
    <div class="flex justify-end gap-3" v-if="Plotly">
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
            <UInput v-model="GHG" type="number" disabled />
          </UFormGroup>
          <UFormGroup label="GHG Rates" class="p-2" name="GHG2">
            <UInput v-model="GHG2" type="number" disabled />
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
        <div class="grid grid-cols-1 p-2">
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
    <div id="plotContainer" style="width: 100%; height: 100%"></div>
    <SelectedTable :selectedData="selectedData" />
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import { reactive, watch } from "vue";

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
      GHG: 12,
      GHG2: 6,
      plotColor: "Jet",

      wallRValue: 10,
      plotAxis: "GHG Saving%",

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
      // mappedSCV2: [],
      // mappedSCV3: [],
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
      const response = await fetch("A23P1_Parametric_Results.csv");
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      // const colorKey = "Elec Peak kW"; // Change "Age" to any other column name if needed
      const colorKey = this.plotAxis; // Change "Age" to any other column name if needed
      const colorValues = jsonData.map((row) => row[colorKey]); // Extract values for color scaling
      // const excludedColumns = ["ERV Eff"];
      const columnsWithStrings = [
        "Air Leakage",
        "LPD",
        "ERV",
        "Controls",
        "HVAC System",
      ];
      this.jsonData = jsonData;
      this.selectedData = jsonData;
      this.plotColumns = jsonData;

      // this.removeColumns(excludedColumns);
      // this.addOutputColumns();
      this.dimensionKeys = Object.keys(this.plotColumns[0]); // Maps Plotly dimension index to column names

      this.generateMappings(columnsWithStrings);
      this.renderPlot();
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

      // console.log("Constraints after update:", this.constraints);

      // Filter the dataset based on the constraints
      const selectedRows = this.plotColumns.filter((row) => {
        // console.log("Row:", row);

        return Object.entries(this.constraints).every(([dimension, ranges]) => {
          const dimensionIndex = parseInt(
            dimension.match(/dimensions\[(\d+)\]/)[1],
            10
          );
          // console.log("dimensionKeys:", this.dimensionKeys);
          const columnName = this.dimensionKeys[dimensionIndex];
          // console.log("Column Name:", columnName);
          const value = row[columnName];

          // console.log(
          //   `Filtering column: ${columnName}, Value: ${value}, Ranges:`,
          //   ranges
          // );

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
            // Handle numeric columns
            return ranges.some((range) => {
              if (Array.isArray(range[0])) {
                // Handle nested arrays by checking all ranges within them
                return range.some(
                  (subRange) =>
                    Array.isArray(subRange) &&
                    value >= subRange[0] &&
                    value <= subRange[1]
                );
              } else if (Array.isArray(range) && range.length === 2) {
                // Handle non-nested range
                return value >= range[0] && value <= range[1];
              }
              return false; // Ignore invalid range formats
            });
          } else {
            return false;
          }
        });
      });

      console.log("Selected Rows:", selectedRows);

      // Update selected data
      this.selectedData = selectedRows;
    },

    resizePlot() {
      this.Plotly.Plots.resize("plotContainer");
    },

    stringToValue(columnName, data) {
      const mapping = this.mappedColumns[columnName]?.find(
        (item) => item.label === data
      );
      return mapping ? mapping.value : null; // Return fallback if not found
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
    // Method to reset the parallel coordinates plot
    resetPlot() {
      this.selectedData = this.plotColumns;
      this.selectedRanges = {};
      this.constraints = {};
      this.GHG = 12;
      // Purge the existing graph
      this.applyPlotChanges();

      // Prepare fresh data and layout
    },
    applyPlotChanges() {
      // Apply changes to the plot based on user input
      // var myPlot = document.getElementById("plotContainer");
      // this.jsonData.forEach((row) => {
      //   row["GHGI (kg/m2)"] = row["EUI Savings %"] * this.GHG;
      // });
      this.renderPlot();
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
      ];
      this.generateMappings(columnsWithStrings);
      const freshDimensions = Object.keys(this.plotColumns[0]).map((key) => {
        const isStringColumn = columnsWithStrings.includes(key);
        return {
          label: key,
          values: this.plotColumns.map((row) =>
            isStringColumn ? this.stringToValue(key, row[key]) : row[key]
          ),
          ...(isStringColumn && {
            tickvals: this.mappedColumns[key].map((item) => item.value),
            ticktext: this.mappedColumns[key].map((item) => item.label),
          }),

          // labelfont: { color: "#ffffff" },
          // tickfont: { color: "#ffffff" },
        };
      });
      var colorScale = 0;
      this.plotColors.forEach((color, index) => {
        if (this.plotColor === color.colorLabel) {
          colorScale = color.colorName;
        }
      });
      // console.log("this.plotcolor", colorScale);

      const freshPlotData = [
        {
          type: "parcoords",
          line: {
            color: this.plotColumns.map((row) => row[this.plotAxis]),
            colorscale: colorScale,
            thickness: 5,
            reversescale: true,
          },

          dimensions: freshDimensions,
          customdata: this.plotColumns,
        },
      ];

      // Reinitialize the plot
      this.Plotly.newPlot(myPlot, freshPlotData, this.layout, config);
      myPlot.on("plotly_restyle", (eventData) => {
        console.log("eventData", eventData);
        if (!eventData[0].line) {
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
      });
    },
    removeColumns(excludedColumns) {
      this.plotColumns.forEach((row) => {
        excludedColumns.forEach((col) => {
          delete row[col]; // Remove excluded columns from the data
        });
      });
    },
    addOutputColumns() {
      const computedColumns = [
        "EUI Savings %",
        "GHG Savings %",
        "Peak kWe",
        "EUI (kWh/m2)",
      ];
      this.plotColumns.forEach((row) => {
        // Add a new column "ComputedColumn" as the sum of the first two columns
        row["Computed Column"] =
          row[computedColumns[0]] + row[computedColumns[1]];
        row["Computed Column 2"] = Math.floor(
          (row[computedColumns[2]] / row[computedColumns[3]]) *
            (row[computedColumns[0]] * row[computedColumns[1]])
        );
      });
      console.log("plotColumns", this.plotColumns);

      this.resetPlot();
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
  width: 98%;
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
</style>
