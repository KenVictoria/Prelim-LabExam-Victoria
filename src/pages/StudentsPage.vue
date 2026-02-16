<template>
  <div class="students-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div>
            <h2>Student Management</h2>
            <p class="subtitle">Manage student records with advanced controls</p>
          </div>
          <div class="header-actions">
            <button @click="exportData" class="btn btn-outline">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
            <button @click="showAddForm = true" class="btn btn-success" v-if="!showAddForm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Student
            </button>
          </div>
        </div>
      </div>

      <div class="management-section">
        <!-- Search and Filters -->
        <div class="card">
          <div class="filters-grid">
            <div class="search-box">
              <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search students by name, department, or ID..."
                class="search-input"
                :disabled="loading"
              />
              <div class="search-stats" v-if="!loading">
                {{ filteredStudents.length }} results
              </div>
              <div class="search-loading" v-else>
                <div class="loading-dot"></div>
                <span>Loading...</span>
              </div>
            </div>
            
            <div class="filter-group">
              <div class="filter-item">
                <label>Department</label>
                <select v-model="selectedDepartment" class="form-control filter-select" :disabled="loading">
                  <option value="">All Departments</option>
                  <option 
                    v-for="dept in departments" 
                    :key="dept"
                    :value="dept"
                  >
                    {{ dept }}
                  </option>
                </select>
              </div>
              
              <div class="filter-item">
                <label>Year Level</label>
                <select v-model="selectedYear" class="form-control filter-select" :disabled="loading">
                  <option value="">All Years</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year</option>
                </select>
              </div>
              
              <div class="filter-item">
                <label>Gender</label>
                <select v-model="selectedGender" class="form-control filter-select" :disabled="loading">
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>
        </div>

       <!-- Student Form -->
        <div v-if="showAddForm || editingStudent" class="card form-card">
        <StudentForm
            :student="editingStudent || {}"
            :loading="formLoading"
            @submit="handleFormSubmit"
            @cancel="closeForm"
        />
        </div>

        <!-- Students Table -->
        <div class="card">
          <div class="table-header">
            <h3>Student Records</h3>
            <div class="table-actions">
              <button @click="refreshData" class="action-btn" :disabled="loading">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {{ loading ? 'Refreshing...' : 'Refresh' }}
              </button>
              <div class="view-toggle">
                <button class="view-btn active" :disabled="loading">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button class="view-btn" :disabled="loading">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div v-if="loading" class="loading-container">
            <LoadingSpinner type="dots" message="Loading student records..." />
            <div class="loading-details">
              <div class="loading-info">
                <div class="loading-progress">
                  <div class="progress-label">Fetching data from API...</div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: loadingProgress + '%' }"></div>
                  </div>
                  <div class="progress-text">{{ loadingProgress }}%</div>
                </div>
                <div class="loading-note">Simulating API delay (1-2 seconds)</div>
              </div>
            </div>
          </div>

          <div v-else-if="error" class="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ error }}
            <button @click="fetchStudents" class="btn btn-outline retry-btn">
              Retry
            </button>
          </div>

          <div v-else>
            <!-- Desktop Table View -->
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>
                      <div class="table-cell">
                        <span>ID</span>
                        <button @click="sortBy('id')" class="sort-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th>
                      <div class="table-cell">
                        <span>Student</span>
                        <button @click="sortBy('name')" class="sort-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th>Section</th>
                    <th>Department</th>
                    <th>Year Level</th>
                    <th>Gender</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="student in paginatedStudents" :key="student.id" class="table-row">
                    <td>
                      <div class="student-id">#{{ student.id }}</div>
                    </td>
                    <td>
                      <div class="student-info-cell">
                        <div :class="['student-avatar-mini', student.gender.toLowerCase()]">
                          {{ student.name.charAt(0).toUpperCase() }}
                        </div>
                        <div>
                          <div class="student-name">{{ student.name }}</div>
                          <div class="student-email">{{ student.name.toLowerCase().replace(/\s+/g, '.') }}@university.edu</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="section-badge">{{ student.section }}</span>
                    </td>
                    <td>
                      <span class="department-tag" :class="getDepartmentClass(student.department)">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {{ student.department }}
                      </span>
                    </td>
                    <td>
                      <div class="year-level">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Year {{ student.yearLevel }}
                      </div>
                    </td>
                    <td>
                      <div :class="['gender-badge', student.gender.toLowerCase()]">
                        <svg v-if="student.gender === 'Male'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 3.75v-3.375c0-.621-.503-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.375m0 0h.75m0 0h3.375c.621 0 1.125-.504 1.125-1.125v-3.375c0-.621-.504-1.125-1.125-1.125h-3.375c-.621 0-1.125.504-1.125 1.125v3.375c0 .621.504 1.125 1.125 1.125h.75" />
                        </svg>
                        {{ student.gender }}
                      </div>
                    </td>
                    <td class="text-right">
                      <div class="action-buttons">
                        <button @click="editStudent(student)" class="action-btn edit">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button @click="deleteStudent(student.id)" class="action-btn delete">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <button @click="showStudentDetails(student)" class="action-btn more">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Empty State -->
            <div v-if="filteredStudents.length === 0" class="empty-state">
              <div class="empty-state-content">
                <svg xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h4>No students found</h4>
                <p>Try adjusting your search or filters</p>
                <button @click="resetFilters" class="btn btn-outline">
                  Reset Filters
                </button>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="filteredStudents.length > 0" class="pagination-section">
              <div class="pagination-info">
                Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredStudents.length) }} of {{ filteredStudents.length }} entries
              </div>
              <div class="pagination-controls">
                <button 
                  @click="prevPage" 
                  :disabled="currentPage === 1"
                  class="pagination-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <div class="page-numbers">
                  <button 
                    v-for="page in pageNumbers" 
                    :key="page"
                    @click="currentPage = page"
                    :class="['page-number', { active: currentPage === page }]"
                  >
                    {{ page }}
                  </button>
                  <span v-if="hasMorePages" class="page-dots">...</span>
                </div>
                <button 
                  @click="nextPage" 
                  :disabled="currentPage === totalPages"
                  class="pagination-btn"
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
              <!-- Student Details Modal -->
      <div v-if="showStudentModal" class="modal-overlay" @click.self="closeStudentModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Student Details</h3>
            <button @click="closeStudentModal" class="modal-close">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="modal-body" v-if="selectedStudent">
            <div class="student-details-grid">
              <!-- Student Avatar -->
              <div class="detail-section avatar-section">
                <div :class="['detail-avatar', selectedStudent.gender.toLowerCase()]">
                  {{ selectedStudent.name.charAt(0).toUpperCase() }}
                </div>
                <div class="avatar-info">
                  <h4>{{ selectedStudent.name }}</h4>
                  <div class="student-id">#{{ selectedStudent.id }}</div>
                </div>
              </div>
              
              <!-- Contact Info -->
              <div class="detail-section">
                <div class="detail-label">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Information
                </div>
                <div class="detail-content">
                  <div class="detail-item">
                    <span class="detail-item-label">Email:</span>
                    <span class="detail-item-value">{{ selectedStudent.name.toLowerCase().replace(/\s+/g, '.') }}@university.edu</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-item-label">Phone:</span>
                    <span class="detail-item-value">+1 (555) {{ Math.floor(Math.random() * 900) + 100 }}-{{ Math.floor(Math.random() * 9000) + 1000 }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Academic Info -->
              <div class="detail-section">
                <div class="detail-label">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Academic Information
                </div>
                <div class="detail-content">
                  <div class="detail-item">
                    <span class="detail-item-label">Department:</span>
                    <span class="detail-item-value badge" :class="getDepartmentClass(selectedStudent.department)">
                      {{ selectedStudent.department }}
                    </span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-item-label">Year Level:</span>
                    <span class="detail-item-value">Year {{ selectedStudent.yearLevel }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-item-label">Section:</span>
                    <span class="detail-item-value">{{ selectedStudent.section }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-item-label">GPA:</span>
                    <span class="detail-item-value">{{ (Math.random() * 1.5 + 2.5).toFixed(2) }}/4.0</span>
                  </div>
                </div>
              </div>
              
              <!-- Personal Info -->
              <div class="detail-section">
                <div class="detail-label">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </div>
                <div class="detail-content">
                  <div class="detail-item">
                    <span class="detail-item-label">Gender:</span>
                    <span class="detail-item-value">{{ selectedStudent.gender }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-item-label">Age:</span>
                    <span class="detail-item-value">{{ Math.floor(Math.random() * 10) + 18 }} years</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-item-label">Enrollment Date:</span>
                    <span class="detail-item-value">{{ new Date(2023 - selectedStudent.yearLevel + 1, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-item-label">Status:</span>
                    <span class="detail-item-value status-active">Active</span>
                  </div>
                </div>
              </div>
              
              <!-- Additional Info -->
              <div class="detail-section">
                <div class="detail-label">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Additional Information
                </div>
                <div class="detail-content">
                  <div class="detail-item">
                    <span class="detail-item-label">Courses Enrolled:</span>
                    <span class="detail-item-value">{{ Math.floor(Math.random() * 6) + 4 }} courses</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-item-label">Attendance Rate:</span>
                    <span class="detail-item-value">{{ Math.floor(Math.random() * 20) + 80 }}%</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-item-label">Last Activity:</span>
                    <span class="detail-item-value">{{ ['Yesterday', 'Today', '2 days ago', 'This week'][Math.floor(Math.random() * 4)] }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button @click="editStudent(selectedStudent)" class="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Student
            </button>
            <button @click="deleteStudent(selectedStudent.id)" class="btn btn-outline danger">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
            <button @click="closeStudentModal" class="btn btn-outline">
              Close
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
import StudentForm from '../components/StudentForm.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { studentAPI } from '../services/api'

export default {
  name: 'StudentsPage',
  components: {
    StudentForm,
    LoadingSpinner
  },
  setup() {
    const students = ref([])
    const loading = ref(true)
    const loadingProgress = ref(0)
    const error = ref(null)
    const showAddForm = ref(false)
    const editingStudent = ref(null)
    const formLoading = ref(false)
    const searchQuery = ref('')
    const selectedDepartment = ref('')
    const selectedYear = ref('')
    const selectedGender = ref('')
    const sortField = ref('id')
    const sortDirection = ref('asc')
    const currentPage = ref(1)
    const itemsPerPage = 10
    let progressInterval

    // Inject loading functions
    const loadingFunctions = inject('loading')

    const startProgress = () => {
  loadingProgress.value = 0
  clearInterval(progressInterval) // Clear any existing interval
  
  progressInterval = setInterval(() => {
    if (loadingProgress.value < 90) {
      loadingProgress.value += 10
    } else {
      clearInterval(progressInterval) // Stop at 90%
    }
  }, 200)
}

    const stopProgress = () => {
  clearInterval(progressInterval)
  loadingProgress.value = 100
  
  // Don't reset to 0 immediately, let it stay at 100% briefly
  setTimeout(() => {
    // Only reset if we're not loading anymore
    if (!loading.value) {
      loadingProgress.value = 0
    }
  }, 500) // Increased delay to 500ms
}

    const fetchStudents = async () => {
  try {
    loading.value = true
    error.value = null
    startProgress()
    
    // Show global loading on initial load
    if (loadingFunctions) {
      // Always show loading, not just on initial load
      loadingFunctions.show('Loading student records...', 1800)
    }
    
    const response = await studentAPI.getStudents()
    students.value = response.data
    currentPage.value = 1
  } catch (err) {
    error.value = 'Failed to load students. Please try again later.'
    console.error('Error fetching students:', err)
    
    // Ensure loading hides on error
    if (loadingFunctions) {
      loadingFunctions.hide()
    }
  } finally {
    loading.value = false
    stopProgress()
    
    // Hide global loading with a small delay
    setTimeout(() => {
      if (loadingFunctions) {
        loadingFunctions.hide()
      }
    }, 300)
  }
}

    const departments = computed(() => {
      const depts = new Set(students.value.map(s => s.department))
      return Array.from(depts)
    })

    const filteredStudents = computed(() => {
      let filtered = students.value.filter(student => {
        const matchesSearch = 
          student.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          student.department.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          student.id.toString().includes(searchQuery.value)
        
        const matchesDepartment = !selectedDepartment.value || 
          student.department === selectedDepartment.value
        
        const matchesYear = !selectedYear.value || 
          student.yearLevel.toString() === selectedYear.value
        
        const matchesGender = !selectedGender.value || 
          student.gender === selectedGender.value
        
        return matchesSearch && matchesDepartment && matchesYear && matchesGender
      })

      // Apply sorting
      filtered.sort((a, b) => {
        let aVal = a[sortField.value]
        let bVal = b[sortField.value]
        
        if (sortField.value === 'id' || sortField.value === 'yearLevel') {
          aVal = parseInt(aVal)
          bVal = parseInt(bVal)
        } else {
          aVal = aVal.toLowerCase()
          bVal = bVal.toLowerCase()
        }
        
        if (sortDirection.value === 'asc') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })

      return filtered
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredStudents.value.length / itemsPerPage)
    })

    const paginatedStudents = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredStudents.value.slice(start, end)
    })

    const pageNumbers = computed(() => {
      const pages = []
      const maxVisible = 5
      
      if (totalPages.value <= maxVisible) {
        for (let i = 1; i <= totalPages.value; i++) {
          pages.push(i)
        }
      } else {
        let start = Math.max(1, currentPage.value - 2)
        let end = Math.min(totalPages.value, start + maxVisible - 1)
        
        if (end - start < maxVisible - 1) {
          start = Math.max(1, end - maxVisible + 1)
        }
        
        for (let i = start; i <= end; i++) {
          pages.push(i)
        }
      }
      
      return pages
    })

    const hasMorePages = computed(() => {
      return totalPages.value > 5 && currentPage.value < totalPages.value - 2
    })

    const getDepartmentClass = (department) => {
      const dept = department.toLowerCase()
      if (dept.includes('computer')) return 'cs'
      if (dept.includes('electrical')) return 'ee'
      if (dept.includes('mechanical')) return 'me'
      if (dept.includes('civil')) return 'ce'
      return 'default'
    }

    const addStudent = async (studentData) => {
      try {
        formLoading.value = true
        
        // Show global loading for add operation
        if (loadingFunctions) {
          loadingFunctions.show('Adding new student...', 2000)
        }
        
        const response = await studentAPI.addStudentWithExternalAPI(studentData)
        console.log('Add response:', response)
        
        await fetchStudents()
        closeForm()
        alert('Student added successfully! Check console for API response.')
      } catch (err) {
        error.value = 'Failed to add student. Please try again.'
        console.error('Error adding student:', err)
      } finally {
        formLoading.value = false
        if (loadingFunctions) {
          loadingFunctions.hide()
        }
      }
    }

    const updateStudent = async (id, studentData) => {
      try {
        formLoading.value = true
        
        // Show global loading for update operation
        if (loadingFunctions) {
          loadingFunctions.show('Updating student...', 1800)
        }
        
        const response = await studentAPI.updateStudentWithExternalAPI(id, studentData)
        console.log('Update response:', response)
        
        await fetchStudents()
        closeForm()
        alert('Student updated successfully! Check console for API response.')
      } catch (err) {
        error.value = 'Failed to update student. Please try again.'
        console.error('Error updating student:', err)
      } finally {
        formLoading.value = false
        if (loadingFunctions) {
          loadingFunctions.hide()
        }
      }
    }

    const deleteStudent = async (id) => {
      if (confirm('Are you sure you want to delete this student?')) {
        try {
          // Show global loading for delete operation
          if (loadingFunctions) {
            loadingFunctions.show('Deleting student...', 1200)
          }
          
          const response = await studentAPI.deleteStudentWithExternalAPI(id)
          console.log('Delete response:', response)
          
          await fetchStudents()
          alert('Student deleted successfully! Check console for API response.')
        } catch (err) {
          error.value = 'Failed to delete student. Please try again.'
          console.error('Error deleting student:', err)
        } finally {
          if (loadingFunctions) {
            loadingFunctions.hide()
          }
        }
      }
    }

    const editStudent = (student) => {
  console.log('Editing student:', student)
  editingStudent.value = { ...student }
  showAddForm.value = true
  closeStudentModal() // Close the details modal
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const closeForm = () => {
  console.log('Closing form') // Debug log
  showAddForm.value = false
  editingStudent.value = null
}

const handleFormSubmit = async (studentData) => {
  console.log('Form submitted:', studentData) // Debug log
  if (editingStudent.value) {
    await updateStudent(editingStudent.value.id, studentData)
  } else {
    await addStudent(studentData)
  }
}

    const sortBy = (field) => {
      if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortField.value = field
        sortDirection.value = 'asc'
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    const resetFilters = () => {
      searchQuery.value = ''
      selectedDepartment.value = ''
      selectedYear.value = ''
      selectedGender.value = ''
      currentPage.value = 1
    }

    const refreshData = async () => {
  loading.value = true
  error.value = null
  startProgress()
  
  // Show global loading for refresh
  if (loadingFunctions) {
    loadingFunctions.show('Refreshing data...', 1500)
  }
  
  try {
    await fetchStudents()
  } finally {
    // Add safety timeout
    setTimeout(() => {
      if (loadingFunctions) {
        loadingFunctions.hide()
      }
    }, 500)
  }
}

    // Add these reactive properties
const showStudentModal = ref(false)
const selectedStudent = ref(null)

// Add these functions
const showStudentDetails = (student) => {
  console.log('Showing student details:', student)
  selectedStudent.value = student
  showStudentModal.value = true
  // Prevent body scrolling when modal is open
  document.body.style.overflow = 'hidden'
}

const closeStudentModal = () => {
  showStudentModal.value = false
  selectedStudent.value = null
  // Restore body scrolling
  document.body.style.overflow = ''
}

// Add keyboard event listener to close modal with ESC key
onMounted(() => {
  const handleEscKey = (event) => {
    if (event.key === 'Escape' && showStudentModal.value) {
      closeStudentModal()
    }
  }
  window.addEventListener('keydown', handleEscKey)
  
  // Clean up event listener
  return () => {
    window.removeEventListener('keydown', handleEscKey)
    document.body.style.overflow = '' // Ensure scrolling is restored
  }
})

    const exportData = () => {
      const dataStr = JSON.stringify(students.value, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'students-data.json'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    onMounted(fetchStudents)

   return {
  students,
  loading,
  loadingProgress,
  error,
  showAddForm,
  editingStudent,
  formLoading,
  searchQuery,
  selectedDepartment,
  selectedYear,
  selectedGender,
  sortField,
  sortDirection,
  currentPage,
  departments,
  filteredStudents,
  paginatedStudents,
  totalPages,
  pageNumbers,
  hasMorePages,
  getDepartmentClass,
  editStudent,
  deleteStudent,
  handleFormSubmit,
  closeForm,
  sortBy,
  nextPage,
  prevPage,
  resetFilters,
  refreshData,
  exportData,
  showStudentModal,
  selectedStudent,
  showStudentDetails,
  closeStudentModal
    }
  }
}
</script>

<style scoped>
.students-page {
  padding: 32px 0 64px;
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

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-outline, .btn-success {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-outline svg, .btn-success svg {
  width: 16px;
  height: 16px;
}

.management-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.filters-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-icon {
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  color: rgba(255, 215, 0, 0.6);
}

.search-input {
  flex: 1;
  padding: 16px 16px 16px 48px;
  font-size: 14px;
  border-radius: 12px;
}

.search-input:disabled {
  background: rgba(255, 255, 255, 0.05);
  cursor: not-allowed;
  opacity: 0.7;
}

.search-stats {
  padding: 8px 16px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #FFD700;
  white-space: nowrap;
}

.search-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(245, 158, 11, 0.1);
  border-radius: 20px;
  font-size: 12px;
  color: #f59e0b;
}

.search-loading .loading-dot {
  width: 8px;
  height: 8px;
  background: #f59e0b;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

.filter-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-item label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 215, 0, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-select {
  padding: 12px 16px;
  font-size: 14px;
}

.filter-select:disabled {
  background: rgba(255, 255, 255, 0.05);
  cursor: not-allowed;
  opacity: 0.7;
}

.form-card {
  border: 2px solid rgba(255, 215, 0, 0.2);
  background: rgba(255, 215, 0, 0.03);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.table-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #f0f0f0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover:not(:disabled) {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
  color: #FFD700;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.view-toggle {
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 4px;
}

.view-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.view-btn.active {
  background: rgba(255, 215, 0, 0.1);
  color: #FFD700;
}

.view-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.table-responsive {
  overflow-x: auto;
  border-radius: 12px;
}

.table-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-btn:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
  color: #FFD700;
}

.table-row {
  transition: all 0.3s ease;
}

.table-row:hover {
  background: rgba(255, 215, 0, 0.05) !important;
}

.student-id {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 215, 0, 0.8);
  background: rgba(255, 215, 0, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-block;
}

.student-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.student-avatar-mini {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: #1a1a1a;
  flex-shrink: 0;
}

.student-avatar-mini.male {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.student-avatar-mini.female {
  background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
}

.student-name {
  font-size: 14px;
  font-weight: 600;
  color: #f0f0f0;
  margin-bottom: 2px;
}

.student-email {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.section-badge {
  padding: 6px 12px;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #FFD700;
}

.department-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.department-tag.cs {
  background: linear-gradient(135deg, #4a6cf7 0%, #3a5ce5 100%);
}

.department-tag.ee {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.department-tag.me {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.department-tag.ce {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.department-tag.default {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
}

.year-level {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
}

.year-level svg {
  color: #FFD700;
}

.gender-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.gender-badge.male {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.gender-badge.female {
  background: rgba(236, 72, 153, 0.1);
  color: #ec4899;
  border: 1px solid rgba(236, 72, 153, 0.2);
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.action-buttons .action-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  justify-content: center;
  border-radius: 8px;
}

.action-buttons .edit:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}

.action-buttons .delete:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.action-buttons .more:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #f0f0f0;
}

.text-right {
  text-align: right;
}

.loading-container {
  padding: 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.loading-details {
  width: 100%;
  max-width: 400px;
}

.loading-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loading-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
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
  font-size: 11px;
  color: rgba(255, 215, 0, 0.8);
  text-align: right;
}

.loading-note {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  margin-top: 4px;
}

.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
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

.retry-btn {
  margin-top: 12px;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.empty-state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: rgba(255, 215, 0, 0.3);
  margin-bottom: 16px;
}

.empty-state h4 {
  font-size: 18px;
  font-weight: 600;
  color: #f0f0f0;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin-bottom: 8px;
}

.pagination-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.pagination-info {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
  color: #FFD700;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 8px;
  align-items: center;
}

.page-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-number:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
  color: #FFD700;
}

.page-number.active {
  background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
  border-color: transparent;
  color: #1a1a1a;
  font-weight: 600;
}

.form-card {
  animation: slideDown 0.3s ease;
  max-height: 800px;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

/* Student Details Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(4px);
  }
}

.modal-content {
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.98) 100%);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  background: rgba(0, 0, 0, 0.3);
}

.modal-header h3 {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.modal-close {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
  transform: rotate(90deg);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  background: rgba(0, 0, 0, 0.2);
}

.student-details-grid {
  display: grid;
  gap: 24px;
}

.detail-section {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.detail-section:hover {
  border-color: rgba(255, 215, 0, 0.3);
  transform: translateY(-2px);
}

.detail-section.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%);
}

.detail-avatar {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  flex-shrink: 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.detail-avatar.male {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.detail-avatar.female {
  background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
}

.avatar-info h4 {
  font-size: 24px;
  font-weight: 700;
  color: #f0f0f0;
  margin-bottom: 8px;
}

.avatar-info .student-id {
  font-size: 14px;
  color: rgba(255, 215, 0, 0.8);
  background: rgba(255, 215, 0, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  display: inline-block;
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #FFD700;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
}

.detail-label svg {
  width: 20px;
  height: 20px;
}

.detail-content {
  display: grid;
  gap: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.detail-item-value {
  font-size: 14px;
  font-weight: 600;
  color: #f0f0f0;
  text-align: right;
}

.detail-item-value.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-active {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 24px 32px;
  border-top: 1px solid rgba(255, 215, 0, 0.1);
  background: rgba(0, 0, 0, 0.3);
}

.modal-footer .btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
}

.modal-footer .btn.danger {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

.modal-footer .btn.danger:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
}

/* Scrollbar styling for modal */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #FFE55C 0%, #E6C158 100%);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modal-content {
    max-width: 95%;
  }
  
  .modal-header {
    padding: 20px;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .modal-footer {
    flex-direction: column;
    padding: 20px;
  }
  
  .modal-footer .btn {
    width: 100%;
  }
  
  .detail-section.avatar-section {
    flex-direction: column;
    text-align: center;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .detail-item-value {
    text-align: left;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-dots {
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
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