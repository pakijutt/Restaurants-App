import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';

// Configuration from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyC1jskPuiSiAEd5NwcKLV23vG2ndGxGH00",
  authDomain: "gen-lang-client-0642429025.firebaseapp.com",
  projectId: "gen-lang-client-0642429025",
  storageBucket: "gen-lang-client-0642429025.firebasestorage.app",
  messagingSenderId: "888623923821",
  appId: "1:888623923821:web:115d9a817a0f0eb873b564",
  // Using the custom multi-tenant database ID provided
  databaseId: "ai-studio-zingerplus-bb9d0b60-6fe0-4f3f-ba42-bd62b5bed8dc"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
// Note: We pass the specific firestoreDatabaseId (databaseId) to getFirestore to target the correct instance.
export const db = getFirestore(app, firebaseConfig.databaseId);

export type { FirebaseUser };

export { 
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
};
