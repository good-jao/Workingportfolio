import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  ArrowUpRight, 
  SlidersHorizontal, 
  Folder,
  Sparkles,
  Layers,
  Images,
  FolderOpen,
  ChevronRight,
  ArrowLeft,
  LayoutGrid,
  Pencil
} from 'lucide-react';
import { Project, ProjectCategory } from '../types';

interface PortfolioGridProps {
  projects: Project[];
  searchQuery: string;
  onSelectProject: (project: Project) => void;
  onOpenPostModal: (presetCategory?: string) => void;
  isOwner?: boolean;
  onEditProject?: (project: Project) => void;
}

const CATEGORIES: ProjectCategory[] = [
  'All',
  'Amazon Listing',
  'Social Media',
  'Brand Identity',
  'Marketing & Ads',
  'Carousels & Posts',
  'Posters & Banners',
  'Packaging & Print',
  'Motion Graphics'
];

type SortOption = 'featured' | 'newest' | 'images' | 'az';

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({
  projects,
  searchQuery,
  onSelectProject,
  onOpenPostModal,
  isOwner = false,
  onEditProject
}) => {
  // Navigation: activeMasterFolder controls whether we are inside a parent folder (e.g. 'Amazon Listing')
  const [activeMasterFolder, setActiveMasterFolder] = useState<string | null>(null);
  
  // View mode: 'folders' (hierarchical master folders view) or 'all' (flat list of all design projects)
  const [viewMode, setViewMode] = useState<'folders' | 'all'>('folders');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Compute master folders from projects
  const masterFolders = useMemo(() => {
    // Collect all unique parent folders / categories
    const folderMap = new Map<string, {
      name: string;
      coverImage: string;
      subFolders: Project[];
      totalImages: number;
      tagline?: string;
    }>();

    // Default predefined order
    const priorityCategories = [
      'Amazon Listing',
      'Social Media',
      'Brand Identity',
      'Posters & Banners',
      'Carousels & Posts',
      'Marketing & Ads',
      'Packaging & Print'
    ];

    projects.forEach((proj) => {
      const parentName = proj.parentFolder || proj.category || 'General';
      if (!folderMap.has(parentName)) {
        folderMap.set(parentName, {
          name: parentName,
          coverImage: proj.coverImage,
          subFolders: [],
          totalImages: 0,
          tagline: proj.tagline
        });
      }
      const folder = folderMap.get(parentName)!;
      folder.subFolders.push(proj);
      folder.totalImages += proj.images?.length || 1;
    });

    const result = Array.from(folderMap.values());

    // Sort with priority categories first
    result.sort((a, b) => {
      const idxA = priorityCategories.indexOf(a.name);
      const idxB = priorityCategories.indexOf(b.name);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [projects]);

  // When searching, auto-switch to flat search view
  const isSearching = searchQuery.trim().length > 0;

  // Filtered sub-folders / projects when inside a master folder
  const currentSubFolders = useMemo(() => {
    if (!activeMasterFolder) return [];
    return projects.filter(
      (p) => (p.parentFolder || p.category) === activeMasterFolder
    );
  }, [projects, activeMasterFolder]);

  // Filter and sort all projects (for flat view or search results)
  const filteredAndSortedProjects = useMemo(() => {
    return projects
      .filter((project) => {
        const parentName = project.parentFolder || project.category;
        const matchesCategory = 
          selectedCategory === 'All' || 
          project.category === selectedCategory ||
          parentName === selectedCategory ||
          project.folderName === selectedCategory;
        const matchesSearch = 
          !searchQuery.trim() ||
          (project.title && project.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (project.folderName && project.folderName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (project.category && project.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (project.parentFolder && project.parentFolder.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (project.tagline && project.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (project.client && project.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (project.tools && project.tools.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'images') {
          return (b.images?.length || 1) - (a.images?.length || 1);
        }
        if (sortBy === 'az') {
          const titleA = a.folderName || a.title || a.category;
          const titleB = b.folderName || b.title || b.category;
          return titleA.localeCompare(titleB);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [projects, selectedCategory, searchQuery, sortBy]);

  // Handle category chip click
  const handleCategoryClick = (cat: ProjectCategory) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      setActiveMasterFolder(null);
    } else {
      // Direct jump into the chosen category's master folder
      setActiveMasterFolder(cat);
    }
  };

  return (
    <section className="py-8 bg-white min-h-[550px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Controls Bar: Categories & Sorting */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-blue-50">
          
          {/* Scrollable Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const count = cat === 'All' 
                ? projects.length 
                : projects.filter(p => (p.parentFolder || p.category) === cat).length;
              const isSelected = (activeMasterFolder === cat) || (activeMasterFolder === null && selectedCategory === cat && cat === 'All');
              const isAmazon = cat === 'Amazon Listing';

              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs shadow-blue-600/20'
                      : isAmazon
                        ? 'bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100'
                        : 'bg-blue-50/70 hover:bg-blue-100 text-gray-700 hover:text-blue-700'
                  }`}
                >
                  <Folder className="w-3 h-3" />
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected 
                      ? 'bg-blue-700 text-white' 
                      : isAmazon 
                        ? 'bg-amber-200 text-amber-900' 
                        : 'bg-white text-gray-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle & Sort Selector */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3 text-xs">
            {!isSearching && (
              <div className="flex items-center bg-blue-50/60 p-1 rounded-xl border border-blue-100/70">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('folders');
                    setActiveMasterFolder(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'folders' && !activeMasterFolder
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Folder className="w-3.5 h-3.5" />
                  <span>Master Folders</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('all');
                    setActiveMasterFolder(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'all'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>All Designs</span>
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 bg-blue-50/50 px-2.5 py-1.5 rounded-lg border border-blue-100">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-gray-900 font-semibold focus:outline-hidden cursor-pointer text-xs"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest First</option>
                <option value="images">Most Images</option>
                <option value="az">Folder Name (A-Z)</option>
              </select>
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* CASE 1: INSIDE A MASTER FOLDER (e.g. "Amazon Listing")        */}
        {/* ------------------------------------------------------------- */}
        {activeMasterFolder && !isSearching && (
          <div className="pt-6 space-y-6">
            
            {/* Interactive Breadcrumb & Master Folder Header */}
            <div className="bg-gradient-to-r from-blue-50/80 via-blue-50/30 to-amber-50/40 rounded-2xl p-5 sm:p-6 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              <div className="space-y-2">
                {/* Breadcrumb path */}
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                  <button
                    onClick={() => {
                      setActiveMasterFolder(null);
                      setSelectedCategory('All');
                    }}
                    className="hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Folder className="w-3.5 h-3.5 text-blue-600" />
                    <span>All Folders</span>
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>{activeMasterFolder}</span>
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <h2 className="text-xl sm:text-2xl font-black text-gray-950">
                    {activeMasterFolder}
                  </h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                    {currentSubFolders.length} {currentSubFolders.length === 1 ? 'Design Folder' : 'Design Folders'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 max-w-2xl">
                  {activeMasterFolder === 'Amazon Listing'
                    ? 'Browse individual product listing folders. Click any design folder to view all Amazon product infographics, lifestyle images, and dimensions.'
                    : `Organized design project folders inside ${activeMasterFolder}. Click any folder to inspect all high-resolution design assets.`}
                </p>
              </div>

              {/* Action Buttons: Back + Add New Subfolder */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMasterFolder(null);
                    setSelectedCategory('All');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 border border-blue-200 text-gray-700 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Folders</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenPostModal(activeMasterFolder)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ New {activeMasterFolder === 'Amazon Listing' ? 'Amazon Design' : 'Design'} Folder</span>
                </button>
              </div>

            </div>

            {/* Sub-Folders Grid inside Master Folder */}
            {currentSubFolders.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FolderOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-950">No designs inside {activeMasterFolder} yet</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  Click the button below to upload images and create the first design folder inside {activeMasterFolder}.
                </p>
                <button
                  onClick={() => onOpenPostModal(activeMasterFolder)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create First Design Folder</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {currentSubFolders.map((subFolder) => {
                  const imageCount = subFolder.images ? subFolder.images.length : 1;
                  const displayTitle = subFolder.folderName || subFolder.title;

                  return (
                    <div
                      key={subFolder.id}
                      onClick={() => onSelectProject(subFolder)}
                      className="group relative bg-white rounded-2xl overflow-hidden border border-blue-100 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                    >
                      {/* Cover Photo */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                        <img
                          src={subFolder.coverImage}
                          alt={displayTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                          <div className="flex justify-between items-center">
                            <span className="bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                              <Images className="w-3.5 h-3.5 text-blue-400" />
                              <span>{imageCount} {imageCount === 1 ? 'Design' : 'Designs'}</span>
                            </span>

                            <span className="w-8 h-8 rounded-full bg-white/95 text-gray-900 flex items-center justify-center shadow-md">
                              <ArrowUpRight className="w-4 h-4 text-blue-600" />
                            </span>
                          </div>

                          <div className="text-white space-y-1">
                            <p className="text-xs text-blue-300 font-bold uppercase tracking-wider">
                              Click to view all {imageCount} listing designs &amp; infographics
                            </p>
                            {subFolder.tagline && (
                              <p className="text-xs text-gray-200 line-clamp-2">{subFolder.tagline}</p>
                            )}
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 group-hover:opacity-0 transition-opacity">
                          <span className="bg-white/95 backdrop-blur-sm text-gray-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-100 shadow-xs flex items-center gap-1">
                            <Folder className="w-3 h-3 text-blue-600" />
                            <span>Design Folder</span>
                          </span>

                          <span className="bg-gray-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                            <Images className="w-2.5 h-2.5" />
                            <span>{imageCount}</span>
                          </span>
                        </div>

                        {/* Top Right Edit Button */}
                        {onEditProject && (
                          <div className="absolute top-3 right-3 z-10">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditProject(subFolder);
                              }}
                              className="px-2.5 py-1 rounded-full bg-white/95 hover:bg-white text-gray-800 hover:text-blue-700 text-xs font-bold shadow-md border border-blue-100 flex items-center gap-1 transition-all cursor-pointer backdrop-blur-xs hover:scale-105"
                              title="Edit this design folder and images"
                            >
                              <Pencil className="w-3 h-3 text-blue-600" />
                              <span>Edit</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Card Content (NO YEAR) */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold mb-1">
                            <FolderOpen className="w-3.5 h-3.5" />
                            <span>{activeMasterFolder} Design</span>
                          </div>
                          <h3 className="text-base font-bold text-gray-950 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {displayTitle}
                          </h3>
                          {subFolder.tagline && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {subFolder.tagline}
                            </p>
                          )}
                        </div>

                        {/* Footer row */}
                        <div className="mt-4 pt-3 border-t border-blue-50/80 flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1.5 font-medium text-gray-600">
                            <Images className="w-3.5 h-3.5 text-gray-400" />
                            <span>{imageCount} {imageCount === 1 ? 'Design' : 'Designs'}</span>
                            {subFolder.client && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-[110px]">{subFolder.client}</span>
                              </>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {onEditProject && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditProject(subFolder);
                                }}
                                className="text-xs font-bold text-gray-500 hover:text-blue-600 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                                title="Edit this design"
                              >
                                <Pencil className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                            )}
                            <div className="flex items-center gap-1 font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                              <span>Open</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CASE 2: ROOT MASTER FOLDERS VIEW (e.g. Amazon Listing folder) */}
        {/* ------------------------------------------------------------- */}
        {!activeMasterFolder && viewMode === 'folders' && !isSearching && (
          <div className="pt-6 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-950 flex items-center gap-2">
                  <Folder className="w-6 h-6 text-blue-600" />
                  <span>Portfolio Folders</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Select a category folder (e.g. <strong className="text-blue-700">Amazon Listing</strong>) to view its sub-folders and designs
                </p>
              </div>

              {isOwner && (
                <button
                  onClick={() => onOpenPostModal()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Upload &amp; Create Folder</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {masterFolders.map((folder) => {
                const isAmazon = folder.name === 'Amazon Listing';

                return (
                  <div
                    key={folder.name}
                    onClick={() => {
                      setActiveMasterFolder(folder.name);
                      setSelectedCategory(folder.name as ProjectCategory);
                    }}
                    className={`group relative bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col cursor-pointer ${
                      isAmazon 
                        ? 'border-amber-300 shadow-md hover:shadow-2xl hover:border-amber-500 ring-2 ring-amber-400/20' 
                        : 'border-blue-100 hover:border-blue-400 hover:shadow-xl'
                    }`}
                  >
                    {/* Master Folder Cover Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                      <img
                        src={folder.coverImage}
                        alt={folder.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Folder Overlay with Subfolder summary */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                        <div className="flex justify-between items-center">
                          <span className="bg-black/60 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                            <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
                            <span>{folder.subFolders.length} {folder.subFolders.length === 1 ? 'Design Folder' : 'Design Folders'}</span>
                          </span>

                          <span className="w-9 h-9 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-lg">
                            <ArrowUpRight className="w-5 h-5 text-blue-600" />
                          </span>
                        </div>

                        <div className="text-white space-y-1">
                          <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                            Click to open {folder.name} folder
                          </p>
                          <p className="text-xs text-gray-200">
                            Contains {folder.subFolders.length} product design {folder.subFolders.length === 1 ? 'folder' : 'folders'} with {folder.totalImages} total graphics
                          </p>
                        </div>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className={`text-[11px] font-black px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 backdrop-blur-sm ${
                          isAmazon 
                            ? 'bg-amber-400 text-gray-950' 
                            : 'bg-white/95 text-gray-900 border border-blue-100'
                        }`}>
                          <Folder className="w-3.5 h-3.5 text-blue-700" />
                          <span>{folder.name}</span>
                        </span>

                        <span className="bg-gray-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                          <Images className="w-3 h-3 text-blue-400" />
                          <span>{folder.totalImages} Images</span>
                        </span>
                      </div>

                    </div>

                    {/* Master Folder Card Bottom */}
                    <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold mb-1">
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span>Master Category Folder</span>
                        </div>
                        <h3 className="text-lg font-black text-gray-950 group-hover:text-blue-600 transition-colors">
                          {folder.name}
                        </h3>
                        {folder.tagline && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {folder.tagline}
                          </p>
                        )}
                      </div>

                      {/* Folder Footer */}
                      <div className="mt-4 pt-3 border-t border-blue-50 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-medium text-gray-600">
                          <span className="font-bold text-gray-900">{folder.subFolders.length}</span>
                          <span>{folder.subFolders.length === 1 ? 'Folder' : 'Folders'} inside</span>
                          <span>•</span>
                          <span>{folder.totalImages} Designs</span>
                        </div>

                        <div className="flex items-center gap-1 font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                          <span>Open Folder</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CASE 3: FLAT ALL-DESIGNS VIEW OR ACTIVE SEARCH RESULTS        */}
        {/* ------------------------------------------------------------- */}
        {((!activeMasterFolder && viewMode === 'all') || isSearching) && (
          <div className="pt-6 space-y-6">
            
            {isSearching && (
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-700">
                  Search results for <strong className="text-blue-600">"{searchQuery}"</strong> ({filteredAndSortedProjects.length} found)
                </span>
              </div>
            )}

            {filteredAndSortedProjects.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Layers className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-950">No designs found</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  {searchQuery 
                    ? `No design projects match "${searchQuery}". Try a different keyword.` 
                    : `No designs found.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredAndSortedProjects.map((project) => {
                  const imageCount = project.images ? project.images.length : 1;
                  const displayTitle = project.folderName || project.title;
                  const parentName = project.parentFolder || project.category;

                  return (
                    <div
                      key={project.id}
                      onClick={() => onSelectProject(project)}
                      className="group relative bg-white rounded-2xl overflow-hidden border border-blue-100 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                        <img
                          src={project.coverImage}
                          alt={displayTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                          <div className="flex justify-between items-center">
                            <span className="bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                              <Images className="w-3.5 h-3.5 text-blue-400" />
                              <span>{imageCount} {imageCount === 1 ? 'Design' : 'Designs'}</span>
                            </span>

                            <span className="w-8 h-8 rounded-full bg-white/95 text-gray-900 flex items-center justify-center shadow-md">
                              <ArrowUpRight className="w-4 h-4 text-blue-600" />
                            </span>
                          </div>

                          <div className="text-white space-y-1">
                            <p className="text-xs text-blue-300 font-bold uppercase tracking-wider">
                              Click to view all {imageCount} images
                            </p>
                          </div>
                        </div>

                        <div className="absolute top-3 left-3 flex items-center gap-1.5 group-hover:opacity-0 transition-opacity">
                          <span className="bg-white/95 backdrop-blur-sm text-gray-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-100 shadow-xs flex items-center gap-1">
                            <Folder className="w-3 h-3 text-blue-600" />
                            <span>{parentName}</span>
                          </span>

                          {imageCount > 1 && (
                            <span className="bg-gray-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                              <Images className="w-2.5 h-2.5" />
                              <span>{imageCount}</span>
                            </span>
                          )}

                          {project.featured && (
                            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Top Right Edit Button */}
                        {onEditProject && (
                          <div className="absolute top-3 right-3 z-10">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditProject(project);
                              }}
                              className="px-2.5 py-1 rounded-full bg-white/95 hover:bg-white text-gray-800 hover:text-blue-700 text-xs font-bold shadow-md border border-blue-100 flex items-center gap-1 transition-all cursor-pointer backdrop-blur-xs hover:scale-105"
                              title="Edit this design and images"
                            >
                              <Pencil className="w-3 h-3 text-blue-600" />
                              <span>Edit</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold mb-1">
                            <FolderOpen className="w-3.5 h-3.5" />
                            <span>{parentName} Folder</span>
                          </div>
                          <h3 className="text-base font-bold text-gray-950 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {displayTitle}
                          </h3>
                          {project.tagline && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {project.tagline}
                            </p>
                          )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-blue-50/80 flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1.5 font-medium text-gray-600">
                            <Images className="w-3.5 h-3.5 text-gray-400" />
                            <span>{imageCount} {imageCount === 1 ? 'Design' : 'Designs'}</span>
                            {project.client && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-[120px]">{project.client}</span>
                              </>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {onEditProject && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditProject(project);
                                }}
                                className="text-xs font-bold text-gray-500 hover:text-blue-600 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                                title="Edit this design"
                              >
                                <Pencil className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                            )}
                            <div className="flex items-center gap-1 font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                              <span>Open</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};
