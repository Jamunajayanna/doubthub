
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Doubt } from '../types';
import { doubtApi } from '../services/api';
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

  const fetchDoubt = async () => {
    if (!id) return;
    try {
      const res = await doubtApi.getOne(id);
      const d = res.data;
      const formatted = {
        ...d,
        id: d._id,
        authorName: d.author?.name,
        authorAvatar: d.author?.avatar,
        answers: d.answers.map((a: any) => ({
          ...a,
          id: a._id,
          authorName: a.author?.name,
          authorAvatar: a.author?.avatar
        }))
      };
      setDoubt(formatted);
    } catch (err) {
      console.error(err);
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoubt();
  }, [id]);

  const handleVote = async (type: 'up' | 'down') => {
    if (!doubt) return;
    try {
      await doubtApi.vote(doubt.id, type);
      fetchDoubt();
    } catch (err) {
      console.error("Vote failed");
    }
  };

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubt || !answerContent.trim()) return;
    
    try {
      await doubtApi.addAnswer(doubt.id, answerContent);
      setAnswerContent('');
      fetchDoubt();
    } catch (err) {
      console.error("Failed to post answer");
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
      alert("AI Service is currently busy.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-500">Loading doubt...</div>;
  if (!doubt) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight">{doubt.title}</h1>
        <div className="flex items-center gap-4 text-xs text-slate-500 border-b border-slate-100 pb-6">
          <span className="flex items-center gap-1">Asked {new Date(doubt.createdAt).toLocaleDateString()}</span>
          <span className="flex items-center gap-1">{doubt.views} views</span>
        </div>
      </div>

      <div className="flex gap-6 mb-12">
        <div className="flex flex-col items-center gap-2">
          <button onClick={() => handleVote('up')} className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400">{ICONS.VoteUp}</button>
          <span className="text-xl font-bold text-slate-800">{doubt.votes}</span>
          <button onClick={() => handleVote('down')} className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400">{ICONS.VoteDown}</button>
        </div>

        <div className="flex-grow">
          <div className="prose prose-slate max-w-none mb-8 text-slate-700 leading-relaxed text-lg">{doubt.description}</div>
          <div className="flex flex-wrap gap-2 mb-8">
            {doubt.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">#{tag}</span>
            ))}
          </div>
          <div className="flex justify-end">
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center gap-4">
              <img src={doubt.authorAvatar || `https://ui-avatars.com/api/?name=${doubt.authorName}`} alt="" className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Asked by</p>
                <p className="text-sm font-bold text-indigo-900">{doubt.authorName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4 text-indigo-300">
            {ICONS.AI} <span className="font-bold text-sm uppercase tracking-widest">DoubtFlow AI</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Get an instant AI response</h3>
          {aiAnswer && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-indigo-50 mb-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="prose prose-invert max-w-none text-sm whitespace-pre-wrap">{aiAnswer}</div>
            </div>
          )}
          <button onClick={handleAiAsk} disabled={aiLoading} className="inline-flex items-center gap-2 bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all">
            {aiLoading ? "Thinking..." : "Generate AI Answer"}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-slate-900 pb-4 border-b border-slate-100">{doubt.answers.length} Answers</h2>
        {doubt.answers.map(answer => (
          <div key={answer.id} className="flex gap-6 pb-8 border-b border-slate-100 last:border-0">
             <div className="flex flex-col items-center gap-2">
                <span className="font-bold text-slate-700">{answer.votes}</span>
             </div>
             <div className="flex-grow">
                <div className="text-slate-700 mb-6 leading-relaxed whitespace-pre-wrap">{answer.content}</div>
                <div className="flex justify-end">
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                    <img src={answer.authorAvatar || `https://ui-avatars.com/api/?name=${answer.authorName}`} className="w-8 h-8 rounded-lg" alt="" />
                    <p className="text-xs font-bold text-slate-900">{answer.authorName}</p>
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
            required rows={6}
            className="block w-full rounded-2xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 p-6 mb-6"
            placeholder="Help the community..."
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
          ></textarea>
          <button type="submit" className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition-all">Post Answer</button>
        </form>
      </div>
    </div>
  );
};

export default DoubtDetail;
