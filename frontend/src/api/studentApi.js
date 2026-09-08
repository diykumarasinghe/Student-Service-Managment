import axiosInstance from './axiosInstance';

export const getAllStudentsApi = async () => {
  const response = await axiosInstance.get('/students');
  return response.data;
};

export const getStudentByIdApi = async (id) => {
  const response = await axiosInstance.get(`/students/${id}`);
  return response.data;
};

export const createStudentApi = async (studentData) => {
  const response = await axiosInstance.post('/students', studentData);
  return response.data;
};

export const updateStudentApi = async (id, studentData) => {
  const response = await axiosInstance.put(`/students/${id}`, studentData);
  return response.data;
};

export const deleteStudentApi = async (id) => {
  const response = await axiosInstance.delete(`/students/${id}`);
  return response.data;
};

export const searchStudentsApi = async (query) => {
  const response = await axiosInstance.get(`/students/search`, {
    params: { query },
  });
  return response.data;
};

export const getStudentStatsApi = async () => {
  const response = await axiosInstance.get('/students/stats');
  return response.data;
};

