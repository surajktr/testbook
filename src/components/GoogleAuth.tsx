import React, { useState, useEffect } from 'react';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

interface GoogleAuthProps {
  onSuccess: () => void;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ onSuccess }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          onSuccess();
        }
      } catch (error: any) {
        if (error.code !== 'auth/redirect-cancelled-by-user') {
          setError('Failed to sign in with Google. Please try again.');
        }
      }
    };

    handleRedirectResult();
  }, [onSuccess]);

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);

      if (window.matchMedia('(display-mode: standalone)').matches) {
        // PWA mode - always use redirect
        await signInWithRedirect(auth, googleProvider);
      } else {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          if (result.user) {
            onSuccess();
          }
        } catch (popupError: any) {
          if (popupError.code === 'auth/popup-blocked') {
            await signInWithRedirect(auth, googleProvider);
          } else if (popupError.code === 'auth/unauthorized-domain') {
            throw new Error('This domain is not authorized. Please ensure you are using the correct URL.');
          } else {
            throw popupError;
          }
        }
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setError(error.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <img 
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
          alt="Google" 
          className="w-5 h-5" 
        />
        {loading ? 'Signing in...' : 'Continue with Google'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
};

export default GoogleAuth;