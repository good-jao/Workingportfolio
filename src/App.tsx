/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ProfileHero } from './components/ProfileHero';
import { PortfolioGrid } from './components/PortfolioGrid';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { PostProjectModal } from './components/PostProjectModal';
import { ResumeSection } from './components/ResumeSection';
import { EditProfileModal } from './components/EditProfileModal';
import { ContactMessageModal } from './components/ContactMessageModal';
import { MessagesInboxModal } from './components/MessagesInboxModal';
import { OwnerLoginModal } from './components/OwnerLoginModal';
import { Footer } from './components/Footer';
import { Project, UserProfile, DirectMessage } from './types';
import { INITIAL_PROJECTS, INITIAL_USER_PROFILE, INITIAL_MESSAGES } from './data/initialData';
import { Briefcase, FileText, PlusCircle, Check, Mail, Inbox, Lock } from 'lucide-react';

const STORAGE_PROJECTS_KEY = 'jao_pangan_portfolio_projects_v9';
const STORAGE_PROFILE_KEY = 'jao_pangan_portfolio_profile_v8';
const STORAGE_OWNER_TOKEN_KEY = 'jao_owner_session_token_v2';
const STORAGE_MESSAGES_KEY = 'jao_portfolio_messages_v1';

export default function App() {
  // Load stored projects or fallback to initial data
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROJECTS_KEY) || localStorage.getItem('jao_pangan_portfolio_projects_v8');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasAmazonHeadphones = parsed.some(
            (p: Project) => p.id === 'proj-amazon-headphones'
          );
          if (!hasAmazonHeadphones) {
            const cleaned = parsed.filter((p: Project) => p.id !== 'proj-amazon-listing');
            const amazonSubFolders = INITIAL_PROJECTS.filter(p => p.parentFolder === 'Amazon Listing');
            return [...amazonSubFolders, ...cleaned];
          }
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_PROJECTS;
  });

  // Load stored user profile or fallback to Joemarie Gulapa Pangan
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY) || localStorage.getItem('jao_pangan_portfolio_profile_v7');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.name !== 'Alex Rivera' && parsed.name !== 'Jao Pangan') {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_USER_PROFILE;
  });

  // Owner authentication session state
  const [ownerToken, setOwnerToken] = useState<string | null>(() => {
    try {
      return (
        localStorage.getItem(STORAGE_OWNER_TOKEN_KEY) ||
        sessionStorage.getItem(STORAGE_OWNER_TOKEN_KEY)
      );
    } catch {
      return null;
    }
  });

  const isOwner = Boolean(ownerToken);

  // Private messages state - ONLY loaded for Owner
  const [messages, setMessages] = useState<DirectMessage[]>([]);

  const [activeTab, setActiveTab] = useState<'work' | 'resume'>('work');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Modals state
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postModalCategory, setPostModalCategory] = useState<string | undefined>(undefined);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isInboxModalOpen, setIsInboxModalOpen] = useState(false);
  const [isOwnerLoginOpen, setIsOwnerLoginOpen] = useState(false);

  const handleOpenPostModal = (category?: string) => {
    if (!isOwner) {
      setIsOwnerLoginOpen(true);
      return;
    }
    setEditingProject(null);
    setPostModalCategory(category);
    setIsPostModalOpen(true);
  };

  const handleOpenEditProject = (project: Project) => {
    if (!isOwner) {
      setIsOwnerLoginOpen(true);
      return;
    }
    setEditingProject(project);
  };

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync projects and profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    } catch {
      // Ignore quota errors
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore
    }
  }, [profile]);

  // Fetch messages from server ONLY if authenticated as Owner (with Vercel/Static fallback)
  const fetchOwnerMessages = useCallback(async (token: string) => {
    let loadedMessages: DirectMessage[] | null = null;

    try {
      const res = await fetch('/api/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.status === 401 && contentType.includes('application/json')) {
        // Token invalid or changed
        setOwnerToken(null);
        setMessages([]);
        try {
          localStorage.removeItem(STORAGE_OWNER_TOKEN_KEY);
          sessionStorage.removeItem(STORAGE_OWNER_TOKEN_KEY);
        } catch {}
        return;
      }
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.messages && Array.isArray(data.messages)) {
          loadedMessages = data.messages;
        }
      }
    } catch (err) {
      // Backend unavailable on static host
    }

    // Fallback to local storage if server didn't respond with JSON
    if (!loadedMessages) {
      try {
        const saved = localStorage.getItem(STORAGE_MESSAGES_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            loadedMessages = parsed;
          }
        }
      } catch {}
    }

    // Default to INITIAL_MESSAGES if still null
    if (!loadedMessages) {
      loadedMessages = INITIAL_MESSAGES;
    }

    setMessages(loadedMessages);
    try {
      localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(loadedMessages));
    } catch {}
  }, []);

  // When ownerToken is valid, fetch messages
  useEffect(() => {
    if (ownerToken) {
      fetchOwnerMessages(ownerToken);
    } else {
      setMessages([]);
    }
  }, [ownerToken, fetchOwnerMessages]);

  // Check URL params for ?owner=login shortcut
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('owner') === 'login' || params.get('admin') === '1') {
        setIsOwnerLoginOpen(true);
      }
    } catch {}
  }, []);

  const handleUnlockSuccess = (token: string) => {
    setOwnerToken(token);
    try {
      localStorage.setItem(STORAGE_OWNER_TOKEN_KEY, token);
      sessionStorage.setItem(STORAGE_OWNER_TOKEN_KEY, token);
    } catch {}
    setIsOwnerLoginOpen(false);
    setIsInboxModalOpen(true);
    showToast('Welcome back Jao! Owner mode unlocked.');
    fetchOwnerMessages(token);
  };

  const handleLock = () => {
    setOwnerToken(null);
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_OWNER_TOKEN_KEY);
      sessionStorage.removeItem(STORAGE_OWNER_TOKEN_KEY);
    } catch {}
    setIsInboxModalOpen(false);
    setIsPostModalOpen(false);
    setIsEditProfileOpen(false);
    showToast('Portfolio locked. You are now in Client / Visitor view.');
  };

  const handleSaveProject = (newProject: Project) => {
    if (!isOwner) {
      setIsOwnerLoginOpen(true);
      return;
    }
    setProjects((prev) => [newProject, ...prev]);
    showToast(`"${newProject.title}" has been added to your portfolio!`);
    setSelectedProject(newProject);
  };

  const handleUpdateProject = (updated: Project) => {
    if (!isOwner) {
      setIsOwnerLoginOpen(true);
      return;
    }
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedProject?.id === updated.id) {
      setSelectedProject(updated);
    }
    showToast(`"${updated.folderName || updated.title}" updated successfully!`);
  };

  const handleDeleteProject = (projectId: string) => {
    if (!isOwner) {
      setIsOwnerLoginOpen(true);
      return;
    }
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    showToast('Project removed from your portfolio.');
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    if (!isOwner) {
      setIsOwnerLoginOpen(true);
      return;
    }
    setProfile(updatedProfile);
    showToast('Your profile information has been updated.');
  };

  // Direct on-site messaging handlers
  const handleSendMessage = (newMsg: DirectMessage) => {
    try {
      const saved = localStorage.getItem(STORAGE_MESSAGES_KEY);
      const currentList: DirectMessage[] = saved ? JSON.parse(saved) : INITIAL_MESSAGES;
      localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify([newMsg, ...currentList]));
    } catch {}

    if (isOwner) {
      setMessages((prev) => [newMsg, ...prev]);
    }
    showToast(`Message sent directly to Jao! Thank you, ${newMsg.senderName}.`);
  };

  const handleMarkRead = async (messageId: string) => {
    setMessages((prev) => {
      const updated = prev.map((m) => (m.id === messageId ? { ...m, isRead: true } : m));
      try {
        localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (ownerToken) {
      try {
        await fetch(`/api/messages/${messageId}/read`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${ownerToken}` }
        });
      } catch {}
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    setMessages((prev) => {
      const updated = prev.filter((m) => m.id !== messageId);
      try {
        localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('Message deleted from inbox.');
    if (ownerToken) {
      try {
        await fetch(`/api/messages/${messageId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${ownerToken}` }
        });
      } catch {}
    }
  };

  const unreadCount = isOwner ? messages.filter((m) => !m.isRead).length : 0;

  // Next / Prev project navigation in modal
  const currentIndex = selectedProject
    ? projects.findIndex((p) => p.id === selectedProject.id)
    : -1;

  const handleNextProject = currentIndex >= 0 && currentIndex < projects.length - 1
    ? () => setSelectedProject(projects[currentIndex + 1])
    : undefined;

  const handlePrevProject = currentIndex > 0
    ? () => setSelectedProject(projects[currentIndex - 1])
    : undefined;

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-gray-950 text-white px-4 py-3 rounded-2xl shadow-2xl border border-gray-800 flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenPostModal={() => handleOpenPostModal()}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        onOpenInboxModal={() => setIsInboxModalOpen(true)}
        onOpenOwnerLogin={() => setIsOwnerLoginOpen(true)}
        onLock={handleLock}
        isOwner={isOwner}
        unreadCount={unreadCount}
        profile={profile}
      />

      {/* Hero & Identity Banner */}
      <ProfileHero
        profile={profile}
        projects={projects}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        onOpenInboxModal={() => setIsInboxModalOpen(true)}
        onOpenOwnerLogin={() => setIsOwnerLoginOpen(true)}
        onLock={handleLock}
        isOwner={isOwner}
        unreadCount={unreadCount}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Body: Switch between Portfolio Grid and Resume Section */}
      <main className="flex-1">
        {activeTab === 'work' ? (
          <PortfolioGrid
            projects={projects}
            searchQuery={searchQuery}
            onSelectProject={(proj) => setSelectedProject(proj)}
            onOpenPostModal={(presetCat) => handleOpenPostModal(presetCat)}
            isOwner={isOwner}
            onEditProject={handleOpenEditProject}
          />
        ) : (
          <ResumeSection
            profile={profile}
            onOpenEditProfile={() => setIsEditProfileOpen(true)}
            onOpenContactModal={() => setIsContactModalOpen(true)}
            isOwner={isOwner}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        profile={profile}
        setActiveTab={setActiveTab}
        onOpenPostModal={() => handleOpenPostModal()}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        onOpenOwnerLogin={() => setIsOwnerLoginOpen(true)}
        onLock={handleLock}
        isOwner={isOwner}
      />

      {/* Mobile Sticky Quick Navigation Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-blue-100 px-4 py-2 flex items-center justify-around no-print">
        <button
          onClick={() => { setActiveTab('work'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center gap-0.5 text-xs font-semibold py-1 transition-colors cursor-pointer ${
            activeTab === 'work' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span>Designs</span>
        </button>

        <button
          onClick={() => setIsContactModalOpen(true)}
          className="flex flex-col items-center gap-0.5 text-xs font-semibold text-blue-700 py-1 cursor-pointer"
        >
          <Mail className="w-5 h-5" />
          <span>Message</span>
        </button>

        {isOwner ? (
          <button
            onClick={() => handleOpenPostModal()}
            className="flex flex-col items-center gap-0.5 text-xs font-bold text-blue-600 py-1 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center -mt-4 shadow-md shadow-blue-500/30 active:scale-95 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span>Post</span>
          </button>
        ) : (
          <button
            onClick={() => setIsOwnerLoginOpen(true)}
            className="flex flex-col items-center gap-0.5 text-xs font-semibold text-gray-400 hover:text-gray-600 py-1 cursor-pointer"
            title="Owner login"
          >
            <Lock className="w-5 h-5" />
            <span>Owner</span>
          </button>
        )}

        <button
          onClick={() => { setActiveTab('resume'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center gap-0.5 text-xs font-semibold py-1 transition-colors cursor-pointer ${
            activeTab === 'resume' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Resume</span>
        </button>

        {isOwner && (
          <button
            onClick={() => setIsInboxModalOpen(true)}
            className="relative flex flex-col items-center gap-0.5 text-xs font-semibold text-blue-600 py-1 cursor-pointer"
          >
            <Inbox className="w-5 h-5" />
            <span>Inbox</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 right-2 w-3.5 h-3.5 rounded-full bg-blue-600 text-white text-[8px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Modals */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onDeleteProject={handleDeleteProject}
          onNextProject={handleNextProject}
          onPrevProject={handlePrevProject}
          onOpenContactModal={() => setIsContactModalOpen(true)}
          isOwner={isOwner}
          profile={profile}
          onUpdateProject={handleUpdateProject}
          onEditProject={handleOpenEditProject}
        />
      )}

      {isOwner && (isPostModalOpen || Boolean(editingProject)) && (
        <PostProjectModal
          isOpen={isPostModalOpen || Boolean(editingProject)}
          onClose={() => {
            setIsPostModalOpen(false);
            setEditingProject(null);
          }}
          onSaveProject={(proj) => {
            if (editingProject) {
              handleUpdateProject(proj);
            } else {
              handleSaveProject(proj);
            }
            setEditingProject(null);
          }}
          initialCategory={postModalCategory}
          projectToEdit={editingProject}
        />
      )}

      {isOwner && (
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          profile={profile}
          onSaveProfile={handleSaveProfile}
        />
      )}

      <ContactMessageModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        profile={profile}
        onSendMessage={handleSendMessage}
      />

      {isOwner && (
        <MessagesInboxModal
          isOpen={isInboxModalOpen}
          onClose={() => setIsInboxModalOpen(false)}
          messages={messages}
          onMarkRead={handleMarkRead}
          onDeleteMessage={handleDeleteMessage}
          onOpenOwnerSettings={() => setIsOwnerLoginOpen(true)}
          onLock={handleLock}
          onRefresh={() => ownerToken && fetchOwnerMessages(ownerToken)}
          profile={profile}
        />
      )}

      <OwnerLoginModal
        isOpen={isOwnerLoginOpen}
        onClose={() => setIsOwnerLoginOpen(false)}
        onUnlockSuccess={handleUnlockSuccess}
        isCurrentlyOwner={isOwner}
        onLock={handleLock}
        token={ownerToken}
      />

    </div>
  );
}
