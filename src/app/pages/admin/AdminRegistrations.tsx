import { DashboardSidebar } from '../../components/DashboardSidebar';
import { mockRegistrations, mockActivities, mockUsers } from '../../data/mockData';
import { ClipboardList, Check, X } from 'lucide-react';
import { useState } from 'react';

export function AdminRegistrations() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredRegistrations = filter === 'all'
    ? mockRegistrations
    : mockRegistrations.filter((r) => r.status === filter);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="admin" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pendaftaran</h1>
            <p className="text-gray-600">Kelola pendaftaran anggota dan kegiatan</p>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Semua ({mockRegistrations.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Pending ({mockRegistrations.filter(r => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Disetujui ({mockRegistrations.filter(r => r.status === 'approved').length})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Ditolak ({mockRegistrations.filter(r => r.status === 'rejected').length})
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Kegiatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Pendaftar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tgl Daftar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRegistrations.map((registration) => {
                  const activity = mockActivities.find((a) => a.id === registration.activityId);
                  const user = mockUsers.find((u) => u.id === registration.userId);
                  return (
                    <tr key={registration.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{activity?.title}</div>
                        <div className="text-sm text-gray-500">{activity?.type}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{user?.name}</div>
                        <div className="text-xs text-gray-500">{user?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(registration.registeredDate).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          registration.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          registration.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {registration.status === 'pending' ? 'Pending' :
                           registration.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {registration.status === 'pending' && (
                          <div className="flex gap-2">
                            <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1">
                              <Check size={14} />
                              Setujui
                            </button>
                            <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1">
                              <X size={14} />
                              Tolak
                            </button>
                          </div>
                        )}
                        {registration.status !== 'pending' && (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredRegistrations.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <ClipboardList size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada pendaftaran</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
