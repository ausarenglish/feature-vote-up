import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowUp } from 'lucide-react';
import { getFeatures, upvoteFeature, type Feature } from '@/lib/api';
import EmptyState from '@/components/EmptyState';
import { useHaptic } from '@/hooks/useHaptic';

function FeatureListSkeleton() {
  return (
    <div className="space-y-4 mb-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 shadow-sm animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-5 bg-gray-200 dark:bg-slate-600 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-16"></div>
            </div>
            <div className="min-h-[44px] min-w-[44px] bg-gray-200 dark:bg-slate-600 rounded-lg ml-4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

type SortMode = 'top' | 'newest';

export default function Home() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upvotingIds, setUpvotingIds] = useState<Set<number>>(new Set());
  const [pressedButton, setPressedButton] = useState<number | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('top');
  const triggerHaptic = useHaptic();
  
  // Refs for cleanup and abort control
  const abortControllerRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const sortedFeatures = useMemo(() => {
    if (sortMode === 'top') {
      return [...features].sort((a, b) => b.votes - a.votes);
    } else {
      return [...features].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }, [features, sortMode]);

  // Fetch features with abort controller support
  async function fetchFeatures(signal?: AbortSignal) {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/features`, {
        cache: 'no-store',
        signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setFeatures(data);
      setError(null);
    } catch (err) {
      // Don't set error if request was aborted
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
        console.error('Error fetching features:', err);
      }
    }
  }

  // Refetch wrapper that cancels previous requests
  const refetch = useCallback(() => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    // Fetch with new controller
    fetchFeatures(abortControllerRef.current.signal);
  }, []);

  useEffect(() => {
    // Initial fetch
    refetch();
    setLoading(false);
    
    // Set up polling every 3 seconds
    intervalRef.current = setInterval(() => {
      refetch();
    }, 3000);
    
    // Focus and visibility change handlers
    function handleFocus() {
      refetch();
    }
    
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        refetch();
      }
    }
    
    function handleFeatureCreated() {
      refetch();
    }
    
    // Add event listeners
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('featureCreated', handleFeatureCreated);
    
    // Cleanup function
    return () => {
      // Clear interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Abort ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      
      // Remove event listeners
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('featureCreated', handleFeatureCreated);
    };
  }, [refetch]);


  async function handleUpvote(feature: Feature) {
    if (upvotingIds.has(feature.id)) return;

    // Trigger haptic feedback and visual animation
    triggerHaptic();
    setPressedButton(feature.id);
    setTimeout(() => setPressedButton(null), 120);

    // Optimistic update
    setFeatures(prev => prev.map(f => 
      f.id === feature.id ? { ...f, votes: f.votes + 1 } : f
    ));
    
    setUpvotingIds(prev => new Set(prev).add(feature.id));

    try {
      await upvoteFeature(feature.id);
      // Refetch to align with server state
      refetch();
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


  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50 p-4 pt-8 safe-bottom">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-slate-100">FeatureVotes</h1>
          <Link
            to="/settings"
            className="text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 min-h-[44px] flex items-center px-4"
          >
            Settings
          </Link>
        </div>

        {!loading && sortedFeatures.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-500 dark:text-slate-400">{sortedFeatures.length} features</div>
            <div className="flex bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setSortMode('top')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  sortMode === 'top' 
                    ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm' 
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
                }`}
              >
                Top
              </button>
              <button
                onClick={() => setSortMode('newest')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  sortMode === 'newest' 
                    ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm' 
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
                }`}
              >
                Newest
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <FeatureListSkeleton />
        ) : sortedFeatures.length === 0 ? (
          <div className="mb-8">
            <EmptyState />
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {sortedFeatures.map((feature) => (
              <div key={feature.id} className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="font-medium text-gray-900 dark:text-slate-100 mb-2">{feature.title}</h2>
                    <div className="text-sm text-gray-500 dark:text-slate-400">{feature.votes} votes</div>
                  </div>
                  <button
                    onClick={() => handleUpvote(feature)}
                    disabled={upvotingIds.has(feature.id)}
                    aria-label={`Upvote ${feature.title}`}
                    className={`min-h-[44px] min-w-[44px] bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-slate-600 text-white rounded-lg flex items-center justify-center ml-4 transition-all duration-75 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      pressedButton === feature.id ? 'vote-button-pressed' : ''
                    }`}
                  >
                    <ArrowUp className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link
          to="/new"
          aria-label="Add feature"
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}