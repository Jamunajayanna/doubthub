
import React from 'react';
import { Link } from 'react-router-dom';
import { ICONS } from '../constants';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-indigo-100/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[50%] bg-emerald-100/40 rounded-full blur-3xl"></div>
      </div>

      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
              {ICONS.Doubts}
           </div>
           <span className="text-2xl font-black text-slate-900 tracking-tight">DoubtFlow</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Sign In</Link>
          <Link to="/signup" className="px-6 py-3 bg-white border border-slate-200 text-slate-900 text-sm font-bold rounded-2xl shadow-sm hover:bg-slate-50 transition-all">Get Started</Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest rounded-full mb-8 border border-indigo-100">
          🚀 Next-gen Learning Community
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 leading-tight tracking-tighter">
          Don't let <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">doubts</span><br />
          slow you down.
        </h1>
        
        <p className="text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed font-medium">
          DoubtFlow is the premier collaborative Q&A platform for the modern student. Ask questions, share insights, and leverage AI to master any subject.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link 
            to="/signup" 
            className="px-10 py-5 bg-indigo-600 text-white text-lg font-bold rounded-3xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all"
          >
            Create Free Account
          </Link>
          <button className="flex items-center gap-3 px-8 py-5 bg-white border border-slate-200 text-slate-700 text-lg font-bold rounded-3xl shadow-sm hover:bg-slate-50 transition-all group">
            {ICONS.Trending} View Doubts
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        <div className="mt-32 grid md:grid-cols-3 gap-12 w-full">
          {[
            { 
              title: "Community Driven", 
              desc: "Ask anything and get answers from thousands of students and mentors worldwide.", 
              icon: ICONS.Users,
              color: "indigo"
            },
            { 
              title: "AI Co-pilot", 
              desc: "Get instant, high-quality answers powered by the latest Gemini AI technology.", 
              icon: ICONS.AI,
              color: "emerald"
            },
            { 
              title: "Gain Reputation", 
              desc: "Build your profile, earn reputation points, and become a community leader.", 
              icon: ICONS.Reputation,
              color: "amber"
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50 text-left group hover:-translate-y-2 transition-all duration-500">
              <div className={`w-14 h-14 bg-${feature.color}-100 text-${feature.color}-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-${feature.color}-50 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Wave Footer Decor */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default Landing;
