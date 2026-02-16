<template>
  <div class="api-monitor" :class="{ 'monitor-visible': isVisible }">
    <button class="monitor-toggle" @click="toggleMonitor">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="monitor-badge">{{ apiLogs.length }}</span>
      <div class="monitor-pulse" :class="{ 'pulse-active': hasPendingCalls }"></div>
    </button>
    
    <div class="monitor-panel">
      <div class="monitor-header">
        <h3>API Monitor</h3>
        <div class="monitor-actions">
          <button @click="refreshLogs" class="action-btn" title="Refresh">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button @click="clearLogs" class="action-btn" title="Clear Logs">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button @click="simulateError" class="action-btn" title="Simulate Error">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button @click="toggleMonitor" class="action-btn" title="Close">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div class="monitor-stats">
        <div class="stat-item">
          <span class="stat-label">Total Calls</span>
          <span class="stat-value">{{ apiLogs.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Success</span>
          <span class="stat-value success">{{ successCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Pending</span>
          <span class="stat-value warning">{{ pendingCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Errors</span>
          <span class="stat-value danger">{{ errorCount }}</span>
        </div>
      </div>
      
      <div class="monitor-controls">
        <div class="filter-controls">
          <label class="filter-label">Filter:</label>
          <button 
            v-for="filter in filters" 
            :key="filter"
            @click="toggleFilter(filter)"
            :class="['filter-btn', { active: activeFilters.includes(filter) }]"
          >
            {{ filter }}
          </button>
        </div>
      </div>
      
      <div class="monitor-logs">
        <div v-for="log in filteredLogs" :key="log.id" class="log-item" :class="log.status">
          <div class="log-time">{{ formatTime(log.timestamp) }}</div>
          <div class="log-method" :class="log.method.toLowerCase()">{{ log.method }}</div>
          <div class="log-url">{{ log.url }}</div>
          <div class="log-status">
            <span class="status-badge" :class="log.status.replace('external-', '')">
              {{ getStatusText(log.status) }}
            </span>
          </div>
          <div class="log-duration" v-if="log.duration">
            {{ log.duration }}ms
          </div>
          <div v-else class="log-duration">
            <span class="loading-dot"></span>
          </div>
        </div>
        
        <div v-if="filteredLogs.length === 0" class="empty-logs">
          <svg xmlns="http://www.w3.org/2000/svg" class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          No API calls to show
          <p class="empty-subtitle">Perform actions to see API logs</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { studentAPI } from '../services/api'

export default {
  name: 'APIMonitor',
  setup() {
    const isVisible = ref(false)
    const apiLogs = ref([])
    const activeFilters = ref(['all'])
    const filters = ['all', 'pending', 'success', 'error', 'external']
    let refreshInterval

    const fetchLogs = () => {
      apiLogs.value = studentAPI.getAPILogs()
    }

    const successCount = computed(() => {
      return apiLogs.value.filter(log => 
        log.status === 'success' || log.status === 'external-success'
      ).length
    })

    const pendingCount = computed(() => {
      return apiLogs.value.filter(log => 
        log.status === 'pending' || log.status === 'external-pending'
      ).length
    })

    const errorCount = computed(() => {
      return apiLogs.value.filter(log => 
        log.status === 'error' || log.status === 'external-error'
      ).length
    })

    const hasPendingCalls = computed(() => {
      return pendingCount.value > 0
    })

    const filteredLogs = computed(() => {
      if (activeFilters.value.includes('all')) {
        return apiLogs.value
      }
      
      return apiLogs.value.filter(log => {
        if (activeFilters.value.includes('external')) {
          return log.status.includes('external')
        }
        return activeFilters.value.some(filter => 
          log.status.includes(filter)
        )
      })
    })

    const toggleMonitor = () => {
      isVisible.value = !isVisible.value
    }

    const refreshLogs = () => {
      fetchLogs()
    }

    const clearLogs = () => {
      studentAPI.clearAPILogs()
      fetchLogs()
    }

    const simulateError = async () => {
      try {
        await studentAPI.simulateNetworkError()
      } catch (error) {
        console.error('Simulated error:', error.message)
      }
    }

    const toggleFilter = (filter) => {
      if (filter === 'all') {
        activeFilters.value = ['all']
      } else {
        const index = activeFilters.value.indexOf(filter)
        if (index > -1) {
          activeFilters.value.splice(index, 1)
          if (activeFilters.value.length === 0) {
            activeFilters.value = ['all']
          }
        } else {
          activeFilters.value = activeFilters.value.filter(f => f !== 'all')
          activeFilters.value.push(filter)
        }
      }
    }

    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    const getStatusText = (status) => {
      const statusMap = {
        'pending': 'Pending',
        'success': 'Success',
        'error': 'Error',
        'external-pending': 'External',
        'external-success': 'Ext Success',
        'external-error': 'Ext Error'
      }
      return statusMap[status] || status
    }

    onMounted(() => {
      fetchLogs()
      // Refresh logs every second to see pending status updates
      refreshInterval = setInterval(fetchLogs, 1000)
    })

    onUnmounted(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    })

    return {
      isVisible,
      apiLogs,
      activeFilters,
      filters,
      successCount,
      pendingCount,
      errorCount,
      hasPendingCalls,
      filteredLogs,
      toggleMonitor,
      refreshLogs,
      clearLogs,
      simulateError,
      toggleFilter,
      formatTime,
      getStatusText
    }
  }
}
</script>

<style scoped>
.api-monitor {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

.monitor-toggle {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
  transition: all 0.3s ease;
  position: relative;
}

.monitor-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 30px rgba(255, 215, 0, 0.4);
}

.monitor-toggle svg {
  width: 24px;
  height: 24px;
}

.monitor-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 700;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.monitor-pulse {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: rgba(245, 158, 11, 0.3);
  opacity: 0;
  animation: none;
}

.monitor-pulse.pulse-active {
  animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  70%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.monitor-panel {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 500px;
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  transition: all 0.3s ease;
  pointer-events: none;
  overflow: hidden;
}

.monitor-visible .monitor-panel {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: all;
}

.monitor-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 215, 0, 0.05);
}

.monitor-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #FFD700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.monitor-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
  color: #FFD700;
}

.monitor-stats {
  padding: 20px 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #f0f0f0;
}

.stat-value.success {
  color: #10b981;
}

.stat-value.warning {
  color: #f59e0b;
}

.stat-value.danger {
  color: #ef4444;
}

.monitor-controls {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
}

.filter-btn {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-btn:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
  color: #FFD700;
}

.filter-btn.active {
  background: rgba(255, 215, 0, 0.2);
  border-color: #FFD700;
  color: #FFD700;
}

.monitor-logs {
  max-height: 400px;
  overflow-y: auto;
  padding: 0;
}

.log-item {
  display: grid;
  grid-template-columns: 70px 60px 1fr 80px 60px;
  gap: 12px;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.log-item:hover {
  background: rgba(255, 215, 0, 0.05);
}

.log-item.pending, .log-item.external-pending {
  background: rgba(245, 158, 11, 0.1);
}

.log-item.success, .log-item.external-success {
  background: rgba(16, 185, 129, 0.05);
}

.log-item.error, .log-item.external-error {
  background: rgba(239, 68, 68, 0.05);
}

.log-time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Monaco', 'Menlo', monospace;
}

.log-method {
  font-size: 11px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 6px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.log-method.get {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.log-method.post {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.log-method.put {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.log-method.delete {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.log-url {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Monaco', 'Menlo', monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-badge {
  font-size: 10px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-badge.success {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-badge.error {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.log-duration {
  font-size: 11px;
  color: rgba(255, 215, 0, 0.8);
  font-family: 'Monaco', 'Menlo', monospace;
  text-align: right;
}

.loading-dot {
  width: 8px;
  height: 8px;
  background: #f59e0b;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
  display: inline-block;
}

.empty-logs {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.5);
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: rgba(255, 215, 0, 0.3);
  margin-bottom: 16px;
}

.empty-subtitle {
  font-size: 12px;
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.4);
}

/* Scrollbar styling for monitor logs */
.monitor-logs::-webkit-scrollbar {
  width: 8px;
}

.monitor-logs::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.monitor-logs::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
  border-radius: 4px;
}

.monitor-logs::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #FFE55C 0%, #E6C158 100%);
}
</style>