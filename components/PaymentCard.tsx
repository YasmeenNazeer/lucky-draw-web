import React, { useState } from 'react';

type PaymentCardProps = {
  name: string;
  phone: string;
  className?: string;
};

export default function PaymentCard({ name, phone, className = '' }: PaymentCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`group flex-1 min-w-[180px] bg-white/70 rounded-2xl border border-gray-200/50 hover:border-gray-300/50 p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-purple-200 ${className}`}>
      {/* Icon with background gradient */}
      <div className="w-16 h-16 h-16 mb-4 flex-shrink-0">
        <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 group-hover:from-purple-50 group-hover:to-pink-50 transition-colors duration-300">
          <div className="text-2xl text-purple-600 group-hover:text-purple-700 transition-colors duration-300">💳</div>
        </div>
      </div>

      <h3 className="font-semibold text-gray-800 mb-2 flex-1">
        {name}
      </h3>
      <div className="flex flex-col items-center mt-2">
        <p className="text-sm text-gray-600 flex-1 break-all">
          {phone}
        </p>
        <button
          onClick={handleCopy}
          className={`mt-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200
                   ${copied ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}