import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  Sparkles, 
  Eye, 
  ArrowLeft,
  ArrowRight,
  FolderPlus,
  Star,
  Layers,
  Wrench,
  Link,
  Pencil
} from 'lucide-react';
import { Project, ProjectCategory } from '../types';
import { PRESET_SAMPLE_COVERS } from '../data/initialData';

interface PostProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProject: (project: Project) => void;
  initialCategory?: string;
  projectToEdit?: Project | null;
}

const FOLDER_CATEGORIES: ProjectCategory[] = [
  'Amazon Listing',
  'Social Media',
  'Brand Identity',
  'Marketing & Ads',
  'Carousels & Posts',
  'Posters & Banners',
  'Packaging & Print',
  'Motion Graphics'
];

const COMMON_TOOLS = [
  'Adobe Photoshop',
  'Adobe Illustrator',
  'Adobe InDesign',
  'Adobe After Effects',
  'Canva Pro',
  'Procreate',
  'Lightroom',
  'Blender'
];

export const PostProjectModal: React.FC<PostProjectModalProps> = ({
  isOpen,
  onClose,
  onSaveProject,
  initialCategory,
  projectToEdit
}) => {
  const isEditing = Boolean(projectToEdit);

  // Folder / Category selection (defaults to Amazon Listing or initialCategory)
  const [category, setCategory] = useState<ProjectCategory>(() => 
    (initialCategory as ProjectCategory) || 'Amazon Listing'
  );
  const [customFolder, setCustomFolder] = useState('');
  const [isCustomFolder, setIsCustomFolder] = useState(false);

  // Optional custom title / sub-label (e.g. Amazon Design — My Product)
  const [folderTitle, setFolderTitle] = useState('');
  
  // All uploaded images in order (index 0 is ALWAYS the Cover Photo)
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadTab, setUploadTab] = useState<'upload' | 'preset' | 'url'>('upload');

  // Optional details
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [role, setRole] = useState('Graphic Designer');
  const [tagline, setTagline] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>(['Adobe Photoshop']);
  const [featured, setFeatured] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (projectToEdit) {
      // Editing existing project/design
      const cat = projectToEdit.parentFolder || projectToEdit.category || 'Amazon Listing';
      if (FOLDER_CATEGORIES.includes(cat as ProjectCategory)) {
        setCategory(cat as ProjectCategory);
        setIsCustomFolder(false);
        setCustomFolder('');
      } else {
        setIsCustomFolder(true);
        setCustomFolder(cat);
      }
      setFolderTitle(projectToEdit.folderName || projectToEdit.title || '');
      setImages(
        projectToEdit.images && projectToEdit.images.length > 0 
          ? [...projectToEdit.images] 
          : [projectToEdit.coverImage]
      );
      setTagline(projectToEdit.tagline || '');
      setDescription(projectToEdit.description || '');
      setClient(projectToEdit.client || '');
      setRole(projectToEdit.role || 'Senior Graphic Designer');
      setLiveUrl(projectToEdit.liveUrl || '');
      setSelectedTools(
        projectToEdit.tools && projectToEdit.tools.length > 0 
          ? [...projectToEdit.tools] 
          : ['Adobe Photoshop']
      );
      setFeatured(Boolean(projectToEdit.featured));
      if (projectToEdit.description || projectToEdit.client || projectToEdit.liveUrl) {
        setShowAdvanced(true);
      }
      setIsPreview(false);
      setErrorMsg(null);
    } else {
      // Creating new project
      if (initialCategory) {
        setCategory(initialCategory as ProjectCategory);
        setIsCustomFolder(false);
      } else {
        setCategory('Amazon Listing');
        setIsCustomFolder(false);
      }
      setCustomFolder('');
      setFolderTitle('');
      setImages([]);
      setTagline('');
      setDescription('');
      setClient('');
      setRole('Graphic Designer');
      setLiveUrl('');
      setSelectedTools(['Adobe Photoshop']);
      setFeatured(false);
      setShowAdvanced(false);
      setIsPreview(false);
      setErrorMsg(null);
    }
  }, [isOpen, projectToEdit, initialCategory]);

  if (!isOpen) return null;

  const currentFolder = isCustomFolder && customFolder.trim() 
    ? customFolder.trim() 
    : category;

  // Multi-file upload handler
  const handleMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList: File[] = Array.from(files);
    let loadedCount = 0;
    const newImgs: string[] = [];

    fileList.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          newImgs.push(reader.result);
        }
        loadedCount++;
        if (loadedCount === fileList.length) {
          setImages((prev) => [...prev, ...newImgs]);
          setErrorMsg(null);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  // Add single image from URL
  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
      setErrorMsg(null);
    }
  };

  // Add preset sample image
  const handleAddPreset = (url: string) => {
    if (!images.includes(url)) {
      setImages((prev) => [...prev, url]);
      setErrorMsg(null);
    }
  };

  // Set an image as the Cover Photo (moves it to index 0)
  const handleSetAsCover = (index: number) => {
    if (index === 0 || index >= images.length) return;
    setImages((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
  };

  // Move image earlier in order
  const handleMoveEarlier = (index: number) => {
    if (index <= 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
  };

  // Move image later in order
  const handleMoveLater = (index: number) => {
    if (index >= images.length - 1) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleTool = (tool: string) => {
    if (selectedTools.includes(tool)) {
      setSelectedTools(selectedTools.filter((t) => t !== tool));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  // Submit form - all metadata is optional!
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If no images uploaded, guide the user
    if (images.length === 0) {
      setErrorMsg('Please upload at least one image or choose a preset for this folder.');
      setIsPreview(false);
      return;
    }

    const finalParentFolder = currentFolder || 'Amazon Listing';
    const finalSubFolderName = folderTitle.trim() || (finalParentFolder === 'Amazon Listing' ? 'Amazon Design — New Product Listing' : `${finalParentFolder} Design`);
    const finalCover = images[0];

    if (projectToEdit) {
      const updatedProject: Project = {
        ...projectToEdit,
        title: finalSubFolderName,
        folderName: finalSubFolderName,
        parentFolder: finalParentFolder,
        subFolder: finalSubFolderName,
        tagline: tagline.trim() || `${finalSubFolderName} visual assets & graphics.`,
        category: finalParentFolder as ProjectCategory,
        coverImage: finalCover,
        images: images,
        description: description.trim() || `Organized visual design files and showcase images for ${finalSubFolderName}.`,
        client: client.trim() || 'Client Showcase',
        role: role.trim() || 'Senior Graphic Designer',
        tools: selectedTools.length > 0 ? selectedTools : ['Adobe Photoshop'],
        featured,
        liveUrl: liveUrl.trim() || undefined,
      };

      onSaveProject(updatedProject);
    } else {
      const newProject: Project = {
        id: `folder-${Date.now()}`,
        title: finalSubFolderName,
        folderName: finalSubFolderName,
        parentFolder: finalParentFolder,
        subFolder: finalSubFolderName,
        tagline: tagline.trim() || `${finalSubFolderName} visual assets & graphics.`,
        category: finalParentFolder as ProjectCategory,
        coverImage: finalCover,
        images: images,
        description: description.trim() || `Organized visual design files and showcase images for ${finalSubFolderName}.`,
        client: client.trim() || 'Client Showcase',
        role: role.trim() || 'Senior Graphic Designer',
        tools: selectedTools.length > 0 ? selectedTools : ['Adobe Photoshop'],
        likes: Math.floor(Math.random() * 25) + 8,
        views: Math.floor(Math.random() * 350) + 60,
        featured,
        liveUrl: liveUrl.trim() || undefined,
        createdAt: new Date().toISOString().split('T')[0]
      };

      onSaveProject(newProject);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/80 backdrop-blur-sm flex justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-blue-100 max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-md ${
              isEditing 
                ? 'bg-amber-600 text-white shadow-amber-500/20' 
                : 'bg-blue-600 text-white shadow-blue-500/20'
            }`}>
              {isEditing ? <Pencil className="w-5 h-5" /> : <FolderPlus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-950 flex items-center gap-2">
                <span>{isEditing ? 'Edit Design Folder' : 'Upload & Organize Designs'}</span>
                {isEditing && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                    Editing Mode
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-500">
                {isEditing
                  ? `Update images, change cover photo, reorder slides, or edit folder details`
                  : `Create a folder like Amazon Listing or social media visuals in a single group`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className="px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isPreview ? 'Back to Editor' : 'Preview'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {isPreview ? (
            /* Live Preview Mode */
            <div className="space-y-6 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                <span>Previewing folder: <strong>{folderTitle.trim() || currentFolder}</strong> ({images.length} images)</span>
                <button
                  type="button"
                  onClick={() => setIsPreview(false)}
                  className="font-bold underline text-blue-700 hover:text-blue-900"
                >
                  Return to editor
                </button>
              </div>

              {/* Cover card preview */}
              <div className="max-w-md mx-auto rounded-2xl overflow-hidden border border-blue-100 shadow-md">
                <div className="relative aspect-4/3 bg-gray-100">
                  {images.length > 0 ? (
                    <img src={images[0]} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No cover image selected
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-full text-xs font-bold text-gray-800 shadow-xs flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    Cover Photo
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                    {images.length} Images in Folder
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-bold text-gray-950 text-base">
                    {folderTitle.trim() || currentFolder}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {tagline.trim() || `${currentFolder} design project group`}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Step 1: Choose Folder / Group */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-blue-900">
                    1. Select Folder / Group
                  </label>
                  <span className="text-[11px] text-gray-400">
                    Designs are organized cleanly by this folder name
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {FOLDER_CATEGORIES.map((cat) => {
                    const isSelected = !isCustomFolder && category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategory(cat);
                          setIsCustomFolder(false);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 ring-2 ring-blue-400'
                            : 'bg-blue-50/70 hover:bg-blue-100 text-gray-700 hover:text-blue-700'
                        }`}
                      >
                        {cat === 'Amazon Listing' && <Star className="w-3 h-3 text-amber-300 fill-amber-300" />}
                        <span>{cat}</span>
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setIsCustomFolder(true)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isCustomFolder
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 ring-2 ring-blue-400'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    + Custom Folder
                  </button>
                </div>

                {isCustomFolder && (
                  <div className="pt-1">
                    <input
                      type="text"
                      placeholder="Type custom folder name (e.g. Amazon Listing, Etsy Creatives)..."
                      value={customFolder}
                      onChange={(e) => setCustomFolder(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-blue-200 focus:border-blue-600 focus:outline-hidden text-sm"
                    />
                  </div>
                )}

                {/* Sub-folder / Design Listing Name */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Design Folder / Listing Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder={`e.g. ${currentFolder === 'Amazon Listing' ? 'Amazon Design — Wireless ANC Headphones' : `${currentFolder} — Project Alpha`} (Optional)`}
                    value={folderTitle}
                    onChange={(e) => setFolderTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-blue-600 focus:outline-hidden text-sm bg-gray-50/50"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Leave blank to automatically name this folder &ldquo;{currentFolder === 'Amazon Listing' ? 'Amazon Design' : `${currentFolder} Design`}&rdquo;
                  </p>
                </div>
              </div>

              {/* Step 2: Upload Images (First image is Cover Photo, user can reorder or pick cover) */}
              <div className="space-y-4 pt-4 border-t border-blue-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                      <span>2. Upload Images for this Folder</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      The <strong className="text-blue-600">first image is automatically your cover photo</strong>. You can click &ldquo;Set as Cover&rdquo; or reorder anytime!
                    </p>
                  </div>

                  {/* Upload Source Tabs */}
                  <div className="flex items-center gap-1 bg-blue-50/70 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setUploadTab('upload')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        uploadTab === 'upload' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      Upload Files
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadTab('preset')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        uploadTab === 'preset' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      Sample Presets
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadTab('url')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        uploadTab === 'url' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {/* Upload Area: Multi-file Upload */}
                {uploadTab === 'upload' && (
                  <div className="border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-2xl p-6 sm:p-8 text-center bg-blue-50/30 hover:bg-blue-50/60 transition-all">
                    <Upload className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                    <label className="cursor-pointer inline-block">
                      <span className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all">
                        Browse &amp; Select Multiple Images
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleMultipleFiles}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-3">
                      Select one or multiple images at once (PNG, JPG, WEBP).
                    </p>
                  </div>
                )}

                {/* Preset Samples */}
                {uploadTab === 'preset' && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">
                      Click to add sample design mockups into this folder:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {PRESET_SAMPLE_COVERS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddPreset(preset.url)}
                          className="relative rounded-xl overflow-hidden aspect-4/3 border border-gray-200 hover:border-blue-500 transition-all group text-left cursor-pointer"
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-2">
                            <span className="text-[10px] text-white font-semibold line-clamp-1">{preset.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Image URL */}
                {uploadTab === 'url' && (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-blue-600 focus:outline-hidden text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                    >
                      + Add Image
                    </button>
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
                    {errorMsg}
                  </div>
                )}

                {/* Interactive Images List (Visual Cover Photo + Re-ordering) */}
                {images.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800">
                        {images.length} Image{images.length > 1 ? 's' : ''} in this Folder:
                      </span>
                      <span className="text-[11px] text-blue-600 font-medium">
                        First image (marked &ldquo;Cover&rdquo;) will be shown on the portfolio card
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {images.map((img, idx) => {
                        const isCover = idx === 0;
                        return (
                          <div
                            key={idx}
                            className={`relative rounded-2xl overflow-hidden border p-2 bg-white transition-all ${
                              isCover 
                                ? 'border-blue-600 ring-2 ring-blue-400/40 shadow-md' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-gray-100 mb-2">
                              <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                              
                              {/* Cover Badge on First Image */}
                              {isCover && (
                                <div className="absolute top-2 left-2 bg-blue-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                                  <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                                  <span>Cover Photo</span>
                                </div>
                              )}

                              {!isCover && (
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                                  #{idx + 1}
                                </div>
                              )}
                            </div>

                            {/* Controls: Make Cover, Reorder, Delete */}
                            <div className="flex items-center justify-between gap-1 pt-1">
                              {!isCover ? (
                                <button
                                  type="button"
                                  onClick={() => handleSetAsCover(idx)}
                                  className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                                  title="Make this the Cover Photo (shown first)"
                                >
                                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                  <span>Set as Cover</span>
                                </button>
                              ) : (
                                <span className="text-[11px] font-bold text-blue-700 flex items-center gap-1 px-1">
                                  <Check className="w-3 h-3" />
                                  <span>Current Cover</span>
                                </span>
                              )}

                              <div className="flex items-center gap-1">
                                {idx > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveEarlier(idx)}
                                    className="p-1 rounded-md hover:bg-gray-100 text-gray-600 cursor-pointer"
                                    title="Move earlier"
                                  >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {idx < images.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveLater(idx)}
                                    className="p-1 rounded-md hover:bg-gray-100 text-gray-600 cursor-pointer"
                                    title="Move later"
                                  >
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="p-1 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 cursor-pointer ml-1"
                                  title="Remove image"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Optional Details (Collapsible & 100% Optional) */}
              <div className="pt-4 border-t border-blue-50">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-left py-2 text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <span className="uppercase tracking-wider">
                    {showAdvanced ? '− Hide Optional Details (Client, Notes, Tools)' : '+ Add Optional Details (Client, Notes, Tools)'}
                  </span>
                  <span className="text-gray-400 text-[11px] font-normal">
                    (All optional — no need to fill)
                  </span>
                </button>

                {showAdvanced && (
                  <div className="space-y-4 pt-3 animate-in fade-in">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Caption / Project Notes (Optional)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Brief notes about this design set, product features, or client goals..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-blue-600 focus:outline-hidden text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Client / Brand (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Amazon Seller, Oligarch Media"
                          value={client}
                          onChange={(e) => setClient(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          External Link / Behance (Optional)
                        </label>
                        <input
                          type="url"
                          placeholder="https://behance.net/..."
                          value={liveUrl}
                          onChange={(e) => setLiveUrl(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Tools Used (Optional)
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {COMMON_TOOLS.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => handleToggleTool(t)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              selectedTools.includes(t)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {selectedTools.includes(t) ? '✓ ' : '+ '} {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="featured-check"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded-sm border-gray-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="featured-check" className="text-xs font-medium text-gray-700 cursor-pointer">
                        Feature this folder at the top of your portfolio
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-blue-50 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-submit-post-project"
                  className={`px-6 py-2.5 rounded-xl text-white text-sm font-bold shadow-md transition-all cursor-pointer flex items-center gap-2 ${
                    isEditing
                      ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Changes to Folder</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Publish Folder ({currentFolder})</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
