# Movie Frontend Application

A modern, responsive movie streaming web application built with React and Vite, featuring a beautiful dark theme and seamless integration with a Node.js backend.

## 🚀 Features

- **Modern UI/UX**: Beautiful dark theme with gradient accents and smooth animations
- **Responsive Design**: Fully responsive layout that works on all devices
- **User Authentication**: Secure login and registration system
- **Movie Management**: Browse, search, and manage your movie collection
- **Watchlist**: Add/remove movies to your personal watchlist
- **Video Streaming**: Watch movies directly in the browser
- **Profile Management**: Edit your profile information
- **Real-time Search**: Instant search functionality across movies

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: CSS3 with custom design system
- **State Management**: React Context API
- **Routing**: React Router DOM
- **HTTP Client**: Fetch API with custom utilities
- **Authentication**: JWT tokens
- **Responsive Design**: CSS Grid, Flexbox, Media Queries

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LoadingSpinner.jsx
│   ├── MovieCard.jsx
│   └── Navbar.jsx
├── context/            # React Context providers
│   ├── AuthContext.jsx
│   └── WatchlistContext.jsx
├── hooks/              # Custom React hooks
│   └── useApi.js
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── MovieDetail.jsx
│   ├── Profile.jsx
│   ├── Register.jsx
│   └── Watchlist.jsx
├── styles/             # CSS stylesheets
│   ├── App.css
│   ├── index.css
│   └── component-specific CSS files
├── utils/              # Utility functions
│   └── api.js
├── App.jsx             # Main application component
└── main.jsx           # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://movies-backend-zijv.onrender.com
```

### Backend Integration

The frontend is configured to work with the movie backend API. Ensure your backend is running and accessible at the configured URL.

## 🎨 Design System

### Color Palette

- **Primary**: `#667eea` to `#764ba2` (gradient)
- **Background**: `#0f0f23` to `#1a1a2e` (gradient)
- **Text**: `#ffffff` (primary), `#a0a0a0` (secondary)
- **Accents**: `#28a745` (success), `#dc3545` (error)

### Typography

- **Headings**: Bold, gradient text with custom fonts
- **Body**: Clean, readable text with proper contrast
- **Responsive**: Scales appropriately across device sizes

### Components

- **Cards**: Glassmorphism effect with backdrop blur
- **Buttons**: Gradient backgrounds with hover animations
- **Forms**: Clean inputs with focus states
- **Navigation**: Fixed header with smooth transitions

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop**: Full-featured experience with grid layouts
- **Tablet**: Adaptive layouts with touch-friendly interactions
- **Mobile**: Mobile-first design with optimized navigation

## 🔐 Authentication

- JWT-based authentication
- Secure token storage
- Protected routes
- Automatic token refresh
- User session management

## 🎬 Movie Features

- **Browse**: View all available movies
- **Search**: Find movies by title, description, or interpreter
- **Details**: Comprehensive movie information
- **Watchlist**: Personal movie collection
- **Streaming**: In-browser video playback

## 🧪 Testing

The application includes:

- ESLint configuration for code quality
- Responsive design testing
- Cross-browser compatibility
- Accessibility features

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag the `dist` folder to Netlify
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the documentation
- Review existing issues
- Create a new issue with detailed information

## 🔮 Future Enhancements

- [ ] Advanced search filters
- [ ] Movie ratings and reviews
- [ ] Social features (sharing, comments)
- [ ] Offline support
- [ ] Progressive Web App (PWA)
- [ ] Dark/Light theme toggle
- [ ] Internationalization (i18n)
- [ ] Advanced analytics
- [ ] Admin dashboard
- [ ] Mobile app versions

---

Built with ❤️ using React and Vite

