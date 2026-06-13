import React from 'react';

const ShiftCard = ({ schedule, isSelected, onSelect, status }) => {
  const timeRange = `${schedule.shift?.startTime?.substring(0, 5)} - ${schedule.shift?.endTime?.substring(0, 5)}`;
  const isExpired = status === 'EXPIRED';
  const isLate = status === 'LATE_ALLOWED';

  if (isExpired) {
    return (
      <div className="py-3.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 text-center font-bold text-sm md:text-base flex flex-col items-center justify-center cursor-not-allowed select-none opacity-60">
        <span>{timeRange}</span>
        <span className="text-[10px] text-gray-400 font-semibold mt-0.5">(Hết ca hẹn)</span>
      </div>
    );
  }

  if (isLate) {
    return (
      <div
        onClick={onSelect}
        className={`py-3.5 px-4 rounded-xl border-2 text-center cursor-pointer transition-all duration-200 select-none font-bold text-sm md:text-base flex flex-col items-center justify-center ${
          isSelected
            ? 'border-amber-600 bg-amber-600 text-white shadow-md shadow-amber-200 scale-[1.02]'
            : 'border-amber-200 bg-amber-50 hover:border-amber-400 hover:text-amber-700 text-amber-800'
        }`}
      >
        <span>{timeRange}</span>
        <span className={`text-[9px] font-bold mt-0.5 ${isSelected ? 'text-white/95' : 'text-amber-600'}`}>
          ⚠️ Quá giờ hẹn - Vẫn nhận
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={`py-3.5 px-4 rounded-xl border-2 text-center cursor-pointer transition-all duration-200 select-none font-bold text-sm md:text-base flex items-center justify-center ${
        isSelected
          ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200 scale-[1.02]'
          : 'border-gray-100 bg-white hover:border-blue-500 hover:text-blue-600 text-gray-700 hover:shadow-sm'
      }`}
    >
      <span>{timeRange}</span>
    </div>
  );
};

export default ShiftCard;
