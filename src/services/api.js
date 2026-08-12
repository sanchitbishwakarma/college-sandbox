const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const api = {
  getStudents: async () => {
    const res = await fetch('/api/v1/students');
    return handleResponse(res);
  },
  
  getStudentById: async (id) => {
    const res = await fetch(`/api/v1/students/${id}`);
    return handleResponse(res);
  },
  
  createStudent: async (studentData) => {
    const res = await fetch('/api/v1/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    return handleResponse(res);
  },
  
  updateStudent: async (id, studentData) => {
    const res = await fetch(`/api/v1/students/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    return handleResponse(res);
  },
  
  deleteStudent: async (id) => {
    const res = await fetch(`/api/v1/students/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },
  
  getApiLogs: async () => {
    const res = await fetch('/api/v1/api-logs');
    return handleResponse(res);
  },
};
