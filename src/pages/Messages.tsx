import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Pin, ImageIcon, Send } from 'lucide-react';
import { mockMessages } from '@/data/mock';
import { useAuth } from '@/contexts/AuthContext';

export function MessagesPage() {
  const { isLoggedIn } = useAuth();
  const [messages, setMessages] = useState(mockMessages);
  const [newMsg, setNewMsg] = useState('');
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLiked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    if (!newMsg.trim()) return;
    setMessages(prev => [{
      id: `m-${Date.now()}`,
      userId: 'u1', userName: '张明远', userAvatar: 'https://i.pravatar.cc/150?img=12',
      content: newMsg, images: [], isPinned: false,
      createdAt: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      likeCount: 0,
    }, ...prev]);
    setNewMsg('');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <div className="mb-8 text-center">
        <Badge className="mb-3 bg-accent/10 text-accent">班级留言墙</Badge>
        <h1 className="text-2xl font-bold text-primary md:text-3xl">寄语 · 感悟 · 祝福</h1>
        <p className="mt-2 text-sm text-muted-foreground">留下你的求学感悟与同窗祝福</p>
      </div>

      {/* 发布留言 */}
      {isLoggedIn ? (
        <Card className="mb-8 p-5">
          <Textarea
            placeholder="写下你的寄语、感悟或祝福..."
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            rows={4}
            className="resize-none border-none focus-visible:ring-0"
          />
          <div className="mt-3 flex items-center justify-between">
            <Button variant="ghost" size="sm"><ImageIcon className="mr-1 h-4 w-4" />添加配图</Button>
            <Button size="sm" className="bg-accent text-primary hover:bg-accent/90" onClick={handleSubmit}>
              <Send className="mr-1 h-4 w-4" />发布留言
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="mb-8 p-6 text-center">
          <p className="text-sm text-muted-foreground">登录后即可发布留言</p>
          <Button asChild className="mt-3 bg-accent text-primary hover:bg-accent/90" size="sm">
            <a href="/login">去登录</a>
          </Button>
        </Card>
      )}

      {/* 留言列表 */}
      <div className="space-y-4">
        {messages.map(msg => (
          <Card key={msg.id} className={`p-5 ${msg.isPinned ? 'border-accent/30 bg-accent/5' : ''}`}>
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-accent/20">
                <AvatarImage src={msg.userAvatar} />
                <AvatarFallback>{msg.userName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary">{msg.userName}</span>
                  {msg.isPinned && <Badge className="bg-accent text-primary"><Pin className="mr-1 h-3 w-3" />置顶</Badge>}
                  <span className="text-xs text-muted-foreground">{msg.createdAt}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed">{msg.content}</p>
                {msg.images.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {msg.images.map((img, i) => (
                      <img key={i} src={img} alt="" className="h-32 w-32 rounded-lg object-cover" loading="lazy" />
                    ))}
                  </div>
                )}
                <div className="mt-3 flex items-center gap-3">
                  <button onClick={() => toggleLike(msg.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors">
                    <Heart className={`h-4 w-4 ${liked.has(msg.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    {msg.likeCount + (liked.has(msg.id) ? 1 : 0)}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
