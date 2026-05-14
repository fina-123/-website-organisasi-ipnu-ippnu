import { useEffect, useState } from 'react';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import { UserCog, Plus, Edit, Trash2, KeyRound, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import type { Member } from '../../../data/mockData';
import { sendPasswordResetEmail } from '@supabase/supabase-js';

interface Member {
  id: string;
  auth_id: string;
  full_name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  created_at: string;
}

export function AdminUsers() {
  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      auth_id: 'auth1',
      full_name: 'Admin IPNU',
      email: 'admin@ipnu.org',
      phone: '081234567890',
      organization: 'IPNU',
      role: 'admin',
      created_at: '2026-01-01',
    },
    {
      id: '2',
      auth_id: 'auth2',
      full_name: 'Ahmad Fauzi',
      email: 'user1@example.com',
      phone: '081234567891',
      organization: 'IPNU',
      role: 'user',
      created_at: '2026-02-01',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (memberId: string) => {
    toast.info(`Edit member ${memberId}`);
    setEditingId(memberId);
  };

  const handleDelete = (memberId: string) => {
    if (confirm(`Hapus ${members.find(m => m.id === memberId)?.full_name}?`)) {
      setMembers(prev => prev.filter(m => m.id !== memberId));
      toast.success('Member dihapus!');
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching members:', error);
        toast.error('Gagal memuat data member');
      } else {
        setMembers(data || []);
      }
    } else {
      setMembers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleResetPassword = async (member: Member) => {
    if (!confirm(`Reset password untuk ${member.full_name} (${member.email})?\nPassword baru akan dikirim via email.`)) return;
    
    setResettingId(member.id);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(member.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;
        toast.success(`Password reset dikirim ke ${member.email}`);
      } catch (error: any) {
        toast.error(`Error: ${error.message}`);
      }
    } else {
      toast.success(`Password reset dikirim ke ${member.email} (Demo Mode)`);
    }

    setResettingId(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="admin" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola User</h1>
              <p className="text-gray-600">Manajemen akun user dan admin</p>
            </div>
            <button 
              onClick={() => toast.info('Tambah user baru - Form akan ditambahkan')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Plus size={20} />
              Tambah User
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telepon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                      Memuat data...
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      {isSupabaseConfigured 
                        ? 'Belum ada member.' 
                        : 'Supabase belum dikonfigurasi. Gunakan mode demo.'}
                    </td>
                  </tr>
                ) : (
                  members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <UserCog size={20} className="text-gray-600" />
                          </div>
                          <div className="font-medium text-gray-900">{member.full_name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {member.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          member.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {member.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {member.phone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(member.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleResetPassword(member)}
                            disabled={resettingId === member.id}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded disabled:opacity-50"
                            title="Reset Password"
                          >
                            {resettingId === member.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <KeyRound size={16} />
                            )}
                          </button>
                          <button 
                            onClick={() => handleDelete(member.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

