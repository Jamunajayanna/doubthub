
import React from 'react';
import { 
  Home, 
  MessageCircle, 
  Users, 
  Tag, 
  TrendingUp, 
  Award, 
  HelpCircle,
  PlusCircle,
  LogOut,
  User as UserIcon,
  Search,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export const COLORS = {
  primary: '#6366f1', // Indigo 500
  secondary: '#10b981', // Emerald 500
  accent: '#f59e0b', // Amber 500
  danger: '#ef4444', // Red 500
  background: '#f8fafc', // Slate 50
  card: '#ffffff'
};

export const ICONS = {
  Home: <Home size={20} />,
  Doubts: <MessageCircle size={20} />,
  Tags: <Tag size={20} />,
  Users: <Users size={20} />,
  Trending: <TrendingUp size={20} />,
  Reputation: <Award size={20} />,
  Ask: <PlusCircle size={20} />,
  Help: <HelpCircle size={20} />,
  Logout: <LogOut size={20} />,
  User: <UserIcon size={20} />,
  Search: <Search size={20} />,
  VoteUp: <ChevronUp size={24} />,
  VoteDown: <ChevronDown size={24} />,
  Options: <MoreVertical size={18} />,
  Accepted: <CheckCircle2 size={18} />,
  Clock: <Clock size={16} />,
  AI: <Sparkles size={18} />
};

export const TAG_COLORS: Record<string, string> = {
  react: 'bg-blue-100 text-blue-700',
  javascript: 'bg-yellow-100 text-yellow-700',
  typescript: 'bg-blue-100 text-blue-800',
  node: 'bg-green-100 text-green-700',
  mongodb: 'bg-emerald-100 text-emerald-800',
  css: 'bg-indigo-100 text-indigo-700',
  python: 'bg-blue-200 text-blue-900',
  java: 'bg-red-100 text-red-700'
};
