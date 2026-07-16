import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MessageSquare, GraduationCap, Briefcase, BookOpen, Heart, Globe, Users, Lock } from 'lucide-react';
import { mockUsers } from '@/data/mock';
import { useAuth } from '@/contexts/AuthContext';
import type { PhotoVisibility } from '@/types';

const personalAlbumLabels: Record<string, string> = {
  class_group: '班级集体合影',
  personal_research: '个人研学抓拍',
  course: '课程课堂照片',
  private: '私人活动留影',
};

const visConfig: Record<PhotoVisibility, { icon: typeof Globe; color: string }> = {
  public: { icon: Globe, color: 'text-green-600' },
  class_only: { icon: Users, color: 'text-blue-600' },
  private: { icon: Lock, color: 'text-pink-600' },
};

export function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('class_group');
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    return <div className="py-20 text-center text-muted-foreground">用户不存在</div>;
  }

  const isOwner = currentUser?.id === user.id;
  const isClassmate = currentUser && currentUser.role !== 'guest';

  // 判断字段是否可见
  const canSee = (vis: PhotoVisibility) => {
    if (isOwner) return true;
    if (vis === 'public') return true;
    if (vis === 'class_only' && isClassmate) return true;
    return false;
  };

  return (
    <div className="bg-background">
      {/* 封面区 */}
      <div className="relative h-64 w-full overflow-hidden md:h-80">
        <img src={user.coverImage || `https://picsum.photos/seed/cover${user.id}/1920/400`} alt="封面" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
        {/* 双校 LOGO 水印 */}
        <div className="absolute right-8 top-8 flex gap-3 opacity-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-xs text-white">港大</div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-xs text-white">北大</div>
        </div>
      </div>

      {/* 头像 + 基本信息 */}
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <div className="relative -mt-20 flex flex-col items-center md:flex-row md:items-end md:gap-6">
          <div className="h-32 w-32 overflow-hidden rounded-full ring-4 ring-background shadow-xl">
            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
          </div>
          <div className="mt-4 flex-1 text-center md:text-left md:pb-4">
            <h1 className="text-2xl font-bold text-primary">{user.name}</h1>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="flex items-center gap-1 text-sm text-muted-foreground"><Briefcase className="h-4 w-4" />{user.position}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">{user.company}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <Badge variant="secondary">{user.industry}</Badge>
              <Badge variant="secondary">{user.enrollmentBatch}</Badge>
              {user.role === 'admin' && <Badge className="bg-accent text-primary">班委</Badge>}
            </div>
          </div>
          <div className="mt-4 flex gap-2 md:mb-4">
            {isOwner ? (
              <Button variant="outline" size="sm">编辑资料</Button>
            ) : isClassmate ? (
              <>
                <Button size="sm" variant="outline"><MessageSquare className="mr-1 h-4 w-4" />私信</Button>
                <Button size="sm" variant="outline"><Heart className="mr-1 h-4 w-4" />收藏主页</Button>
              </>
            ) : null}
          </div>
        </div>

        {/* 个人介绍 */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {/* 左栏：基本信息 */}
          <Card className="p-6 md:col-span-1">
            <h3 className="mb-4 font-bold text-primary">基本信息</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground">工作单位：</span>
                <span className="font-medium">{user.company}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground">行业：</span>
                <span className="font-medium">{user.industry}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground">入学批次：</span>
                <span className="font-medium">{user.enrollmentBatch}</span>
              </div>
              {/* 联系方式（受权限控制） */}
              {canSee(user.phoneVisibility) && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-accent" />
                  <span className="text-muted-foreground">手机：</span>
                  <span className="font-medium">{user.phone}</span>
                </div>
              )}
              {canSee(user.emailVisibility) && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-accent" />
                  <span className="text-muted-foreground">邮箱：</span>
                  <span className="font-medium text-xs">{user.email}</span>
                </div>
              )}
              {!isClassmate && !isOwner && (
                <div className="mt-4 rounded-md bg-secondary p-3 text-xs text-muted-foreground">
                  <Lock className="mb-1 h-4 w-4" />
                  联系方式仅同班同学可见，登录后查看
                </div>
              )}
            </div>
          </Card>

          {/* 右栏：详细介绍 */}
          <div className="space-y-6 md:col-span-2">
            {user.researchDirection && (
              <Card className="p-6">
                <h3 className="mb-3 flex items-center gap-2 font-bold text-primary"><BookOpen className="h-5 w-5 text-accent" />研究方向</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{user.researchDirection}</p>
              </Card>
            )}
            {canSee('class_only') && user.dbaReflection && (
              <Card className="p-6">
                <h3 className="mb-3 flex items-center gap-2 font-bold text-primary"><GraduationCap className="h-5 w-5 text-accent" />DBA 就读心得</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{user.dbaReflection}</p>
              </Card>
            )}
            {user.personalMessage && (
              <Card className="p-6">
                <h3 className="mb-3 flex items-center gap-2 font-bold text-primary"><Heart className="h-5 w-5 text-accent" />个人寄语</h3>
                <p className="text-sm leading-relaxed text-muted-foreground italic">"{user.personalMessage}"</p>
              </Card>
            )}
          </div>
        </div>

        {/* 个人照片作品集 */}
        <div className="mt-10 mb-16">
          <h2 className="mb-6 text-xl font-bold text-primary">个人照片作品集</h2>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex w-full flex-wrap gap-1 h-auto p-1 mb-6 bg-secondary/50">
              {user.personalAlbums.map(album => (
                <TabsTrigger key={album.type} value={album.type} className="px-4 py-2 text-sm">
                  {personalAlbumLabels[album.type]}
                </TabsTrigger>
              ))}
            </TabsList>

            {user.personalAlbums.map(album => (
              <TabsContent key={album.type} value={album.type} className="mt-0">
                {album.photos.length === 0 ? (
                  <p className="py-12 text-center text-muted-foreground">暂无照片</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {album.photos.map(photo => {
                      const canSeePhoto = canSee(photo.visibility);
                      const VisIcon = visConfig[photo.visibility].icon;
                      if (!canSeePhoto) {
                        return (
                          <Card key={photo.id} className="flex aspect-square flex-col items-center justify-center bg-secondary/30">
                            <Lock className="mb-2 h-8 w-8 text-muted-foreground/40" />
                            <span className="text-xs text-muted-foreground">{visConfig[photo.visibility].icon === Lock ? '仅自己可见' : '仅同班同学可见'}</span>
                          </Card>
                        );
                      }
                      return (
                        <Card key={photo.id} className="group relative overflow-hidden p-0">
                          <img src={photo.thumbnail} alt={photo.caption} className="aspect-square w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" onClick={() => setPreviewPhoto(photo.url)} />
                          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                            <p className="truncate text-xs text-white">{photo.caption}</p>
                          </div>
                          <Badge className="absolute right-2 top-2 bg-black/40 backdrop-blur-sm">
                            <VisIcon className={`mr-1 h-3 w-3 ${visConfig[photo.visibility].color}`} />
                            <span className="text-white">{visConfig[photo.visibility].icon === Globe ? '公开' : visConfig[photo.visibility].icon === Users ? '班级' : '私密'}</span>
                          </Badge>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* 图片预览 */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setPreviewPhoto(null)}>
          <img src={previewPhoto} alt="预览" className="max-h-[90vh] max-w-full" />
        </div>
      )}
    </div>
  );
}
