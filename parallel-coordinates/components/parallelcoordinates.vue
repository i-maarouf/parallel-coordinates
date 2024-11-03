<template>
  <div class="w-full">
    <div id="plotContainer" style="width: 100%; height: 100%"></div>

    <table v-if="selectedData.length > 0" border="1" style="margin-top: 20px">
      <thead>
        <tr>
          <th v-for="(key, index) in selectedKeys" :key="index">{{ key }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-for="(value, index) in selectedData[0]" :key="index">
            {{ value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import * as XLSX from "xlsx";

export default {
  data() {
    return {
      plotData: [],
      layout: {
        title: "Parallel Coordinates Plot",
        width: null,
        height: 600,
        font: {
          color: "#ffffff", // Set color of text, like title and axis labels
          size: 14,
        },
        paper_bgcolor: "transparent", // Background color of the entire plot
        plot_bgcolor: "#333333", // Background color within plot borders
      },
      Plotly: null, // Will hold the Plotly instance
      selectedData: [],
      mappedSCV: [],
      selectedKeys: [],
      filterRanges: {}, // Store ranges for each axis
      jsonData: [], // Raw data for filtering
    };
  },
  async mounted() {
    if (process.client) {
      var myPlot = document.getElementById("plotContainer");

      // Dynamically import Plotly on the client side
      this.Plotly = await import("plotly.js-dist-min");

      // Fetch and parse Excel file data
      // const response = await fetch("/Bilmar_Sample_Data.xlsx");
      const response = await fetch("/Bilmar_Sample_Data copy.xlsx");
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      const colorKey = "out:Elec Peak kW"; // Change "Age" to any other column name if needed
      const colorValues = jsonData.map((row) => row[colorKey]); // Extract values for color scaling
      // const mappedData = this.mapTextColumnsToNumbers(this.jsonData);
      const stringColumnName = "out:Premium ($)";
      const stringColumnValues = jsonData.map((row) => row[stringColumnName]);
      const uniqueSCV = Array.from(new Set(stringColumnValues)); // Get unique values

      this.mappedSCV = uniqueSCV.map((label, index) => ({
        label: label,
        value: index,
      }));
      console.log("mappedSCV", this.mappedSCV);

      const dimensions = Object.keys(jsonData[0]).map((key) => {
        const isStringColumn = key === stringColumnName;
        return {
          label: key,
          values: jsonData.map((row) =>
            isStringColumn ? this.stringToValue(row[key]) : row[key]
          ),
          // Only set tickvals and ticktext for the string column
          ...(isStringColumn && {
            tickvals: this.mappedSCV.map((item) => item.value),
            ticktext: this.mappedSCV.map((item) => item.label),
          }),
          labelfont: { color: "#ffffff" },
          tickfont: { color: "#ffffff" },
        };
      });
      console.log("dimensions: ", dimensions);
      this.plotData = [
        {
          type: "parcoords",
          line: {
            color: colorValues, // Set color to array of values from the selected column
            colorscale: "Jet", // Choose a color scale, e.g., Viridis, Jet, etc.
            cmin: Math.min(...colorValues), // Minimum value for color scaling
            cmax: Math.max(...colorValues), // Maximum value for color scaling
            width: 5,
          },
          selected: {
            line: {
              color: "red", // Color of lines when selected
              width: 3, // Thickness of selected lines
            },
          },
          dimensions: dimensions,
          customdata: jsonData, // Store the entire jsonData for later access
        },
      ];

      // Render plot using Plotly
      this.Plotly.newPlot(myPlot, this.plotData, this.layout);

      myPlot.on("plotly_restyle", (eventData) => {
        console.log("eventData", eventData);
        // if (eventData && eventData[0]) {
        //   Object.keys(eventData[0]).forEach((key) => {
        //     const match = key.match(/dimensions\[(\d+)\]\.constraintrange/);
        //     console.log("match", match);
        //     if (match) {
        //       const axisIndex = parseInt(match[1], 10);
        //       const range = eventData[0][key][0];
        //       this.filterRanges[axisIndex] = range;
        //     }
        //   });

        //   // Filter data points based on updated ranges
        //   this.selectedData = this.filterDataByRanges();
        //   this.selectedKeys = Object.keys(this.jsonData[0]);
        // }
      });
      window.addEventListener("resize", () => {
        this.Plotly.Plots.resize(myPlot);
      });
    }
  },
  beforeUnmount() {
    // Clean up the resize listener
    window.removeEventListener("resize", this.resizePlot);
  },
  methods: {
    resizePlot() {
      this.Plotly.Plots.resize(this.$refs.plotContainer);
    },
    filterDataByRanges() {
      return this.jsonData.filter((row) => {
        return Object.keys(this.filterRanges).every((axisIndex) => {
          const range = this.filterRanges[axisIndex];
          const key = Object.keys(this.jsonData[0])[axisIndex];
          const value = row[key];
          // Check if value is within range if range is set
          return range && range[0] !== null && range[1] !== null
            ? value >= range[0] && value <= range[1]
            : true;
        });
      });
    },
    stringToValue(data) {
      const mapping = this.mappedSCV.find((item) => item.label === data);
      return mapping ? mapping.value : null; // Return a fallback if not found
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
</style>
