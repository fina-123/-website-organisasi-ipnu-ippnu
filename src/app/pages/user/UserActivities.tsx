import { DashboardSidebar } from '../../components/DashboardSidebar';
import { mockActivities } from '../../data/mockData';
import { Calendar, Users, MapPin } from 'lucide-react';
import { useState } from 'react';

export function UserActivities() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');

  const filteredActivities = filter === 'all'
    ? mockActivities
    : mockActivities.filter((a) => a.status === filter);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="user" />

      <main className="flex-1 p-8 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kegiatan</h1>
            <p className="text-gray-600">Daftar kegiatan IPNU IPPNU Batursari</p>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Mendatang
            </button>
            <button
              onClick={() => setFilter('ongoing')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'ongoing'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Berlangsung
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'completed'
                  ? 'bg-gray-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Selesai
            </button>
          </div>

          {/* Activities Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-48 flex items-center justify-center ${
                  activity.status === 'upcoming' ? 'bg-blue-100' :
                  activity.status === 'ongoing' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Calendar size={64} className={
                    activity.status === 'upcoming' ? 'text-blue-600' :
                    activity.status === 'ongoing' ? 'text-green-600' : 'text-gray-600'
                  } />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      activity.type === 'MAKESTA' ? 'bg-purple-100 text-purple-700' :
                      activity.type === 'LAKMUD' ? 'bg-blue-100 text-blue-700' :
                      activity.type === 'PELATIHAN' ? 'bg-green-100 text-green-700' :
                      activity.type === 'BAKSOS' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {activity.type}
                    </span>
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      activity.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                      activity.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {activity.status === 'upcoming' ? 'Mendatang' :
                       activity.status === 'ongoing' ? 'Berlangsung' : 'Selesai'}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{activity.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{activity.description}</p>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{new Date(activity.date).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{activity.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>{activity.registered}/{activity.quota} peserta</span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(activity.registered / activity.quota) * 100}%` }}
                    />
                  </div>

                  {activity.status === 'upcoming' && activity.registered < activity.quota && (
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Daftar Sekarang
                    </button>
                  )}
                  {activity.status === 'upcoming' && activity.registered >= activity.quota && (
                    <button className="w-full px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed" disabled>
                      Kuota Penuh
                    </button>
                  )}
                  {activity.status !== 'upcoming' && (
                    <button className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                      Lihat Detail
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredActivities.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada kegiatan</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
