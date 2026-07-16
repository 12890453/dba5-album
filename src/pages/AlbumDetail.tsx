import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X, Heart, MessageCircle, Download, Eye, Lock, Users, Globe } from 'lucide-react';
import { mockComments } from '@/data/mock';
import { getPhotosByAlbum, getAlbumsWithPhotoCount, getAlbumById } from '@/data/photoLoader';
import { CATEGORY_LABELS, type PhotoVisibility } from '@/types';

const visibilityConfig: Record<PhotoVisibility, { label: string; icon: typeof Globe; color: string }> = {
  public: { label: '全部可见', icon: Globe, color: 'text-green-600' },
  class_only: { label: '仅同班同学', icon: Users, color: 'text-blue-600' },
  private: { label: '仅自己', icon: Lock, color: 'text-pink-600' },
};

export function AlbumDetailPage() {
  const { albumId } = useParams();
  const allAlbums = getAlbumsWithPhotoCount();
  const album = allAlbums.find(a => a.id === albumId) || getAlbumById(albumId || '');
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const photos = useMemo(
    () => getPhotosByAlbum(albumId || ''),
    [albumId]
  );

  const toggleFav = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (!album) {
    return <div className="py-20 text-center text-muted-foreground">相册不存在</div>;
  }

  const parentAlbum = album?.parentId ? allAlbums.find(a => a.id === album.parentId) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* 面包屑 */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">首页</Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/albums">全部相册</Link></BreadcrumbLink></BreadcrumbItem>
          {parentAlbum && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink asChild><Link to={`/albums?category=${album.category}`}>{CATEGORY_LABELS[album.category]}</Link></BreadcrumbLink></BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>{album.name}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 相册信息 */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary md:text-3xl">{album.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{album.description}</p>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{photos.length} 张照片</span>
            {album.year && <span>· {album.year}</span>}
            {album.city && <span>· {album.city}</span>}
          </div>
        </div>
        {album.allowDownload && (
          <Button variant="outline" size="sm"><Download className="mr-1 h-4 w-4" />批量下载</Button>
        )}
      </div>

      {/* 照片瀑布流 */}
      {photos.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">该相册暂无照片</div>
      ) : (
        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
          {photos.map((photo, idx) => {
            const VisIcon = visibilityConfig[photo.visibility].icon;
            return (
              <Card
                key={photo.id}
                className="group relative break-inside-avoid cursor-pointer overflow-hidden p-0"
                onClick={() => setSelectedPhoto(idx)}
              >
                <img
                  src={photo.thumbnail}
                  alt={photo.caption}
                  className="w-full transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {/* 悬浮遮罩（不拦截点击） */}
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="p-3 text-white">
                    <p className="truncate text-xs">{photo.caption}</p>
                    <div className="mt-1 flex items-center gap-3 text-[10px]">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{photo.viewCount}</span>
                      <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{photo.likeCount}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{photo.commentCount}</span>
                    </div>
                  </div>
                </div>
                {/* 可见性标签 */}
                <div className="pointer-events-none absolute right-2 top-2">
                  <Badge className={`bg-black/40 backdrop-blur-sm ${visibilityConfig[photo.visibility].color}`}>
                    <VisIcon className="mr-1 h-3 w-3" />{visibilityConfig[photo.visibility].label}
                  </Badge>
                </div>
                {/* 收藏按钮（阻止事件冒泡避免触发预览） */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFav(photo.id); }}
                  className="absolute left-2 top-2 rounded-full bg-black/40 p-1.5 backdrop-blur-sm transition-colors hover:bg-black/60"
                >
                  <Heart className={`h-4 w-4 ${favorites.has(photo.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </button>
              </Card>
            );
          })}
        </div>
      )}

      {/* 全屏预览 */}
      {selectedPhoto !== null && (
        <Dialog open={true} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
          <DialogContent className="max-w-5xl border-0 bg-black/95 p-0">
            <div className="relative flex items-center justify-center min-h-[60vh]">
              {/* 关闭按钮 */}
              <button onClick={() => setSelectedPhoto(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
                <X className="h-5 w-5" />
              </button>
              {/* 左切换 */}
              <button
                onClick={() => setSelectedPhoto(s => (s! - 1 + photos.length) % photos.length)}
                className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              {/* 图片 */}
              <img src={photos[selectedPhoto].url} alt={photos[selectedPhoto].caption} className="max-h-[75vh] w-auto" />
              {/* 右切换 */}
              <button
                onClick={() => setSelectedPhoto(s => (s! + 1) % photos.length)}
                className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            {/* 信息栏 */}
            <div className="bg-black/80 p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium">{photos[selectedPhoto].caption}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-white/60">
                    <span>上传者：{photos[selectedPhoto].uploaderName}</span>
                    <span>拍摄：{photos[selectedPhoto].takenAt}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{photos[selectedPhoto].viewCount}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/10" onClick={() => toggleFav(photos[selectedPhoto].id)}>
                    <Heart className={`mr-1 h-4 w-4 ${favorites.has(photos[selectedPhoto].id) ? 'fill-red-500 text-red-500' : ''}`} />
                    {photos[selectedPhoto].likeCount}
                  </Button>
                  {album.allowDownload && (
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                      <Download className="mr-1 h-4 w-4" />下载
                    </Button>
                  )}
                </div>
              </div>
              {/* 评论区 */}
              <div className="mt-4 border-t border-white/10 pt-4">
                <h4 className="mb-3 text-sm font-semibold">评论 ({mockComments.filter(c => c.photoId === photos[selectedPhoto].id).length})</h4>
                <div className="space-y-2">
                  {mockComments.filter(c => c.photoId === photos[selectedPhoto].id).map(c => (
                    <div key={c.id} className="flex gap-2">
                      <img src={c.userAvatar} alt={c.userName} className="h-7 w-7 rounded-full" />
                      <div>
                        <div className="text-xs"><span className="font-medium text-accent">{c.userName}</span> <span className="text-white/40">{c.createdAt}</span></div>
                        <p className="text-sm text-white/80">{c.content}</p>
                      </div>
                    </div>
                  ))}
                  {mockComments.filter(c => c.photoId === photos[selectedPhoto].id).length === 0 && (
                    <p className="text-xs text-white/40">暂无评论，快来发表第一条吧～</p>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
