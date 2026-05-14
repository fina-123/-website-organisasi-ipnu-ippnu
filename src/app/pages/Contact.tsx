import { PublicNavbar } from '../components/PublicNavbar';
import { Footer } from '../components/Footer';
import { organizationInfo } from '../data/mockData';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
      const { error } = await supabase.from('contact_messages').insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
      ]);

      if (error) throw error;

      alert('Terima kasih! Pesan Anda telah terkirim. Kami akan membalas secepatnya.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Supabase error:', error);
      alert('Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Hubungi Kami</h1>
          <p className="text-lg text-green-50">Jangan ragu untuk menghubungi kami</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Informasi Kontak</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Alamat</h3>
                    <p className="text-gray-600">{organizationInfo.ranting.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Telepon</h3>
                    <p className="text-gray-600">{organizationInfo.ranting.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">{organizationInfo.ranting.email}</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin size={48} className="mx-auto mb-2" />
                  <p>Google Maps</p>
                  <p className="text-sm">Lokasi Sekretariat</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subjek</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Subjek pesan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Tulis pesan Anda di sini..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                  {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
