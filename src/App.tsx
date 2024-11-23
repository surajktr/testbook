import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import EmailAuth from './components/EmailAuth';
import GoogleAuth from './components/GoogleAuth';
import HomePage from './pages/HomePage';

export type AuthMode = 'signup' | 'signin';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <HomePage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <EmailAuth
          mode={authMode}
          onModeSwitch={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}
          onSuccess={() => setIsAuthenticated(true)}
        />
        <div className="mt-4">
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>
          <GoogleAuth onSuccess={() => setIsAuthenticated(true)} />
        </div>
      </div>
    </div>
  );
}

export default App;