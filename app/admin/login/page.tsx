'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Login failed');
      }

      // Success — go to the admin dashboard.
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#f8f5ff] to-[#fff7ed] p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 rounded-3xl shadow-lg border border-gray-100/50 p-10 border-l-4 border-r-4 bg-gradient-to-t from-purple-50 via-pink-50 to-orange-50/10"
      >
        <h1 className="mb-6 text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500">
          Admin Login
        </h1>

        <label className="block text-sm font-medium mb-2 text-black ">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-transparent focus:ring-2 focus:ring-gradient-to-r from-purple-400 via-pink-500 to-orange-400 focus:bg-white placeholder-gray-400 text-gray-900"
          autoFocus
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`mt-6 w-full px-6 py-3 rounded-md font-medium text-white transition-all duration-300
            ${loading
              ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500/70 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 hover:from-purple-500 hover:via-pink-400 hover:to-orange-400 hover:-translate-y-0.5 hover:shadow-lg active:scale-95'}`}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}