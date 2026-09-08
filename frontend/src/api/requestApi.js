import axiosInstance from './axiosInstance';

export const getAllRequestsApi = async () => {
  const response = await axiosInstance.get('/requests');
  return response.data;
};

export const getRequestByIdApi = async (id) => {
  const response = await axiosInstance.get(`/requests/${id}`);
  return response.data;
};

export const createRequestApi = async (requestData) => {
  const response = await axiosInstance.post('/requests', requestData);
  return response.data;
};

export const updateRequestApi = async (id, requestData) => {
  const response = await axiosInstance.put(`/requests/${id}`, requestData);
  return response.data;
};

export const updateRequestStatusApi = async (id, statusData) => {
  const response = await axiosInstance.patch(`/requests/${id}/status`, statusData);
  return response.data;
};

export const deleteRequestApi = async (id) => {
  const response = await axiosInstance.delete(`/requests/${id}`);
  return response.data;
};

export const searchRequestsApi = async (query) => {
  const response = await axiosInstance.get('/requests/search', {
    params: { query },
  });
  return response.data;
};

export const filterRequestsApi = async (category, status) => {
  const response = await axiosInstance.get('/requests/filter', {
    params: { category, status },
  });
  return response.data;
};

export const getRequestStatsApi = async () => {
  const response = await axiosInstance.get('/requests/stats');
  return response.data;
};

