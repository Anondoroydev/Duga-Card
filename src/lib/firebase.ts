import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Universal Firebase configuration
// These values are based on the current AI Studio project and will work after export to Vercel.
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBwSAlQzRKmeP_v8SBCsFEBkUFo5cz9Ang",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0913304861.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0913304861",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0913304861.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1015598867701",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1015598867701:web:aa94fc250bfa9fd91b51bc",
  databaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || "ai-studio-durgapujagreetin-babd2c97-85fb-4075-b41e-f3a55a1c4ed4"
};

const app = initializeApp(config);
export const db = getFirestore(app);
