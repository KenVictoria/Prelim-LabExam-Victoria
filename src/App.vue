<template>
  <div id="app">
    <HeaderComponent />
    <router-view />
    <APIMonitor />
    
    <!-- Global Loading Overlay -->
    <div v-if="globalLoading" class="global-loading">
      <div class="loading-content">
        <LoadingSpinner type="pulse" size="large" message="Processing..." />
        <div class="loading-details">
          <div class="loading-operation">{{ loadingOperation }}</div>
          <div class="loading-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: loadingProgress + '%' }"></div>
            </div>
            <div class="progress-text">{{ loadingProgress }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, provide } from 'vue'
import HeaderComponent from './components/HeaderComponent.vue'
import APIMonitor from './components/APIMonitor.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'

export default {
  name: 'App',
  components: {
    HeaderComponent,
    APIMonitor,
    LoadingSpinner
  },
  setup() {
    const globalLoading = ref(false)
    const loadingOperation = ref('')
    const loadingProgress = ref(0)
    let progressInterval

    const showLoading = (operation = 'Loading...', duration = 2000) => {
      globalLoading.value = true
      loadingOperation.value = operation
      loadingProgress.value = 0
      
      // Simulate progress
      clearInterval(progressInterval)
      progressInterval = setInterval(() => {
        if (loadingProgress.value < 90) {
          loadingProgress.value += 10
        }
      }, duration / 10)
    }

    const hideLoading = () => {
      loadingProgress.value = 100
      setTimeout(() => {
        globalLoading.value = false
        loadingOperation.value = ''
        loadingProgress.value = 0
        clearInterval(progressInterval)
      }, 300)
    }

    // Provide loading functions to all components
    provide('loading', {
      show: showLoading,
      hide: hideLoading
    })

    return {
      globalLoading,
      loadingOperation,
      loadingProgress
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  color: #f0f0f0;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Gold theme colors */
.gold-primary { color: #FFD700; }
.gold-secondary { color: #D4AF37; }
.bg-gold-gradient { background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%); }
.bg-dark-gradient { background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%); }

.card {
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.card:hover {
  border-color: rgba(255, 215, 0, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(255, 215, 0, 0.1);
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
  color: #1a1a1a;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #FFE55C 0%, #E6C158 100%);
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
}

.btn-danger {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3);
}

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.btn-success:hover {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
}

.btn-outline {
  background: transparent;
  border: 2px solid rgba(255, 215, 0, 0.3);
  color: #FFD700;
}

.btn-outline:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: #FFD700;
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 12px;
  overflow: hidden;
}

.table th, .table td {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.table th {
  background: rgba(255, 215, 0, 0.1);
  font-weight: 600;
  color: #FFD700;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 1px;
}

.table tr {
  transition: background-color 0.3s ease;
}

.table tr:hover {
  background: rgba(255, 215, 0, 0.05);
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #FFD700;
  font-size: 14px;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 10px;
  color: #f0f0f0;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #FFD700;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  background: rgba(255, 255, 255, 0.08);
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

select.form-control {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23FFD700'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;
  padding-right: 40px;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #FFE55C 0%, #E6C158 100%);
}

/* Loading animation */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 215, 0, 0.1) 50%, 
    transparent 100%);
  animation: shimmer 2s infinite;
}

/* Global Loading Styles */
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 15, 15, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  max-width: 400px;
  text-align: center;
}

.loading-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.loading-operation {
  font-size: 18px;
  font-weight: 600;
  color: #FFD700;
}

.loading-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFD700 0%, #D4AF37 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-align: right;
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
</style>