import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Megaphone, ArrowRight, Heart } from 'lucide-react';
import { mockUsers, mockAnnouncements, mockStats } from '@/data/mock';
import { getLatestPhotos, getAlbumsWithPhotoCount } from '@/data/photoLoader';
import { CATEGORY_ICONS, CATEGORY_ORDER } from '@/types';

const heroSlides = [
  { url: 'https://picsum.photos/seed/hero1/1920/520', title: '港大北大联合 DBA5 班', subtitle: '2023-2025 · 三年研学路，一生同窗情' },
  { url: 'https://picsum.photos/seed/hero2/1920/520', title: '学术与实践的交汇', subtitle: '汇聚中国优秀企业家学者' },
  { url: 'https://picsum.photos/seed/hero3/1920/520', title: '毕业不散场', subtitle: 'DBA5班 · 永远的家' },
];

export function HomePage() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const latestPhotos = getLatestPhotos(12);
  const showcaseUsers = mockUsers.filter(u => u.role !== 'guest').slice(0, 6);
  const allAlbums = getAlbumsWithPhotoCount();
  const rootAlbums = CATEGORY_ORDER.map(cat => allAlbums.find(a => a.category === cat && a.parentId === null)!).filter(Boolean);

  return (
    <div className="bg-background">
      {/* ── Hero 轮播 ── */}
      <section className="relative h-[520px] w-full overflow-hidden md:h-[420px] sm:h-[375px]">
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${s.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
          </div>
        ))}
        {/* 文字 */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">{heroSlides[slide].title}</h1>
            <p className="mt-3 text-lg text-white/70">{heroSlides[slide].subtitle}</p>
            <div className="mt-6">
              <Button asChild className="bg-accent text-primary hover:bg-accent/90">
                <Link to="/albums">浏览全部相册 <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
        {/* 箭头 */}
        <button onClick={() => setSlide(s => (s - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button onClick={() => setSlide(s => (s + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors">
          <ChevronRight className="h-6 w-6" />
        </button>
        {/* 指示器 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`h-2 rounded-full transition-all ${i === slide ? 'w-8 bg-accent' : 'w-2 bg-white/40'}`} />
          ))}
        </div>
      </section>

      {/* ── 班级简介 ── */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="text-center">
          <Badge className="mb-3 bg-accent/10 text-accent">关于我们</Badge>
          <h2 className="text-2xl font-bold text-primary md:text-3xl">港大北大联合 DBA5 班</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            香港大学与北京大学联合管理学博士（DBA）项目，旨在培养具有全球视野和学术深度的管理思想者。
            DBA5班于2023年开学，汇聚32位来自金融、科技、制造、医疗等领域的优秀企业家学者，
            以"学术与实践融合、智慧与情怀并重"为宗旨，共同探索管理的真谛。
          </p>
        </div>
        {/* 数据卡片 */}
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: '班级同学', value: mockStats.totalUsers, suffix: '人' },
            { label: '相册总数', value: mockStats.totalAlbums, suffix: '个' },
            { label: '照片总量', value: mockStats.totalPhotos, suffix: '张' },
            { label: '累计浏览', value: mockStats.totalViews.toLocaleString(), suffix: '次' },
          ].map((stat, i) => (
            <Card key={i} className="p-6 text-center">
              <div className="text-3xl font-bold text-accent">{stat.value}<span className="text-sm text-muted-foreground">{stat.suffix}</span></div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── 相册快捷入口 ── */}
      <section className="bg-secondary/50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-8 text-center">
            <Badge className="mb-3 bg-accent/10 text-accent">五大相册</Badge>
            <h2 className="text-2xl font-bold text-primary md:text-3xl">班级时光相册</h2>
            <p className="mt-2 text-sm text-muted-foreground">按就读流程分类，记录每一个珍贵瞬间</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {rootAlbums.map((album, i) => {
              const subAlbums = allAlbums.filter(a => a.parentId === album.id);
              const photoCount = subAlbums.reduce((sum, a) => sum + a.photoCount, 0);
              return (
                <Link key={album.id} to={`/albums?category=${album.category}`}>
                  <Card className="group relative overflow-hidden transition-all hover:shadow-lg cursor-pointer h-full">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={album.coverImage} alt={album.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <div className="text-2xl">{CATEGORY_ICONS[album.category]}</div>
                      <div className="mt-1 font-bold">{`①②③④⑤`[i]} {album.name}</div>
                      <div className="text-xs text-white/70">{photoCount} 张照片</div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 最新影像 ── */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Badge className="mb-2 bg-accent/10 text-accent">最新动态</Badge>
            <h2 className="text-2xl font-bold text-primary">最新上传影像</h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/albums">查看更多 <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {latestPhotos.map(photo => (
            <Link key={photo.id} to={`/albums/${photo.albumId}`}>
              <Card className="group overflow-hidden cursor-pointer">
                <div className="aspect-square overflow-hidden">
                  <img src={photo.thumbnail} alt={photo.caption} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                </div>
                <div className="p-2">
                  <p className="truncate text-xs text-muted-foreground">{photo.caption}</p>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground/60">
                    <Heart className="h-3 w-3" /> {photo.likeCount}
                    <span>{photo.uploadAt}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 优秀同学展示 ── */}
      <section className="bg-secondary/50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-8 text-center">
            <Badge className="mb-3 bg-accent/10 text-accent">班级风采</Badge>
            <h2 className="text-2xl font-bold text-primary md:text-3xl">优秀同学展示</h2>
            <p className="mt-2 text-sm text-muted-foreground">点击卡片直达同学个人主页</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {showcaseUsers.map(user => (
              <Link key={user.id} to={`/profile/${user.id}`}>
                <Card className="group p-6 text-center transition-all hover:shadow-lg cursor-pointer">
                  <div className="mx-auto mb-3 h-20 w-20 overflow-hidden rounded-full ring-2 ring-accent/20 ring-offset-2 transition-all group-hover:ring-accent/60">
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="font-semibold text-primary">{user.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{user.company}</div>
                  <div className="text-xs text-muted-foreground">{user.position}</div>
                  <Badge variant="secondary" className="mt-2 text-[10px]">{user.industry}</Badge>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link to="/directory">查看全部同学 <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 班级公告 ── */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="mb-8">
          <Badge className="mb-2 bg-accent/10 text-accent"><Megaphone className="mr-1 h-3 w-3" />班级公告</Badge>
          <h2 className="text-2xl font-bold text-primary">最新通知</h2>
        </div>
        <div className="space-y-3">
          {mockAnnouncements.map(ann => (
            <Card key={ann.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {ann.isPinned && <Badge className="bg-accent text-primary">置顶</Badge>}
                    <h3 className="font-semibold text-primary">{ann.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{ann.content}</p>
                  <div className="mt-2 text-xs text-muted-foreground/60">{ann.publisherName} · {ann.createdAt}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
