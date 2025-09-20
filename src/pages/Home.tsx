import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowUp } from 'lucide-react';
import { getFeatures, upvoteFeature, type Feature } from '@/lib/api';

export default function Home() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upvotingIds, setUpvotingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFeatures();
  }, []);

  async function loadFeatures() {
    try {
      setError(null);
      const data = await getFeatures();
      setFeatures(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load features');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpvote(feature: Feature) {
    if (upvotingIds.has(feature.id)) return;

    // Optimistic update
    setFeatures(prev => prev.map(f => 
      f.id === feature.id ? { ...f, votes: f.votes + 1 } : f
    ));
    
    setUpvotingIds(prev => new Set(prev).add(feature.id));

    try {
      await upvoteFeature(feature.id);
      // Refresh to get server state
      loadFeatures();
    } catch (err) {
      // Revert optimistic update
      setFeatures(prev => prev.map(f => 
        f.id === feature.id ? { ...f, votes: f.votes - 1 } : f
      ));
      setError(err instanceof Error ? err.message : 'Failed to upvote');
    } finally {
      setUpvotingIds(prev => {
        const next = new Set(prev);
        next.delete(feature.id);
        return next;
      });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 pt-8 pb-safe">
        <div className="max-w-md mx-auto">
          <div className="text-center text-gray-600">Loading features...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-8 pb-safe">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">FeatureVotes</h1>
          <Link
            to="/settings"
            className="text-sm text-gray-600 hover:text-gray-900 min-h-[44px] flex items-center px-2"
          >
            Settings
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-6">
          {features.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              No features yet. Be the first to add one!
            </div>
          ) : (
            features.map((feature) => (
              <div key={feature.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
                    <div className="text-sm text-gray-600">{feature.votes} votes</div>
                  </div>
                  <button
                    onClick={() => handleUpvote(feature)}
                    disabled={upvotingIds.has(feature.id)}
                    className="min-h-[44px] min-w-[44px] bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg flex items-center justify-center ml-3 transition-colors"
                  >
                    <ArrowUp className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <Link
          to="/new"
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors"
        >
          <Plus className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}