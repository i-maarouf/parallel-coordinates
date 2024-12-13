<template>
  <div class="backgroundCont flex flex-col">
    <UButton
      icon="i-heroicons-arrow-path"
      size="sm"
      color="primary"
      variant="outline"
      class="flex self-end"
      label="Reset Filters"
      @click="resetPlot()"
    />
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
      // mappedSCV2: [],
      // mappedSCV3: [],
      constraints: {}, // To store active constraints for all columns
      mappedColumns: {},
      selectedRanges: {}, // Track selection ranges for each column
      jsonData: [], // Raw data for filtering
    };
  },
  async mounted() {
    window.addEventListener("resize", this.resizePlot);

    this.layout = reactive({
      title: "GEF Retrofit Decision Making Workshop",
      width: null,
      autosize: true, // Makes the chart adjust to container size
      responsive: true, // Enables responsive behavior
      height: 600,
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
      const response = await fetch("gefdatacostFinal.xlsx");
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      // const colorKey = "Elec Peak kW"; // Change "Age" to any other column name if needed
      const colorKey = "EUI Savings %"; // Change "Age" to any other column name if needed
      const colorValues = jsonData.map((row) => row[colorKey]); // Extract values for color scaling
      // const mappedData = this.mapTextColumnsToNumbers(this.jsonData);

      // const stringColumnName = "Premium ($)";
      // const stringColumnName = "SOG R-Value";
      const columnsWithStrings = ["HVAC", "SOG R-Value", "CMHC MLI"];

      // const stringColumnName = "HVAC";
      // const stringColumnName3 = "CMHC MLI";
      // const stringColumnValues = jsonData.map((row) => row[stringColumnName]);
      // const stringColumnValues2 = jsonData.map((row) => row[stringColumnName2]);
      // const stringColumnValues3 = jsonData.map((row) => row[stringColumnName3]);
      // const uniqueSCV = Array.from(new Set(stringColumnValues)); // Get unique values
      // const uniqueSCV2 = Array.from(new Set(stringColumnValues2)); // Get unique values
      // const uniqueSCV3 = Array.from(new Set(stringColumnValues3)); // Get unique values
      this.jsonData = jsonData;
      this.selectedData = jsonData;
      // this.mappedSCV = uniqueSCV.map((label, index) => ({
      //   label: label,
      //   value: index,
      // }));
      // console.log("mappedSCV", this.mappedSCV);
      this.generateMappings(columnsWithStrings);
      // this.mappedSCV2 = uniqueSCV2.map((label, index) => ({
      //   label: label,
      //   value: index,
      // }));
      // this.mappedSCV3 = uniqueSCV3.map((label, index) => ({
      //   label: label,
      //   value: index,
      // }));

      const dimensions = Object.keys(this.jsonData[0]).map((key) => {
        const isStringColumn = columnsWithStrings.includes(key);
        return {
          label: key,
          values: this.jsonData.map((row) =>
            isStringColumn ? this.stringToValue(key, row[key]) : row[key]
          ),
          ...(isStringColumn && {
            tickvals: this.mappedColumns[key].map((item) => item.value),
            ticktext: this.mappedColumns[key].map((item) => item.label),
          }),
          labelfont: { color: "#ffffff" },
          tickfont: { color: "#ffffff" },
        };
      });

      this.dimensionKeys = Object.keys(this.jsonData[0]); // Maps Plotly dimension index to column names

      this.plotData = [
        {
          type: "parcoords",
          line: {
            color: colorValues, // Set color to array of values from the selected column
            colorscale: "Jet", // Choose a color scale, e.g., Viridis, Jet, etc.
            // showscale: true,
            // cmin: Math.min(...colorValues), // Minimum value for color scaling
            // cmax: Math.max(...colorValues), // Maximum value for color scaling
            width: 5,
          },
          dimensions: dimensions,
          customdata: jsonData, // Store the entire jsonData for later access
        },
      ];

      // Render plot using Plotly
      this.Plotly.newPlot(myPlot, this.plotData, this.layout);

      myPlot.on("plotly_restyle", (eventData) => {
        console.log("eventData", eventData);
        const selectedColumnIndex = Object.keys(eventData[0])[0].match(
          /\d+/
        )[0];
        console.log("selectedColumnIndex", selectedColumnIndex);
        const selectedColumn = dimensions[selectedColumnIndex].label;
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
      });
    }
  },
  beforeUnmount() {
    // Clean up the resize listener
    window.removeEventListener("resize", this.resizePlot);
  },
  methods: {
    updateSelectedData(eventData) {
      // Parse constraints from the current eventData
      if (eventData && eventData[0]) {
        Object.entries(eventData[0]).forEach(([dimension, range]) => {
          if (range && range[0]) {
            this.constraints[dimension] = range; // Add/Update constraint for the dimension
          } else {
            delete this.constraints[dimension]; // Remove constraint if invalid
          }
        });
      }

      // Process the dataset based on all active constraints
      const selectedRows = this.jsonData.filter((row) => {
        return Object.entries(this.constraints).every(([dimension, range]) => {
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
              mappedValue >= range[0][0] &&
              mappedValue <= range[0][1]
            );
          } else if (typeof value === "number") {
            // Handle numeric columns
            return value >= range[0][0] && value <= range[0][1];
          } else {
            // Handle unexpected cases
            return false;
          }
        });
      });

      // Update the selected data for the table
      this.selectedData = selectedRows;

      // Debugging: Log active constraints and selected rows
      // console.log("Active Constraints:", this.constraints);
      // console.log("Selected Rows:", this.selectedData);
    },
    // updateSelectedData(eventData) {
    //   // Parse constraints from the current eventData
    //   if (eventData && eventData[0]) {
    //     Object.entries(eventData[0]).forEach(([dimension, range]) => {
    //       // console.log("range", range);

    //       if (range && range[0]) {
    //         this.constraints[dimension] = range; // Add/Update constraint for the dimension
    //       } else {
    //         delete this.constraints[dimension]; // Remove constraint if invalid
    //       }
    //     });
    //   }

    //   // Process the dataset based on all active constraints
    //   const selectedRows = this.jsonData.filter((row) => {
    //     return Object.entries(this.constraints).every(([dimension, range]) => {
    //       const dimensionIndex = parseInt(
    //         dimension.match(/dimensions\[(\d+)\]/)[1],
    //         10
    //       );
    //       const columnName = this.dimensionKeys[dimensionIndex];
    //       const value = row[columnName];
    //       // console.log("value", value);
    //       // console.log("type of value", typeof value);

    //       if (typeof value === "string") {
    //         // console.log("value", value);

    //         // Map text value and compare
    //         const mappedValue = this.mappedSCV.find(
    //           (item) => item.label === value
    //         )?.value;
    //         return (
    //           mappedValue !== undefined &&
    //           mappedValue >= range[0][0] &&
    //           mappedValue <= range[0][1]
    //         );
    //       } else {
    //         // console.log("value", value);

    //         // Compare numeric values
    //         return value >= range[0][0] && value <= range[0][1];
    //       }
    //     });
    //   });
    //   // console.log("selectedRows", selectedRows);

    //   // Update the selected data for the table
    //   this.selectedData = selectedRows;

    //   // // Debugging: Log active constraints and selected rows
    //   // console.log("Active Constraints:", this.constraints);
    //   // console.log("Selected Rows:", this.selectedData);
    // },
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
          new Set(this.jsonData.map((row) => row[column]))
        );
        this.mappedColumns[column] = uniqueValues.map((label, index) => ({
          label: label,
          value: index,
        }));
      });
    },
    // Method to reset the parallel coordinates plot
    resetPlot() {
      const myPlot = document.getElementById("plotContainer");
      this.selectedData = this.jsonData;
      this.selectedRanges = {};
      this.constraints = {};
      // Purge the existing graph
      this.Plotly.purge(myPlot);
      const stringColumnName = "HVAC";
      // Prepare fresh data and layout
      const columnsWithStrings = ["HVAC", "SOG R-Value", "CMHC MLI"];
      this.generateMappings(columnsWithStrings);
      const freshDimensions = Object.keys(this.jsonData[0]).map((key) => {
        const isStringColumn = columnsWithStrings.includes(key);
        return {
          label: key,
          values: this.jsonData.map((row) =>
            isStringColumn ? this.stringToValue(key, row[key]) : row[key]
          ),
          ...(isStringColumn && {
            tickvals: this.mappedColumns[key].map((item) => item.value),
            ticktext: this.mappedColumns[key].map((item) => item.label),
          }),
          labelfont: { color: "#ffffff" },
          tickfont: { color: "#ffffff" },
        };
      });

      const freshPlotData = [
        {
          type: "parcoords",
          line: {
            color: this.jsonData.map((row) => row["EUI Savings %"]),
            colorscale: "Jet",
            width: 5,
          },
          dimensions: freshDimensions,
          customdata: this.jsonData,
        },
      ];

      // Reinitialize the plot
      this.Plotly.newPlot(myPlot, freshPlotData, this.layout);
      myPlot.on("plotly_restyle", (eventData) => {
        console.log("eventData", eventData);
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
      });
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
</style>
