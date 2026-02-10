# FEMS - React Application with Clerk Authentication

A modern React application built with Vite, Tailwind CSS, React Router, and Clerk authentication.

## 🚀 Features

- ⚡ **Vite** - Lightning-fast development server
- ⚛️ **React 19** - Latest React with modern features
- 🔐 **Clerk Authentication** - Complete user management
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🛣️ **React Router v7** - Client-side routing
- 📦 **Axios** - HTTP client for API requests
- 🎯 **Lucide React** - Beautiful icon library

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Clerk account (free tier available at [clerk.com](https://clerk.com))

## 🏁 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Clerk Authentication

#### a. Create a Clerk Account
1. Go to [clerk.com](https://clerk.com) and sign up
2. Create a new application in the Clerk dashboard
3. Choose your authentication methods (Email, Google, GitHub, etc.)

#### b. Get Your Clerk Publishable Key
1. In your Clerk dashboard, go to **API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)

#### c. Configure Environment Variables
1. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

2. Open `.env` and add your Clerk Publishable Key:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

⚠️ **Important:** Never commit your `.env` file to version control!

### 3. Configure Clerk Dashboard Settings

In your Clerk dashboard:

1. Navigate to **User & Authentication** → **Email, Phone, Username**
2. Enable your preferred authentication methods
3. Go to **Paths** and configure:
   - **Sign-in path:** `/sign-in`
   - **Sign-up path:** `/sign-up`
   - **Home URL:** `/`
   - **After sign-in URL:** `/`
   - **After sign-up URL:** `/`

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at **http://localhost:3000**

## 📁 Project Structure

```
fems/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx      # Protected dashboard page
│   │   ├── SignInPage.jsx     # Sign-in page
│   │   └── SignUpPage.jsx     # Sign-up page
│   ├── App.jsx                # Main app with routing
│   ├── main.jsx               # Entry point with Clerk provider
│   └── index.css              # Global styles with Tailwind
├── public/                    # Static assets
├── index.html                 # HTML entry point
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server at localhost:3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

## 🔐 Authentication Flow

### Public Routes
- **`/sign-in`** - User login page
- **`/sign-up`** - User registration page

### Protected Routes
- **`/`** - Dashboard (requires authentication)

### Clerk Components Used

| Component | Purpose |
|-----------|---------|
| `<ClerkProvider>` | Wraps the entire app with Clerk context |
| `<SignIn>` | Pre-built sign-in form |
| `<SignUp>` | Pre-built sign-up form |
| `<UserButton>` | User profile menu with sign-out |
| `<SignedIn>` | Renders content only for authenticated users |
| `<SignedOut>` | Renders content only for unauthenticated users |
| `<RedirectToSignIn>` | Redirects unauthenticated users to sign-in |

## 🛠️ Making API Calls with Axios

Example of authenticated API requests:

```javascript
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

function MyComponent() {
  const { getToken } = useAuth()

  const fetchData = async () => {
    try {
      // Get Clerk session token
      const token = await getToken()
      
      // Make authenticated request
      const response = await axios.get('https://api.example.com/data', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      return response.data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Use fetchData in your component...
}
```

## ✨ Customization

### Adding New Protected Routes

Edit `src/App.jsx`:

```javascript
<Route
  path="/your-new-route"
  element={
    <>
      <SignedIn>
        <YourNewComponent />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  }
/>
```

### Styling with Tailwind CSS

The project uses Tailwind CSS for styling. Customize your theme in `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
      },
    },
  },
}
```

### Accessing User Information

```javascript
import { useUser } from '@clerk/clerk-react'

function MyComponent() {
  const { user, isLoaded, isSignedIn } = useUser()

  if (!isLoaded) return <div>Loading...</div>
  if (!isSignedIn) return null

  return (
    <div>
      <p>Hello, {user.firstName}!</p>
      <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
    </div>
  )
}
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variable:
   - Key: `VITE_CLERK_PUBLISHABLE_KEY`
   - Value: Your Clerk publishable key
4. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Import your repository in [Netlify](https://netlify.com)
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variable:
   - Key: `VITE_CLERK_PUBLISHABLE_KEY`
   - Value: Your Clerk publishable key
5. Deploy!

## 🐛 Troubleshooting

### "Missing Publishable Key" Error

**Solution:**
1. Ensure you created a `.env` file in the root directory
2. Verify your Clerk publishable key is correct
3. Restart the development server (`npm run dev`)

### Clerk Components Not Rendering

**Check:**
1. Your Clerk application is active in the dashboard
2. The publishable key matches your Clerk application
3. You're using the correct environment (development/production)

### Authentication Redirects Not Working

**Ensure:**
1. Paths in Clerk dashboard match your routes:
   - Sign-in path: `/sign-in`
   - Sign-up path: `/sign-up`
2. After sign-in/sign-up URLs are set to `/`

### Build Errors

**Try:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 📚 Learn More

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
- [Lucide Icons](https://lucide.dev/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 💡 Support

For issues and questions:

- **Clerk Support:** [clerk.com/support](https://clerk.com/support)
- **Project Issues:** Create an issue in this repository
- **Vite Issues:** [Vite GitHub](https://github.com/vitejs/vite/issues)

## 🎉 Quick Start Checklist

- [ ] Install dependencies (`npm install`)
- [ ] Create Clerk account at clerk.com
- [ ] Copy Clerk publishable key
- [ ] Create `.env` file with your key
- [ ] Configure Clerk dashboard paths
- [ ] Run development server (`npm run dev`)
- [ ] Visit http://localhost:3000
- [ ] Test sign-up and sign-in flows
- [ ] Start building your features!

---

**Happy Coding! 🚀**
