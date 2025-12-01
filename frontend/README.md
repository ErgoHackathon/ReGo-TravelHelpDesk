# ReGo Frontend

Frontend application for ReGo Travel Management System built with React and Material-UI.

## 📋 Prerequisites

- Node.js 20.x or higher
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

```bash
# Copy the example env file
cp .env.example .env

# Edit .env if needed
nano .env
```

### 3. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html             # HTML template
│   ├── manifest.json          # PWA manifest
│   └── favicon.ico            # App icon
├── src/
│   ├── components/
│   │   ├── common/            # Reusable components
│   │   ├── layout/            # Layout components
│   │   └── features/          # Feature-specific components
│   ├── pages/                 # Page components
│   ├── features/              # Redux slices
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API services
│   │   └── api.js             # Axios instance
│   ├── routes/
│   │   └── AppRoutes.jsx      # Route configuration
│   ├── store/
│   │   └── store.js           # Redux store
│   ├── utils/                 # Utility functions
│   ├── styles/
│   │   └── globalStyles.css   # Global CSS
│   ├── App.js                 # Root component
│   └── index.js               # Entry point
├── .env                       # Environment variables
├── .env.example               # Example environment file
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🔧 Available Scripts

```bash
npm start        # Start development server
npm build        # Build for production
npm test         # Run tests
npm run lint     # Run ESLint
npm run lint:fix # Fix ESLint errors
npm run format   # Format code with Prettier
```

## 🎨 Tech Stack

- **React 18** - UI library
- **Material-UI (MUI) 5** - Component library
- **Redux Toolkit** - State management
- **React Router 6** - Routing
- **React Query** - Server state management
- **Axios** - HTTP client
- **Formik + Yup** - Form handling and validation
- **Chart.js** - Data visualization
- **date-fns** - Date utilities

## 🔐 Environment Variables

See `.env.example` for all available environment variables.

Key variables:

- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_ENV` - Environment (development/production)

## 🧪 Testing

```bash
# Run tests in interactive watch mode
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📦 Building for Production

```bash
# Create production build
npm run build

# The build folder will contain the optimized production build
```

## 🎨 Styling

This project uses Material-UI for styling. The theme is configured in `App.js`.

Custom global styles can be added to `src/styles/globalStyles.css`.

## 🔄 State Management

- **Redux Toolkit** for global state
- **React Query** for server state (API data)
- **React Context** for theme/locale (optional)

## 📝 Code Style

- ESLint for linting
- Prettier for formatting
- Run `npm run lint:fix` before committing

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Change port in package.json or use:
PORT=3001 npm start
```

### Dependencies Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Development Workflow

1. Create a feature branch
2. Make changes
3. Test locally
4. Run linter: `npm run lint:fix`
5. Commit and push
6. Create PR

## 📚 Component Structure

Components are organized by:

- **common/** - Buttons, Inputs, Cards, etc.
- **layout/** - Header, Sidebar, Footer
- **features/** - Feature-specific components

Each component should have:

- Component file (.jsx)
- Styles (if using styled-components)
- Tests (.test.jsx)

## 🚀 Next Steps

Stage 2 will add:

- Login page
- Registration page
- Protected routes
- Authentication state management

## 👥 Team

- Frontend Lead: [Name]
- Contributors: [Names]

## 📄 License

MIT