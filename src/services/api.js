// Local storage-based API for persistent CRUD operations
class StudentAPI {
  constructor() {
    this.STORAGE_KEY = 'student_info_app_data_v3'
    this.initializeData()
    this.apiCalls = []
  }

  initializeData() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const initialData = [
        {
          id: 1,
          name: 'John Smith',
          section: 'A',
          department: 'Computer Science',
          yearLevel: 3,
          gender: 'Male'
        },
        {
          id: 2,
          name: 'Emma Johnson',
          section: 'B',
          department: 'Electrical Engineering',
          yearLevel: 2,
          gender: 'Female'
        },
        {
          id: 3,
          name: 'Michael Brown',
          section: 'C',
          department: 'Mechanical Engineering',
          yearLevel: 4,
          gender: 'Male'
        },
        {
          id: 4,
          name: 'Sophia Williams',
          section: 'A',
          department: 'Computer Science',
          yearLevel: 1,
          gender: 'Female'
        },
        {
          id: 5,
          name: 'Daniel Miller',
          section: 'B',
          department: 'Civil Engineering',
          yearLevel: 3,
          gender: 'Male'
        }
      ]
      this.saveData(initialData)
    }
  }

  getData() {
    const data = localStorage.getItem(this.STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }

  saveData(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
  }

  generateId() {
    const data = this.getData()
    if (data.length === 0) return 1
    return Math.max(...data.map(item => item.id)) + 1
  }

  logAPICall(method, url, status = 'pending') {
    const call = {
      id: Date.now(),
      method,
      url,
      status,
      timestamp: new Date().toISOString(),
      startTime: Date.now()
    }
    this.apiCalls.push(call)
    console.log(`📡 API ${method}: ${url} - ${status}`)
    
    // Keep only last 20 calls
    if (this.apiCalls.length > 20) {
      this.apiCalls.shift()
    }
    
    return call
  }

  updateAPICallStatus(id, status) {
    const call = this.apiCalls.find(c => c.id === id)
    if (call) {
      call.status = status
      call.completedAt = new Date().toISOString()
      call.duration = Date.now() - call.startTime
      console.log(`✅ API ${call.method}: ${call.url} - ${status} (${call.duration}ms)`)
    }
  }

  async simulateDelay(min = 800, max = 2000) {
    const delay = Math.random() * (max - min) + min
    console.log(`⏳ Simulating API delay: ${Math.round(delay)}ms`)
    
    // Update progress in console
    const steps = 5
    const stepDelay = delay / steps
    
    for (let i = 1; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDelay))
      console.log(`   Progress: ${(i / steps * 100).toFixed(0)}%`)
    }
  }

  async getStudents() {
    const call = this.logAPICall('GET', '/students')
    try {
      await this.simulateDelay(1000, 2000)
      const data = this.getData()
      this.updateAPICallStatus(call.id, 'success')
      return { 
        data,
        meta: {
          timestamp: new Date().toISOString(),
          count: data.length,
          simulatedDelay: '1000-2000ms'
        }
      }
    } catch (error) {
      this.updateAPICallStatus(call.id, 'error')
      throw error
    }
  }

  async addStudent(student) {
    const call = this.logAPICall('POST', '/students')
    try {
      console.log('📝 Adding student:', student)
      await this.simulateDelay(1200, 2500)
      
      const data = this.getData()
      const newStudent = {
        ...student,
        id: this.generateId()
      }
      data.push(newStudent)
      this.saveData(data)
      
      this.updateAPICallStatus(call.id, 'success')
      
      // Make external API call
      const externalCall = await this.makeExternalAPICall('POST', newStudent)
      
      return { 
        data: newStudent,
        externalCall,
        meta: {
          timestamp: new Date().toISOString(),
          method: 'POST',
          externalAPICalled: true
        }
      }
    } catch (error) {
      this.updateAPICallStatus(call.id, 'error')
      throw error
    }
  }

  // Add this method for compatibility with your components
  async addStudentWithExternalAPI(studentData) {
    return this.addStudent(studentData)
  }

  async updateStudent(id, studentData) {
    const call = this.logAPICall('PUT', `/students/${id}`)
    try {
      console.log('✏️ Updating student ID:', id, studentData)
      await this.simulateDelay(1000, 2200)
      
      const data = this.getData()
      const index = data.findIndex(s => s.id === id)
      if (index !== -1) {
        const updatedStudent = { ...data[index], ...studentData, id }
        data[index] = updatedStudent
        this.saveData(data)
        
        this.updateAPICallStatus(call.id, 'success')
        
        // Make external API call
        const externalCall = await this.makeExternalAPICall('PUT', updatedStudent)
        
        return { 
          data: updatedStudent,
          externalCall,
          meta: {
            timestamp: new Date().toISOString(),
            method: 'PUT',
            externalAPICalled: true
          }
        }
      }
      throw new Error('Student not found')
    } catch (error) {
      this.updateAPICallStatus(call.id, 'error')
      throw error
    }
  }

  // Add this method for compatibility with your components
  async updateStudentWithExternalAPI(id, studentData) {
    return this.updateStudent(id, studentData)
  }

  async deleteStudent(id) {
    const call = this.logAPICall('DELETE', `/students/${id}`)
    try {
      console.log('🗑️ Deleting student ID:', id)
      await this.simulateDelay(800, 1800)
      
      const data = this.getData()
      const index = data.findIndex(s => s.id === id)
      if (index !== -1) {
        const deletedStudent = data[index]
        data.splice(index, 1)
        this.saveData(data)
        
        this.updateAPICallStatus(call.id, 'success')
        
        // Make external API call
        const externalCall = await this.makeExternalAPICall('DELETE', { id })
        
        return { 
          data: { success: true, id, student: deletedStudent },
          externalCall,
          meta: {
            timestamp: new Date().toISOString(),
            method: 'DELETE',
            externalAPICalled: true
          }
        }
      }
      throw new Error('Student not found')
    } catch (error) {
      this.updateAPICallStatus(call.id, 'error')
      throw error
    }
  }

  // Add this method for compatibility with your components
  async deleteStudentWithExternalAPI(id) {
    return this.deleteStudent(id)
  }

  async makeExternalAPICall(method, data) {
    const externalCall = this.logAPICall(method, 'https://jsonplaceholder.typicode.com/posts', 'external-pending')
    try {
      console.log('🌐 Making external API call to JSONPlaceholder...')
      await this.simulateDelay(500, 1500)
      
      const url = 'https://jsonplaceholder.typicode.com/posts'
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Student ${method} Operation`,
          body: JSON.stringify(data),
          userId: 1
        })
      })
      
      const result = await response.json()
      console.log('✅ External API Response:', result)
      this.updateAPICallStatus(externalCall.id, 'external-success')
      
      return {
        success: true,
        data: result,
        message: 'External API call successful'
      }
    } catch (error) {
      console.log('⚠️ External API call failed (this is expected for demo):', error)
      this.updateAPICallStatus(externalCall.id, 'external-error')
      return { 
        success: false,
        demo: true, 
        message: 'This is a simulated external API call for demonstration',
        simulatedData: data,
        note: 'JSONPlaceholder responds with mock data even on errors'
      }
    }
  }

  getAPILogs() {
    return [...this.apiCalls].reverse()
  }

  clearAPILogs() {
    this.apiCalls = []
  }

  // Method to simulate network error
  async simulateNetworkError() {
    const call = this.logAPICall('GET', '/students/error', 'pending')
    await new Promise(resolve => setTimeout(resolve, 1000))
    this.updateAPICallStatus(call.id, 'error')
    throw new Error('Simulated network error - Failed to fetch data')
  }
}

// Create and export a singleton instance
const studentAPI = new StudentAPI()

export {
  studentAPI
}