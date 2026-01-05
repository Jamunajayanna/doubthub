
# DoubtFlow - MERN Q&A Platform

A complete, production-ready full-stack application.

## 🛠 Local Setup Instructions

### 1. Database (MongoDB)
Ensure MongoDB is running locally at `mongodb://localhost:27017` or have a MongoDB Atlas connection string ready.

### 2. Backend (Express & Node)
1. Navigate to `/backend`.
2. Install: `npm install`.
3. Setup `.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/doubtflow
   JWT_SECRET=supersecretkey123
   ```
4. Run: `npm start`.

### 3. Frontend (React & Vite)
1. Navigate to the project root.
2. Install: `npm install`.
3. Setup `.env`:
   ```env
   VITE_API_KEY=your_gemini_api_key_from_google_ai_studio
   ```
4. Run: `npm run dev`.
5. Visit: `http://localhost:5173`.

## 📂 Architecture
- **Frontend**: React 19 + Tailwind CSS + Lucide Icons.
- **Backend**: Node.js + Express + Mongoose.
- **AI**: Google Gemini API for smart auto-answers.
- **Auth**: JWT-based secure session management.

## 🚀 Key Endpoints
- `POST /api/auth/register` - Create user
- `POST /api/auth/login` - User login
- `GET /api/doubts` - Fetch all doubts
- `POST /api/doubts` - Post new doubt
- `GET /api/doubts/:id` - Detailed view
- `POST /api/doubts/:id/vote` - Upvote/Downvote
