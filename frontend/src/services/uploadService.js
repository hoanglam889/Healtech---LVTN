import apiClient from './apiClient';

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data; // Trả về { filePath: '/uploads/img-xxx.ext', ... }
};
