/**
 * 照片加载器
 * 自动读取 photo-manifest.json（由 COS 上传脚本生成）
 * 如果有真实照片则使用 COS URL，否则回退到 Mock 占位图
 */
import type { Photo, Album, AlbumCategory } from '@/types';
import { mockPhotos, mockAlbums, mockUsers } from './mock';
import manifestData from './photo-manifest.json';

interface ManifestPhoto {
  id: string;
  url: string;
  category: AlbumCategory;
  filename: string;
  originalPath: string;
  width: number;
  height: number;
  size: number;
}

interface Manifest {
  total: number;
  success: number;
  failed: number;
  uploaded_at: string;
  cos_base_url: string;
  photos: ManifestPhoto[];
}

const manifest = manifestData as Manifest;

// 分类 -> 子相册映射（用于将 manifest 照片分配到对应子相册）
const CATEGORY_ALBUM_MAP: Record<AlbumCategory, string[]> = {
  orientation: ['a1-1', 'a1-2', 'a1-3'],
  course: ['a2-1', 'a2-2', 'a2-3'],
  research: ['a3-1', 'a3-2', 'a3-3'],
  activities: ['a4-1', 'a4-2', 'a4-3'],
  graduation: ['a5-1', 'a5-2', 'a5-3'],
};

/**
 * 从 manifest 照片生成 Photo 对象
 */
function manifestToPhotos(mPhotos: ManifestPhoto[]): Photo[] {
  if (!mPhotos || mPhotos.length === 0) return [];

  // 按分类分组
  const byCategory: Record<string, ManifestPhoto[]> = {};
  mPhotos.forEach((p) => {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push(p);
  });

  const photos: Photo[] = [];

  Object.entries(byCategory).forEach(([category, catPhotos]) => {
    const albumIds = CATEGORY_ALBUM_MAP[category as AlbumCategory] || [];
    if (albumIds.length === 0) return;

    // 均匀分配到该分类下的子相册
    catPhotos.forEach((mp, index) => {
      const albumId = albumIds[index % albumIds.length];
      const uploader = mockUsers[index % mockUsers.length];
      const date = new Date().toISOString().split('T')[0];

      photos.push({
        id: mp.id,
        albumId,
        uploaderId: uploader.id,
        uploaderName: uploader.name,
        url: mp.url,
        thumbnail: mp.url, // 直接用原图作为缩略图，浏览器会自动缩放
        caption: mp.filename.replace(/\.[^.]+$/, ''), // 用文件名作为备注
        visibility: 'public',
        takenAt: date,
        uploadAt: date,
        width: mp.width,
        height: mp.height,
        viewCount: Math.floor(Math.random() * 100),
        likeCount: Math.floor(Math.random() * 30),
        commentCount: 0,
      });
    });
  });

  return photos;
}

/**
 * 获取所有照片（优先 manifest，回退 mock）
 */
export function getAllPhotos(): Photo[] {
  if (manifest.total > 0 && manifest.photos.length > 0) {
    return manifestToPhotos(manifest.photos);
  }
  return mockPhotos;
}

/**
 * 获取指定相册的照片
 */
export function getPhotosByAlbum(albumId: string): Photo[] {
  return getAllPhotos().filter((p) => p.albumId === albumId);
}

/**
 * 获取指定分类的照片
 */
export function getPhotosByCategory(category: AlbumCategory): Photo[] {
  return getAllPhotos().filter((p) => {
    const album = getAlbumById(p.albumId);
    return album?.category === category;
  });
}

/**
 * 获取最新照片（按上传时间倒序）
 */
export function getLatestPhotos(limit = 12): Photo[] {
  return getAllPhotos()
    .slice()
    .sort((a, b) => b.uploadAt.localeCompare(a.uploadAt))
    .slice(0, limit);
}

/**
 * 根据相册 ID 获取相册信息
 */
export function getAlbumById(albumId: string): Album | undefined {
  return mockAlbums.find((a) => a.id === albumId);
}

/**
 * 更新相册的 photoCount 为实际照片数
 */
export function getAlbumsWithPhotoCount(): Album[] {
  const photos = getAllPhotos();
  return mockAlbums.map((album) => {
    if (album.parentId === null) {
      // 一级相册：统计所有子相册照片
      const childCount = mockAlbums
        .filter((a) => a.parentId === album.id)
        .reduce((sum, child) => {
          const count = photos.filter((p) => p.albumId === child.id).length;
          return sum + count;
        }, 0);
      return { ...album, photoCount: childCount };
    }
    // 子相册：统计直接属于该相册的照片
    const count = photos.filter((p) => p.albumId === album.id).length;
    return { ...album, photoCount: count || album.photoCount };
  });
}

/**
 * 是否有真实照片
 */
export function hasRealPhotos(): boolean {
  return manifest.total > 0;
}

/**
 * 获取照片总数
 */
export function getTotalPhotoCount(): number {
  return getAllPhotos().length;
}
