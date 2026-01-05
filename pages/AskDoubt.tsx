
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { apiService } from '../services/mockApi';
import { ICONS } from '../constants';

const AskDoubt: React.FC = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.user) return;
    setLoading(true);

    try {
      const newDoubt = await apiService.createDoubt({
        title,
        description,
        tags,
        authorId: auth.user.id,
        authorName: auth.user.name,
        authorAvatar: auth.user.avatar,
      });
      navigate(`/doubt/${newDoubt.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to post doubt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Ask a Public Doubt</h1>
        <p className="text-slate-500 max-w-xl mx-auto">Get help from a community of expert developers and students. Be specific and clear to get the best answers.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Title</label>
                <p className="text-xs text-slate-400 mb-3 font-medium">Be specific and imagine you're asking a question to another person.</p>
                <input
                  required
                  type="text"
                  placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                  className="block w-full px-4 py-3 rounded-xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Description</label>
                <p className="text-xs text-slate-400 mb-3 font-medium">Include all the information someone would need to answer your question.</p>
                <textarea
                  required
                  rows={10}
                  className="block w-full px-4 py-4 rounded-xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-sm"
                  placeholder="Describe your problem in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Tags</label>
                <p className="text-xs text-slate-400 mb-3 font-medium">Add up to 5 tags to describe what your doubt is about.</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-lg group">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">&times;</button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="e.g. react, nodejs, sql (Press Enter to add)"
                  className="block w-full px-4 py-3 rounded-xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                />
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Discard Draft
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? 'Posting...' : 'Post Your Doubt'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">{ICONS.Help}</div>
              Asking Tips
            </h3>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex gap-3">
                <span className="font-bold text-indigo-600">1.</span>
                <span>Summarize the problem in the title.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-indigo-600">2.</span>
                <span>Describe what you've tried.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-indigo-600">3.</span>
                <span>Include minimal reproducible code.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-indigo-600">4.</span>
                <span>Check for existing answers first.</span>
              </li>
            </ul>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
            <h3 className="font-bold text-emerald-900 mb-2">Community Guidelines</h3>
            <p className="text-sm text-emerald-700 leading-relaxed">
              Be respectful and helpful. We're all here to learn and grow together. Good questions attract good answers!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskDoubt;
