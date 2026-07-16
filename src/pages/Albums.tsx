import { Link, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Image as ImageIcon, Calendar, MapPin } from 'lucide-react';
import { mockAlbums } from '@/data/mock';
import { CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_ORDER, type AlbumCategory } from '@/types';

export function AlbumsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = (searchParams.get('category') as AlbumCategory) || 'orientation';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* 面包屑 */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">首页</Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>全部相册</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary md:text-3xl">班级时光相册</h1>
        <p className="mt-2 text-sm text-muted-foreground">按就读流程分类，记录 DBA5 班每一个珍贵瞬间</p>
      </div>

      {/* 五大分类 Tab */}
      <Tabs value={activeCategory} onValueChange={(v) => setSearchParams({ category: v })}>
        <TabsList className="flex w-full flex-wrap justify-start gap-1 h-auto p-1 mb-8 bg-secondary/50">
          {CATEGORY_ORDER.map((cat, i) => (
            <TabsTrigger key={cat} value={cat} className="flex items-center gap-2 px-4 py-2 text-sm">
              <span>{CATEGORY_ICONS[cat]}</span>
              <span>{`①②③④⑤`[i]}</span>
              <span>{CATEGORY_LABELS[cat]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* 子相册网格 */}
        {CATEGORY_ORDER.map(cat => (
          <div key={cat} className={cat === activeCategory ? 'block' : 'hidden'}>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {mockAlbums.filter(a => a.parentId !== null && a.category === cat).map(album => (
                <Link key={album.id} to={`/albums/${album.id}`}>
                  <Card className="group overflow-hidden transition-all hover:shadow-lg cursor-pointer h-full">
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <img src={album.coverImage} alt={album.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-bold">{album.name}</h3>
                      </div>
                      <Badge className="absolute right-3 top-3 bg-black/40 text-white backdrop-blur-sm">
                        <ImageIcon className="mr-1 h-3 w-3" />{album.photoCount}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">{album.description}</p>
                      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground/70">
                        {album.year && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{album.year}</span>}
                        {album.city && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{album.city}</span>}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </Tabs>
    </div>
  );
}
