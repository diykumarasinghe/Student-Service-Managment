import axiosInstance from './axiosInstance';

export const loginApi = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

export const registerApi = async (studentData) => {
  const response = await axiosInstance.post('/auth/register', studentData);
  return response.data;
};

export const forgotPasswordApi = async (data) => {
  const response = await axiosInstance.post('/auth/forgot-password', data);
  return response.data;
};

export const getCurrentUserApi = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};

