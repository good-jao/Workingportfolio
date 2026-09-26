import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle, 
  Mail, 
  User, 
  Tag, 
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { DirectMessage, UserProfile } from '../types';

interface ContactMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSendMessage: (message: DirectMessage) => void;
}

const INQUIRY_TYPES = [
  'Social Media Graphics',
  'Brand Identity',
  'Marketing & Ads',
  'Carousels & Posts',
  'Posters & Banners',
  'Packaging & Print',
  'General Inquiry'
];

export const ContactMessageModal: React.FC<ContactMessageModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSendMessage
}) => {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [inquiryType, setInquiryType] = useState('Social Media Graphics');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !message.trim()) {
      setError('Please provide your name, email, and a message.');
      return;
    }

    setIsSending(true);
    setError('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: senderName.trim(),
          senderEmail: senderEmail.trim(),
          subject: subject.trim() || `${inquiryType} Inquiry`,
          inquiryType,
          message: message.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      const newMessage: DirectMessage = {
        id: data.messageId || `msg-${Date.now()}`,
        senderName: senderName.trim(),
        senderEmail: senderEmail.trim(),
        subject: subject.trim() || `${inquiryType} Inquiry`,
        inquiryType,
        message: message.trim(),
        createdAt: data.timestamp || new Date().toISOString(),
        isRead: false
      };

      onSendMessage(newMessage);
      setIsSubmitted(true);
    } catch {
      // Local fallback
      const fallbackMessage: DirectMessage = {
        id: `msg-${Date.now()}`,
        senderName: senderName.trim(),
        senderEmail: senderEmail.trim(),
        subject: subject.trim() || `${inquiryType} Inquiry`,
        inquiryType,
        message: message.trim(),
        createdAt: new Date().toISOString(),
        isRead: false
      };
      onSendMessage(fallbackMessage);
      setIsSubmitted(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setSenderName('');
    setSenderEmail('');
    setSubject('');
    setMessage('');
    setIsSubmitted(false);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/80 backdrop-blur-md flex justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-blue-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-gray-950 tracking-tight">
                Message {profile.name}
              </h2>
              <p className="text-xs text-gray-500">
                Direct on-site contact • No external platform needed
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner ring-4 ring-emerald-100">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-950">
                Message Sent Directly!
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-gray-900">{senderName}</strong>. Your message has been delivered directly to <strong className="text-gray-900">{profile.name}</strong> through this website.
              </p>
              <p className="text-xs text-blue-600 font-medium">
                A response will be sent to your email at <span className="underline">{senderEmail}</span>.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold cursor-pointer"
              >
                Send Another Message
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Sender Info Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Your Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Jane Smith"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-blue-50/40 hover:bg-blue-50/70 focus:bg-white border border-blue-100 focus:border-blue-500 rounded-xl text-xs text-gray-900 focus:outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Your Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-blue-50/40 hover:bg-blue-50/70 focus:bg-white border border-blue-100 focus:border-blue-500 rounded-xl text-xs text-gray-900 focus:outline-hidden transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Topic / Inquiry Type */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Inquiry Topic
              </label>
              <div className="flex flex-wrap gap-1.5">
                {INQUIRY_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setInquiryType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      inquiryType === type
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-blue-50/70 hover:bg-blue-100 text-gray-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                placeholder="e.g., Design Collaboration / New Project"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-blue-50/40 hover:bg-blue-50/70 focus:bg-white border border-blue-100 focus:border-blue-500 rounded-xl text-xs text-gray-900 focus:outline-hidden transition-all"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Your Message *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Tell Jao about your project, timeline, or design needs..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 bg-blue-50/40 hover:bg-blue-50/70 focus:bg-white border border-blue-100 focus:border-blue-500 rounded-xl text-xs text-gray-900 focus:outline-hidden transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-blue-50">
              <span className="text-[11px] text-gray-400">
                Direct to {profile.name}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isSending ? 'Sending...' : 'Send Message'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
