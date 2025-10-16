# Smart Task Planner

> AI-powered goal breakdown and task planning application built with MERN stack (MongoDB, Express.js, React.js, Node.js) and Google Gemini AI.

## 🎯 Overview

Smart Task Planner helps users break down complex goals into actionable tasks with intelligent timelines. Using AI reasoning from Google Gemini, it analyzes your objectives and creates structured task plans with dependencies and realistic deadlines.

## ✨ Features

- **AI-Powered Task Generation**: Leverages Google Gemini AI to intelligently break down goals
- **Smart Timeline Planning**: Automatically schedules tasks with dependencies and realistic timeframes
- **Interactive Dashboard**: Clean, modern UI for creating and managing plans
- **Task Dependencies**: Understands and manages task relationships
- **Export & Share**: Export plans or share them with others
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Status**: Track task progress with visual indicators

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **Google Gemini AI** - LLM for task generation
- **Zod** - Input validation

### Frontend
- **React.js** - UI framework
- **React Router** - Navigation
- **Axios** - API communication
- **Lucide React** - Icons
- **date-fns** - Date utilities

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Google Gemini API Key** (from Google AI Studio)
- **Git** (for cloning the repository)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd smart_task_planner
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
# MONGODB_URI=mongodb://localhost:27017/smart_task_planner
# GEMINI_API_KEY=your_gemini_api_key_here
# PORT=5000
# CORS_ORIGIN=http://localhost:3000
```

### 3. Frontend Setup

```bash
# Navigate to client directory (from project root)
cd client

# Install dependencies
npm install
```

### 4. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key and add it to your `.env` file

### 5. Start MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas**
- Create a cluster at [MongoDB Atlas](https://cloud.mongodb.com)
- Get connection string and update `MONGODB_URI` in `.env`

### 6. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📖 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Health Check
```http
GET /health
```

#### Generate Plan
```http
POST /plans/generate
Content-Type: application/json

{
  "goal": "Launch a product in 2 weeks",
  "horizonDays": 14,
  "startDate": "2024-01-01T00:00:00.000Z"
}
```

#### Get All Plans
```http
GET /plans
```

#### Get Plan by ID
```http
GET /plans/:id
```

#### Update Plan
```http
PUT /plans/:id
Content-Type: application/json

{
  "goal": "Updated goal",
  "tasks": [...]
}
```

#### Delete Plan
```http
DELETE /plans/:id
```

## 🏗 Project Structure

```
smart_task_planner/
├── server/                 # Backend (Node.js/Express)
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── db/            # Database connection
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic (Gemini AI)
│   │   ├── utils/         # Helper functions
│   │   └── index.js       # Entry point
│   ├── package.json
│   └── .env.example
├── client/                # Frontend (React)
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API calls
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
└── README.md
```

## 🎮 Usage Guide

### 1. Creating a Plan

1. Navigate to the home page
2. Enter your goal in the text area (e.g., "Launch a mobile app in 30 days")
3. Set your timeline (days) and start date
4. Click "Generate Smart Plan"
5. AI will analyze your goal and create actionable tasks

### 2. Viewing Plans

1. Click "View Plans" in the navigation
2. Browse your created plans
3. Click "View" to see detailed task breakdown
4. Use export/share features as needed

### 3. Managing Tasks

- Tasks are automatically scheduled with dependencies
- Visual indicators show task status (pending, in-progress, completed)
- Dependencies are clearly marked between tasks

## 🧪 Testing

### Backend Testing
```bash
cd server

# Test health endpoint
curl http://localhost:5000/health

# Test plan generation
curl -X POST http://localhost:5000/api/plans/generate \
  -H "Content-Type: application/json" \
  -d '{"goal":"Test goal","horizonDays":7}'
```

### Frontend Testing
```bash
cd client
npm test
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/smart_task_planner

# AI Service
GEMINI_API_KEY=your_gemini_api_key_here

# Server
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (optional .env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Backend Deployment (e.g., Heroku, Railway)

1. Set environment variables in your hosting platform
2. Ensure MongoDB connection string is configured
3. Deploy using your preferred method

### Frontend Deployment (e.g., Vercel, Netlify)

1. Update API URL in environment variables
2. Build the project: `npm run build`
3. Deploy the build folder

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string format
   - Verify network connectivity for Atlas

2. **Gemini API Error**
   - Verify API key is correct
   - Check API quota/limits
   - Ensure internet connectivity

3. **CORS Issues**
   - Verify CORS_ORIGIN in backend .env
   - Check if frontend URL matches CORS setting

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### Debug Mode

Enable debug logging:
```bash
# Backend
DEBUG=* npm run dev

# View browser console for frontend issues
```

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for intelligent task generation
- [MongoDB](https://www.mongodb.com/) for database solutions
- [React](https://reactjs.org/) for the frontend framework
- [Express.js](https://expressjs.com/) for the backend framework

---

**Built with ❤️ for efficient project planning and task management**
