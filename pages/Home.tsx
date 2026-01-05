
import React, { useState, useEffect } from 'react';
import DoubtCard from '../components/DoubtCard';
import { Doubt } from '../types';
import { apiService } from '../services/mockApi';
import { ICONS } from '../constants';

const Home: React.FC = () => {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'newest' | 'popular' | 'unanswered'>('newest');

  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const data = await apiService.getDoubts();
        setDoubts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoubts();
  }, []);

  const filteredDoubts = () => {
    switch (filter) {
      case 'popular':
        return [...doubts].sort((a, b) => b.votes - a.votes);
      case 'unanswered':
        return doubts.filter(d => d.answers.length === 0);
      default:
        return doubts;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Hidden on mobile */}
        <div className="hidden lg:block w-64 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Navigation</h4>
            <nav className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-indigo-600 bg-indigo-50 rounded-xl font-semibold transition-all">
                {ICONS.Home} Home
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                {ICONS.Doubts} All Doubts
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                {ICONS.Tags} Popular Tags
              </button>
            </nav>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-lg shadow-indigo-100">
            <h4 className="font-bold text-lg mb-2">Build your reputation</h4>
            <p className="text-indigo-100 text-sm mb-4">Answering doubts helps you gain points and credibility in the community.</p>
            <button className="w-full py-2 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
              Explore Doubts
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900">
              All Doubts
            </h1>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {(['newest', 'popular', 'unanswered'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                    filter === f 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(n => (
                <div key={n} className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse h-48"></div>
              ))}
            </div>
          ) : filteredDoubts().length > 0 ? (
            <div className="grid gap-6">
              {filteredDoubts().map((doubt) => (
                <DoubtCard key={doubt.id} doubt={doubt} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                {ICONS.Help}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No doubts found</h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">Be the first to ask a doubt or try adjusting your filters.</p>
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                Ask a Doubt
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:block w-72 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4">Trending Tags</h4>
            <div className="flex flex-wrap gap-2">
              {['react', 'node', 'mongodb', 'typescript', 'aws', 'docker', 'python'].map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4">Top Contributors</h4>
            <div className="space-y-4">
              {[
                { name: 'Sarah Chen', rep: 5420, avatar: 'https://picsum.photos/seed/sarah/100' },
                { name: 'Mike Ross', rep: 3105, avatar: 'https://picsum.photos/seed/mike/100' },
                { name: 'Elena Gilbert', rep: 2840, avatar: 'https://picsum.photos/seed/elena/100' }
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} className="w-8 h-8 rounded-full" alt="" />
                    <span className="text-sm font-medium text-slate-700">{user.name}</span>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{user.rep}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
