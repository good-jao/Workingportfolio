export type ProjectCategory = 
  | 'All'
  | 'Amazon Listing'
  | 'Social Media'
  | 'Brand Identity'
  | 'Marketing & Ads'
  | 'Carousels & Posts'
  | 'Posters & Banners'
  | 'Packaging & Print'
  | 'Motion Graphics'
  | string;

export interface Project {
  id: string;
  title: string;
  folderName?: string;
  parentFolder?: string;
  subFolder?: string;
  tagline?: string;
  category: ProjectCategory;
  coverImage: string;
  images: string[];
  description?: string;
  client?: string;
  role?: string;
  year?: string;
  tools?: string[];
  likes?: number;
  views?: number;
  isLiked?: boolean;
  featured?: boolean;
  behanceUrl?: string;
  liveUrl?: string;
  challenges?: string;
  solution?: string;
  palette?: { name: string; hex: string }[];
  createdAt: string;
}

export interface MasterFolder {
  id: string;
  name: string;
  category: ProjectCategory;
  coverImage: string;
  description: string;
  subFolderCount: number;
  totalImagesCount: number;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  skills: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  honors?: string;
}

export interface SkillCategory {
  category: string;
  items: { name: string; level: number }[];
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description?: string;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientRole: string;
  company: string;
  quote: string;
  avatar?: string;
  projectTitle?: string;
}

export interface DirectMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  inquiryType: string;
  message: string;
  createdAt: string;
  isRead?: boolean;
}

export interface UserProfile {
  name: string;
  headline: string;
  tagline: string;
  bio: string;
  avatar: string;
  coverBanner: string;
  location: string;
  email: string;
  phone: string;
  availableForWork: boolean;
  availabilityNote: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  awards: AwardItem[];
  testimonials: TestimonialItem[];
}
