import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createFeature } from '@/lib/api';

export default function New() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await createFeature(title.trim());
      // Dispatch custom event to trigger refetch in Home component
      window.dispatchEvent(new CustomEvent('featureCreated'));
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create feature');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50 p-4 pt-8 pb-safe">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <Link
            to="/"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center mr-3 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">New Feature</h1>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Feature Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Describe the feature you'd like to see..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="w-full min-h-[44px] bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? 'Creating...' : 'Create Feature'}
            </button>
            <Link
              to="/"
              className="w-full min-h-[44px] bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}