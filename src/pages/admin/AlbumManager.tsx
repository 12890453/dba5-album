import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Pencil, Trash2, Plus, ImageUp, FolderOpen, MapPin } from 'lucide-react';
import { usePersistedState } from '@/hooks/usePersistedState';
import { mockAlbums as initialAlbums } from '@/data/mock';
import { getAllPhotos } from '@/data/photoLoader';
import { CATEGORY_LABELS, type Album, type AlbumCategory, type Photo } from '@/types';

export function AlbumManager() {
  const [albums, setAlbums] = usePersistedState('admin_albums', initialAlbums);
  const [photos, setPhotos] = usePersistedState('admin_photos', getAllPhotos());
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Album | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Album | null>(null);
  const [activeTab, setActiveTab] = useState<AlbumCategory>('orientation');
  const [form, setForm] = useState({ name: '', category: 'orientation' as AlbumCategory, year: '', city: '', description: '', isPublic: true, allowDownload: true });

  const parentAlbums = albums.filter(a => a.parentId === null);
  const subAlbums = albums.filter(a => a.parentId !== null && a.category === activeTab);
  const getPhotoCount = (albumId: string) => photos.filter(p => p.albumId === albumId).length;

  const resetForm = () => {
    setForm({ name: '', category: 'orientation', year: '', city: '', description: '', isPublic: true, allowDownload: true });
    setEditing(null);
  };

  const openEdit = (album: Album) => {
    setEditing(album);
    setForm({ name: album.name, category: album.category, year: album.year || '', city: album.city || '', description: album.description, isPublic: album.isPublic, allowDownload: album.allowDownload });
    setShowDialog(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setAlbums(prev => prev.map(a => a.id === editing.id ? { ...a, name: form.name, category: form.category, year: form.year || undefined, city: form.city || undefined, description: form.description, isPublic: form.isPublic, allowDownload: form.allowDownload } : a));
    } else {
      const parentAlbum = parentAlbums.find(a => a.category === form.category);
      if (!parentAlbum) return;
      const newId = `a-${Date.now()}`;
      const newAlbum: Album = {
        id: newId, parentId: parentAlbum.id, name: form.name, category: form.category, sortOrder: subAlbums.length, coverImage: `https://picsum.photos/seed/${newId}/600/400`, description: form.description, isPublic: form.isPublic, allowDownload: form.allowDownload, year: form.year || undefined, city: form.city || undefined, photoCount: 0,
      };
      setAlbums(prev => [...prev, newAlbum]);
    }
    setShowDialog(false);
    resetForm();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const albumId = deleteTarget.id;
    const hasSub = albums.some(a => a.parentId === albumId);
    if (hasSub) {
      setAlbums(prev => prev.filter(a => a.id !== albumId && a.parentId !== albumId));
      setPhotos(prev => prev.filter(p => p.albumId !== albumId && !albums.some(a => a.parentId === albumId && a.id === p.albumId)));
    } else {
      setAlbums(prev => prev.filter(a => a.id !== albumId));
      setPhotos(prev => prev.filter(p => p.albumId !== albumId));
    }
    setDeleteTarget(null);
  };

  const handleBatchImport = () => {
    if (!editing) return;
    const count = 3;
    const newPhotos: Photo[] = Array.from({ length: count }, (_, i) => ({
      id: `ph-import-${Date.now()}-${i}`,
      albumId: editing.id,
      uploaderId: 'u1', uploaderName: '张明远',
      url: `https://picsum.photos/seed/import${Date.now()}${i}/1200/800`,
      thumbnail: `https://picsum.photos/seed/import${Date.now()}${i}/400/267`,
      caption: `${editing.name} - 导入照片 ${i + 1}`,
      visibility: 'public' as const,
      takenAt: new Date().toISOString().split('T')[0],
      uploadAt: new Date().toISOString().split('T')[0],
      width: 1200, height: 800, viewCount: 0, likeCount: 0, commentCount: 0,
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
    setAlbums(prev => prev.map(a => a.id === editing.id ? { ...a, photoCount: a.photoCount + count } : a));
  };

  const cols = (a: Album) => [a.isPublic ? '公开' : '私密', a.allowDownload ? '可下载' : '禁下载'];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">相册管理</h1>
          <p className="text-sm text-muted-foreground">管理五大分类相册及其子相册</p>
        </div>
        <Button onClick={() => { resetForm(); setShowDialog(true); }} className="bg-accent text-primary hover:bg-accent/90">
          <Plus className="mr-1 h-4 w-4" />新建子相册
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AlbumCategory)}>
        <TabsList className="mb-6 w-full justify-start bg-white">
          {(Object.keys(CATEGORY_LABELS) as AlbumCategory[]).map(cat => (
            <TabsTrigger key={cat} value={cat}>{CATEGORY_LABELS[cat]}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab}>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>相册名称</TableHead>
                  <TableHead>年份</TableHead>
                  <TableHead>城市</TableHead>
                  <TableHead>照片数</TableHead>
                  <TableHead>属性</TableHead>
                  <TableHead className="w-48">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subAlbums.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">暂无子相册</TableCell></TableRow>
                ) : subAlbums.map(album => (
                  <TableRow key={album.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4 text-accent" />
                        {album.name}
                      </div>
                    </TableCell>
                    <TableCell>{album.year || '-'}</TableCell>
                    <TableCell>
                      {album.city && <span className="inline-flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3 w-3" />{album.city}</span>}
                    </TableCell>
                    <TableCell>{getPhotoCount(album.id)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {cols(album).map((c, i) => <Badge key={i} variant="secondary" className="text-xs">{c}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(album)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => { setEditing(album); }} className="text-blue-500"><ImageUp className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => setDeleteTarget(album)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 新建/编辑弹窗 */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? '编辑相册' : '新建子相册'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>相册名称 <span className="text-destructive">*</span></Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="请输入相册名称" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>所属分类</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as AlbumCategory })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(CATEGORY_LABELS) as AlbumCategory[]).map(cat => <SelectItem key={cat} value={cat}>{CATEGORY_LABELS[cat]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>年份</Label>
                <Input value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="如 2025" />
              </div>
            </div>
            <div>
              <Label>城市</Label>
              <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="如 香港" />
            </div>
            <div>
              <Label>描述</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="相册简介" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>取消</Button>
            <Button className="bg-accent text-primary hover:bg-accent/90" onClick={handleSave}>{editing ? '保存' : '创建'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认 */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除相册「{deleteTarget?.name}」吗？该操作同时删除该相册下的所有照片，不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 批量导入提示 */}
      {editing && editing.parentId !== null && (
        <Dialog open={!!(editing && editing.parentId !== null)} onOpenChange={() => setEditing(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>批量导入照片</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground">为「{editing.name}」批量导入 3 张演示照片</p>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setEditing(null)}>取消</Button>
              <Button className="bg-accent text-primary hover:bg-accent/90" onClick={() => { handleBatchImport(); setEditing(null); }}>确认导入</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
