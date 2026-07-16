import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Megaphone, Pencil, Trash2, Pin, Plus } from 'lucide-react';
import { usePersistedState } from '@/hooks/usePersistedState';
import { mockAnnouncements as initialAnnouncements, mockMessages as initialMessages } from '@/data/mock';
import type { Announcement } from '@/types';

export function ContentManager() {
  const [announcements, setAnnouncements] = usePersistedState('admin_announcements', initialAnnouncements);
  const [messages, setMessages] = usePersistedState('admin_messages', initialMessages);
  const [homeIntro, setHomeIntro] = usePersistedState('admin_home_intro', '香港大学与北京大学联合管理学博士项目 DBA5 班，汇聚来自各行业的优秀企业家与管理者。三年来，我们在学术探索中求真，在实践碰撞中成长。这里是属于 DBA5 班全体同学的珍贵记忆空间。');
  const [activeTab, setActiveTab] = useState('homepage');
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [annForm, setAnnForm] = useState({ title: '', content: '', isPinned: false });
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'announcement' | 'message'; id: string } | null>(null);

  const resetAnnForm = () => { setAnnForm({ title: '', content: '', isPinned: false }); setEditingAnnouncement(null); };

  const openEditAnnouncement = (a: Announcement) => {
    setEditingAnnouncement(a);
    setAnnForm({ title: a.title, content: a.content, isPinned: a.isPinned });
    setShowAnnouncement(true);
  };

  const saveAnnouncement = () => {
    if (!annForm.title.trim() || !annForm.content.trim()) return;
    if (editingAnnouncement) {
      setAnnouncements(prev => prev.map(a => a.id === editingAnnouncement.id ? { ...a, title: annForm.title, content: annForm.content, isPinned: annForm.isPinned } : a));
    } else {
      const newA: Announcement = {
        id: `an${Date.now()}`, title: annForm.title, content: annForm.content,
        publisherId: 'u1', publisherName: '张明远', isPinned: annForm.isPinned,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setAnnouncements(prev => [newA, ...prev]);
    }
    setShowAnnouncement(false);
    resetAnnForm();
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    setDeleteTarget(null);
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    setDeleteTarget(null);
  };

  const togglePin = (type: 'announcement' | 'message', id: string) => {
    if (type === 'announcement') {
      setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, isPinned: !a.isPinned } : a));
    } else {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, isPinned: !m.isPinned } : m));
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">内容管理</h1>
        <p className="text-sm text-muted-foreground">编辑首页简介、发布公告、管理留言墙</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-white">
          <TabsTrigger value="homepage">首页简介</TabsTrigger>
          <TabsTrigger value="announcements">班级公告</TabsTrigger>
          <TabsTrigger value="messages">留言墙</TabsTrigger>
        </TabsList>

        {/* 首页简介 */}
        <TabsContent value="homepage">
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Pencil className="h-5 w-5 text-accent" />
              <h3 className="font-bold text-primary">班级简介文案</h3>
            </div>
            <Textarea value={homeIntro} onChange={e => setHomeIntro(e.target.value)} rows={4} className="mb-4" placeholder="请输入首页班级简介文案" />
            <Button className="bg-accent text-primary hover:bg-accent/90" onClick={() => alert('首页简介已更新！')}>保存文案</Button>
          </Card>
        </TabsContent>

        {/* 公告管理 */}
        <TabsContent value="announcements">
          <div className="mb-4">
            <Button onClick={() => { resetAnnForm(); setShowAnnouncement(true); }} className="bg-accent text-primary hover:bg-accent/90">
              <Plus className="mr-1 h-4 w-4" />发布公告
            </Button>
          </div>
          <div className="space-y-3">
            {announcements.map(a => (
              <Card key={a.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Megaphone className="h-4 w-4 text-accent" />
                      <h4 className="font-semibold text-primary">{a.title}</h4>
                      {a.isPinned && <span className="text-[10px] bg-accent/15 text-accent px-1.5 py-0.5 rounded font-bold">置顶</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{a.content}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{a.createdAt} · {a.publisherName}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => togglePin('announcement', a.id)}><Pin className={`h-4 w-4 ${a.isPinned ? 'text-accent' : 'text-muted-foreground'}`} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditAnnouncement(a)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => setDeleteTarget({ type: 'announcement', id: a.id })}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Dialog open={showAnnouncement} onOpenChange={setShowAnnouncement}>
            <DialogContent>
              <DialogHeader><DialogTitle>{editingAnnouncement ? '编辑公告' : '发布新公告'}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>标题 <span className="text-destructive">*</span></Label>
                  <Input value={annForm.title} onChange={e => setAnnForm({ ...annForm, title: e.target.value })} placeholder="公告标题" />
                </div>
                <div><Label>内容 <span className="text-destructive">*</span></Label>
                  <Textarea value={annForm.content} onChange={e => setAnnForm({ ...annForm, content: e.target.value })} rows={4} placeholder="公告正文" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={annForm.isPinned} onChange={e => setAnnForm({ ...annForm, isPinned: e.target.checked })} className="h-4 w-4" />
                  <span className="text-sm">置顶该公告</span>
                </label>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAnnouncement(false)}>取消</Button>
                <Button className="bg-accent text-primary hover:bg-accent/90" onClick={saveAnnouncement}>{editingAnnouncement ? '保存' : '发布'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* 留言墙 */}
        <TabsContent value="messages">
          <div className="space-y-3">
            {messages.map(m => (
              <Card key={m.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3 flex-1 min-w-0">
                    <img src={m.userAvatar} alt="" className="h-10 w-10 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{m.userName}</span>
                        {m.isPinned && <span className="text-[10px] bg-accent/15 text-accent px-1.5 py-0.5 rounded font-bold">置顶</span>}
                      </div>
                      <p className="text-sm text-muted-foreground">{m.content}</p>
                      {m.images.length > 0 && (
                        <div className="mt-2 flex gap-2">
                          {m.images.map((img, i) => <img key={i} src={img} alt="" className="h-16 w-16 rounded object-cover" />)}
                        </div>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">{m.createdAt} · {m.likeCount} 赞</p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => togglePin('message', m.id)}><Pin className={`h-4 w-4 ${m.isPinned ? 'text-accent' : 'text-muted-foreground'}`} /></Button>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => setDeleteTarget({ type: 'message', id: m.id })}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 删除确认 */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除该{deleteTarget?.type === 'announcement' ? '公告' : '留言'}吗？该操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteTarget.type === 'announcement' ? deleteAnnouncement(deleteTarget.id) : deleteMessage(deleteTarget!.id)}
              className="bg-red-500 hover:bg-red-600"
            >确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
