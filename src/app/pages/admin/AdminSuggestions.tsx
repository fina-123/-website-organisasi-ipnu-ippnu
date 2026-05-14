import { DashboardSidebar } from '../../components/DashboardSidebar';
import { MessageSquare, Check, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface SuggestionData {
  id: string;
  userName: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export function AdminSuggestions() {
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [suggestions, setSuggestions] = useState<SuggestionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);

    if (!supabase) {
      setError('Supabase belum dikonfigurasi. Isi .env dengan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.');
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('suggestions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      setSuggestions([]);
    } else if (data) {
      setSuggestions(
        data.map((item) => ({
          id: item.id,
          userName: item.user_name,
          subject: item.subject,
          message: item.message,
          status: item.status,
          createdAt: item.created_at,
        }))
      );
    } else {
      setSuggestions([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const updateSuggestionStatus = async (id: string, status: 'read' | 'replied') => {
    if (!supabase) {
      alert('Supabase belum dikonfigurasi.');
      return false;
    }

    const { error } = await supabase
      .from('suggestions')
      .update({ status })
      .eq('id', id);

    if (error) {
      alert(`Terjadi kesalahan ketika memperbarui status: ${error.message}`);
      return false;
    }

    setSuggestions((current) =>
      current.map((suggestion) =>
        suggestion.id === id ? { ...suggestion, status } : suggestion
      )
    );

    return true;
  };

  const handleMarkRead = async (id: string) => {
    await updateSuggestionStatus(id, 'read');
  };

  const handleReply = async (id: string) => {
    const reply = prompt('Tulis jawaban singkat untuk saran ini:');
    if (!reply) {
      return;
    }

    const success = await updateSuggestionStatus(id, 'replied');
    if (success) {
      alert('Saran ditandai sebagai dibalas. Silakan kirim jawaban secara terpisah jika diperlukan.');
    }
  };

  const filteredSuggestions = filter === 'all'
    ? suggestions
    : suggestions.filter((s) => s.status === filter);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role="admin" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Saran Masuk</h1>
            <p className="text-gray-600">Kelola saran dari anggota</p>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Semua ({suggestions.length})
            </button>
            <button
              onClick={() => setFilter('new')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'new'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Baru ({suggestions.filter((s) => s.status === 'new').length})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'read'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Dibaca ({suggestions.filter((s) => s.status === 'read').length})
            </button>
            <button
              onClick={() => setFilter('replied')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'replied'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Dibalas ({suggestions.filter((s) => s.status === 'replied').length})
            </button>
          </div>

          {/* Suggestions List */}
          <div className="space-y-4">
            {filteredSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      suggestion.status === 'new' ? 'bg-blue-100' :
                      suggestion.status === 'read' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      <MessageSquare size={24} className={
                        suggestion.status === 'new' ? 'text-blue-600' :
                        suggestion.status === 'read' ? 'text-yellow-600' : 'text-green-600'
                      } />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{suggestion.subject}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          suggestion.status === 'new' ? 'bg-blue-100 text-blue-700' :
                          suggestion.status === 'read' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {suggestion.status === 'new' ? 'Baru' :
                           suggestion.status === 'read' ? 'Dibaca' : 'Dibalas'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Dari: <span className="font-medium">{suggestion.userName}</span> • {new Date(suggestion.createdAt).toLocaleDateString('id-ID')}
                      </p>
                      <p className="text-sm text-gray-700 mt-3">{suggestion.message}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                  {suggestion.status === 'new' && (
                    <button
                      onClick={() => handleMarkRead(suggestion.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 text-sm"
                    >
                      <Check size={16} />
                      Tandai Dibaca
                    </button>
                  )}
                  {suggestion.status !== 'replied' && (
                    <button
                      onClick={() => handleReply(suggestion.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2 text-sm"
                    >
                      <Mail size={16} />
                      Balas
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredSuggestions.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada saran</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
