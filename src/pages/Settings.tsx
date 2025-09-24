import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { storage } from '@/lib/storage';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getTheme } from '@/lib/theme';

export default function Settings() {
  const [reduceHaptics, setReduceHaptics] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const value = await storage.get('reduceHaptics');
      setReduceHaptics(value === 'true');
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleHaptics(checked: boolean) {
    setReduceHaptics(checked);
    try {
      await storage.set('reduceHaptics', checked.toString());
    } catch (err) {
      console.error('Failed to save settings:', err);
      // Revert on error
      setReduceHaptics(!checked);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50 p-4 pt-8 pb-safe">
        <div className="max-w-md mx-auto">
          <div className="text-center text-gray-600 dark:text-slate-400">Loading settings...</div>
        </div>
      </div>
    );
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Settings</h1>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 divide-y divide-gray-200 dark:divide-slate-700">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-slate-100">Theme</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                  Switch between light and dark mode
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-slate-100">Reduce Haptics</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                  Minimize vibration feedback throughout the app
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reduceHaptics}
                  onChange={(e) => handleToggleHaptics(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="text-sm text-gray-500 dark:text-slate-400">
            FeatureVotes v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
}