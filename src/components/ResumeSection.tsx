import React from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  CheckCircle, 
  Download, 
  Printer, 
  Mail, 
  MapPin, 
  Phone, 
  ExternalLink, 
  Edit3, 
  Quote, 
  Sparkles,
  Calendar,
  Layers,
  Star
} from 'lucide-react';
import { UserProfile } from '../types';

interface ResumeSectionProps {
  profile: UserProfile;
  onOpenEditProfile: () => void;
  onOpenContactModal?: () => void;
  isOwner?: boolean;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({
  profile,
  onOpenEditProfile,
  onOpenContactModal,
  isOwner = false
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="py-8 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Resume Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-3xl bg-blue-50/70 border border-blue-100 no-print">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Curriculum Vitae &amp; Background
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950">
              {profile.name} — Resume
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              {profile.headline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {onOpenContactModal && (
              <button
                onClick={onOpenContactModal}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
                title="Send a message directly on this website"
              >
                <Mail className="w-4 h-4" />
                <span>Message Me</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
              title="Print or save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            {isOwner && (
              <button
                onClick={onOpenEditProfile}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs sm:text-sm font-medium transition-all cursor-pointer"
                title="Edit resume info"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit Details</span>
              </button>
            )}
          </div>
        </div>

        {/* Printable Resume Header (Visible in print or clean view) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-blue-50 pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
                {profile.name}
              </h1>
              <p className="text-lg font-bold text-blue-600 mt-1">
                {profile.headline}
              </p>
              <p className="text-sm text-gray-500 mt-1 max-w-xl">
                {profile.tagline}
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-gray-600 text-left sm:text-right flex-shrink-0">
              <p className="flex items-center sm:justify-end gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>{profile.email}</span>
              </p>
              <p className="flex items-center sm:justify-end gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{profile.location}</span>
              </p>
              <p className="flex items-center sm:justify-end gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>{profile.phone}</span>
              </p>
            </div>
          </div>

          {/* Executive Summary / About Me */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>About Me &amp; Professional Philosophy</span>
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {profile.bio}
            </p>
          </div>
        </div>

        {/* Work Experience Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-blue-50 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-950">Work Experience</h3>
                <p className="text-xs text-gray-500">Track record of high-engagement social media campaigns and brand design</p>
              </div>
            </div>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-blue-100">
            {profile.experience.map((exp) => (
              <div key={exp.id} className="relative pl-9 space-y-2">
                {/* Timeline node */}
                <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white" />

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div>
                    <h4 className="text-base font-bold text-gray-950">
                      {exp.role}
                    </h4>
                    <p className="text-sm font-semibold text-blue-600">
                      {exp.company}
                    </p>
                  </div>
                  <div className="text-xs font-medium text-gray-500 sm:text-right flex items-center sm:justify-end gap-2">
                    <span>{exp.period}</span>
                    <span>•</span>
                    <span>{exp.location}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {exp.description}
                </p>

                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="space-y-1.5 pt-1">
                    {exp.achievements.map((ach, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className="text-blue-600 font-bold mt-0.5">▸</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {exp.skills && exp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {exp.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Skills & Technical Capabilities Matrix */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-blue-50 pb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-950">Core Skills &amp; Proficiencies</h3>
              <p className="text-xs text-gray-500">Design disciplines, software suites, and technical capabilities</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profile.skills.map((cat, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-blue-50/40 border border-blue-100/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-blue-100 pb-2">
                  {cat.category}
                </h4>
                <div className="space-y-2.5">
                  {cat.items.map((skill, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-gray-800">{skill.name}</span>
                        <span className="text-blue-700 font-bold">{skill.level}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Awards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Education */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-blue-50 pb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-gray-950">Education &amp; Credentials</h3>
            </div>

            <div className="space-y-4">
              {profile.education.map((edu) => (
                <div key={edu.id} className="p-3.5 rounded-2xl bg-blue-50/30 border border-blue-100">
                  <h4 className="text-sm font-bold text-gray-950">{edu.degree}</h4>
                  <p className="text-xs font-semibold text-blue-700 mt-0.5">{edu.institution}</p>
                  <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                    <span>{edu.year}</span>
                    {edu.honors && <span className="font-medium text-emerald-700">{edu.honors}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Awards */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-blue-50 pb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-gray-950">Honors &amp; Recognition</h3>
            </div>

            <div className="space-y-4">
              {profile.awards.map((aw) => (
                <div key={aw.id} className="p-3.5 rounded-2xl bg-blue-50/30 border border-blue-100">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-gray-950">{aw.title}</h4>
                    <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                      {aw.year}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-blue-700 mt-0.5">{aw.issuer}</p>
                  {aw.description && (
                    <p className="text-xs text-gray-500 mt-1">{aw.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Client Recommendations / Testimonials */}
        {profile.testimonials && profile.testimonials.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 border-b border-blue-50 pb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Quote className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-950">Client Recommendations</h3>
                <p className="text-xs text-gray-500">What design directors and founders say about collaborating</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.testimonials.map((t) => (
                <div 
                  key={t.id} 
                  className="p-6 rounded-2xl bg-linear-to-b from-blue-50/60 to-white border border-blue-100 flex flex-col justify-between space-y-4"
                >
                  <p className="text-sm text-gray-700 italic leading-relaxed">
                    "{t.quote}"
                  </p>

                  <div className="flex items-center gap-3 pt-2 border-t border-blue-100">
                    {t.avatar && (
                      <img 
                        src={t.avatar} 
                        alt={t.clientName} 
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-200" 
                      />
                    )}
                    <div>
                      <p className="text-xs font-bold text-gray-900">{t.clientName}</p>
                      <p className="text-[11px] text-gray-500">{t.clientRole}, {t.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Export action at bottom of Resume */}
        <div className="p-8 rounded-3xl bg-linear-to-r from-blue-900 via-blue-800 to-blue-700 text-white text-center space-y-4 no-print shadow-xl">
          <h3 className="text-2xl font-extrabold tracking-tight">
            Curriculum Vitae &amp; Background
          </h3>
          <p className="text-blue-100 text-sm max-w-lg mx-auto">
            You can print or save a clean, formatted PDF copy of this complete resume and credentials.
          </p>
          <div className="flex items-center justify-center pt-2">
            <button
              onClick={handlePrint}
              className="px-6 py-3 rounded-xl bg-white text-blue-900 font-bold text-sm shadow-md hover:bg-blue-50 transition-all cursor-pointer flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Download / Print PDF Resume</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
