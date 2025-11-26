██████╗ ███████╗ ████████╗ ███████╗
██╔══██╗██╔════╝██╔══════╝██ ██
██████╔╝█████╗ ██║ ████╗██ ██
██╔══██╗██╔══╝ ██║ ██╔╝██ ██
██║ ██║███████╗ ╚██████╗ ███████╗
╚═╝ ╚═╝╚══════╝ ╚════╝ ╚══════╝
AI-Powered Travel Platform

✈️ ReGo – AI-Powered Corporate Travel Management System
Making every journey smoother, faster, and stress-free.
ReGo exists to remove friction, reduce stress, and help people travel with peace of mind.

**🚀 About ReGo**
ReGo is an intelligent travel automation system designed to simplify corporate travel from request → approval → booking → reimbursement with the power of AI and OCR.

It replaces email chains, manual approvals, lost documents, and confusion with a single seamless platform.

**⭐ “Because your journey matters, not just the destination.”**

**🌟 Key Features**

🌐 Centralized Travel Portal

🤖 AI Recommendations (Low/Mid/High cost options)

🔎 Document OCR Verification

🧾 Smart Expense Management

🛫 Multi-level Approvals (Manager → AVP → SVP → CHRO)

🔔 Notifications via Email/SMS

📊 Real-time Transparency

**🧠 Tech Stack**

| Component | Technology                  | Why                                      |
| --------- | --------------------------- | ---------------------------------------- |
| Frontend  | React.js + Material-UI      | Modern, component-based, beautiful UI    |
| Backend   | Node.js + Express           | JavaScript everywhere, easy to learn     |
| Database  | PostgreSQL                  | Robust, supports JSONB for flexible data |
| ORM       | Prisma                      | Type-safe, easy migrations               |
| Cloud     | Azure                       | Free credits, all-in-one platform        |
| OCR       | Azure Document Intelligence | Best-in-class document processing        |
| State     | Redux Toolkit               | Predictable state management             |
| Auth      | JWT                         | Stateless, scalable authentication       |

**🏗️ Project Structure**
ReGo-AI-Travel-Platform/
rego-travel-system/
├── backend/ # Node.js + Express API
│ ├── prisma/ # Database schema
│ ├── src/
│ │ ├── config/ # Configuration files
│ │ ├── controllers/ # Request handlers
│ │ ├── middleware/ # Express middleware
│ │ ├── routes/ # API routes
│ │ ├── services/ # Business logic
│ │ └── utils/ # Helper functions
│ ├── .env.example # Environment variables template
│ ├── package.json # Dependencies
│ ├── server.js # Entry point
│ └── README.md # Backend documentation
│
├── frontend/ # React application
│ ├── public/ # Static files
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── pages/ # Page components
│ │ ├── features/ # Redux slices
│ │ ├── services/ # API services
│ │ ├── routes/ # Route configuration
│ │ ├── store/ # Redux store
│ │ └── utils/ # Helper functions
│ ├── .env.example # Environment variables template
│ ├── package.json # Dependencies
│ └── README.md # Frontend documentation
│
└── README.md # This file

🚀 Quick Start
Prerequisites

Node.js 20.x or higher
PostgreSQL 15.x or higher
npm or yarn
Git

1. Clone Repository

bashgit clone <your-repo-url>
cd rego-travel-system

2. Backend Setup

# Navigate to backend directory

cd backend

# Install dependencies

npm install

# Create environment file

cp .env.example .env

# Edit .env and add your database credentials

nano .env

# Create PostgreSQL database

createdb rego_db

# Generate Prisma Client

npm run prisma:generate

# Run database migrations

npm run prisma:migrate

# Start development server

npm run dev
Backend will run at http://localhost:8080

3. Frontend Setup

# Navigate to frontend directory (from project root)

cd frontend

# Install dependencies

npm install

# Create environment file

cp .env.example .env

# Start development server

npm start

Frontend will open at http://localhost:3000

🧪 Testing the Setup
Backend Health Check

# In a new terminal

curl http://localhost:8080/health

# Expected response:

# {"status":"OK","message":"ReGo API is running",...}

Frontend Check
Open browser to http://localhost:3000 - You should see the ReGo welcome page.

📚 Technology Stack
Backend

Node.js - Runtime environment
Express.js - Web framework
PostgreSQL - Database
Prisma - ORM
JWT - Authentication
Azure Services - Cloud infrastructure

Frontend

React 18 - UI library
Material-UI - Component library
Redux Toolkit - State management
React Router - Routing
Axios - HTTP client
Formik + Yup - Forms and validation

🗄️ Database Schema
The application uses PostgreSQL with the following main tables:

users - User accounts and roles
travel_requests - Travel request records
approvals - Multi-level approval workflow
documents - Uploaded documents with OCR data
bookings - Flight, hotel, and other bookings
expenses - Expense claims and reimbursements
notifications - User notifications
ai_recommendations - AI-generated travel suggestions

See backend/prisma/schema.prisma for complete schema.
🔐 Environment Variables
Backend (.env)
bash# Database
DATABASE_URL=postgresql://user:password@localhost:5432/rego_db

# JWT

JWT_SECRET=secret-key
JWT_EXPIRE=15m

# Azure (required for production features)

AZURE_STORAGE_ACCOUNT_NAME=
AZURE_STORAGE_ACCOUNT_KEY=
AZURE_DOCUMENT_INTELLIGENCE_KEY=
Frontend (.env)
bashREACT_APP_API_URL=http://localhost:8080/api/v1
REACT_APP_ENV=development
📋 Development Stages
✅ Stage 1: Foundation (COMPLETED)

Project structure
Backend setup
Frontend setup
Database schema
Basic configuration

Stage 2: Authentication (In Progress)

User registration
Login/logout
JWT authentication
Protected routes
User profile

Stage 3: Travel Requests

Create travel request
Upload documents
OCR processing
Request list/details

Stage 4: Approval Workflow

Multi-level approvals
Approval dashboard
Notifications
Comments system

Stage 5: AI & Bookings

AI flight recommendations
AI hotel suggestions
Booking management
Travel desk portal

Stage 6: Expenses

Expense submission
Receipt upload
Approval workflow
Reimbursement processing

🧪 Running Tests
Backend Tests
bashcd backend
npm test
Frontend Tests
bashcd frontend
npm test
📦 Building for Production
Backend
bashcd backend
npm start
Frontend
bashcd frontend
npm run build

# The build folder will contain optimized production files

🚀 Deployment
See individual README files in backend/ and frontend/ for deployment instructions.
Recommended platforms:

Backend: Azure App Service, Heroku, Railway
Frontend: Vercel, Netlify, Azure Static Web Apps
Database: Azure PostgreSQL, AWS RDS

👥 Team Structure

Backend Lead - API development, database, integrations
Frontend Lead - UI/UX, component development
Full Stack Dev 1 - Travel request module
Full Stack Dev 2 - AI & expense module
QA Engineer - Testing, bug tracking

🐛 Troubleshooting
Database Connection Issues
bash# Check if PostgreSQL is running
sudo service postgresql status

# Start PostgreSQL

sudo service postgresql start
Port Already in Use
bash# Backend (port 8080)
lsof -i :8080
kill -9 <PID>

# Frontend (port 3000)

lsof -i :3000
kill -9 <PID>
Node Modules Issues
bash# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend

cd frontend
rm -rf node_modules package-lock.json
npm install

📖 Documentation
Backend API Documentation
Frontend Documentation
Database Schema

🤝 Contributing

Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

## 🏆 What Makes ReGo Special

1. **AI-Powered OCR** - Automatic document verification
2. **Smart Recommendations** - AI suggests best flight/hotel options
3. **Complete Transparency** - Real-time status for everyone
4. **Zero Email Chains** - All approvals in one place
5. **Fast Reimbursements** - Digital process cuts wait time
6. **Anomaly Detection** - AI flags suspicious expenses

**🎯 Vision & Mission**
“ReGo is where technology meets empathy — helping people travel without stress.”

### Useful Commands Quick Reference

```bash
# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm start

# Run tests
npm test

# Check git status
git status

# Create new branch
git checkout -b feature/your-feature

# Database commands
psql -U postgres -d rego_db
```
