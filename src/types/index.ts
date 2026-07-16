// ========== 核心类型定义 ==========

export type UserRole = 'admin' | 'student' | 'alumni' | 'guest';

export type PhotoVisibility = 'public' | 'class_only' | 'private';

export type AlbumCategory = 'orientation' | 'course' | 'research' | 'activities' | 'graduation';

export interface User {
  id: string;
  role: UserRole;
  studentId: string;
  name: string;
  avatar: string;
  company: string;
  industry: string;
  position: string;
  researchDirection: string;
  dbaReflection: string;
  personalMessage: string;
  phone: string;
  phoneVisibility: PhotoVisibility;
  email: string;
  emailVisibility: PhotoVisibility;
  wechat: string;
  wechatVisibility: PhotoVisibility;
  enrollmentBatch: string;
  status: 'pending' | 'active' | 'disabled';
  coverImage?: string;
  personalAlbums: PersonalAlbum[];
}

export interface PersonalAlbum {
  id: string;
  type: 'class_group' | 'personal_research' | 'course' | 'private';
  name: string;
  photos: Photo[];
}

export interface Album {
  id: string;
  parentId: string | null;
  name: string;
  category: AlbumCategory;
  sortOrder: number;
  coverImage: string;
  description: string;
  isPublic: boolean;
  allowDownload: boolean;
  year?: string;
  city?: string;
  photoCount: number;
}

export interface Photo {
  id: string;
  albumId: string;
  uploaderId: string;
  uploaderName: string;
  url: string;
  thumbnail: string;
  caption: string;
  visibility: PhotoVisibility;
  takenAt: string;
  uploadAt: string;
  width: number;
  height: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export interface Comment {
  id: string;
  photoId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likeCount: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  publisherId: string;
  publisherName: string;
  isPinned: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  images: string[];
  isPinned: boolean;
  createdAt: string;
  likeCount: number;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  albumId?: string;
  eventDate: string;
  icon: string;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  uploaderId: string;
  uploaderName: string;
  category: string;
  createdAt: string;
  viewCount: number;
}

export interface DownloadItem {
  id: string;
  title: string;
  fileUrl: string;
  fileType: 'jpg' | 'png' | 'pdf' | 'zip';
  fileSize: string;
  uploaderName: string;
  createdAt: string;
  downloadCount: number;
}

export const CATEGORY_LABELS: Record<AlbumCategory, string> = {
  orientation: '开学季',
  course: '课程学习',
  research: '研学实践',
  activities: '班级活动',
  graduation: '毕业纪念',
};

export const CATEGORY_ICONS: Record<AlbumCategory, string> = {
  orientation: '🎓',
  course: '📚',
  research: '🌐',
  activities: '🎉',
  graduation: '🏆',
};

export const CATEGORY_ORDER: AlbumCategory[] = [
  'orientation',
  'course',
  'research',
  'activities',
  'graduation',
];
