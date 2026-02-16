<template>
  <div class="student-card">
    <div class="student-info">
      <h3>{{ student.name }}</h3>
      <div class="student-details">
        <span class="badge" :class="departmentClass">{{ student.department }}</span>
        <span class="detail">Section {{ student.section }}</span>
        <span class="detail">Year {{ student.yearLevel }}</span>
        <span class="detail" :class="genderClass">{{ student.gender }}</span>
      </div>
    </div>
    <div class="student-actions">
      <button @click="$emit('edit', student)" class="btn btn-primary">Edit</button>
      <button @click="$emit('delete', student.id)" class="btn btn-danger">Delete</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentComponent',
  props: {
    student: {
      type: Object,
      required: true
    }
  },
  computed: {
    departmentClass() {
      const dept = this.student.department.toLowerCase()
      if (dept.includes('computer')) return 'badge-cs'
      if (dept.includes('electrical')) return 'badge-ee'
      if (dept.includes('mechanical')) return 'badge-me'
      if (dept.includes('civil')) return 'badge-ce'
      return 'badge-default'
    },
    genderClass() {
      return this.student.gender === 'Female' ? 'female' : 'male'
    }
  },
  emits: ['edit', 'delete']
}
</script>

<style scoped>
.student-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.student-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.student-info h3 {
  margin-bottom: 10px;
  color: #333;
}

.student-details {
  display: flex;
  gap: 15px;
  align-items: center;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.badge-cs { background-color: #4a6cf7; }
.badge-ee { background-color: #10b981; }
.badge-me { background-color: #f59e0b; }
.badge-ce { background-color: #ef4444; }
.badge-default { background-color: #6b7280; }

.detail {
  font-size: 14px;
  color: #6b7280;
}

.detail.female { color: #ec4899; }
.detail.male { color: #3b82f6; }

.student-actions {
  display: flex;
  gap: 10px;
}
</style>