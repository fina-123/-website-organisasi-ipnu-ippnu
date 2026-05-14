import { DashboardSidebar } from '../../components/DashboardSidebar';
import { MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export function UserSuggestions() {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      alert('Supabase belum dikonfigurasi. Isi .env dengan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('suggestions').insert([
        {
          subject: formData.subject,
          message: formData.message,
          user_name: 'Anggota',
        },
      ]);

      if (error) throw error;

      alert('Saran Anda telah terkirim! Terima kasih atas partisipasinya.');
      setFormData({ subject: '', message: '' });
    } catch (error) {
      console.error('Supabase error:', error);
      alert('Terjadi kesalahan saat mengirim saran. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="user" />

      <main className="flex-1 p-8 lg:ml-0">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kirim Saran</h1>
            <p className="text-gray-600">Berikan masukan dan saran untuk kemajuan organisasi</p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <MessageSquare size={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Suara Anda Penting!</h3>
                <p className="text-sm text-blue-800">
                  Kami sangat menghargai setiap masukan dan saran dari anggota. Saran Anda akan membantu
                  kami meningkatkan kualitas organisasi dan program kegiatan yang lebih baik.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subjek Saran
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Contoh: Saran untuk Kegiatan Ramadhan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detail Saran
                </label>
                <textarea
                  required
                  rows={8}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Tuliskan saran Anda secara detail di sini..."
                />
                <p className="mt-2 text-xs text-gray-500">
                  Minimal 20 karakter. Jelaskan saran Anda dengan detail agar mudah dipahami.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                  {isSubmitting ? 'Mengirim...' : 'Kirim Saran'}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ subject: '', message: '' })}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Guidelines */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-3">Panduan Memberikan Saran:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Gunakan bahasa yang sopan dan konstruktif</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Jelaskan saran dengan spesifik dan detail</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Fokus pada solusi, bukan hanya masalah</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Saran yang membangun akan sangat dihargai</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
