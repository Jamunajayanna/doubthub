
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Doubt, Answer } from '../types';
import { apiService } from '../services/mockApi';
import { getAiAnswer } from '../services/gemini';
import { useAuth } from '../App';
import { ICONS, TAG_COLORS } from '../constants';

const DoubtDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { auth } = useAuth();
  
  const [doubt, setDoubt] = useState<Doubt | null>(null);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoubt = async () => {
      if (!id) return;
      try {
        const data = await apiService.getDoubt(id);
        if (data) setDoubt(data);
        else navigate('/home');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoubt();
  }, [id, navigate]);

  const handleVote = async (type: 'up' | 'down') => {
    if (!doubt) return;
    const updated = await apiService.voteDoubt(doubt.id, type);
    setDoubt({ ...updated });
  };

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubt || !answerContent.trim() || !auth.user) return;
    
    try {
      await apiService.addAnswer(doubt.id, answerContent, auth.user);
      const updated = await apiService.getDoubt(doubt.id);
      if (updated) setDoubt(updated);
      setAnswerContent('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAiAsk = async () => {
    if (!doubt) return;
    setAiLoading(true);
    setAiAnswer(null);
    try {
      const result = await getAiAnswer(doubt.title, doubt.description);
      setAiAnswer(result);
    } catch (err) {
      alert("AI Service is currently busy. Try again later.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-500">Loading doubt details...</div>;
  if (!doubt) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight">{doubt.title}</h1>
        <div className="flex items-center gap-4 text-xs text-slate-500 border-b border-slate-100 pb-6">
          <span className="flex items-center gap-1"><span className="text-slate-400">Asked</span> {new Date(doubt.createdAt).toLocaleDateString()}</span>
          <span className="flex items-center gap-1"><span className="text-slate-400">Viewed</span> {doubt.views} times</span>
        </div>
      </div>

      <div className="flex gap-6 mb-12">
        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={() => handleVote('up')}
            className={`p-2 rounded-full hover:bg-slate-100 transition-colors ${doubt.userVote === 'up' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
          >
            {ICONS.VoteUp}
          </button>
          <span className="text-xl font-bold text-slate-800">{doubt.votes}</span>
          <button 
            onClick={() => handleVote('down')}
            className={`p-2 rounded-full hover:bg-slate-100 transition-colors ${doubt.userVote === 'down' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
          >
            {ICONS.VoteDown}
          </button>
        </div>

        <div className="flex-grow">
          <div className="prose prose-slate max-w-none mb-8 text-slate-700 leading-relaxed text-lg">
            {doubt.description}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {doubt.tags.map(tag => (
              <span key={tag} className={`px-3 py-1 rounded-full text-xs font-semibold ${TAG_COLORS[tag.toLowerCase()] || 'bg-slate-100 text-slate-600'}`}>
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex justify-end">
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center gap-4 max-w-xs">
              <img src={doubt.authorAvatar} alt="" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
              <div>
                <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Asked by</p>
                <p className="text-sm font-bold text-indigo-900">{doubt.authorName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Feature */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4 text-indigo-300">
            {ICONS.AI}
            <span className="font-bold text-sm uppercase tracking-widest">DoubtFlow AI Copilot</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Stuck? Get an instant AI-powered solution</h3>
          <p className="text-indigo-100/70 mb-6 max-w-lg">Our advanced Gemini AI can analyze your doubt and provide a high-quality explanation and code example instantly.</p>
          
          {aiAnswer ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-indigo-50 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="prose prose-invert max-w-none text-sm whitespace-pre-wrap">
                {aiAnswer}
              </div>
            </div>
          ) : null}

          <button 
            onClick={handleAiAsk}
            disabled={aiLoading}
            className="inline-flex items-center gap-2 bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all disabled:opacity-50"
          >
            {aiLoading ? (
               <><span className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-900 border-t-transparent"></span> Analyzing...</>
            ) : (
               <>{ICONS.AI} Generate AI Answer</>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-2xl font-bold text-slate-900">
            {doubt.answers.length} {doubt.answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
        </div>

        {doubt.answers.map(answer => (
          <div key={answer.id} className="flex gap-6 pb-8 border-b border-slate-100 last:border-0">
             <div className="flex flex-col items-center gap-2">
                <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">{ICONS.VoteUp}</button>
                <span className="font-bold text-slate-700">{answer.votes}</span>
                <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">{ICONS.VoteDown}</button>
                {answer.isAccepted && <div className="text-emerald-500 mt-2">{ICONS.Accepted}</div>}
             </div>
             <div className="flex-grow">
                <div className="prose prose-slate max-w-none text-slate-700 mb-6 leading-relaxed">
                  {answer.content}
                </div>
                <div className="flex justify-end">
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                    <img src={answer.authorAvatar || `https://ui-avatars.com/api/?name=${answer.authorName}`} className="w-8 h-8 rounded-lg" alt="" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{answer.authorName}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{new Date(answer.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Your Answer</h3>
        <form onSubmit={submitAnswer}>
          <textarea
            required
            rows={8}
            className="block w-full rounded-2xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent p-6 mb-6 text-slate-700 shadow-inner"
            placeholder="Help this person out! Write your answer here..."
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            Post Answer
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoubtDetail;
