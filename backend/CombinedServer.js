
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || 'doubtflow_secret_key_123';

// --- DATABASE MODELS ---

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  reputation: { type: Number, default: 0 },
  avatar: { type: String, default: '' },
}, { timestamps: true });

const AnswerSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  votes: { type: Number, default: 0 },
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isAccepted: { type: Boolean, default: false },
}, { timestamps: true });

const DoubtSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  votes: { type: Number, default: 0 },
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  answers: [AnswerSchema],
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Doubt = mongoose.model('Doubt', DoubtSchema);

// --- AUTH MIDDLEWARE ---

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// --- AUTH ROUTES ---

app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    
    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, reputation: user.reputation } });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, reputation: user.reputation } });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- DOUBT ROUTES ---

app.get('/api/doubts', async (req, res) => {
  try {
    const doubts = await Doubt.find()
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(doubts);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.post('/api/doubts', auth, async (req, res) => {
  try {
    const newDoubt = new Doubt({
      ...req.body,
      author: req.user.id
    });
    const doubt = await newDoubt.save();
    res.json(doubt);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.get('/api/doubts/:id', async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('answers.author', 'name avatar');
    if (!doubt) return res.status(404).json({ msg: 'Doubt not found' });
    doubt.views += 1;
    await doubt.save();
    res.json(doubt);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.post('/api/doubts/:id/vote', auth, async (req, res) => {
  const { type } = req.body;
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ msg: 'Not found' });
    
    // Simple voting logic: incrementing
    doubt.votes += type === 'up' ? 1 : -1;
    await doubt.save();
    res.json(doubt);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.post('/api/doubts/:id/answers', auth, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ msg: 'Doubt not found' });
    
    const newAnswer = {
      content: req.body.content,
      author: req.user.id
    };
    
    doubt.answers.push(newAnswer);
    await doubt.save();
    
    // Reward contributor
    await User.findByIdAndUpdate(req.user.id, { $inc: { reputation: 10 } });
    
    res.json(doubt);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/doubtflow';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
