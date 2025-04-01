<template>
  <div class="skeleton-loader" :class="{ 'skeleton-card': type === 'card', 'skeleton-banner': type === 'banner', 'skeleton-text': type === 'text' }" :style="customStyle">
    <div v-if="type === 'card'" class="skeleton-image"></div>
    <div v-if="type === 'card'" class="skeleton-title"></div>
    <div v-if="type === 'card'" class="skeleton-subtitle"></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: 'card', // 'card', 'banner', 'text'
    validator: (value: string) => ['card', 'banner', 'text'].includes(value)
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: ''
  },
  customStyle: {
    type: Object,
    default: () => ({})
  }
});
</script>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

.skeleton-loader {
  position: relative;
  overflow: hidden;
  background: #1a1a1a;
  border-radius: 4px;
}

.skeleton-loader::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-card {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
}

.skeleton-image {
  width: 100%;
  height: 70%;
  background: #2a2a2a;
  border-radius: 8px 8px 0 0;
}

.skeleton-title {
  width: 80%;
  height: 16px;
  margin: 12px 10px 8px 10px;
  background: #2a2a2a;
  border-radius: 4px;
}

.skeleton-subtitle {
  width: 60%;
  height: 12px;
  margin: 0 10px 10px 10px;
  background: #2a2a2a;
  border-radius: 4px;
}

.skeleton-banner {
  width: 100%;
  height: 400px;
  border-radius: 8px;
}

.skeleton-text {
  width: 100%;
  height: 16px;
  margin: 8px 0;
  border-radius: 4px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .skeleton-card {
    height: 180px;
  }
  
  .skeleton-banner {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .skeleton-card {
    height: 160px;
  }
  
  .skeleton-banner {
    height: 200px;
  }
}
</style>
