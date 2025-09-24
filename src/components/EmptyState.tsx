import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-2">No features yet</h2>
      <p className="text-gray-500 dark:text-slate-400 mb-8">Be the first to suggest one.</p>
      <Link
        to="/new"
        className="inline-flex items-center min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Feature
      </Link>
    </div>
  );
}