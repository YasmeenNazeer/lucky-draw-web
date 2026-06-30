import { getParticipants, getStats } from '@/lib/googleSheets';
import LogoutButton from '@/components/LogoutButton';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Shape of a row returned by getParticipants().
type Participant = {
  name: string;
  phone: string;
  amount: string;
  returnNumber: string;
  paymentMethod: string;
  timestamp?: string;
};

// Shape of the object returned by getStats().
type Stats = {
  totalParticipants: number;
  totalAmount: number;
};

export default async function AdminPage() {
  // Check for authentication cookie
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin_auth');
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  // If no cookie or password mismatch, redirect to login
  if (!authCookie || typeof ADMIN_PASSWORD !== 'string' || authCookie.value !== ADMIN_PASSWORD) {
    return redirect('/admin/login');
  }

  // Explicit types so TypeScript knows what these variables hold
  // after the try/catch resolves.
  let participants: Participant[] = [];
  let stats: Stats = { totalParticipants: 0, totalAmount: 0 };
  let error: string | undefined = undefined;
  let loading = true;

  try {
    // Fetch both participants and stats in parallel would be more efficient,
    // but for simplicity and to demonstrate the getStats function, we'll fetch separately
    participants = await getParticipants();
    stats = await getStats();
    loading = false;
  } catch (err) {
    console.error('Error fetching data:', err);
    error = 'Failed to load data';
    loading = false;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50/10 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <p className="text-gray-500">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50/10 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100/50">
          <div className="flex items-center justify-between mb-6 p-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Monitor participants and track lucky draw activity
              </p>
            </div>
            <LogoutButton />
          </div>

          {/* Stats from getStats() function */}
          <div className="grid gap-6 mb-6 px-4 md:px-0 md:grid-cols-2">
            {/* Total Participants Card */}
            <div
              className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-10"></div>
              <div className="relative z-0 flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Total Participants
                </h2>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalParticipants}
                </p>
              </div>
            </div>

            {/* Total Amount Collected Card */}
            <div
              className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-pink-500 via-orange-500 to-purple-500 opacity-10"></div>
              <div className="relative z-0 flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Total Amount Collected
                </h2>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalAmount.toFixed(2)} PKR
                </p>
              </div>
            </div>
          </div>

          {/* Participants Table */}
          <div className="overflow-hidden rounded-2xl shadow-lg border border-gray-200">
            <div className="px-6 py-4 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50/20 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Participants List
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Return Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participants.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                          <p className="text-lg font-medium text-gray-800 mb-2">
                            No participants yet
                          </p>
                          <p className="text-sm text-gray-600">
                            Entries will appear here once users join the lucky draw.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    participants.map((participant: Participant, index: number) => (
                      <tr
                        key={index}
                        className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white/50' : ''}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {participant.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {participant.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {participant.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {participant.returnNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {participant.paymentMethod}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}