# Notesroom Frontend

A modern, full-featured note management and AI collaboration platform built with React, Vite, and Tailwind CSS. This frontend application provides users with a seamless experience for creating, managing, and sharing notes, alongside integrated AI chatbot support.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Architecture & Workflow](#architecture--workflow)
- [Component Documentation](#component-documentation)
- [API Integration](#api-integration)
- [Theme System](#theme-system)
- [Contributing](#contributing)

---

## 🎯 Overview

**Notesroom** is an intelligent note management application that combines:
- **User Authentication**: Secure registration, login, and email verification
- **Note Management**: Create, read, update, and delete notes with rich formatting support
- **AI Assistant**: Integrated chatbot for note enhancement and productivity assistance
- **Search Functionality**: Quickly find notes by keywords and metadata
- **User Profiles**: Manage user information and preferences
- **Dark Mode Support**: Toggle between light and dark themes for comfortable viewing
- **Mobile Responsive**: Fully optimized for desktop and mobile devices

---

## ✨ Features

### Authentication System
- **User Registration**: Create new accounts with email verification
- **Email Verification**: Verify user emails before account activation
- **Secure Login**: JWT-based authentication with token management
- **Google OAuth**: Social login integration for quick access
- **Session Management**: Persistent login with automatic token refresh

### Note Management
- **Create Notes**: Add new notes with title and content
- **Edit Notes**: Modify existing notes with real-time updates
- **Delete Notes**: Remove notes securely
- **Rich Text Support**: Markdown formatting with GitHub Flavored Markdown (GFM) support
- **Note Organization**: Categorize and manage notes efficiently

### AI Assistant
- **Floating Chatbot**: Always-accessible AI assistant
- **Note Enhancement**: Get AI suggestions for improving note content
- **Real-time Chat**: Interactive conversation with AI
- **Context Awareness**: Chatbot understands note context

### Search & Discovery
- **Full-text Search**: Search through all your notes
- **Advanced Filtering**: Filter by date, tags, and other metadata
- **Quick Navigation**: Fast access to frequently used notes

### User Experience
- **Dark/Light Theme**: User preference-based theme switching
- **Mobile Navigation**: Optimized navigation for mobile devices
- **Responsive Design**: Adapts perfectly to all screen sizes
- **Intuitive UI**: Clean and user-friendly interface

---

## 🛠 Tech Stack

### Frontend Framework
- **React 19.2.5**: Modern UI library with hooks
- **Vite 8.0.10**: Lightning-fast build tool and dev server
- **React Router 7.14.2**: Client-side routing and navigation

### Styling & UI
- **Tailwind CSS 4.2.4**: Utility-first CSS framework
- **React Markdown 10.1.0**: Markdown rendering support
- **Remark GFM 4.0.1**: GitHub Flavored Markdown support

### Authentication & State
- **JWT Decode 4.0.0**: JWT token parsing
- **React OAuth/Google 0.13.5**: Google OAuth integration
- **React Context API**: Global state management

### HTTP Client
- **Axios 1.16.0**: Promise-based HTTP client for API calls

### Development Tools
- **ESLint 10.2.1**: Code quality and linting
- **Node.js & npm**: Dependency management and package management

---

## 📁 Project Structure

```
notesroom-frontend/
├── src/
│   ├── components/
│   │   ├── ChatModal.jsx              # AI chatbot modal component
│   │   ├── Dashboard.jsx              # Main dashboard with notes list
│   │   ├── FloatingChatbot.jsx        # Floating AI assistant widget
│   │   ├── Login.jsx                  # User login form
│   │   ├── Register.jsx               # User registration form
│   │   ├── VerifyEmail.jsx            # Email verification page
│   │   ├── Profile.jsx                # User profile management
│   │   ├── Search.jsx                 # Search functionality
│   │   ├── MobileNavbar.jsx           # Mobile navigation bar
│   │   ├── ThemeToggle.jsx            # Dark/light theme switcher
│   │   ├── UploadForm.jsx             # Note creation/upload form
│   │   └── PdfModal.jsx               # PDF export modal
│   ├── context/
│   │   └── ThemeContext.jsx           # Global theme state management
│   ├── services/
│   │   └── api.js                     # Axios API configuration and requests
│   ├── assets/                        # Static assets (images, icons, etc.)
│   ├── App.jsx                        # Root application component
│   ├── App.css                        # Global app styles
│   ├── index.css                      # Global CSS styles
│   └── main.jsx                       # React entry point
├── public/
│   └── _redirects                     # Netlify routing configuration
├── vite.config.js                     # Vite configuration
├── eslint.config.js                   # ESLint configuration
├── package.json                       # Project dependencies and scripts
├── index.html                         # HTML entry point
└── README.md                          # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)
- Backend API server running (see backend documentation)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/notesroom-frontend.git
   cd notesroom-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

---

## 📝 Available Scripts

### `npm run dev`
Starts the development server with hot module replacement (HMR).
- Access at: `http://localhost:5173`
- Features live code reloading

### `npm run build`
Creates an optimized production build.
- Output: `dist/` directory
- Ready for deployment

### `npm run lint`
Runs ESLint to check code quality and identify issues.
- Helps maintain code standards

### `npm run preview`
Previews the production build locally.
- Useful for testing before deployment

---

## 🏗 Architecture & Workflow

### End-to-End User Journey

#### 1. **Authentication Flow**
```
User → Registration/Login → Email Verification → JWT Token → Authenticated Session
```
- New users register with email and password
- Email verification link sent for account activation
- Existing users login with credentials
- JWT tokens stored in localStorage for persistent sessions
- Google OAuth option for quick sign-up

#### 2. **Dashboard & Note Management**
```
Dashboard → Create/View/Edit/Delete Notes → Auto-save to Backend
```
- Users access dashboard after login
- Can create new notes with title and content
- Edit existing notes with live updates
- Delete notes with confirmation
- All changes synced with backend

#### 3. **Search & Discovery**
```
Search Page → Query Processing → Filtered Results → Note Selection
```
- Users search for notes by keywords
- Advanced filtering options available
- Results displayed in organized list
- Click to view or edit notes

#### 4. **AI Assistance**
```
User → Floating Chatbot → AI Query → Response → Integration with Notes
```
- Access AI assistant from any page
- Chat interface for queries
- AI can help enhance notes
- Context-aware suggestions

#### 5. **User Profile Management**
```
Profile Page → Update Info → Change Settings → Save Preferences
```
- Users manage their account information
- Update profile details
- Manage notification preferences
- View account statistics

---

## 🧩 Component Documentation

### Authentication Components

#### **Login.jsx**
- User login form with email and password
- Google OAuth integration
- Form validation and error handling
- Password strength indicators

#### **Register.jsx**
- New account creation form
- Email and password validation
- Terms and conditions acceptance
- Redirect to email verification

#### **VerifyEmail.jsx**
- Email verification page
- Token-based verification
- Resend verification email option
- Auto-redirect to dashboard on success

### Main App Components

#### **Dashboard.jsx**
- Main application hub
- Displays user's notes in grid/list view
- Create new note button
- Note management options
- Search and filter integration

#### **UploadForm.jsx**
- Note creation/editing interface
- Rich text editor with Markdown support
- Save/Cancel options
- Autosave functionality

#### **Search.jsx**
- Advanced search interface
- Filter by date range, tags, categories
- Real-time search results
- Quick note access

### User Interface Components

#### **MobileNavbar.jsx**
- Mobile-specific navigation
- Quick access menu
- Profile and logout options
- Theme toggle

#### **ThemeToggle.jsx**
- Dark/Light mode switcher
- User preference persistence
- Icon-based UI

#### **FloatingChatbot.jsx**
- Always-accessible AI assistant
- Floating widget on screen
- Quick access from any page
- Minimizable interface

#### **ChatModal.jsx**
- Modal dialog for chat interface
- Message history display
- Input field for user queries
- Real-time response streaming

#### **PdfModal.jsx**
- Export notes to PDF
- Format customization
- Download management

### Profile & Context

#### **Profile.jsx**
- User account management
- Update profile information
- Change password
- Account settings

#### **ThemeContext.jsx**
- Global theme state management
- Light/Dark mode configuration
- User preference persistence
- Context provider for entire app

---

## 🔌 API Integration

### Service Configuration

The `services/api.js` file handles all API communication:

```javascript
// Base configuration
- Base URL: Configured via VITE_API_BASE_URL
- JWT Authentication: Auto-included in request headers
- Error Handling: Centralized error response management
- Interceptors: Auto-refresh tokens on expiration
```

### API Endpoints Used

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/verify-email` - Email verification
- `POST /auth/refresh` - Token refresh

#### Notes Management
- `GET /notes` - Fetch all user notes
- `POST /notes` - Create new note
- `GET /notes/:id` - Fetch specific note
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note

#### Search
- `GET /notes/search?q=keyword` - Search notes

#### AI Assistant
- `POST /ai/chat` - Send message to AI
- `GET /ai/suggestions` - Get AI suggestions

#### User Profile
- `GET /user/profile` - Fetch user profile
- `PUT /user/profile` - Update user profile
- `PUT /user/change-password` - Change password

---

## 🎨 Theme System

### Implementation
- **Context API**: Global theme state management
- **Local Storage**: User preference persistence
- **Tailwind Dark Mode**: CSS-based dark theme
- **Toggle Component**: Easy theme switching

### Usage
```javascript
// Access theme context
import { useContext } from 'react';
import { ThemeContext } from './context/ThemeContext';

const MyComponent = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  // Use isDark for conditional rendering
};
```

---

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTPS Ready**: Configured for secure connections
- **XSS Protection**: React's built-in XSS prevention
- **CSRF Protection**: Backend-managed CSRF tokens
- **Secure Storage**: JWT tokens in localStorage (production: secure HttpOnly cookies recommended)
- **Email Verification**: Prevents unauthorized accounts

---

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Tailored for sm, md, lg, xl screens
- **Touch Friendly**: Large tap targets for mobile
- **Adaptive Layout**: Changes layout based on screen size
- **Mobile Navigation**: Dedicated mobile navbar

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options

#### Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist/`
4. Configure environment variables in settings
5. Deploy automatically on push

#### Vercel
1. Import project from GitHub
2. Set environment variables
3. Click Deploy
4. Automatic deployments on push

#### Traditional Hosting
1. Build the project: `npm run build`
2. Upload `dist/` folder to server
3. Configure server for SPA routing (redirect to index.html)
4. Set environment variables on server

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- Use ESLint for code quality
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 📞 Support & Contact

For support, questions, or feedback:
- Open an issue on GitHub
- Email: notesroomofflice@gmail.com
- Documentation: See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 🗺 Roadmap

### Upcoming Features
- [ ] Collaborative note editing
- [ ] Advanced markdown editor with live preview
- [ ] Note tagging and categorization system
- [ ] Note sharing and permissions
- [ ] Sync across devices
- [ ] Offline mode support
- [ ] Browser extension
- [ ] Mobile app (React Native)
- [ ] Advanced AI features (summarization, translation)
- [ ] Integration with external services

---

**Happy Note Taking! 🎉**
