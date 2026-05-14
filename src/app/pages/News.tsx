import { PublicNavbar } from '../components/PublicNavbar';
import { Footer } from '../components/Footer';
import { mockNews } from '../data/mockData';
import { Newspaper, Calendar, User } from 'lucide-react';
import { useState } from 'react';

export function News() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const categories = ['Semua', 'Organisasi', 'Kegiatan', 'Pengumuman'];

  const filteredNews =
    selectedCategory === 'Semua'
      ? mockNews
      : mockNews.filter((news) => news.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Berita & Kegiatan</h1>
          <p className="text-lg text-green-50">Informasi terbaru seputar IPNU IPPNU Batursari</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* News Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((news) => (
              <div
                key={news.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <Newspaper size={48} className="text-gray-400" />
                </div>
                <div className="p-6">
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mb-3">
                    {news.category}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{news.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{news.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{news.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{new Date(news.date).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                  <button className="mt-4 text-sm text-green-700 hover:text-green-800 font-medium">
                    Baca selengkapnya →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <Newspaper size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada berita dalam kategori ini</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
