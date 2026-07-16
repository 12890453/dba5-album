import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Trash2, MoveRight, Image as ImageIcon } from 'lucide-react';
import { usePersistedState } from '@/hooks/usePersistedState';
import { mockAlbums as initialAlbums } from '@/data/mock';
import { getAllPhotos } from '@/data/photoLoader';
import type { Photo } from '@/types';

const VIS_LABELS: Record<string, string> = { public: '公开', class_only: '班级可见', private: '仅自己' };

export function PhotoManager() {
  const [photos, setPhotos] = usePersistedState('admin_photos', getAllPhotos());
  const [albums] = usePersistedState('admin_albums_search', initialAlbums);
  const subAlbums = albums.filter(a => a.parentId !== null);
  const [search, setSearch] = useState('');
  const [selAlbum, setSelAlbum] = useState<string>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<Photo[] | null>(null);
  const [moveTarget, setMoveTarget] = useState<{ photos: Photo[] } | null>(null);
  const [moveToAlbum, setMoveToAlbum] = useState('');

  const filtered = photos.filter(p => {
    if (search && !p.caption.includes(search) && !p.uploaderName.includes(search)) return false;
    if (selAlbum !== 'all' && p.albumId !== selAlbum) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const handleBatchDelete = () => {
    if (selected.size === 0) return;
    const toDelete = filtered.filter(p => selected.has(p.id));
    setDeleteTarget(toDelete);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const ids = new Set(deleteTarget.map(p => p.id));
    setPhotos(prev => prev.filter(p => !ids.has(p.id)));
    setSelected(new Set());
    setDeleteTarget(null);
  };

  const handleBatchMove = () => {
    if (selected.size === 0) return;
    const toMove = filtered.filter(p => selected.has(p.id));
    setMoveTarget({ photos: toMove });
  };

  const confirmMove = () => {
    if (!moveTarget || !moveToAlbum) return;
    const ids = new Set(moveTarget.photos.map(p => p.id));
    setPhotos(prev => prev.map(p => ids.has(p.id) ? { ...p, albumId: moveToAlbum } : p));
    setSelected(new Set());
    setMoveTarget(null);
    setMoveToAlbum('');
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">图片管理</h1>
          <p className="text-sm text-muted-foreground">审核、删除、批量操作照片</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleBatchMove} disabled={selected.size === 0}>
            <MoveRight className="mr-1 h-4 w-4" />批量移动
          </Button>
          <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50" onClick={handleBatchDelete} disabled={selected.size === 0}>
            <Trash2 className="mr-1 h-4 w-4" />批量删除 ({selected.size})
          </Button>
        </div>
      </div>

      {/* 搜索筛选 */}
      <Card className="mb-6 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="搜索照片标题或上传者" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={selAlbum} onValueChange={setSelAlbum}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="筛选相册" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部相册</SelectItem>
              {subAlbums.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* 照片网格 */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {filtered.map(photo => (
          <div
            key={photo.id}
            className="group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-colors"
            style={{ borderColor: selected.has(photo.id) ? '#C5A55A' : 'transparent' }}
            onClick={() => toggleSelect(photo.id)}
          >
            <img src={photo.thumbnail} alt={photo.caption} className="aspect-square w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
              <Checkbox checked={selected.has(photo.id)} className="absolute left-2 top-2 h-4 w-4 opacity-0 group-hover:opacity-100 data-[state=checked]:opacity-100" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 pt-6">
              <p className="truncate text-[10px] text-white">{photo.caption}</p>
              <div className="flex items-center gap-1">
                <Badge className="h-4 bg-white/20 px-1 text-[9px] text-white">{VIS_LABELS[photo.visibility]}</Badge>
                <span className="ml-auto text-[9px] text-white/70">{photo.uploaderName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          <ImageIcon className="mx-auto mb-2 h-10 w-10 opacity-30" />
          <p>暂无匹配的照片</p>
        </div>
      )}

      {/* 删除确认 */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>批量删除照片</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除选中的 {deleteTarget?.length} 张照片吗？该操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 移动相册 */}
      <AlertDialog open={!!moveTarget} onOpenChange={() => setMoveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>批量移动照片</AlertDialogTitle>
            <AlertDialogDescription>
              将选中的 {moveTarget?.photos.length} 张照片移动到指定相册
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <Label>目标相册</Label>
            <Select value={moveToAlbum} onValueChange={setMoveToAlbum}>
              <SelectTrigger><SelectValue placeholder="选择目标相册" /></SelectTrigger>
              <SelectContent>
                {subAlbums.filter(a => !moveTarget?.photos.every(p => p.albumId === a.id)).map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmMove} disabled={!moveToAlbum} className="bg-accent text-primary hover:bg-accent/90">确认移动</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
