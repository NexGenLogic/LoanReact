<template>
  <div class="chart">
    <canvas :id="id" class="chart-canvas" :height="height"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  name: "ReportsLineChart",
  props: {
    id: {
      type: String,
      default: "line-chart",
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
      chartInstance: null,
    };
  },
  watch: {
    // Watch for changes in the chart data and re-render
    chart: {
      handler() {
        // Defensive: Only run if component still mounted and canvas exists
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
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      const canvasEl = document.getElementById(this.id);
      if (!canvasEl) {
        // Component may be hidden/unmounted during navigation
        return;
      }
      const ctx = canvasEl.getContext("2d");
      if (!ctx) {
        return;
      }

      this.chartInstance = new Chart(ctx, {
        type: "line",
        data: this.chart,
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
                beginAtZero: true, 
              },
            },
            x: {
              grid: {
                drawBorder: false,
                display: false,
                drawOnChartArea: false,
                drawTicks: false,
                borderDash: [5, 5],
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
    // This is the crucial addition to prevent memory leaks
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  },
};
</script>
