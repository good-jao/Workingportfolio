import React, { useState } from 'react';
import { 
  Search, 
  Briefcase, 
  FileText, 
  PlusCircle, 
  Menu, 
  X, 
  User, 
  Mail, 
  Inbox,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  activeTab: 'work' | 'resume';
  setActiveTab: (tab: 'work' | 'resume') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenPostModal: () => void;
  onOpenEditProfile: () => void;
  onOpenContactModal: () => void;
  onOpenInboxModal: () => void;
  onOpenOwnerLogin: () => void;
  onLock: () => void;
  isOwner: boolean;
  unreadCount: number;
  profile: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenPostModal,
  onOpenEditProfile,
  onOpenContactModal,
  onOpenInboxModal,
  onOpenOwnerLogin,
  onLock,
  isOwner,
  unreadCount,
  profile
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100/80 transition-all no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4 min-w-0">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
            <button 
              id="header-brand-logo"
              onClick={() => { setActiveTab('work'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-hidden cursor-pointer min-w-0"
              title={profile.name}
            >
              {/* Personal JP Monogram Symbol */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm sm:text-base shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors flex-shrink-0">
                <span className="tracking-tight">JP</span>
              </div>
              <div className="min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-extrabold text-gray-950 text-xs sm:text-sm md:text-base tracking-tight truncate max-w-[110px] xs:max-w-[150px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[240px] xl:max-w-[320px] group-hover:text-blue-600 transition-colors block">
                    {profile.name}
                  </span>
                  {isOwner && (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.2 rounded-md hidden xs:flex items-center gap-0.5 flex-shrink-0">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      Owner
                    </span>
                  )}
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium truncate max-w-[110px] sm:max-w-[180px] hidden xs:block">
                  Graphic Design &amp; Social Media
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-blue-50/70 p-1 rounded-xl border border-blue-100 flex-shrink-0">
            <button
              id="nav-tab-work"
              onClick={() => setActiveTab('work')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'work'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-white/60'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Portfolio &amp; Work</span>
            </button>
            <button
              id="nav-tab-resume"
              onClick={() => setActiveTab('resume')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'resume'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-white/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Resume &amp; About Me</span>
            </button>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center relative max-w-xs w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            <input
              id="header-search-input"
              type="text"
              placeholder="Search designs, tools, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-blue-50/40 hover:bg-blue-50/70 focus:bg-white border border-blue-100/90 focus:border-blue-500 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-hidden transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ×
              </button>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            
            {/* Primary Direct Message Button - Always available to clients & visitors */}
            <button
              id="btn-header-contact"
              onClick={onOpenContactModal}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 cursor-pointer flex-shrink-0"
              title="Send a message directly on this website"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Message Me</span>
              <span className="xs:hidden">Contact</span>
            </button>

            {/* OWNER ONLY: Inbox Button (Private to Jao) */}
            {isOwner && (
              <button
                id="btn-header-inbox"
                onClick={onOpenInboxModal}
                className="relative p-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer border border-blue-200 bg-blue-50/50"
                title="Private Owner Inbox"
              >
                <Inbox className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* OWNER ONLY: Post Design Button */}
            {isOwner && (
              <button
                id="btn-post-design"
                onClick={onOpenPostModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 hover:bg-blue-50 text-blue-700 font-semibold text-xs transition-all cursor-pointer"
                title="Publish a new design project"
              >
                <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Post Design</span>
              </button>
            )}

            {/* OWNER ONLY: Edit Profile Avatar */}
            {isOwner && (
              <button
                id="btn-user-profile"
                onClick={onOpenEditProfile}
                className="w-8 h-8 rounded-full ring-2 ring-blue-500 hover:ring-blue-600 transition-all overflow-hidden flex-shrink-0 cursor-pointer"
                title="Edit Profile & Info"
              >
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="w-full h-full object-cover"
                />
              </button>
            )}

            {/* Owner Lock / Login Discreet Button */}
            {isOwner ? (
              <button
                id="btn-header-lock"
                onClick={onLock}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all cursor-pointer"
                title="Owner mode active. Click to lock and switch to Client View."
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden lg:inline text-[11px]">Owner Active</span>
                <Lock className="w-3 h-3 text-emerald-700" />
              </button>
            ) : (
              <button
                id="btn-header-owner-login"
                onClick={onOpenOwnerLogin}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-gray-200 hover:border-blue-300 text-gray-500 hover:text-blue-600 hover:bg-blue-50/70 font-semibold text-xs transition-all cursor-pointer"
                title="Owner Login (Passcode required to edit designs)"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">Owner Login</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search input */}
        <div className="lg:hidden pb-3 pt-1">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search design projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-blue-50/50 focus:bg-white border border-blue-100 focus:border-blue-500 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-hidden transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 cursor-pointer"
              >
                ×
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-blue-100 bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          
          {/* User profile summary in mobile menu */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50/60 border border-blue-100">
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-300 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-gray-950 text-sm truncate" title={profile.name}>
                {profile.name}
              </p>
              <p className="text-xs text-gray-500 truncate">Graphic Design &amp; Social Media</p>
            </div>
            {isOwner && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0">
                Owner
              </span>
            )}
          </div>

          <div className="space-y-1">
            <button
              onClick={() => { setActiveTab('work'); setMobileMenuOpen(false); }}
              className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === 'work'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-blue-50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Portfolio &amp; Work</span>
            </button>
            <button
              onClick={() => { setActiveTab('resume'); setMobileMenuOpen(false); }}
              className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === 'resume'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-blue-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Resume &amp; About Me</span>
            </button>
          </div>

          <div className="pt-2 border-t border-blue-50 flex flex-col gap-2">
            <button
              onClick={() => { onOpenContactModal(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Send Message</span>
            </button>

            {isOwner && (
              <>
                <button
                  onClick={() => { onOpenPostModal(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 px-4 rounded-xl border border-blue-200 bg-blue-50/60 text-blue-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-100/60 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-blue-600" />
                  <span>Post New Design</span>
                </button>
                <button
                  onClick={() => { onOpenInboxModal(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 px-4 rounded-xl border border-blue-200 bg-blue-50 text-blue-900 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Inbox className="w-4 h-4 text-blue-600" />
                  <span>Private Inbox ({unreadCount})</span>
                </button>
                <button
                  onClick={() => { onOpenEditProfile(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 px-4 rounded-xl text-gray-700 font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-100 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Edit Profile &amp; Bio</span>
                </button>
                <button
                  onClick={() => { onLock(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gray-100 text-gray-600 font-medium text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock Portfolio (Exit Owner Mode)</span>
                </button>
              </>
            )}

            {!isOwner && (
              <button
                onClick={() => { onOpenOwnerLogin(); setMobileMenuOpen(false); }}
                className="w-full py-2 text-gray-400 hover:text-gray-600 text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              >
                <Lock className="w-3 h-3" />
                <span>Owner Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
