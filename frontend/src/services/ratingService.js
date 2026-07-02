import apiClient from './apiClient';

// Hàm gửi Đánh giá mới
export const createRating = async (ratingData) => {
  const response = await apiClient.post('/ratings', ratingData);
  return response.data;
};

// Lát nữa mình sẽ xài hàm này ở trang chủ để kéo danh sách điểm số
export const getRatingsByDoctor = async (doctorId) => {
  const response = await apiClient.get(`/ratings`, {
    params: { doctorId }
  });
  return response.data;
};

// Lấy tất cả đánh giá cho Admin
export const getAllRatings = async () => {
  const response = await apiClient.get('/ratings');
  return response.data;
};
