import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Reply, 
  Inbox, 
  MessageSquare,
  Lock,
  KeyRound,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { DirectMessage, UserProfile } from '../types';

interface MessagesInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: DirectMessage[];
  onMarkRead: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onOpenOwnerSettings: () => void;
  onLock: () => void;
  onRefresh?: () => void;
  profile: UserProfile;
}

export const MessagesInboxModal: React.FC<MessagesInboxModalProps> = ({
  isOpen,
  onClose,
  messages,
  onMarkRead,
  onDeleteMessage,
  onOpenOwnerSettings,
  onLock,
  onRefresh,
  profile
}) => {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    messages.length > 0 ? messages[0].id : null
  );

  if (!isOpen) return null;

  const selectedMessage = messages.find(m => m.id === selectedMessageId) || messages[0] || null;

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/80 backdrop-blur-md flex justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-blue-100 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Security Status */}
        <div className="px-5 sm:px-6 py-4 bg-white border-b border-blue-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-gray-950 tracking-tight">
                  Website Direct Messages
                </h2>
                <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {messages.length} {messages.length === 1 ? 'message' : 'messages'}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Private to Jao</span>
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Only you can view these messages • Clients visiting the website cannot access this inbox
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                title="Check for new messages"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => { onOpenOwnerSettings(); }}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
              title="Passcode & Security Settings"
            >
              <KeyRound className="w-4 h-4" />
            </button>

            <button
              onClick={() => { onLock(); onClose(); }}
              className="hidden sm:flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Lock inbox and return to client view"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {messages.length === 0 ? (
          <div className="p-12 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-950">Your inbox is clear</h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
              Messages submitted by visitors directly on your website will appear here in real-time. Clients cannot see this screen.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[420px]">
            
            {/* Left Column: Message List */}
            <div className="w-full md:w-80 border-r border-blue-100 overflow-y-auto bg-blue-50/20 divide-y divide-blue-50/80">
              {messages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessageId(msg.id);
                      if (!msg.isRead) onMarkRead(msg.id);
                    }}
                    className={`p-3.5 transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-100/60 border-l-4 border-blue-600' 
                        : 'hover:bg-blue-50/60 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-900 truncate">
                        {msg.senderName}
                      </span>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-gray-800 truncate mb-1">
                      {msg.subject}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100/80 text-blue-700 font-medium">
                        {msg.inquiryType}
                      </span>
                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-blue-100" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Selected Message Detail */}
            {selectedMessage ? (
              <div className="flex-1 p-6 overflow-y-auto space-y-6 flex flex-col justify-between bg-white">
                <div className="space-y-4">
                  
                  {/* Message Title & Actions */}
                  <div className="flex items-start justify-between gap-4 border-b border-blue-50 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full">
                          {selectedMessage.inquiryType}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(selectedMessage.createdAt)}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-gray-950 mt-1.5">
                        {selectedMessage.subject}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => onDeleteMessage(selectedMessage.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Sender Info Card */}
                  <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        {selectedMessage.senderName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">
                          {selectedMessage.senderName}
                        </p>
                        <p className="text-xs text-blue-600 font-medium">
                          {selectedMessage.senderEmail}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`mailto:${selectedMessage.senderEmail}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                    </a>
                  </div>

                  {/* Message Body */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Message Content
                    </h4>
                    <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </div>
                  </div>

                </div>

                {/* Footer Note */}
                <div className="pt-4 border-t border-blue-50 text-[11px] text-gray-400 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Private &amp; Confidential (Jao Pangan)</span>
                  </span>
                  <a
                    href={`mailto:${selectedMessage.senderEmail}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Reply: {selectedMessage.senderEmail}
                  </a>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6 text-gray-400 text-xs">
                Select a message to view details
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
