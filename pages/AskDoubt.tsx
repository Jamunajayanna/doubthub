
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doubtApi } from '../services/api';
import { ICONS } from '../constants';

const AskDoubt: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await doubtApi.create({ title, description, tags });
      navigate(`/doubt/${res.data._id}`);
    } catch (err) {
      alert('Failed to post doubt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Ask a Public Doubt</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Title</label>
            <input
              required type="text"
              className="block w-full px-4 py-3 rounded-xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500"
              placeholder="What's your doubt?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Description</label>
            <textarea
              required rows={8}
              className="block w-full px-4 py-4 rounded-xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              placeholder="Provide more context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Tags (Enter to add)</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map(t => <span key={t} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg">#{t}</span>)}
            </div>
            <input
              type="text" className="block w-full px-4 py-3 rounded-xl bg-slate-50 border-slate-200"
              value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag}
            />
          </div>
        </div>
        <div className="mt-10 pt-6 flex justify-end">
          <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all">
            {loading ? 'Posting...' : 'Post Your Doubt'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AskDoubt;
