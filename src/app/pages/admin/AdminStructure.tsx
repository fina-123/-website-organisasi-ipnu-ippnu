import { DashboardSidebar } from '../../components/DashboardSidebar';
import { mockStructure } from '../../data/mockData';
import { Network, Plus, Edit, Trash2, UserCircle } from 'lucide-react';

export function AdminStructure() {
  const ipnuStructure = mockStructure.filter((s) => s.organization === 'IPNU');
  const ippnuStructure = mockStructure.filter((s) => s.organization === 'IPPNU');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="admin" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Struktur Organisasi</h1>
              <p className="text-gray-600">Kelola pengurus IPNU & IPPNU</p>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Plus size={20} />
              Tambah Pengurus
            </button>
          </div>

          {/* IPNU Section */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IP</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Pengurus IPNU</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ipnuStructure.map((member) => (
                <div key={member.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <UserCircle size={32} className="text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{member.name}</h3>
                        <p className="text-sm text-green-700">{member.position}</p>
                        <p className="text-xs text-gray-500">{member.period}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center justify-center gap-1 text-sm">
                      <Edit size={14} />
                      Edit
                    </button>
                    <button className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IPPNU Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IP</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Pengurus IPPNU</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ippnuStructure.map((member) => (
                <div key={member.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <UserCircle size={32} className="text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{member.name}</h3>
                        <p className="text-sm text-purple-700">{member.position}</p>
                        <p className="text-xs text-gray-500">{member.period}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center justify-center gap-1 text-sm">
                      <Edit size={14} />
                      Edit
                    </button>
                    <button className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
