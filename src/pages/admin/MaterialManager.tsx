import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, FileText, FileImage, FileArchive, File } from 'lucide-react';
import { usePersistedState } from '@/hooks/usePersistedState';
import { mockDownloads as initialDownloads } from '@/data/mock';
import type { DownloadItem } from '@/types';

const FILE_ICONS: Record<string, typeof FileText> = {
  jpg: FileImage, png: FileImage, pdf: FileText, zip: FileArchive,
};

export function MaterialManager() {
  const [downloads, setDownloads] = usePersistedState('admin_downloads', initialDownloads);
  const [showDialog, setShowDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DownloadItem | null>(null);
  const [form, setForm] = useState({ title: '', fileType: 'jpg' as DownloadItem['fileType'], fileSize: '' });

  const resetForm = () => setForm({ title: '', fileType: 'jpg', fileSize: '' });

  const handleAdd = () => {
    if (!form.title.trim() || !form.fileSize.trim()) return;
    const newItem: DownloadItem = {
      id: `d${Date.now()}`,
      title: form.title,
      fileUrl: '#',
      fileType: form.fileType,
      fileSize: form.fileSize,
      uploaderName: '张明远',
      createdAt: new Date().toISOString().split('T')[0],
      downloadCount: 0,
    };
    setDownloads(prev => [...prev, newItem]);
    setShowDialog(false);
    resetForm();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDownloads(prev => prev.filter(d => d.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">素材管理</h1>
          <p className="text-sm text-muted-foreground">管理纪念素材下载文件</p>
        </div>
        <Button onClick={() => { resetForm(); setShowDialog(true); }} className="bg-accent text-primary hover:bg-accent/90">
          <Plus className="mr-1 h-4 w-4" />上传素材
        </Button>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>文件名称</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>大小</TableHead>
              <TableHead>上传时间</TableHead>
              <TableHead>下载次数</TableHead>
              <TableHead className="w-24">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {downloads.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">暂无素材文件</TableCell></TableRow>
            ) : downloads.map(item => {
              const IconComp = FILE_ICONS[item.fileType] || File;
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <IconComp className="h-5 w-5 text-accent" />
                      {item.title}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground uppercase">{item.fileType}</TableCell>
                  <TableCell className="text-sm">{item.fileSize}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.createdAt}</TableCell>
                  <TableCell className="text-sm">{item.downloadCount} 次</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => setDeleteTarget(item)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* 新建 */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>上传新素材</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>文件名称 <span className="text-destructive">*</span></Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="请输入文件名称" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>文件类型</Label>
                <Select value={form.fileType} onValueChange={(v) => setForm({ ...form, fileType: v as DownloadItem['fileType'] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpg">JPG 图片</SelectItem>
                    <SelectItem value="png">PNG 图片</SelectItem>
                    <SelectItem value="pdf">PDF 文档</SelectItem>
                    <SelectItem value="zip">ZIP 压缩包</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>文件大小 <span className="text-destructive">*</span></Label>
                <Input value={form.fileSize} onChange={e => setForm({ ...form, fileSize: e.target.value })} placeholder="如 24.5 MB" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>取消</Button>
            <Button className="bg-accent text-primary hover:bg-accent/90" onClick={handleAdd}>上传</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>确定要删除素材「{deleteTarget?.title}」吗？该操作不可撤销。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
