import React from 'react';
import { 
  MapPin, 
  Sparkles, 
  Send, 
  Edit3, 
  CheckCircle2, 
  Layers, 
  Briefcase,
  FileText,
  Inbox,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { UserProfile, Project } from '../types';

interface ProfileHeroProps {
  profile: UserProfile;
  projects: Project[];
  onOpenEditProfile: () => void;
  onOpenContactModal: () => void;
  onOpenInboxModal: () => void;
  onOpenOwnerLogin: () => void;
  onLock: () => void;
  isOwner: boolean;
  unreadCount: number;
  activeTab: 'work' | 'resume';
  setActiveTab: (tab: 'work' | 'resume') => void;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({
  profile,
  projects,
  onOpenEditProfile,
  onOpenContactModal,
  onOpenInboxModal,
  onOpenOwnerLogin,
  onLock,
  isOwner,
  unreadCount,
  activeTab,
  setActiveTab
}) => {
  return (
    <section className="bg-white border-b border-blue-100/90 no-print">
      
      {/* Editorial Decorative Banner */}
      <div className="h-32 sm:h-44 md:h-52 w-full bg-linear-to-r from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
        {/* Subtle geometric lines */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute -right-10 -bottom-20 w-80 h-80 rounded-full border border-white/40" />
          <div className="absolute left-1/3 -top-10 w-96 h-96 rounded-full border border-white/20" />
        </div>

        {/* Minimalist Watermark Monogram */}
        <div className="absolute right-6 sm:right-12 bottom-2 select-none pointer-events-none opacity-20">
          <span className="text-white font-black text-6xl sm:text-8xl tracking-tighter">JP</span>
        </div>

        {/* Availability Badge */}
        {profile.availableForWork && (
          <div className="absolute top-4 right-4 sm:right-8 bg-blue-950/60 backdrop-blur-md border border-white/20 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wide">Available for Design Projects</span>
          </div>
        )}
      </div>

      {/* Main Profile Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="relative">
          
          {/* Top Row: Avatar (overlapping banner with white ring) + Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 sm:-mt-18">
            {/* Avatar */}
            <div className="relative group flex-shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-4 ring-white shadow-xl bg-blue-100">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {profile.availableForWork && (
                <div 
                  className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[11px] font-bold p-1 rounded-full ring-4 ring-white shadow-xs"
                  title="Open for design work"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Top Action Buttons */}
            <div className="pt-2 sm:pt-0 flex flex-wrap items-center gap-2.5">
              
              {/* Primary Direct Contact Button (Available to everyone) */}
              <button
                id="hero-message-me-btn"
                onClick={onOpenContactModal}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                title="Send a message directly to Jao"
              >
                <Send className="w-4 h-4" />
                <span>Message Me</span>
              </button>

              {/* For Visitors: Quick Resume Switch */}
              {!isOwner && (
                <button
                  onClick={() => setActiveTab(activeTab === 'work' ? 'resume' : 'work')}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
                >
                  {activeTab === 'work' ? (
                    <>
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>View Resume</span>
                    </>
                  ) : (
                    <>
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      <span>View Designs</span>
                    </>
                  )}
                </button>
              )}

              {/* OWNER ONLY: Edit Profile */}
              {isOwner && (
                <button
                  id="hero-edit-profile-btn"
                  onClick={onOpenEditProfile}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
                  title="Edit your bio and credentials"
                >
                  <Edit3 className="w-4 h-4 text-blue-600" />
                  <span>Edit Profile</span>
                </button>
              )}

              {/* OWNER ONLY: Messages Inbox for Jao */}
              {isOwner && (
                <button
                  id="hero-inbox-btn"
                  onClick={onOpenInboxModal}
                  className="relative flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-900 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
                  title="View private messages received from visitors"
                >
                  <Inbox className="w-4 h-4 text-blue-600" />
                  <span>Private Inbox</span>
                  {unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}

              {/* OWNER ONLY: Quick Lock Toggle */}
              {isOwner && (
                <button
                  onClick={onLock}
                  className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Lock portfolio and preview client view"
                >
                  <Lock className="w-4 h-4" />
                </button>
              )}

            </div>
          </div>

          {/* Name & Headline */}
          <div className="mt-4 space-y-2 min-w-0 max-w-full">
            <div className="flex items-center gap-3 flex-wrap min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-950 tracking-tight break-words max-w-full">
                {profile.name}
              </h1>
              {isOwner && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex-shrink-0">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Owner Mode</span>
                </span>
              )}
            </div>

            <p className="text-base sm:text-lg font-medium text-gray-700 max-w-2xl leading-relaxed">
              {profile.headline}
            </p>

            <p className="text-sm text-gray-500 max-w-3xl leading-relaxed pt-1">
              {profile.bio}
            </p>
          </div>

          {/* Info Tags Row */}
          <div className="mt-5 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-gray-600 pt-3 border-t border-blue-50">
            {profile.location && (
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{profile.location}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 font-medium">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>{projects.length} Design Folders &amp; Sets</span>
            </div>

            {profile.yearsOfExperience && (
              <div className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>{profile.yearsOfExperience}+ Years Experience</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 font-medium text-blue-700">
              <Layers className="w-3.5 h-3.5" />
              <span>Specialized in Amazon Listings, Social Media &amp; Brand Visuals</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
