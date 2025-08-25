<template>
  <div class="spinner-wrapper">
    <div class="spinner"></div>
    <span class="spinner-text">{{ text }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: "Loading..."
  }
})
</script>

<style scoped>
.spinner-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 6px solid #ddd;
  border-top: 6px solid #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-text {
  font-size: 0.8rem;
  font-weight: bold;
  color: #333;
  z-index: 1;
  text-align: center;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
