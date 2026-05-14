import { PublicNavbar } from '../components/PublicNavbar';
import { Footer } from '../components/Footer';
import { mockStructure } from '../data/mockData';
import { UserCircle } from 'lucide-react';

export function Structure() {
  const ipnuStructure = mockStructure.filter((s) => s.organization === 'IPNU');
  const ippnuStructure = mockStructure.filter((s) => s.organization === 'IPPNU');

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Struktur Organisasi</h1>
          <p className="text-lg text-green-50">Pengurus IPNU IPPNU Ranting Batursari</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* IPNU Structure */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">IP</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Pengurus IPNU</h2>
                <p className="text-gray-600">Periode 2026-2028</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {ipnuStructure.map((member) => (
                <div
                  key={member.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <UserCircle size={64} className="text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-sm text-green-700 mb-2">{member.position}</p>
                    <p className="text-xs text-gray-500">{member.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IPPNU Structure */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">IP</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Pengurus IPPNU</h2>
                <p className="text-gray-600">Periode 2026-2028</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {ippnuStructure.map((member) => (
                <div
                  key={member.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <UserCircle size={64} className="text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-sm text-purple-700 mb-2">{member.position}</p>
                    <p className="text-xs text-gray-500">{member.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-16 bg-gray-50 rounded-lg p-8 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 text-xl">Informasi</h3>
            <p className="text-gray-700 leading-relaxed">
              Struktur organisasi IPNU IPPNU Ranting Batursari periode 2026-2028 dirancang untuk
              memaksimalkan kinerja dan koordinasi dalam menjalankan program kerja. Setiap pengurus
              memiliki tugas dan tanggung jawab yang jelas untuk mencapai visi dan misi organisasi.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
