import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Unlock, 
  KeyRound, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Cloud
} from 'lucide-react';
import { loginWithGoogle, logoutOwner, OWNER_EMAIL } from '../firebase';

interface OwnerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: (token: string) => void;
  isCurrentlyOwner: boolean;
  onLock: () => void;
  token?: string | null;
}

export const OwnerLoginModal: React.FC<OwnerLoginModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess,
  isCurrentlyOwner,
  onLock,
  token
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Change PIN state
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [changePinSuccess, setChangePinSuccess] = useState('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const user = await loginWithGoogle();
      if (user) {
        const token = `owner-token-google-${user.uid}`;
        onUnlockSuccess(token);
        setPin('');
        setError('');
      }
    } catch (err: unknown) {
      console.error('Google sign in notice:', err);
      setError(err instanceof Error ? err.message : 'Google sign-in was interrupted. You can also sign in with your PIN passcode below.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pin.trim();
    if (!cleanPin) {
      setError('Please enter your owner passcode.');
      return;
    }

    setIsLoading(true);
    setError('');

    let serverVerified = false;
    let tokenToUse = `owner-token-${cleanPin}`;

    // 1. Try server verification if backend API is reachable
    try {
      const res = await fetch('/api/owner/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: cleanPin })
      });

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (res.ok && data.success) {
          serverVerified = true;
          tokenToUse = data.token || tokenToUse;
        } else if (res.status === 401) {
          setError(data.error || 'Incorrect passcode. Please try again.');
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Backend unreachable or static hosting (e.g. Vercel, Netlify, GitHub Pages)
    }

    // 2. If server verified, unlock immediately
    if (serverVerified) {
      onUnlockSuccess(tokenToUse);
      setPin('');
      setError('');
      setIsLoading(false);
      return;
    }

    // 3. Resilient Client-Side Verification (for Vercel / Static deployments)
    let currentStoredPin = '2026';
    try {
      const savedPin = localStorage.getItem('jao_owner_passcode_v1');
      if (savedPin && savedPin.trim().length >= 4) {
        currentStoredPin = savedPin.trim();
      }
    } catch {}

    if (cleanPin === currentStoredPin) {
      onUnlockSuccess(tokenToUse);
      setPin('');
      setError('');
    } else {
      setError('Incorrect passcode. Please try again.');
    }
    setIsLoading(false);
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = newPin.trim();
    if (cleanPin.length < 4) {
      setError('New PIN must be at least 4 digits.');
      return;
    }
    if (cleanPin !== confirmPin.trim()) {
      setError('New PIN and confirmation do not match.');
      return;
    }

    setIsLoading(true);
    setError('');
    setChangePinSuccess('');

    // Save in localStorage immediately for static hosting (Vercel)
    try {
      localStorage.setItem('jao_owner_passcode_v1', cleanPin);
    } catch {}

    let newToken = `owner-token-${cleanPin}`;

    // Also attempt backend update if server is present
    try {
      const res = await fetch('/api/owner/change-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPin: cleanPin })
      });

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data.token) {
          newToken = data.token;
        }
      }
    } catch {
      // Offline / Vercel static deployment
    }

    setChangePinSuccess('Owner PIN updated successfully!');
    setNewPin('');
    setConfirmPin('');
    onUnlockSuccess(newToken);
    setTimeout(() => {
      setIsChangingPin(false);
      setChangePinSuccess('');
    }, 2000);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/80 backdrop-blur-md flex justify-center p-4 animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-blue-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/20">
              {isCurrentlyOwner ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-black text-gray-950 tracking-tight">
                {isCurrentlyOwner ? 'Owner Controls' : 'Owner Verification'}
              </h2>
              <p className="text-[11px] text-gray-500">
                {isCurrentlyOwner ? 'You are logged in as Jao Pangan' : 'Private messages & portfolio settings'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {isCurrentlyOwner ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">
                    Owner Mode Active
                  </h4>
                  <p className="text-[11px] text-emerald-700">
                    You can view the private inbox, post designs, and edit your profile.
                  </p>
                </div>
              </div>

              {/* Cloud Database Connected Status */}
              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center gap-2.5 text-xs text-blue-900">
                <Cloud className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div className="leading-tight">
                  <span className="font-bold">Cloud Database Active: </span>
                  <span className="text-[11px] text-blue-700">Client inquiries &amp; designs sync live on Vercel &amp; mobile.</span>
                </div>
              </div>

              {isChangingPin ? (
                <form onSubmit={handleChangePin} className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-gray-900">Change Owner PIN</h4>
                  
                  {changePinSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                      {changePinSuccess}
                    </div>
                  )}

                  {error && (
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">New 4-Digit PIN</label>
                    <input
                      type="password"
                      maxLength={8}
                      placeholder="e.g. 5432"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Confirm New PIN</label>
                    <input
                      type="password"
                      maxLength={8}
                      placeholder="Confirm new PIN"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => { setIsChangingPin(false); setError(''); }}
                      className="px-3 py-1.5 rounded-xl text-gray-600 hover:bg-gray-100 text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                    >
                      Save New PIN
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => setIsChangingPin(true)}
                    className="w-full py-2.5 px-4 rounded-xl border border-blue-200 text-blue-700 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Change Owner Passcode</span>
                  </button>

                  <button
                    onClick={() => { onLock(); onClose(); }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lock Portfolio (Switch to Client View)</span>
                  </button>
                  
                  <p className="text-[11px] text-gray-400 text-center pt-2">
                    When you share the link with clients, it is always locked by default.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* 1-Click Google Sign In with Owner Account */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-2xl bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 text-gray-800 font-bold text-xs flex items-center justify-center gap-2.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google ({OWNER_EMAIL})</span>
                </button>
                <p className="text-[11px] text-gray-500 text-center mt-1.5">
                  1-Click verified cloud sign-in for Jao
                </p>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-gray-200 w-full"></div>
                <span className="bg-white px-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider relative">
                  Or enter passcode
                </span>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100/90 text-xs text-blue-900 leading-relaxed space-y-1">
                  <p>
                    Enter your owner passcode to unlock <strong>design editing</strong>, posting new work, and your private client inbox.
                  </p>
                  <p className="text-[11px] text-blue-700 font-medium">
                    Default passcode: <code className="bg-white px-1.5 py-0.5 rounded font-bold border border-blue-200 text-blue-950 font-mono">2026</code> (you can change it anytime in settings).
                  </p>
                </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Owner Passcode (PIN)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPin ? 'text' : 'password'}
                    autoFocus
                    required
                    maxLength={10}
                    placeholder="Enter owner passcode"
                    value={pin}
                    onChange={(e) => { setPin(e.target.value); setError(''); }}
                    className="w-full pl-9 pr-10 py-2.5 bg-blue-50/40 hover:bg-blue-50/70 focus:bg-white border border-blue-100 focus:border-blue-500 rounded-xl text-xs sm:text-sm font-mono tracking-widest text-gray-900 focus:outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1.5 px-0.5">
                  <span>Owner access only</span>
                  <span className="text-gray-400">Secured &amp; private</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-blue-50">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'Verifying...' : 'Unlock Inbox'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
        </div>

      </div>
    </div>
  );
};
