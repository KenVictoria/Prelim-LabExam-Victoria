<template>
  <form @submit.prevent="handleSubmit" class="student-form">
    <div class="form-header">
      <h3>{{ isEditing ? 'Edit Student' : 'Add New Student' }}</h3>
      <div v-if="loading" class="form-loading">
        <div class="loading-dot"></div>
        <span>Saving changes...</span>
      </div>
    </div>
    
    <div class="form-grid">
      <div class="form-group">
        <label for="name">Full Name</label>
        <input
          type="text"
          id="name"
          v-model="formData.name"
          class="form-control"
          required
          placeholder="Enter student name"
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label for="section">Section</label>
        <select id="section" v-model="formData.section" class="form-control" required :disabled="loading">
          <option value="">Select Section</option>
          <option value="A">Section A</option>
          <option value="B">Section B</option>
          <option value="C">Section C</option>
          <option value="D">Section D</option>
        </select>
      </div>

      <div class="form-group">
        <label for="department">Department</label>
        <select id="department" v-model="formData.department" class="form-control" required :disabled="loading">
          <option value="">Select Department</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Electrical Engineering">Electrical Engineering</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
          <option value="Civil Engineering">Civil Engineering</option>
          <option value="Chemical Engineering">Chemical Engineering</option>
        </select>
      </div>

      <div class="form-group">
        <label for="yearLevel">Year Level</label>
        <select id="yearLevel" v-model="formData.yearLevel" class="form-control" required :disabled="loading">
          <option value="">Select Year Level</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
          <option value="5">5th Year</option>
        </select>
      </div>

      <div class="form-group">
        <label>Gender</label>
        <div class="radio-group">
          <label>
            <input
              type="radio"
              v-model="formData.gender"
              value="Male"
              required
              :disabled="loading"
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              v-model="formData.gender"
              value="Female"
              required
              :disabled="loading"
            />
            Female
          </label>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary" :disabled="loading">
        <span v-if="loading" class="button-loading">
          <div class="button-spinner"></div>
        </span>
        {{ loading ? 'Saving...' : (isEditing ? 'Update Student' : 'Add Student') }}
      </button>
      <button type="button" class="btn btn-outline" @click="$emit('cancel')" :disabled="loading">
        Cancel
      </button>
    </div>
    
    <div v-if="loading" class="api-progress">
      <div class="progress-label">
        Making API call to server...
        <span class="progress-detail">(Simulating 1-2 second delay)</span>
      </div>
      <LoadingSpinner type="progress" :progress="simulatedProgress" size="small" />
    </div>
  </form>
</template>

<script>
import { ref, watch, onMounted, computed } from 'vue' // Add computed import
import LoadingSpinner from './LoadingSpinner.vue'

export default {
  name: 'StudentForm',
  components: {
    LoadingSpinner
  },
  props: {
    student: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const formData = ref({
      name: '',
      section: '',
      department: '',
      yearLevel: '',
      gender: ''
    })
    
    const simulatedProgress = ref(0)
    let progressInterval

    const isEditing = computed(() => {
      return props.student !== null && props.student.id !== undefined
    })

    watch(() => props.student, {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          formData.value = { 
            name: newVal.name || '',
            section: newVal.section || '',
            department: newVal.department || '',
            yearLevel: newVal.yearLevel?.toString() || '',
            gender: newVal.gender || ''
          }
        } else {
          resetForm()
        }
      }
    })

    watch(() => props.loading, {
      handler(newVal) {
        if (newVal) {
          startProgressSimulation()
        } else {
          stopProgressSimulation()
        }
      }
    })

    const resetForm = () => {
      formData.value = {
        name: '',
        section: '',
        department: '',
        yearLevel: '',
        gender: ''
      }
    }

    const startProgressSimulation = () => {
      simulatedProgress.value = 0
      clearInterval(progressInterval)
      progressInterval = setInterval(() => {
        if (simulatedProgress.value < 90) {
          simulatedProgress.value += 10
        }
      }, 200)
    }

    const stopProgressSimulation = () => {
      clearInterval(progressInterval)
      simulatedProgress.value = 100
      setTimeout(() => {
        simulatedProgress.value = 0
      }, 500)
    }

    const handleSubmit = () => {
      // Validate all fields are filled
      if (!formData.value.name || !formData.value.section || !formData.value.department || 
          !formData.value.yearLevel || !formData.value.gender) {
        alert('Please fill in all fields')
        return
      }
      
      // Prepare data for submission
      const studentData = {
        ...formData.value,
        yearLevel: parseInt(formData.value.yearLevel)
      }
      
      emit('submit', studentData)
    }

    onMounted(() => {
      if (props.loading) {
        startProgressSimulation()
      }
    })

    // Clean up interval on unmount
    onMounted(() => {
      return () => {
        clearInterval(progressInterval)
      }
    })

    return {
      formData,
      isEditing,
      simulatedProgress,
      handleSubmit,
      resetForm
    }
  },
  emits: ['submit', 'cancel']
}
</script>

<style scoped>
.student-form {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(255, 215, 0, 0.1);
}

.form-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.form-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  font-size: 13px;
  color: #1a1a1a;
  font-weight: 500;
}

.loading-dot {
  width: 8px;
  height: 8px;
  background: #FFD700;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  color: #1a1a1a;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #FFD700;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  background: white;
}

.form-control:disabled {
  background: #e9ecef;
  cursor: not-allowed;
  opacity: 0.7;
}

.radio-group {
  display: flex;
  gap: 24px;
  margin-top: 8px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #495057;
}

.radio-group input[type="radio"] {
  width: 18px;
  height: 18px;
  accent-color: #FFD700;
}

.radio-group input[type="radio"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 600;
}

.btn-primary {
  background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
  color: #1a1a1a;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #FFE55C 0%, #E6C158 100%);
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(26, 26, 26, 0.2);
  border-top: 2px solid #1a1a1a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.api-progress {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid rgba(255, 215, 0, 0.1);
}

.progress-label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 12px;
  text-align: center;
}

.progress-detail {
  font-size: 11px;
  color: #9ca3af;
  display: block;
  margin-top: 4px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>