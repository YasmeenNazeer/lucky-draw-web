'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // ignore — cookie clear is best-effort
    }
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`relative overflow-hidden flex h-10 w-14 items-center justify-center gap-2 rounded-full border border-gray-200/50 bg-white/70 backdrop-blur-sm
        hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300/50 transition-all duration-300
        ${loading
          ? 'opacity-70 cursor-not-allowed'
          : 'hover:from-purple-500/20 hover:via-pink-500/20 hover:to-orange-500/20'}`}
    >
      {/* Gradient overlay for hover effect */}
      <div className="absolute inset-0 -z-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-0
          group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
      {loading ? (
        <>
          <svg className="h-5 w-5 text-gray-600 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 8v4l4 2" />
          </svg>
          <span className="sr-only">Logging out...</span>
        </>
      ) : (
        <>
          <svg className="h-5 w-5 text-gray-600 transition-colors duration-300 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <path d="M12 17V5" />
            <path d="M15 21h4a2 2 0 002-2V5a2 2 0 00-2-2h-4" />
            <path d="M7 10h10" />
          </svg>
          <span className="sr-only">Log out</span>
        </>
      )}
    </button>
  );
}