import React from 'react';

const BookingStepper = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Chọn hồ sơ bệnh nhân' },
    { number: 2, label: 'Chọn bác sĩ & ngày giờ' },
    { number: 3, label: 'Xác nhận & Thanh toán' },
    { number: 4, label: 'Đặt lịch thành công' }
  ];

  return (
    <div className="max-w-3xl mx-auto mb-8 md:mb-12 px-2 md:px-4">
      <div className="flex items-start justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-4 md:top-5 left-4 right-4 h-1 bg-gray-200 z-0">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>

        {/* Steps */}
        {steps.map((step, idx) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;

          return (
            <div key={idx} className="flex flex-col items-center z-10 relative flex-1">
              <div 
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : isActive 
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow' 
                    : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}
              >
                {isCompleted ? '✓' : step.number}
              </div>
              <span 
                className={`text-[10px] md:text-xs lg:text-sm font-semibold mt-2 md:mt-3 text-center max-w-[65px] md:max-w-none leading-tight transition-colors duration-300 ${
                  isActive ? 'text-blue-600 font-bold' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingStepper;
