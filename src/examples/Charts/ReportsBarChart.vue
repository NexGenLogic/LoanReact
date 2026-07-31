<template>
  <div class="chart">
    <canvas :id="id" class="chart-canvas" :height="height"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  name: "ReportsBarChart",
  props: {
    id: {
      type: String,
      default: "bar-chart",
    },
    height: {
      type: [Number, String],
      default: "170",
    },
    chart: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chartInstance: null, // Store the chart instance here
    };
  },
  watch: {
    chart: {
      handler() {
        // Only run if component still mounted and canvas exists
        if (!this.$el || !document.getElementById(this.id)) {
          return;
        }
        this.renderChart();
      },
      deep: true,
    },
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      // Destroy the previous chart instance if it exists
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      
      const canvasEl = document.getElementById(this.id);
      if (!canvasEl) {
        return;
      }
      const ctx = canvasEl.getContext("2d");
      if (!ctx) {
        return;
      }

      this.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.chart.labels,
          datasets: this.chart.datasets.map(dataset => ({
            ...dataset,
            tension: 0.4,
            borderWidth: 0,
            borderRadius: 4,
            borderSkipped: false,
            maxBarThickness: 6,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          interaction: {
            intersect: false,
            mode: "index",
          },
          scales: {
            y: {
              grid: {
                drawBorder: false,
                display: true,
                drawOnChartArea: true,
                drawTicks: false,
                borderDash: [5, 5],
                color: "rgba(255, 255, 255, .2)",
              },
              ticks: {
                suggestedMin: 0,
                beginAtZero: true,
                padding: 10,
                font: {
                  size: 14,
                  weight: 300,
                  family: "Roboto",
                  style: "normal",
                  lineHeight: 2,
                },
                color: "#fff",
              },
            },
            x: {
              grid: {
                drawBorder: false,
                display: true,
                drawOnChartArea: true,
                drawTicks: false,
                borderDash: [5, 5],
                color: "rgba(255, 255, 255, .2)",
              },
              ticks: {
                display: true,
                color: "#f8f9fa",
                padding: 10,
                font: {
                  size: 14,
                  weight: 300,
                  family: "Roboto",
                  style: "normal",
                  lineHeight: 2,
                },
              },
            },
          },
        },
      });
    },
  },
  beforeUnmount() {
    // Ensure the chart is destroyed when the component is removed
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  },
};
</script>
