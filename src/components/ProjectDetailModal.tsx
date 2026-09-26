import React, { useEffect, useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Trash2,
  FolderOpen,
  Folder,
  Images,
  Grid,
  Maximize2,
  Mail,
  Sparkles,
  Star,
  Check,
  Pencil
} from 'lucide-react';
import { Project, UserProfile } from '../types';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
  onDeleteProject?: (projectId: string) => void;
  onNextProject?: () => void;
  onPrevProject?: () => void;
  onOpenContactModal?: () => void;
  isOwner?: boolean;
  profile: UserProfile;
  onUpdateProject?: (updated: Project) => void;
  onEditProject?: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onDeleteProject,
  onNextProject,
  onPrevProject,
  onOpenContactModal,
  isOwner = false,
  profile,
  onUpdateProject,
  onEditProject
}) => {
  // Gallery view mode: 'grid' (all images organized together) or 'slides' (full width scroll)
  const [viewMode, setViewMode] = useState<'grid' | 'slides'>('grid');
  
  // Full-screen lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const imagesList = project.images && project.images.length > 0
    ? project.images
    : [project.coverImage];

  const parentFolder = project.parentFolder || project.category || 'Amazon Listing';
  const displayTitle = project.folderName || project.title || `${parentFolder} Design`;

  // Set an image as cover directly in modal
  const handleSetCover = (index: number) => {
    if (index === 0 || !onUpdateProject) return;
    const newImages = [...imagesList];
    const [selected] = newImages.splice(index, 1);
    const updatedImages = [selected, ...newImages];
    onUpdateProject({
      ...project,
      coverImage: selected,
      images: updatedImages
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) {
          setLightboxIndex(null);
        } else {
          onClose();
        }
      }
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowRight') {
          setLightboxIndex((prev) => (prev! + 1) % imagesList.length);
        }
        if (e.key === 'ArrowLeft') {
          setLightboxIndex((prev) => (prev! - 1 + imagesList.length) % imagesList.length);
        }
      } else {
        if (e.key === 'ArrowRight' && onNextProject) onNextProject();
        if (e.key === 'ArrowLeft' && onPrevProject) onPrevProject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNextProject, onPrevProject, lightboxIndex, imagesList.length]);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/80 backdrop-blur-md flex justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
        
        {/* Main Modal Card */}
        <div 
          className="relative bg-white w-full max-w-5xl rounded-none sm:rounded-3xl shadow-2xl flex flex-col my-auto border border-blue-100 overflow-hidden min-h-screen sm:min-h-0 sm:max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Breadcrumb */}
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-blue-100/80 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
            
            {/* Folder / Creator details & Breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-200 flex-shrink-0"
              />
              <div className="min-w-0">
                {/* Hierarchical Breadcrumb */}
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={onClose}
                    className="font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md"
                  >
                    <Folder className="w-3 h-3 text-blue-600" />
                    <span>{parentFolder}</span>
                  </button>
                  <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-500 font-medium truncate">
                    {imagesList.length} {imagesList.length === 1 ? 'Design' : 'Designs'}
                  </span>
                </div>

                <h2 className="text-sm sm:text-base font-bold text-gray-950 truncate mt-0.5">
                  {displayTitle}
                </h2>
              </div>
            </div>

            {/* View Mode Toggle, Edit & Close */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {onEditProject && (
                <button
                  type="button"
                  onClick={() => onEditProject(project)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  title="Edit this design listing, change cover, or add/remove images"
                >
                  <Pencil className="w-3.5 h-3.5 text-blue-600" />
                  <span>Edit Design</span>
                </button>
              )}

              <div className="hidden sm:flex items-center gap-1 bg-blue-50/70 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    viewMode === 'grid' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-600 hover:text-blue-600'
                  }`}
                  title="Grid Gallery View"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Grid View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('slides')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    viewMode === 'slides' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-600 hover:text-blue-600'
                  }`}
                  title="Full Slides View"
                >
                  <Images className="w-3.5 h-3.5" />
                  <span>Slides View</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors focus:outline-hidden cursor-pointer"
                aria-label="Close folder"
                title="Close folder"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-8 space-y-6 max-h-[calc(88vh-70px)] overflow-y-auto">
            
            {/* Folder Banner & Clean Summary (NO YEAR) */}
            <div className="space-y-3 max-w-4xl mx-auto">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>{parentFolder}</span>
                </button>
                
                <span className="bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Images className="w-3.5 h-3.5 text-blue-600" />
                  <span>{imagesList.length} Listing Images in Folder</span>
                </span>

                {project.featured && (
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" /> Featured
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight leading-tight">
                {displayTitle}
              </h1>

              {project.tagline && (
                <p className="text-base text-gray-600 font-medium leading-relaxed">
                  {project.tagline}
                </p>
              )}
            </div>

            {/* Quick Helper Note */}
            <div className="max-w-4xl mx-auto flex items-center justify-between p-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900">
              <span className="flex items-center gap-1.5">
                <Images className="w-4 h-4 text-blue-600" />
                <span>All designs in this <strong>{parentFolder}</strong> folder are organized below. Click any image for full-screen inspection.</span>
              </span>
              <span className="hidden sm:inline font-semibold text-blue-700">
                {imagesList.length} Total Graphics
              </span>
            </div>

            {/* View Mode 1: Organized Gallery Grid (Hero, Infographics, Lifestyle, Features) */}
            {viewMode === 'grid' && (
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {imagesList.map((imgUrl, idx) => {
                    const isCover = idx === 0;
                    return (
                      <div
                        key={idx}
                        className={`group relative rounded-2xl overflow-hidden border bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col ${
                          isCover ? 'sm:col-span-2 sm:aspect-16/10' : 'aspect-4/3'
                        }`}
                      >
                        <div 
                          className="relative w-full h-full cursor-pointer"
                          onClick={() => setLightboxIndex(idx)}
                        >
                          <img 
                            src={imgUrl} 
                            alt={`${parentFolder} image ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3.5 text-white">
                            <span className="text-xs font-bold">
                              {isCover ? '★ Cover Image' : `Slide #${idx + 1}`}
                            </span>
                            <span className="p-1.5 rounded-lg bg-white/20 backdrop-blur-xs hover:bg-white/40">
                              <Maximize2 className="w-4 h-4" />
                            </span>
                          </div>

                          {/* Top Left Tag */}
                          <div className="absolute top-2.5 left-2.5">
                            {isCover ? (
                              <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-md shadow-md flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                                <span>Cover Photo</span>
                              </span>
                            ) : (
                              <span className="bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs">
                                #{idx + 1}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Set as Cover Action Bar */}
                        {onUpdateProject && !isCover && (
                          <div className="p-2 bg-white border-t border-gray-100 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => handleSetCover(idx)}
                              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              <span>Set as Cover Photo</span>
                            </button>
                            <span className="text-[10px] text-gray-400">Position #{idx + 1}</span>
                          </div>
                        )}

                        {isCover && (
                          <div className="p-2 bg-blue-50/50 border-t border-blue-100 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-blue-700 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>Primary Cover Photo</span>
                            </span>
                            <span className="text-[10px] text-blue-500">First Image</span>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* View Mode 2: Full Slides View */}
            {viewMode === 'slides' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                {imagesList.map((imgUrl, idx) => (
                  <div 
                    key={idx} 
                    className="rounded-2xl overflow-hidden shadow-lg border border-blue-100 bg-gray-100 relative group cursor-pointer"
                    onClick={() => setLightboxIndex(idx)}
                  >
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-black/70 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                        {idx === 0 && <Star className="w-3 h-3 text-amber-300 fill-amber-300" />}
                        <span>{idx === 0 ? 'Cover Photo' : `Slide ${idx + 1} of ${imagesList.length}`}</span>
                      </span>
                    </div>

                    <img 
                      src={imgUrl} 
                      alt={`${parentFolder} slide ${idx + 1}`}
                      className="w-full h-auto object-cover max-h-[700px]"
                    />

                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-black/70 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Click to Enlarge</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Project Notes / Description (Only shown if filled) */}
            {project.description && (
              <div className="max-w-4xl mx-auto pt-4 space-y-2">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-blue-900">
                  Folder Overview &amp; Concept
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
                  {project.description}
                </p>
              </div>
            )}

            {/* Tools Used (Only shown if available) */}
            {project.tools && project.tools.length > 0 && (
              <div className="max-w-4xl mx-auto pt-2 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Tools &amp; Software Used
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.tools.map((tool, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-100"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Contact Banner */}
            <div className="max-w-4xl mx-auto p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg mt-6">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-lg font-black tracking-tight">
                  Need design work like this for your brand?
                </h4>
                <p className="text-blue-100 text-xs sm:text-sm max-w-md">
                  Contact Joemarie Gulapa Pangan directly for Amazon listings, social media creatives, and visual assets.
                </p>
              </div>

              {onOpenContactModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenContactModal();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs sm:text-sm hover:bg-blue-50 transition-all shadow-md flex items-center gap-2 flex-shrink-0 cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-blue-700" />
                  <span>Send Direct Message</span>
                </button>
              )}
            </div>

          </div>

          {/* Modal Footer Controls */}
          <div className="border-t border-blue-100 bg-white px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {onPrevProject && (
                <button
                  onClick={onPrevProject}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-blue-50 text-gray-700 hover:text-blue-700 text-xs font-semibold transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous Folder</span>
                </button>
              )}

              {onNextProject && (
                <button
                  onClick={onNextProject}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-blue-50 text-gray-700 hover:text-blue-700 text-xs font-semibold transition-all cursor-pointer"
                >
                  <span className="hidden sm:inline">Next Folder</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {onEditProject && (
                <button
                  type="button"
                  onClick={() => onEditProject(project)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                  title="Edit images, cover photo, title, or details"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Design</span>
                </button>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-semibold"
                >
                  <span>Project Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {onDeleteProject && (
                <button
                  onClick={() => {
                    if (confirm(`Remove folder "${displayTitle}" from your portfolio?`)) {
                      onDeleteProject(project.id);
                      onClose();
                    }
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Delete this folder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox Full-Screen Viewer */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="relative max-w-6xl max-h-[95vh] w-full flex flex-col items-center justify-center">
            
            {/* Top Bar */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20" onClick={(e) => e.stopPropagation()}>
              <div className="bg-black/60 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xs flex items-center gap-2">
                <span>{parentFolder}</span>
                <span>•</span>
                <span>Slide {lightboxIndex + 1} of {imagesList.length}</span>
              </div>

              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Prev Image Button */}
            {imagesList.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev! - 1 + imagesList.length) % imagesList.length);
                }}
                className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white transition-colors cursor-pointer z-20"
                title="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* The Image */}
            <div className="p-2 max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img 
                src={imagesList[lightboxIndex]} 
                alt={`${parentFolder} image ${lightboxIndex + 1}`}
                className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Next Image Button */}
            {imagesList.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev! + 1) % imagesList.length);
                }}
                className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white transition-colors cursor-pointer z-20"
                title="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

          </div>
        </div>
      )}
    </>
  );
};
