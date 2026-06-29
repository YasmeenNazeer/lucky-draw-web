import React from 'react';

type AmountCardProps = {
  amount: string;
  description?: string;
  isSelected?: boolean;
  onSelect?: () => void;
};

export default function AmountCard({
  amount,
  description,
  isSelected = false,
  onSelect
}: AmountCardProps) {
  return (
    <div
      className={`group cursor-pointer relative overflow-hidden
                 ${isSelected
                   ? 'border-2 border-purple-500/50 bg-gradient-to-br from-purple-50 to-pink-50/20'
                   : 'border-2 border-gray-200/50 hover:border-gray-300/50 bg-white/70'}
                 rounded-xl p-6 text-center transition-all duration-300
                 hover:scale-105 hover:shadow-xl
                 hover:bg-white/80
                 `}
      onClick={onSelect}
    >
      <div className="pb-4">
        <div className={`text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300
                     ${isSelected ? 'text-purple-600' : ''}`}>
          {amount}
        </div>
        {description && (
          <p className={`mt-2 text-sm
                     ${isSelected ? 'text-purple-600' : 'text-gray-500'}`}>
            {description}
          </p>
        )}
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-purple-600/20 text-white text-xs font-medium px-2 py-1 rounded-full border border-purple-500/30">
          Selected
        </div>
      )}
    </div>
  );
}