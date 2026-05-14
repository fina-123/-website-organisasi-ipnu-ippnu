import { DashboardSidebar } from '../../components/DashboardSidebar';
import { mockMembers } from '../../data/mockData';
import { Users, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function AdminMembers() {
  const [filterOrg, setFilterOrg] = useState<'ALL' | 'IPNU' | 'IPPNU'>('ALL');
  const [members, setMembers] = useState(mockMembers);

  const filteredMembers = filterOrg === 'ALL'
    ? members
    : members.filter((m) => m.organization === filterOrg);

  const handleDetail = (id: string) => {
    toast.info(`Detail member ID: ${id}`);
  };

  const handleEdit = (id: string) => {
    toast.info(`Edit member ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus anggota ini?')) {
      setMembers(prev => prev.filter(m => m.id !== id));
      toast.success('Anggota dihapus!');
    }
  };

  const handleAddMember = () => {
    toast.info('Tambah anggota baru - Form akan ditambahkan');
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="admin" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Anggota</h1>
              <p className="text-gray-600">Manajemen data anggota IPNU & IPPNU</p>
            </div>
            <button 
              onClick={handleAddMember}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Plus size={20} />
              Tambah Anggota
            </button>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilterOrg('ALL')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filterOrg === 'ALL'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Semua ({mockMembers.length})
            </button>
            <button
              onClick={() => setFilterOrg('IPNU')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filterOrg === 'IPNU'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              IPNU ({mockMembers.filter(m => m.organization === 'IPNU').length})
            </button>
            <button
              onClick={() => setFilterOrg('IPPNU')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filterOrg === 'IPPNU'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              IPPNU ({mockMembers.filter(m => m.organization === 'IPPNU').length})
            </button>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      member.organization === 'IPNU' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      <Users size={24} className={member.organization === 'IPNU' ? 'text-green-600' : 'text-purple-600'} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{member.name}</h3>
                      <p className="text-xs text-gray-500">{member.position}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    member.organization === 'IPNU'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {member.organization}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>📧 {member.email}</p>
                  <p>📱 {member.phone}</p>
                  <p>📍 {member.address}</p>
                  <p>📅 Bergabung: {new Date(member.joinDate).toLocaleDateString('id-ID')}</p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDetail(member.id)}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center justify-center gap-1 text-sm">
                    <Eye size={16} />
                    Detail
                  </button>
                  <button 
                    onClick={() => handleEdit(member.id)}
                    className="px-3 py-2 bg-gray-50 text-gray-600 rounded hover:bg-gray-100">
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(member.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
