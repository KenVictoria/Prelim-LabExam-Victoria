<template>
  <div class="loading-spinner" :class="[size, variant]">
    <div v-if="type === 'spinner'" class="spinner-container">
      <div class="spinner"></div>
      <div v-if="message" class="message">{{ message }}</div>
    </div>
    
    <div v-else-if="type === 'dots'" class="dots-container">
      <div class="dots">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
      <div v-if="message" class="message">{{ message }}</div>
    </div>
    
    <div v-else-if="type === 'pulse'" class="pulse-container">
      <div class="pulse"></div>
      <div v-if="message" class="message">{{ message }}</div>
    </div>
    
    <div v-else-if="type === 'bars'" class="bars-container">
      <div class="bars">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
      <div v-if="message" class="message">{{ message }}</div>
    </div>
    
    <!-- Skeleton loading -->
    <div v-else-if="type === 'skeleton'" class="skeleton-container">
      <div class="skeleton-item" v-for="n in skeletonCount" :key="n" :style="{
        width: skeletonWidths[n - 1] || '100%',
        height: skeletonHeight
      }"></div>
    </div>
    
    <!-- Progress loading -->
    <div v-else-if="type === 'progress'" class="progress-container">
      <div class="progress-wrapper">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="progress-text">{{ progress }}%</div>
      </div>
      <div v-if="message" class="message">{{ message }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    message: {
      type: String,
      default: 'Loading...'
    },
    type: {
      type: String,
      default: 'spinner',
      validator: (value) => ['spinner', 'dots', 'pulse', 'bars', 'skeleton', 'progress'].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'gold', 'primary', 'success', 'danger'].includes(value)
    },
    skeletonCount: {
      type: Number,
      default: 3
    },
    skeletonWidths: {
      type: Array,
      default: () => ['80%', '60%', '90%']
    },
    skeletonHeight: {
      type: String,
      default: '20px'
    },
    progress: {
      type: Number,
      default: 0,
      validator: (value) => value >= 0 && value <= 100
    }
  }
}
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-spinner.small {
  padding: 20px;
}

.loading-spinner.medium {
  padding: 40px;
}

.loading-spinner.large {
  padding: 60px;
}

/* Variants */
.loading-spinner.gold .spinner,
.loading-spinner.gold .dot,
.loading-spinner.gold .pulse,
.loading-spinner.gold .bar {
  background: #FFD700 !important;
  border-color: #FFD700 !important;
}

.loading-spinner.primary .spinner,
.loading-spinner.primary .dot,
.loading-spinner.primary .pulse,
.loading-spinner.primary .bar {
  background: #4a6cf7 !important;
  border-color: #4a6cf7 !important;
}

.loading-spinner.success .spinner,
.loading-spinner.success .dot,
.loading-spinner.success .pulse,
.loading-spinner.success .bar {
  background: #10b981 !important;
  border-color: #10b981 !important;
}

.loading-spinner.danger .spinner,
.loading-spinner.danger .dot,
.loading-spinner.danger .pulse,
.loading-spinner.danger .bar {
  background: #ef4444 !important;
  border-color: #ef4444 !important;
}

/* Spinner type */
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 215, 0, 0.1);
  border-top: 3px solid #FFD700;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Dots type */
.dots-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  background: #FFD700;
  border-radius: 50%;
  animation: dots-bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

/* Pulse type */
.pulse-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.pulse {
  width: 40px;
  height: 40px;
  background: #FFD700;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

/* Bars type */
.bars-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.bars {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 40px;
}

.bar {
  width: 6px;
  background: #FFD700;
  border-radius: 3px;
  animation: bars 1.2s infinite ease-in-out;
}

.bar:nth-child(1) {
  animation-delay: -1.2s;
  height: 20px;
}

.bar:nth-child(2) {
  animation-delay: -1.1s;
  height: 30px;
}

.bar:nth-child(3) {
  animation-delay: -1.0s;
  height: 40px;
}

.bar:nth-child(4) {
  animation-delay: -0.9s;
  height: 30px;
}

.bar:nth-child(5) {
  animation-delay: -0.8s;
  height: 20px;
}

/* Skeleton type */
.skeleton-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-item {
  background: linear-gradient(90deg, 
    rgba(255, 215, 0, 0.1) 25%, 
    rgba(255, 215, 0, 0.2) 50%, 
    rgba(255, 215, 0, 0.1) 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
}

/* Progress type */
.progress-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 300px;
}

.progress-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFD700 0%, #D4AF37 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  font-weight: 600;
  color: #FFD700;
  min-width: 40px;
}

.message {
  color: rgba(255, 215, 0, 0.8);
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes dots-bounce {
  0%, 80%, 100% { 
    transform: scale(0);
  }
  40% { 
    transform: scale(1.0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.7;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.7;
  }
}

@keyframes bars {
  0%, 40%, 100% {
    transform: scaleY(0.5);
  }
  20% {
    transform: scaleY(1);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>