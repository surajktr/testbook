import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDcxgyXd7N5uhlpgKKsvpGkQF8emJbirH0",
  authDomain: "testbook-624a4.firebaseapp.com",
  projectId: "testbook-624a4",
  storageBucket: "testbook-624a4.firebasestorage.app",
  messagingSenderId: "182915827198",
  appId: "1:182915827198:web:cab76366aac2fa206aacaf",
  measurementId: "G-NCCPR4X83K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Auth Provider with additional scopes if needed
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

// Helper function to handle auth errors
const getAuthErrorMessage = (error: any) => {
  switch (error.code) {
    case 'auth/invalid-credential':
      return 'Invalid email or password';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/email-already-in-use':
      return 'Email is already registered';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/unauthorized-domain':
      return 'Please use the authorized domain for authentication';
    case 'auth/popup-blocked':
      return 'Popup was blocked. Please allow popups for this site';
    default:
      return 'Authentication failed. Please try again';
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: getAuthErrorMessage(error) };
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: getAuthErrorMessage(error) };
  }
};