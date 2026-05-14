import { DashboardSidebar } from '../../components/DashboardSidebar';
import { mockNews } from '../../data/mockData';
import { Newspaper, Plus, Edit, Trash2, Eye } from 'lucide-react';

export function AdminNews() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="admin" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Berita & Artikel</h1>
              <p className="text-gray-600">Kelola berita dan artikel organisasi</p>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Plus size={20} />
              Tulis Artikel
            </button>
          </div>

          {/* News Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {mockNews.map((news) => (
              <div key={news.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <Newspaper size={48} className="text-gray-400" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {news.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(news.date).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{news.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{news.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Oleh {news.author}</span>
                    <div className="flex gap-2">
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
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
