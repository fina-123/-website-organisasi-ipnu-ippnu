 import { DashboardSidebar } from '../../components/DashboardSidebar';
import { UserPlus, Check, X, Eye, Users, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

interface MemberRegistrationData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  address: string;
  organization: 'IPNU' | 'IPPNU';
  education: string;
  school: string;
  motivation: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  source?: 'server' | 'local';
}

export function AdminMemberRegistrations() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedRegistration, setSelectedRegistration] = useState<MemberRegistrationData | null>(null);
  const [registrations, setRegistrations] = useState<MemberRegistrationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'registrations' | 'accounts'>('registrations');
  const [createdUsers, setCreatedUsers] = useState<Record<string, any>>({});
  const apiBase = import.meta.env.VITE_API_BASE ?? '';

  const loadFromLocalStorage = (): MemberRegistrationData[] => {
    try {
      const stored = localStorage.getItem('member_registrations');
      if (!stored) return [];
      const data = JSON.parse(stored);
      return data.map((item: any) => ({
        id: item.id,
        fullName: item.full_name,
        email: item.email,
        phone: item.phone,
        birthDate: item.birth_date,
        gender: item.gender,
        address: item.address,
        organization: item.organization,
        education: item.education,
        school: item.school,
        motivation: item.motivation,
        status: item.status || 'pending',
        submittedAt: item.submitted_at,
        source: 'local',
      }));
    } catch (e) {
      console.error('Error loading local registrations:', e);
      return [];
    }
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    setError(null);

    const localData = loadFromLocalStorage();
    let mergedData: MemberRegistrationData[] = [...localData];

    try {
      const response = await fetch(`${apiBase}/api/member-registrations`);
      if (!response.ok) {
        throw new Error(`Gagal memuat data dari server (${response.status}).`);
      }

      const data = await response.json();
      const serverData = data.map((item: any) => ({
        id: item.id,
        fullName: item.full_name,
        email: item.email,
        phone: item.phone,
        birthDate: item.birth_date,
        gender: item.gender,
        address: item.address,
        organization: item.organization,
        education: item.education,
        school: item.school,
        motivation: item.motivation,
        status: item.status,
        submittedAt: item.submitted_at,
        source: 'server',
      }));

      const serverIds = new Set(serverData.map((item: any) => item.id));
      const localOnly = mergedData.filter((item) => !serverIds.has(item.id));
      mergedData = [...serverData, ...localOnly];
    } catch (backendError) {
      console.error('Backend error loading registrations:', backendError);
      if (localData.length === 0) {
        setError('Backend tidak tersedia dan tidak ada data lokal.');
      } else {
        setError('Backend tidak tersedia. Menampilkan data lokal saja.');
      }
    }

    mergedData.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    setRegistrations(mergedData);
    setLoading(false);
  };

  const loadCreatedUsers = () => {
    try {
      const stored = localStorage.getItem('created_users');
      if (stored) {
        setCreatedUsers(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading created users:', e);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    loadCreatedUsers();
  }, []);

  const updateRegistrationStatus = async (id: string, status: 'approved' | 'rejected') => {
    const registration = registrations.find((item) => item.id === id);

    if (registration?.source === 'server') {
      const response = await fetch(`${apiBase}/api/member-registrations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Terjadi kesalahan: ${errorText}`);
        return false;
      }
    }

    if (registration?.source === 'local') {
      try {
        const stored = JSON.parse(localStorage.getItem('member_registrations') || '[]');
        const updated = stored.map((item: any) =>
          item.id === id ? { ...item, status } : item
        );
        localStorage.setItem('member_registrations', JSON.stringify(updated));
      } catch (e) {
        console.error('Error updating local storage:', e);
        alert('Gagal memperbarui status pendaftaran lokal.');
        return false;
      }
    }

    setRegistrations((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item))
    );

    return true;
  };

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const getCustomPassword = (): string | null => {
    const custom = prompt('Masukkan password untuk akun (kosongkan untuk generate otomatis):');
    if (custom === null) return null; // cancelled
    if (custom.trim() === '') return generatePassword();
    if (custom.length < 6) {
      alert('Password minimal 6 karakter. Menggunakan password otomatis.');
      return generatePassword();
    }
    return custom.trim();
  };

  const handleApprove = async (id: string) => {
    const registration = registrations.find((item) => item.id === id);
    if (!registration) return;

    const password = getCustomPassword();
    if (password === null) return; // cancelled

    try {
      if (supabase && isSupabaseConfigured) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: registration.email,
          password: password,
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          await supabase.from('members').insert({
            auth_id: data.user.id,
            full_name: registration.fullName,
            email: registration.email,
            phone: registration.phone,
            organization: registration.organization,
            role: 'user',
          });
        }

        const createdUsers = JSON.parse(localStorage.getItem('created_users') || '{}');
        createdUsers[registration.email] = {
          password,
          fullName: registration.fullName,
          phone: registration.phone,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('created_users', JSON.stringify(createdUsers));

        alert(`Pendaftaran disetujui!

✅ Akun berhasil dibuat!

📧 Email: ${registration.email}
🔑 Password: ${password}

Silakan kirim kredensial ini ke anggota via WhatsApp atau email.`);
      } else {
        const createdUsers = JSON.parse(localStorage.getItem('created_users') || '{}');
        createdUsers[registration.email] = {
          password,
          fullName: registration.fullName,
          phone: registration.phone,
          organization: registration.organization,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('created_users', JSON.stringify(createdUsers));

        alert(`Pendaftaran disetujui!

✅ Akun berhasil dibuat! (Demo Mode)

📧 Email: ${registration.email}
🔑 Password: ${password}

Silakan kirim kredensial ini ke anggota via WhatsApp atau email.`);
      }
    } catch (err: any) {
      console.error('Error creating user:', err);
      alert(`Error: ${err.message}`);
      return;
    }

    const success = await updateRegistrationStatus(id, 'approved');
    if (success) {
      loadCreatedUsers();
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Alasan penolakan:');
    if (!reason) return;

    const success = await updateRegistrationStatus(id, 'rejected');
    if (success) {
      alert(`Pendaftaran ditolak. Alasan: ${reason}`);
    }
  };

  const filteredRegistrations =
    filter === 'all'
      ? registrations
      : registrations.filter((item) => item.status === filter);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Tersalin ke clipboard!');
  };

  const createdUsersList = Object.entries(createdUsers).map(([email, data]: [string, any]) => ({
    email,
    ...data,
  }));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="admin" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pendaftaran Anggota Baru</h1>
            <p className="text-gray-600">Kelola pendaftaran anggota baru IPNU & IPPNU</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('registrations')}
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === 'registrations'
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText size={18} />
              Pendaftaran
            </button>
            <button
              onClick={() => setActiveTab('accounts')}
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === 'accounts'
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users size={18} />
              Akun yang Sudah Dibuat ({createdUsersList.length})
            </button>
          </div>

          {error && activeTab === 'registrations' && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {activeTab === 'registrations' ? (
            <>
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    filter === 'all'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Semua ({registrations.length})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    filter === 'pending'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Pending ({registrations.filter((item) => item.status === 'pending').length})
                </button>
                <button
                  onClick={() => setFilter('approved')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    filter === 'approved'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Disetujui ({registrations.filter((item) => item.status === 'approved').length})
                </button>
                <button
                  onClick={() => setFilter('rejected')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    filter === 'rejected'
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Ditolak ({registrations.filter((item) => item.status === 'rejected').length})
                </button>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organisasi</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kontak</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pendidikan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Daftar</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                            Memuat data pendaftaran...
                          </td>
                        </tr>
                      ) : filteredRegistrations.length > 0 ? (
                        filteredRegistrations.map((registration) => (
                          <tr key={registration.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{registration.fullName}</div>
                              <div className="text-xs text-gray-500">{registration.gender}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                registration.organization === 'IPNU'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-purple-100 text-purple-700'
                              }`}>
                                {registration.organization}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{registration.email}</div>
                              <div className="text-xs text-gray-500">{registration.phone}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{registration.education}</div>
                              <div className="text-xs text-gray-500">{registration.school}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {new Date(registration.submittedAt).toLocaleDateString('id-ID')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                registration.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : registration.status === 'approved'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {registration.status === 'pending'
                                  ? 'Pending'
                                  : registration.status === 'approved'
                                  ? 'Disetujui'
                                  : 'Ditolak'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setSelectedRegistration(registration)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                  title="Lihat Detail"
                                >
                                  <Eye size={16} />
                                </button>
                                {registration.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleApprove(registration.id)}
                                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                                      title="Setujui"
                                    >
                                      <Check size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleReject(registration.id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                                      title="Tolak"
                                    >
                                      <X size={16} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                            Tidak ada pendaftaran untuk filter ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {!loading && filteredRegistrations.length === 0 && registrations.length === 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center mt-6">
                  <UserPlus size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Belum ada pendaftaran anggota.</p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Akun Anggota yang Sudah Dibuat</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Daftar akun yang berhasil dibuat saat admin menyetujui pendaftaran. Admin bisa menyalin email dan password untuk diberikan ke anggota.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Lengkap</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Password</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telepon</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Dibuat</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {createdUsersList.length > 0 ? (
                      createdUsersList.map((user, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {user.fullName || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                                {user.password}
                              </code>
                              <button
                                onClick={() => copyToClipboard(user.password)}
                                className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                              >
                                Salin Password
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {user.phone || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => copyToClipboard(`Email: ${user.email}\nPassword: ${user.password}`)}
                                className="text-xs px-3 py-2 bg-green-50 text-green-700 rounded hover:bg-green-100 flex items-center gap-1"
                              >
                                Salin Semua
                              </button>
                              <button
                                onClick={() => {
                                  const newPassword = prompt('Masukkan password baru (kosongkan untuk generate otomatis):');
                                  if (newPassword === null) return;
                                  let finalPassword = newPassword.trim();
                                  if (finalPassword === '') {
                                    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                                    finalPassword = '';
                                    for (let i = 0; i < 8; i++) {
                                      finalPassword += chars.charAt(Math.floor(Math.random() * chars.length));
                                    }
                                  } else if (finalPassword.length < 6) {
                                    alert('Password minimal 6 karakter. Menggunakan password otomatis.');
                                    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                                    finalPassword = '';
                                    for (let i = 0; i < 8; i++) {
                                      finalPassword += chars.charAt(Math.floor(Math.random() * chars.length));
                                    }
                                  }
                                  const stored = JSON.parse(localStorage.getItem('created_users') || '{}');
                                  if (stored[user.email]) {
                                    stored[user.email].password = finalPassword;
                                    localStorage.setItem('created_users', JSON.stringify(stored));
                                    loadCreatedUsers();
                                    alert(`Password untuk ${user.email} telah direset!\n\nPassword Baru: ${finalPassword}`);
                                  }
                                }}
                                className="text-xs px-3 py-2 bg-orange-50 text-orange-700 rounded hover:bg-orange-100 flex items-center gap-1"
                              >
                                Reset Password
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          <Users size={48} className="text-gray-300 mx-auto mb-4" />
                          <p>Belum ada akun yang dibuat.</p>
                          <p className="text-sm mt-1">Akun akan muncul di sini setelah admin menyetujui pendaftaran anggota.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Detail Pendaftaran</h2>
              <button
                onClick={() => setSelectedRegistration(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nama Lengkap</label>
                  <p className="text-gray-900">{selectedRegistration.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Jenis Kelamin</label>
                  <p className="text-gray-900">{selectedRegistration.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{selectedRegistration.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Telepon</label>
                  <p className="text-gray-900">{selectedRegistration.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tanggal Lahir</label>
                  <p className="text-gray-900">
                    {new Date(selectedRegistration.birthDate).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Organisasi</label>
                  <p className="text-gray-900">{selectedRegistration.organization}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Pendidikan</label>
                  <p className="text-gray-900">{selectedRegistration.education}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Sekolah/Universitas</label>
                  <p className="text-gray-900">{selectedRegistration.school}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Alamat</label>
                  <p className="text-gray-900">{selectedRegistration.address}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Motivasi</label>
                  <p className="text-gray-900">{selectedRegistration.motivation}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Tanggal Submit</label>
                  <p className="text-gray-900">{new Date(selectedRegistration.submittedAt).toLocaleString('id-ID')}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Sumber Data</label>
                  <p className="text-xs px-2 py-1 bg-gray-100 rounded inline-block">
                    {selectedRegistration.source === 'server' ? 'Database' : 'Penyimpanan Lokal'}
                  </p>
                </div>
              </div>
            </div>
            {selectedRegistration.status === 'pending' && (
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => {
                    handleApprove(selectedRegistration.id);
                    setSelectedRegistration(null);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Setujui Pendaftaran
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedRegistration.id);
                    setSelectedRegistration(null);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <X size={20} />
                  Tolak Pendaftaran
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

