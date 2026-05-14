import { DashboardSidebar } from '../../components/DashboardSidebar';
import { UserCircle, Mail, Phone, MapPin, Calendar, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export function UserProfile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    joinDate: '',
  });

  useEffect(() => {
    if (user) {
      let createdUsers = {};
      try { createdUsers = JSON.parse(localStorage.getItem('created_users') || '{}'); } catch { createdUsers = {}; }
      const userData = createdUsers[user.email];
      setFormData({
        name: user.name || userData?.fullName || 'Anggota',
        email: user.email || '',
        phone: userData?.phone || '',
        address: userData?.address || 'Batursari RT 01 RW 02',
        joinDate: userData?.createdAt || new Date().toISOString(),
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      let createdUsers = {};
      try { createdUsers = JSON.parse(localStorage.getItem('created_users') || '{}'); } catch { createdUsers = {}; }
      if (createdUsers[user.email]) {
        createdUsers[user.email].fullName = formData.name;
        createdUsers[user.email].phone = formData.phone;
        createdUsers[user.email].address = formData.address;
        localStorage.setItem('created_users', JSON.stringify(createdUsers));
      }
      let savedUser = {};
      try { savedUser = JSON.parse(localStorage.getItem('user') || '{}'); } catch { savedUser = {}; }
      savedUser.name = formData.name;
      localStorage.setItem('user', JSON.stringify(savedUser));
    }
    alert('Profil berhasil diperbarui!');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="user" />

      <main className="flex-1 p-8 lg:ml-0">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Saya</h1>
            <p className="text-gray-600">Kelola informasi profil Anda</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <UserCircle size={64} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{formData.name || 'Anggota'}</h2>
                <p className="text-gray-600">Anggota IPNU</p>
                <button
                  onClick={() => alert('Fitur unggah foto akan tersedia segera.')}
                  className="mt-2 text-sm text-green-700 hover:text-green-800"
                >
                  Ubah Foto Profil
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <UserCircle size={20} className="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <Mail size={20} className="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <Phone size={20} className="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Bergabung
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.joinDate ? new Date(formData.joinDate).toLocaleDateString('id-ID') : '-'}
                      disabled
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <Calendar size={20} className="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                  <MapPin size={20} className="absolute left-3 top-2.5 text-gray-400" />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Save size={20} />
                  Simpan Perubahan
                </button>
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-2">Informasi</h3>
            <p className="text-sm text-gray-700">
              Pastikan data profil Anda selalu up-to-date agar memudahkan komunikasi dan administrasi organisasi.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

