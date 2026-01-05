
import React from 'react';
import { useAuth } from '../App';
import { ICONS } from '../constants';

const Profile: React.FC = () => {
  const { auth } = useAuth();
  
  const stats = [
    { label: 'Doubts Asked', value: 12, icon: ICONS.Doubts, color: 'indigo' },
    { label: 'Answers Given', value: 48, icon: ICONS.Ask, color: 'emerald' },
    { label: 'Reputation', value: '1,250', icon: ICONS.Reputation, color: 'amber' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
        <div className="h-48 bg-gradient-to-r from-indigo-500 to-indigo-700 relative">
          <div className="absolute -bottom-16 left-12">
            <img 
              src={auth.user?.avatar || `https://ui-avatars.com/api/?name=${auth.user?.name}&background=6366f1&color=fff&size=128`} 
              className="w-32 h-32 rounded-[2rem] border-4 border-white shadow-lg bg-white"
              alt={auth.user?.name}
            />
          </div>
        </div>
        
        <div className="pt-20 pb-12 px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2">{auth.user?.name}</h1>
              <p className="text-slate-500 font-medium flex items-center gap-2">
                {auth.user?.email} • Member since {new Date(auth.user?.createdAt || '').getFullYear()}
              </p>
            </div>
            <button className="px-8 py-3 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all">
              Edit Profile
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, i) => (
              <div key={i} className={`bg-${stat.color}-50 border border-${stat.color}-100 p-8 rounded-[2rem] flex items-center gap-6`}>
                <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-${stat.color}-600 shadow-sm`}>
                  {stat.icon}
                </div>
                <div>
                  <p className={`text-xs font-black text-${stat.color}-600 uppercase tracking-widest mb-1`}>{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { type: 'doubt', title: 'How to use Gemini API in React?', date: '2 days ago' },
                { type: 'answer', title: 'Best practices for Node.js architecture', date: '5 days ago' },
                { type: 'doubt', title: 'Understanding TypeScript generics', date: '1 week ago' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${item.type === 'doubt' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {item.type === 'doubt' ? ICONS.Doubts : ICONS.Ask}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.title}</p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{item.type} • {item.date}</p>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
