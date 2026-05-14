import { useState } from 'react';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import { Users, Calendar, ClipboardList, Newspaper, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { mockMembers, mockActivities, mockRegistrations, mockNews } from '../../data/mockData';
import type { Registration } from '../../data/mockData';

export function AdminDashboard() {
  const [pendingRegistrations, setPendingRegistrations] = useState<Registration[]>(mockRegistrations.filter((r: any) => r.status === 'pending') as Registration[]);

  const handleApprove = (id: string) => {
    toast.success('Pendaftaran disetujui!');
    // Update mock data
    const updated = mockRegistrations.map((r: any) => r.id === id ? {...r, status: 'approved' as const} : r);
    setPendingRegistrations(updated.filter((r: any) => r.status === 'pending') as Registration[]);
  };

  const handleReject = (id: string) => {
    if (confirm('Tolak pendaftaran ini?')) {
      toast.error('Pendaftaran ditolak!');
      // Update mock data
      const updated = mockRegistrations.map((r: any) => r.id === id ? {...r, status: 'rejected' as const} : r);
      setPendingRegistrations(updated.filter((r: any) => r.status === 'pending') as Registration[]);
    }
  };


  const stats = [
    {
      label: 'Total Anggota',
      value: mockMembers.length,
      icon: Users,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Kegiatan Aktif',
      value: mockActivities.filter((a) => a.status !== 'completed').length,
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Pendaftaran Pending',
      value: pendingRegistrations.length,
      icon: ClipboardList,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: 'Total Berita',
      value: mockNews.length,
      icon: Newspaper,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const recentActivities = mockActivities.slice(0, 5);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="admin" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
            <p className="text-gray-600">Selamat datang di panel administrasi IPNU IPPNU Batursari</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon size={24} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Kegiatan Terbaru</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar size={20} className="text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{activity.title}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(activity.date).toLocaleDateString('id-ID')} • {activity.registered}/{activity.quota} peserta
                        </p>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                          activity.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                          activity.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {activity.status === 'upcoming' ? 'Mendatang' : activity.status === 'ongoing' ? 'Berlangsung' : 'Selesai'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pending Registrations */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Pendaftaran Menunggu</h2>
              </div>
              <div className="p-6">
                {pendingRegistrations.length > 0 ? (
                  <div className="space-y-4">
                    {pendingRegistrations.map((registration) => {
                      const activity = mockActivities.find((a) => a.id === registration.activityId);
                      return (
                        <div key={registration.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ClipboardList size={20} className="text-yellow-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900">{activity?.title}</h3>
                            <p className="text-sm text-gray-600">
                              User ID: {registration.userId} • {new Date(registration.registeredDate).toLocaleDateString('id-ID')}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <button 
                                onClick={() => handleApprove(registration.id)}
                                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 flex items-center gap-1"
                              >
                                <Check size={14} />
                                Setujui
                              </button>
                              <button 
                                onClick={() => handleReject(registration.id)}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 flex items-center gap-1"
                              >
                                <X size={14} />
                                Tolak
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ClipboardList size={48} className="mx-auto mb-2 text-gray-300" />
                    <p>Tidak ada pendaftaran yang menunggu</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
