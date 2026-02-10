mkdir fems
cd fems

# Initialize npm and create package.json
npm init -y

# Install production dependencies
npm install axios@^1.13.2 lucide-react@^0.554.0 react@^19.2.0 react-dom@^19.2.0 react-router-dom@^7.9.6

# Install Clerk for authentication
npm install @clerk/clerk-react

# Install dev dependencies
npm install -D @eslint/js@^9.39.1 @tailwindcss/postcss@^4.1.17 @types/react@^19.2.5 @types/react-dom@^19.2.3 @vitejs/plugin-react@^5.1.1 autoprefixer@^10.4.22 eslint@^9.39.1 eslint-plugin-react-hooks@^7.0.1 eslint-plugin-react-refresh@^0.4.24 globals@^16.5.0 postcss@^8.5.6 tailwindcss@^3.4.18 vite@^7.2.4



https://dashboard.clerk.com/apps/app_39UFJjo2d11tw15UUo4BCedXsgm/instances/ins_39UFJiJSWgeEFjvoVEbNdjFhxOL

const firebaseConfig = {
  apiKey: "AIzaSyDFGkyRvQiVqghC4R-d2GY0mmfuc1ZtNS0",
  authDomain: "fems-d216c.firebaseapp.com",
  projectId: "fems-d216c",
  storageBucket: "fems-d216c.firebasestorage.app",
  messagingSenderId: "42371501749",
  appId: "1:42371501749:web:d5cc974ab8a6d9959038fc",
  measurementId: "G-2MPLSEKQG8"
};