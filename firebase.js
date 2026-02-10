import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFGkyRvQiVqghC4R-d2GY0mmfuc1ZtNS0",
  authDomain: "fems-d216c.firebaseapp.com",
  projectId: "fems-d216c",
  storageBucket: "fems-d216c.firebasestorage.app",
  messagingSenderId: "42371501749",
  appId: "1:42371501749:web:d5cc974ab8a6d9959038fc",
  measurementId: "G-2MPLSEKQG8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
