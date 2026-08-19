import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { createRating } from '../../../services/ratingService';
import { useToast } from '../../../contexts/ToastContext';

const RatingModal = ({ appointment, onClose, onSuccess }) => {
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    try {
      // 1. Gọi API gửi cục data xuống Backend
      await createRating({
        appointmentId: appointment.id,
        rating: rating,
        comment: comment,
      });
    onSuccess(); // Báo thành công để đóng Modal
    showToast("Cảm ơn bác đã đánh giá! Cực kỳ trân trọng!", 'success'); // Hiện thông báo vui vẻ
    } catch (error) {
      showToast("Chết dở, có lỗi gì đó xảy ra khi gửi đánh giá rùi!", 'error');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Lớp nền mờ, bấm vào đây sẽ đóng Modal */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Nội dung Popup */}
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full relative z-10 shadow-2xl border border-gray-100">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Đánh giá Bác sĩ</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Thông tin bác sĩ */}
        <div className="flex items-center gap-4 mb-8 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <Icons.User className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-gray-900">BS. {appointment.doctorProfile?.fullName}</p>
          </div>
        </div>

        {/* Cụm 5 Ngôi sao */}
        <div className="flex flex-col items-center mb-8">
          <p className="text-sm font-semibold text-gray-600 mb-3">Bạn cảm thấy dịch vụ thế nào?</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Icons.Star
                  className={`w-10 h-10 ${
                    star <= (hoverRating || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-200 fill-gray-50'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Ô nhập comment */}
        <div className="mb-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn (Tùy chọn)..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            rows="3"
          />
        </div>

        {/* Nút gửi */}
        <button
          onClick={handleSubmit}
          className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 cursor-pointer"
        >
          Gửi Đánh Giá
        </button>
      </div>
    </div>
  );
};

export default RatingModal;
