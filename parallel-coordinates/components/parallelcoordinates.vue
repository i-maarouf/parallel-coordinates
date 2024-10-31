<template>
  <div class="row grid grid-cols-1 gap-10 w-full place-items-center">
    <div id="plotContainer"></div>
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
        width: 800,
        height: 400,
        font: {
          color: "#ffffff", // Set color of text, like title and axis labels
          size: 14,
        },
        paper_bgcolor: "transparent", // Background color of the entire plot
        plot_bgcolor: "#333333", // Background color within plot borders
      },
      Plotly: null, // Will hold the Plotly instance
      selectedData: [],
      selectedKeys: [],
    };
  },
  async mounted() {
    if (process.client) {
      var myPlot = document.getElementById("plotContainer");

      // Dynamically import Plotly on the client side
      this.Plotly = await import("plotly.js-dist-min");

      // Fetch and parse Excel file data
      const response = await fetch("/Parallel_Coordinates_Template.xlsx");
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      const colorKey = "power (hp)"; // Change "Age" to any other column name if needed
      const colorValues = jsonData.map((row) => row[colorKey]); // Extract values for color scaling

      // Prepare data for Plotly
      const dimensions = Object.keys(jsonData[0]).map((key) => ({
        label: key,
        values: jsonData.map((row) => row[key]),
      }));

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
          dimensions: dimensions,
          customdata: jsonData, // Store the entire jsonData for later access
        },
      ];

      // Render plot using Plotly
      this.Plotly.newPlot(myPlot, this.plotData, this.layout);

      // Attach event listener for selecting data
      myPlot.on("plotly_click", (eventData) => {
        console.log("Click****");
      });
      myPlot.on("plotly_hover", (eventData) => {
        console.log("****");
      });
      myPlot.on("plotly_selected", (eventData) => {
        console.log("****");

        if (eventData) {
          console.log("****");
          const selectedPoints = eventData.points.map((point) => {
            // Get index of the selected point
            const index = point.pointIndex;
            return jsonData[index]; // Return the whole row for that index
          });

          if (selectedPoints.length > 0) {
            this.selectedData = selectedPoints; // Store selected data
            this.selectedKeys = Object.keys(jsonData[0]); // Store keys for table header
          }
        }
      });
    }
  },
  methods: {},
};
</script>

<style scoped>
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
