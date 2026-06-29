import React from 'react';

type WhatsAppButtonProps = {
  phoneNumber: string;
};

export default function WhatsAppButton({ phoneNumber }: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\s+/g, '')}`;

  return  (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center space-x-3 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 hover:from-purple-700 hover:via-pink-600 hover:to-orange-600 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* WhatsApp icon - using emoji for simplicity, can be replaced with actual SVG/icon */}
      <span className="text-2xl">💬</span>
      <span>WhatsApp Support</span>
    </a>
  );
}