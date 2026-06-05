import React from 'react';

const ProfileCard = ({ profile, isSelected, onSelect }) => {
  const { fullName, name, dob, gender, phone, relationship } = profile;
  const displayName = fullName || name;
  const displayGender = gender === 'MALE' ? 'Nam' : gender === 'FEMALE' ? 'Nữ' : gender === 'OTHER' ? 'Khác' : gender;

  return (
    <div 
      onClick={onSelect}
      className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 select-none ${
        isSelected 
          ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-500/5' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
          ✓
        </div>
      )}

      {/* Relationship Tag */}
      <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full mb-3 uppercase tracking-wider ${
        relationship === 'Bản thân' 
          ? 'bg-blue-100 text-blue-700' 
          : 'bg-gray-100 text-gray-600'
      }`}>
        {relationship}
      </span>

      {/* Basic Info */}
      <div className="space-y-2">
        <h3 className="font-bold text-lg text-gray-900 leading-snug">{displayName}</h3>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-500 font-medium">
          <div>
            <span className="text-gray-400 font-normal">Ngày sinh: </span>
            {dob}
          </div>
          <div>
            <span className="text-gray-400 font-normal">Giới tính: </span>
            {displayGender}
          </div>
          <div className="col-span-2 mt-1">
            <span className="text-gray-400 font-normal">Số điện thoại: </span>
            <span className="font-semibold text-gray-700">{phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
