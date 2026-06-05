import React from 'react';

const ShiftCard = ({ schedule, isSelected, onSelect }) => {
  const timeRange = `${schedule.shift?.startTime?.substring(0, 5)} - ${schedule.shift?.endTime?.substring(0, 5)}`;

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
