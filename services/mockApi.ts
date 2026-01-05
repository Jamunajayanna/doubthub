
import { Doubt, Answer, User, UserRole } from '../types';

const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: UserRole.STUDENT,
    avatar: 'https://picsum.photos/seed/alex/200',
    reputation: 1250,
    createdAt: new Date().toISOString()
  },
  {
    id: 'u2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    role: UserRole.ADMIN,
    avatar: 'https://picsum.photos/seed/sarah/200',
    reputation: 5400,
    createdAt: new Date().toISOString()
  }
];

const INITIAL_DOUBTS: Doubt[] = [
  {
    id: 'd1',
    title: 'How to handle state in React with many complex objects?',
    description: 'I am building a large dashboard and passing props is getting out of hand. Should I use Redux or Context API? What are the performance implications?',
    tags: ['react', 'javascript', 'state-management'],
    authorId: 'u1',
    authorName: 'Alex Johnson',
    authorAvatar: 'https://picsum.photos/seed/alex/200',
    votes: 42,
    userVote: null,
    answers: [
      {
        id: 'a1',
        content: 'For large dashboards, I highly recommend looking into Zustand. It is much simpler than Redux and very performant.',
        authorId: 'u2',
        authorName: 'Sarah Chen',
        votes: 12,
        userVote: null,
        comments: [],
        createdAt: new Date().toISOString()
      }
    ],
    views: 125,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

class MockApiService {
  private doubts: Doubt[] = [];
  private users: User[] = [];

  constructor() {
    const savedDoubts = localStorage.getItem('doubtflow_doubts');
    const savedUsers = localStorage.getItem('doubtflow_users');
    
    this.doubts = savedDoubts ? JSON.parse(savedDoubts) : INITIAL_DOUBTS;
    this.users = savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS;
    
    if (!savedDoubts) this.save();
  }

  private save() {
    localStorage.setItem('doubtflow_doubts', JSON.stringify(this.doubts));
    localStorage.setItem('doubtflow_users', JSON.stringify(this.users));
  }

  async getDoubts(): Promise<Doubt[]> {
    return [...this.doubts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getDoubt(id: string): Promise<Doubt | undefined> {
    return this.doubts.find(d => d.id === id);
  }

  async createDoubt(doubt: Omit<Doubt, 'id' | 'createdAt' | 'updatedAt' | 'votes' | 'views' | 'answers' | 'userVote'>): Promise<Doubt> {
    const newDoubt: Doubt = {
      ...doubt,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      votes: 0,
      views: 0,
      answers: [],
      userVote: null
    };
    this.doubts.push(newDoubt);
    this.save();
    return newDoubt;
  }

  async voteDoubt(id: string, type: 'up' | 'down'): Promise<Doubt> {
    const doubt = this.doubts.find(d => d.id === id);
    if (!doubt) throw new Error('Doubt not found');
    
    if (doubt.userVote === type) {
        doubt.votes += type === 'up' ? -1 : 1;
        doubt.userVote = null;
    } else {
        if (doubt.userVote) {
            doubt.votes += type === 'up' ? 2 : -2;
        } else {
            doubt.votes += type === 'up' ? 1 : -1;
        }
        doubt.userVote = type;
    }
    
    this.save();
    return doubt;
  }

  async addAnswer(doubtId: string, content: string, user: User): Promise<Answer> {
    const doubt = this.doubts.find(d => d.id === doubtId);
    if (!doubt) throw new Error('Doubt not found');
    
    const newAnswer: Answer = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      votes: 0,
      userVote: null,
      comments: [],
      createdAt: new Date().toISOString()
    };
    
    doubt.answers.push(newAnswer);
    this.save();
    return newAnswer;
  }
}

export const apiService = new MockApiService();
