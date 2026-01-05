
import React from 'react';
import { Link } from 'react-router-dom';
import { Doubt } from '../types';
import { ICONS, TAG_COLORS } from '../constants';

interface DoubtCardProps {
  doubt: Doubt;
}

const DoubtCard: React.FC<DoubtCardProps> = ({ doubt }) => {
  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow group">
      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-3 min-w-[60px]">
          <div className="flex flex-col items-center bg-slate-50 rounded-xl px-2 py-3 border border-slate-100 w-full">
            <span className="text-lg font-bold text-slate-800">{doubt.votes}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Votes</span>
          </div>
          <div className={`flex flex-col items-center rounded-xl px-2 py-3 w-full border ${doubt.answers.length > 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
            <span className={`text-lg font-bold ${doubt.answers.length > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
              {doubt.answers.length}
            </span>
            <span className={`text-[10px] uppercase font-bold ${doubt.answers.length > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>Answers</span>
          </div>
        </div>

        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <img 
              src={doubt.authorAvatar || `https://ui-avatars.com/api/?name=${doubt.authorName}`}
              alt={doubt.authorName}
              className="w-5 h-5 rounded-full"
            />
            <span className="text-xs font-medium text-slate-600">{doubt.authorName}</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              {ICONS.Clock} {timeAgo(doubt.createdAt)}
            </span>
          </div>
          
          <Link to={`/doubt/${doubt.id}`}>
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {doubt.title}
            </h3>
          </Link>
          
          <p className="text-slate-600 line-clamp-2 mb-4 text-sm leading-relaxed">
            {doubt.description}
          </p>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {doubt.tags.map(tag => (
                <span 
                  key={tag} 
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${TAG_COLORS[tag.toLowerCase()] || 'bg-slate-100 text-slate-600'}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-4 text-slate-400 text-xs">
              <span className="flex items-center gap-1">
                <span className="font-bold text-slate-600">{doubt.views}</span> Views
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubtCard;
