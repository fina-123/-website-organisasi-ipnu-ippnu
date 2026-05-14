import { DashboardSidebar } from '../../components/DashboardSidebar';
import { mockActivities } from '../../data/mockData';
import { Calendar, Plus, Edit, Trash2, Users } from 'lucide-react';

export function AdminActivities() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="admin" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Kegiatan</h1>
              <p className="text-gray-600">Manajemen kegiatan IPNU IPPNU</p>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Plus size={20} />
              Tambah Kegiatan
            </button>
          </div>

          {/* Activities List */}
          <div className="space-y-4">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        activity.status === 'upcoming' ? 'bg-blue-100' :
                        activity.status === 'ongoing' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Calendar size={24} className={
                          activity.status === 'upcoming' ? 'text-blue-600' :
                          activity.status === 'ongoing' ? 'text-green-600' : 'text-gray-600'
                        } />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{activity.title}</h3>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            activity.type === 'MAKESTA' ? 'bg-purple-100 text-purple-700' :
                            activity.type === 'LAKMUD' ? 'bg-blue-100 text-blue-700' :
                            activity.type === 'PELATIHAN' ? 'bg-green-100 text-green-700' :
                            activity.type === 'BAKSOS' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {activity.type}
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            activity.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                            activity.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {activity.status === 'upcoming' ? 'Mendatang' : activity.status === 'ongoing' ? 'Berlangsung' : 'Selesai'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        <span>{new Date(activity.date).toLocaleDateString('id-ID')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>📍</span>
                        <span>{activity.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={16} />
                        <span>{activity.registered}/{activity.quota} peserta</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(activity.registered / activity.quota) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
