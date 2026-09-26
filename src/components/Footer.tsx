import React from 'react';
import { ArrowUp, Mail, Send, Lock, Unlock, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface FooterProps {
  profile: UserProfile;
  setActiveTab: (tab: 'work' | 'resume') => void;
  onOpenPostModal: () => void;
  onOpenContactModal: () => void;
  onOpenOwnerLogin: () => void;
  onLock: () => void;
  isOwner: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  profile,
  setActiveTab,
  onOpenPostModal,
  onOpenContactModal,
  onOpenOwnerLogin,
  onLock,
  isOwner
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-blue-100/90 pt-12 pb-16 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-blue-50">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-sm flex-shrink-0">
                JP
              </div>
              <span className="font-extrabold text-gray-950 text-lg tracking-tight break-words min-w-0">
                {profile.name}
              </span>
            </div>

            <p className="text-sm text-gray-600 max-w-md leading-relaxed">
              {profile.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={onOpenContactModal}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send a Message</span>
              </button>
              
              {isOwner && (
                <button
                  onClick={onOpenPostModal}
                  className="px-4 py-2 rounded-xl border border-blue-200 hover:bg-blue-50 text-blue-700 font-semibold text-xs transition-all cursor-pointer"
                >
                  Post New Design
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-gray-950 uppercase tracking-wider text-blue-900">
              Navigation
            </h4>
            <ul className="space-y-2 text-gray-600 font-medium">
              <li>
                <button 
                  onClick={() => { setActiveTab('work'); scrollToTop(); }}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Portfolio &amp; Work Showcase
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('resume'); scrollToTop(); }}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Resume &amp; Experience
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenContactModal}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Direct On-Site Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Website Contact Info */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-gray-950 uppercase tracking-wider text-blue-900">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-gray-600">
              <p className="text-gray-500 text-[11px] leading-relaxed">
                Contact or message directly using this website anytime.
              </p>
              {profile.email && (
                <button
                  onClick={onOpenContactModal}
                  className="flex items-center gap-1.5 font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </button>
              )}
              {profile.location && (
                <p className="text-gray-500 text-xs">
                  {profile.location}
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="text-center sm:text-left break-words">
            © 2026 {profile.name ? profile.name.toUpperCase() : 'JOEMARIE GULAPA PANGAN'}. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            {/* Owner Access Discreet Trigger */}
            {isOwner ? (
              <button
                onClick={onLock}
                className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                title="Exit owner mode"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Owner Mode (Click to Lock)</span>
              </button>
            ) : (
              <button
                onClick={onOpenOwnerLogin}
                className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                title="Owner Administration Login"
              >
                <Lock className="w-3 h-3" />
                <span>Owner Access</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors flex items-center gap-1 font-semibold cursor-pointer"
              title="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
