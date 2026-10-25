import React, { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { registerWithUsername, signInWithUsername } from '../lib/supabase';

interface AuthScreenProps {
  isConfigured: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ isConfigured }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const switchMode = (nextMode: 'login' | 'register') => {
    setMode(nextMode);
    setError('');
    setMessage('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'register') {
        await registerWithUsername(username, password);
        setMessage('Account created. You are now signed in.');
      } else {
        await signInWithUsername(username, password);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-black font-['Space_Grotesk',sans-serif]">
      <div className="mx-auto flex min-h-[75vh] w-full max-w-md items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full border-4 border-black bg-white p-6 neo-shadow-lg">
          <div className="mb-6 border-b-4 border-black pb-5">
            <p className="text-3xl font-black tracking-wider">XG</p>
            <h1 className="mt-3 text-2xl font-black uppercase">
              {mode === 'login' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
            </h1>
            <p className="mt-1 text-xs font-bold uppercase text-zinc-600">
              {mode === 'login' ? 'Sign in to manage your football data' : 'Create your XG account'}
            </p>
          </div>

          {!isConfigured && (
            <p className="mb-4 border-2 border-black bg-[#FF5F56] p-3 text-xs font-black">
              Supabase is not configured. Add the VITE_SUPABASE environment variables before signing in.
            </p>
          )}

          <div className="space-y-4">
            <label className="block text-xs font-black uppercase">
              Username
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                required
                disabled={!isConfigured || isSubmitting}
                placeholder="your_username"
                className="mt-1 w-full border-2 border-black p-3 text-sm font-bold outline-none focus:bg-[#00F0FF]/20"
              />
              <span className="mt-1 block text-[10px] font-bold normal-case text-zinc-600">
                At least 3 characters: letters, numbers, and underscores
              </span>
            </label>

            <label className="block text-xs font-black uppercase">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                disabled={!isConfigured || isSubmitting}
                className="mt-1 w-full border-2 border-black p-3 text-sm font-bold outline-none focus:bg-[#00F0FF]/20"
              />
            </label>

            {mode === 'register' && (
              <label className="block text-xs font-black uppercase">
                Confirm password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                  disabled={!isConfigured || isSubmitting}
                  className="mt-1 w-full border-2 border-black p-3 text-sm font-bold outline-none focus:bg-[#00F0FF]/20"
                />
              </label>
            )}
          </div>

          {error && <p className="mt-4 border-2 border-black bg-[#FF5F56] p-3 text-xs font-black">{error}</p>}
          {message && <p className="mt-4 border-2 border-black bg-[#CCFF00] p-3 text-xs font-black">{message}</p>}

          <button
            type="submit"
            disabled={!isConfigured || isSubmitting}
            className="mt-6 flex w-full items-center justify-center gap-2 border-3 border-black bg-[#CCFF00] px-4 py-3 text-sm font-black uppercase neo-btn cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mode === 'login' ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </button>

          <button
            type="button"
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            className="mt-4 w-full text-center text-xs font-black uppercase underline cursor-pointer"
          >
            {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </form>
      </div>
    </main>
  );
};
