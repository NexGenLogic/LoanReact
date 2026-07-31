<template>
  <div class="d-flex align-items-center gap-2 justify-content-center">
    <span :style="{ color: text_color }">{{ text }}</span>
    <div class="pulse-loader">
      <span v-for="i in 4" :key="i" :style="{
        backgroundColor: text_color,
        animationDelay: (i - 1) * 0.2 + 's'
      }"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "PulseLoader",
  props: {
    text: {
      type: String,
      default: "Loading"
    },
    text_color: {
      type: String,
      default: "#92d4cb"
    }
  }
};
</script>

<style scoped>
.pulse-loader {
  display: flex;
  gap: 6px;
}

.pulse-loader span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #92d4cb;
  animation: pulse 1.2s infinite ease-in-out;
}

.pulse-loader span:nth-child(1) {
  animation-delay: 0s;
}

.pulse-loader span:nth-child(2) {
  animation-delay: 0.2s;
}

.pulse-loader span:nth-child(3) {
  animation-delay: 0.4s;
}

.pulse-loader span:nth-child(4) {
  animation-delay: 0.6s;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}
</style>
