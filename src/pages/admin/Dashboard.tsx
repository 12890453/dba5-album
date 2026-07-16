import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, FolderOpen, Image as ImageIcon, Megaphone, TrendingUp, Crown, FileDown } from 'lucide-react';
import { mockStats, mockUsers } from '@/data/mock';
import { getLatestPhotos } from '@/data/photoLoader';

export function AdminDashboard() {
  const pendingUsers = mockUsers.filter(u => u.status === 'pending');
  const recentPhotos = getLatestPhotos(5);

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* 头部 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">管理后台</h1>
            <p className="text-sm text-muted-foreground">港大北大联合 DBA5 班 · 管理控制台</p>
          </div>
          <Button asChild variant="outline" size="sm"><Link to="/">返回前台</Link></Button>
        </div>

        {/* 数据概览卡片 */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: '照片总量', value: mockStats.totalPhotos, icon: ImageIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: '注册用户', value: mockStats.totalUsers, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
            { label: '相册总数', value: mockStats.totalAlbums, icon: FolderOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: '累计浏览', value: mockStats.totalViews.toLocaleString(), icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="flex items-center gap-4 p-5">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 左侧：管理功能入口 */}
          <div className="space-y-4 lg:col-span-1">
            <Card className="p-5">
              <h3 className="mb-4 font-bold text-primary">管理功能</h3>
              <div className="space-y-2">
                {[
                  { label: '相册管理', desc: '新建/编辑/删除相册', icon: FolderOpen, count: mockStats.totalAlbums },
                  { label: '用户管理', desc: `待审核 ${pendingUsers.length} 人`, icon: Users, count: mockUsers.length },
                  { label: '图片管理', desc: '审核/删除/批量操作', icon: ImageIcon, count: mockStats.totalPhotos },
                  { label: '内容管理', desc: '公告/留言/评论', icon: Megaphone },
                  { label: '素材管理', desc: '纪念素材下载', icon: FileDown },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <Button key={i} variant="ghost" className="w-full justify-start gap-3 h-auto py-3">
                      <Icon className="h-5 w-5 text-accent" />
                      <div className="text-left flex-1">
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                      </div>
                      {item.count !== undefined && <Badge variant="secondary">{item.count}</Badge>}
                    </Button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* 右侧：数据统计 */}
          <div className="space-y-6 lg:col-span-2">
            {/* 7日访问趋势 */}
            <Card className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-accent" />
                <h3 className="font-bold text-primary">7日访问趋势</h3>
              </div>
              <div className="flex items-end gap-2 h-40">
                {mockStats.weeklyTrend.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[10px] text-muted-foreground">{val}</div>
                    <div className="w-full rounded-t bg-accent/70 hover:bg-accent transition-colors cursor-pointer"
                      style={{ height: `${(val / 250) * 100}%` }} />
                    <div className="text-[10px] text-muted-foreground">{['周一','周二','周三','周四','周五','周六','周日'][i]}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 热门相册排行 */}
            <Card className="p-5">
              <h3 className="mb-4 font-bold text-primary">热门相册 Top 5</h3>
              <div className="space-y-2">
                {mockStats.topAlbums.map((album, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${i < 3 ? 'bg-accent text-primary' : 'bg-secondary text-muted-foreground'}`}>{i + 1}</span>
                    <span className="flex-1 text-sm">{album.name}</span>
                    <span className="text-xs text-muted-foreground">{album.views} 次浏览</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* 活跃用户排行 */}
            <Card className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <Crown className="h-5 w-5 text-accent" />
                <h3 className="font-bold text-primary">活跃同学 Top 5</h3>
              </div>
              <div className="space-y-2">
                {mockStats.topUsers.map((user, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${i < 3 ? 'bg-accent text-primary' : 'bg-secondary text-muted-foreground'}`}>{i + 1}</span>
                    <span className="flex-1 text-sm">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.uploads} 张上传</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* 最近上传照片 */}
        <Card className="mt-6 p-5">
          <h3 className="mb-4 font-bold text-primary">最近上传照片</h3>
          <div className="grid grid-cols-5 gap-3 sm:grid-cols-10">
            {recentPhotos.map(photo => (
              <div key={photo.id} className="aspect-square overflow-hidden rounded-lg">
                <img src={photo.thumbnail} alt={photo.caption} className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
