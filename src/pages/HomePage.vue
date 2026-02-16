<template>
  <div class="home-page">
    <div class="container">
      <!-- Header with stats -->
      <div class="page-header">
        <div class="header-content">
          <div>
            <h2>Student Analytics Dashboard</h2>
            <p class="subtitle">Comprehensive overview of student information and statistics</p>
          </div>
          <div class="header-stats">
            <div class="stat-chip">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Live Data</span>
            </div>
            <div class="stat-chip">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Updated Real-time</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading state for stats -->
      <div v-if="loading && !initialLoadComplete" class="stats-loading">
        <div class="skeleton-stats">
          <div class="skeleton-stat-card" v-for="n in 4" :key="n"></div>
        </div>
      </div>

      <!-- Stats Grid -->
<div v-else class="stats-grid">
  <div class="stat-card">
    <div class="stat-header">
      <div class="stat-icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="stat-svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <div v-if="initialLoadComplete" class="stat-trend" :class="`trend-${trendDirection}`">
        <svg v-if="trendDirection === 'up'" xmlns="http://www.w3.org/2000/svg" class="trend-svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        <svg v-else-if="trendDirection === 'down'" xmlns="http://www.w3.org/2000/svg" class="trend-svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="trend-svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
        <span class="trend-text">{{ Math.abs(trendPercentage).toFixed(1) }}%</span>
      </div>
    </div>
    <div class="stat-content">
      <h3 class="stat-number">{{ totalStudents }}</h3>
      <p class="stat-label">Total Students</p>
    </div>
  </div>

  <div class="stat-card">
    <div class="stat-header">
      <div class="stat-icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="stat-svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
    </div>
    <div class="stat-content">
      <h3 class="stat-number">{{ departments.length }}</h3>
      <p class="stat-label">Departments</p>
    </div>
  </div>

  <div class="stat-card">
    <div class="stat-header">
      <div class="stat-icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="stat-svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    </div>
    <div class="stat-content">
      <h3 class="stat-number">{{ femaleCount }}</h3>
      <p class="stat-label">Female Students</p>
    </div>
  </div>

  <div class="stat-card">
    <div class="stat-header">
      <div class="stat-icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="stat-svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    </div>
    <div class="stat-content">
      <h3 class="stat-number">{{ maleCount }}</h3>
      <p class="stat-label">Male Students</p>
    </div>
  </div>
</div>

      <!-- Charts Section -->
<div class="charts-grid">
  <div class="card chart-card">
    <div class="card-header">
      <h3 class="chart-title">
        <svg xmlns="http://www.w3.org/2000/svg" class="chart-svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Students by Department
      </h3>
      <select v-model="selectedChartPeriod" class="period-select">
        <option value="monthly">This Month</option>
        <option value="quarterly">This Quarter</option>
        <option value="yearly">This Year</option>
      </select>
    </div>
    <div v-if="loading" class="chart-loading">
      <LoadingSpinner type="skeleton" :skeleton-count="4" size="small" />
    </div>
    <div v-else class="chart-container">
      <div v-for="dept in departmentStats" :key="dept.name" class="chart-bar">
        <div class="bar-info">
          <span class="bar-label">{{ dept.name }}</span>
          <span class="bar-percentage">{{ Math.round((dept.count / totalStudents) * 100) }}%</span>
        </div>
        <div class="bar-container">
          <div 
            class="bar-fill" 
            :style="{ width: (dept.count / Math.max(...departmentStats.map(d => d.count)) * 100) + '%' }"
          >
            <span class="bar-count">{{ dept.count }} students</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card chart-card">
    <div class="card-header">
      <h3 class="chart-title">
        <svg xmlns="http://www.w3.org/2000/svg" class="chart-svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Students by Year Level
      </h3>
    </div>
    <div v-if="loading" class="chart-loading">
      <LoadingSpinner type="skeleton" :skeleton-count="5" size="small" />
    </div>
    <div v-else class="year-chart">
      <div v-for="year in yearLevelStats" :key="year.level" class="year-item">
        <div class="year-info">
          <span class="year-label">Year {{ year.level }}</span>
          <span class="year-count">{{ year.count }}</span>
        </div>
        <div class="year-bar">
          <div class="year-fill" :style="{ width: (year.count / Math.max(...yearLevelStats.map(y => y.count)) * 100) + '%' }">
            <div class="year-progress"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

        <!-- Recent Students -->
<div class="card recent-students-card">
  <div class="card-header">
    <h3 class="recent-title">
      <svg xmlns="http://www.w3.org/2000/svg" class="recent-svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Recent Students
    </h3>
    <router-link to="/students" class="btn btn-outline">
      <svg xmlns="http://www.w3.org/2000/svg" class="btn-svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
      View All
    </router-link>
  </div>
        
        <div v-if="loading" class="loading-container">
          <LoadingSpinner type="bars" message="Loading student data..." />
          <div class="loading-note">Fetching from API (simulated 1-2s delay)</div>
        </div>
        
        <div v-else-if="error" class="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ error }}
        </div>
        
        <div v-else class="students-grid">
          <div v-for="student in recentStudents" :key="student.id" class="student-card-mini">
            <div class="student-avatar">
              <div :class="['avatar', student.gender.toLowerCase()]">
                {{ student.name.charAt(0).toUpperCase() }}
              </div>
            </div>
            <div class="student-info">
              <h4>{{ student.name }}</h4>
              <div class="student-meta">
                <span class="badge" :class="getDepartmentClass(student.department)">
                  {{ student.department }}
                </span>
                <span class="meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Year {{ student.yearLevel }}
                </span>
              </div>
            </div>
            <div class="student-actions">
              <button @click="handleEdit(student)" class="action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button @click="handleDelete(student.id)" class="action-btn danger">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, inject } from 'vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { studentAPI } from '../services/api'

export default {
  name: 'HomePage',
  components: {
    LoadingSpinner
  },
  setup() {
    const students = ref([])
    const loading = ref(true)
    const initialLoadComplete = ref(false)
    const error = ref(null)
    const selectedChartPeriod = ref('monthly')
    
    // Store previous student count in localStorage
    const STORAGE_KEY = 'student_trend_data'
    
    // Get previous data from localStorage
    const getPreviousData = () => {
      try {
        const data = localStorage.getItem(STORAGE_KEY)
        if (data) {
          const parsed = JSON.parse(data)
          return {
            count: parsed.count || 0,
            timestamp: parsed.timestamp ? new Date(parsed.timestamp) : new Date()
          }
        }
      } catch (e) {
        console.error('Error reading trend data from localStorage:', e)
      }
      return { count: 0, timestamp: new Date() }
    }
    
    // Save current data to localStorage
    const saveCurrentData = (count) => {
      try {
        const data = {
          count: count,
          timestamp: new Date().toISOString()
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      } catch (e) {
        console.error('Error saving trend data to localStorage:', e)
      }
    }
    
    // Previous data from localStorage
    const previousData = ref(getPreviousData())
    
    // Inject loading functions
    const loadingFunctions = inject('loading')

    const fetchStudents = async () => {
      try {
        loading.value = true
        error.value = null
        
        // Show global loading
        if (!initialLoadComplete.value && loadingFunctions) {
          loadingFunctions.show('Fetching student data...', 1500)
        } else if (loadingFunctions) {
          loadingFunctions.show('Refreshing data...', 1000)
        }
        
        const response = await studentAPI.getStudents()
        const newStudents = response.data
        
        // Save current count to localStorage for next time
        saveCurrentData(newStudents.length)
        
        students.value = newStudents
        
        // Mark initial load as complete
        initialLoadComplete.value = true
        
      } catch (err) {
        error.value = 'Failed to load students. Please try again later.'
        console.error('Error fetching students:', err)
        
        if (loadingFunctions) {
          loadingFunctions.hide()
        }
      } finally {
        loading.value = false
        
        setTimeout(() => {
          if (loadingFunctions) {
            loadingFunctions.hide()
          }
        }, 300)
      }
    }

    // Computed properties
    const totalStudents = computed(() => students.value.length)
    
    const trendPercentage = computed(() => {
      if (!initialLoadComplete.value) {
        return 0.0
      }
      
      const previousCount = previousData.value.count
      const currentCount = totalStudents.value
      
      // If no previous data or same count
      if (previousCount === 0 || previousCount === currentCount) {
        return 0.0
      }
      
      // Calculate percentage change (scale by 100%)
      const change = currentCount - previousCount
      const percentage = (change / previousCount) * 100
      
      // Return with 1 decimal place
      return parseFloat(percentage.toFixed(1))
    })
    
    const trendDirection = computed(() => {
      if (trendPercentage.value > 0) return 'up'
      if (trendPercentage.value < 0) return 'down'
      return 'neutral'
    })

    // ... rest of your computed properties remain the same ...
    const departments = computed(() => {
      const depts = new Set(students.value.map(s => s.department))
      return Array.from(depts)
    })

    const femaleCount = computed(() => {
      return students.value.filter(s => s.gender === 'Female').length
    })

    const maleCount = computed(() => {
      return students.value.filter(s => s.gender === 'Male').length
    })

    const departmentStats = computed(() => {
      const counts = {}
      students.value.forEach(student => {
        counts[student.department] = (counts[student.department] || 0) + 1
      })
      return Object.entries(counts).map(([name, count]) => ({ name, count }))
    })

    const yearLevelStats = computed(() => {
      const counts = {}
      students.value.forEach(student => {
        counts[student.yearLevel] = (counts[student.yearLevel] || 0) + 1
      })
      return Object.entries(counts).map(([level, count]) => ({ level, count }))
    })

    const recentStudents = computed(() => {
      return [...students.value].reverse().slice(0, 4)
    })

    const getDepartmentClass = (department) => {
      const dept = department.toLowerCase()
      if (dept.includes('computer')) return 'badge-cs'
      if (dept.includes('electrical')) return 'badge-ee'
      if (dept.includes('mechanical')) return 'badge-me'
      if (dept.includes('civil')) return 'badge-ce'
      return 'badge-default'
    }

    // Test function to manually update trend
    const updateTrendManually = (operation = 'add') => {
      const currentCount = totalStudents.value
      let newCount = currentCount
      
      if (operation === 'add') {
        newCount = currentCount + Math.floor(Math.random() * 3) + 1
      } else if (operation === 'remove') {
        newCount = Math.max(0, currentCount - (Math.floor(Math.random() * 2) + 1))
      }
      
      // Update localStorage with new count
      saveCurrentData(newCount)
      
      // Update previous data reference
      previousData.value = getPreviousData()
      
      alert(`Trend updated! Previous: ${previousData.value.count}, Current: ${newCount}`)
    }

    const handleEdit = (student) => {
      console.log('Edit student:', student)
      window.location.href = '/students'
    }

    const handleDelete = async (id) => {
      if (confirm('Are you sure you want to delete this student?')) {
        try {
          if (loadingFunctions) {
            loadingFunctions.show('Deleting student...', 1200)
          }
          
          const response = await studentAPI.deleteStudentWithExternalAPI(id)
          console.log('Delete response:', response)
          
          // Fetch fresh data to update count
          await fetchStudents()
          
          alert('Student deleted successfully!')
        } catch (err) {
          error.value = 'Failed to delete student.'
          console.error('Error deleting student:', err)
          
          if (loadingFunctions) {
            loadingFunctions.hide()
          }
        } finally {
          setTimeout(() => {
            if (loadingFunctions) {
              loadingFunctions.hide()
            }
          }, 500)
        }
      }
    }

    onMounted(() => {
      fetchStudents()
    })

    return {
      students,
      loading,
      initialLoadComplete,
      error,
      totalStudents,
      departments,
      femaleCount,
      maleCount,
      departmentStats,
      yearLevelStats,
      recentStudents,
      selectedChartPeriod,
      trendPercentage,
      trendDirection,
      getDepartmentClass,
      handleEdit,
      handleDelete,
      updateTrendManually,
      previousData,
      refreshStudents: fetchStudents
    }
  }
}
</script>

<style scoped>
.home-page {
  padding: 32px 0 64px;
}

.page-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-content h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.header-stats {
  display: flex;
  gap: 12px;
}

.stat-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: #FFD700;
}

/* Recent Students Card */
.recent-students-card {
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-radius: 16px;
  padding: 20px;
}

.recent-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #f0f0f0;
  margin: 0;
}

.recent-svg-icon {
  width: 18px;
  height: 18px;
  color: #FFD700;
  stroke-width: 1.5;
}

/* Button styles */
.btn-outline {
  padding: 8px 16px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #FFD700;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.4);
}

.btn-svg-icon {
  width: 14px;
  height: 14px;
  stroke-width: 2;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .stat-number {
    font-size: 28px;
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
  }
  
  .stat-svg-icon {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-number {
    font-size: 32px;
  }
}

/* Loading skeleton adjustments */
.skeleton-stat-card {
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-radius: 16px;
  padding: 20px;
  height: 130px;
}

/* Update existing styles */
.page-header h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
}

.stat-chip svg {
  width: 16px;
  height: 16px;
}

/* Stats Loading State */
.stats-loading {
  margin-bottom: 32px;
}

.skeleton-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.skeleton-stat-card {
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-radius: 16px;
  padding: 24px;
  height: 140px;
  position: relative;
  overflow: hidden;
}

.skeleton-stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    rgba(255, 215, 0, 0.1) 25%, 
    rgba(255, 215, 0, 0.2) 50%, 
    rgba(255, 215, 0, 0.1) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.stat-card:hover {
  border-color: rgba(255, 215, 0, 0.3);
  transform: translateY(-4px);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #FFD700 0%, #D4AF37 100%);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFD700;
  flex-shrink: 0;
}

.stat-svg-icon {
  width: 22px;
  height: 22px;
  stroke-width: 1.5;
}

.stat-content {
  margin-top: auto;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  margin: 8px 0;
  color: #f0f0f0;
  line-height: 1.2;
}

.stat-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
  margin: 0;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.trend-svg-icon {
  width: 14px;
  height: 14px;
  stroke-width: 2.5;
}

.trend-text {
  font-size: 11px;
  font-weight: 600;
}

.trend-up {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.trend-down {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.trend-neutral {
  background: rgba(107, 114, 128, 0.1);
  border-color: rgba(107, 114, 128, 0.2);
  color: #6b7280;
}

/* Charts Grid Styles */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.chart-card {
  background: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-radius: 16px;
  padding: 20px;
}

.chart-card .card-header {
  margin-bottom: 20px;
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #f0f0f0;
  margin: 0;
}

.chart-svg-icon {
  width: 18px;
  height: 18px;
  color: #FFD700;
  stroke-width: 1.5;
}

.period-select {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 6px;
  color: #f0f0f0;
  font-size: 12px;
  min-width: 120px;
}

/* Chart bars */
.chart-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.bar-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.bar-label {
  font-size: 13px;
  font-weight: 500;
  color: #f0f0f0;
}

.bar-percentage {
  font-size: 12px;
  color: #FFD700;
  font-weight: 600;
}

.bar-container {
  height: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFD700 0%, #D4AF37 100%);
  border-radius: 4px;
  position: relative;
  transition: width 1s ease;
}

.bar-count {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: #1a1a1a;
  font-weight: 600;
}

/* Year chart */
.year-chart {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.year-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.year-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.year-label {
  font-size: 13px;
  color: #f0f0f0;
}

.year-count {
  font-size: 13px;
  color: #FFD700;
  font-weight: 600;
}

.year-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
  overflow: hidden;
}

.year-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFD700 0%, #D4AF37 100%);
  border-radius: 3px;
  position: relative;
  transition: width 1s ease;
}

.year-progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.2) 50%, 
    transparent 100%);
  animation: shimmer 2s infinite;
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.student-card-mini {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.student-card-mini:hover {
  background: rgba(255, 215, 0, 0.05);
  border-color: rgba(255, 215, 0, 0.3);
}

.student-avatar .avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  color: #1a1a1a;
}

.avatar.male {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.avatar.female {
  background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
}

.student-info {
  flex: 1;
}

.student-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #f0f0f0;
}

.student-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-cs { background: linear-gradient(135deg, #4a6cf7 0%, #3a5ce5 100%); }
.badge-ee { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
.badge-me { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
.badge-ce { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
.badge-default { background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); }

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.student-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
  color: #FFD700;
}

.action-btn.danger:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.loading-container {
  padding: 60px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-note {
  font-size: 12px;
  color: rgba(255, 215, 0, 0.6);
  margin-top: 8px;
}

.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px;
  text-align: center;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.error-message svg {
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
}

.btn-outline {
  padding: 10px 20px;
  font-size: 13px;
}

.btn-outline svg {
  width: 16px;
  height: 16px;
}

.trend-neutral {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
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