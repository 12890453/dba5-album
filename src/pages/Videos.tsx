import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Eye, Clock } from 'lucide-react';
import { mockVideos } from '@/data/mock';

export function VideosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <Badge className="mb-3 bg-accent/10 text-accent">视频专区</Badge>
        <h1 className="text-2xl font-bold text-primary md:text-3xl">班级影像视频</h1>
        <p className="mt-2 text-sm text-muted-foreground">开班视频 · 研学记录 · 毕业纪录片</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockVideos.map(video => (
          <Card key={video.id} className="group overflow-hidden cursor-pointer transition-shadow hover:shadow-lg">
            <div className="relative aspect-video overflow-hidden">
              <img src={video.thumbnail} alt={video.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="rounded-full bg-white/90 p-4">
                  <Play className="h-8 w-8 fill-primary text-primary" />
                </div>
              </div>
              <Badge className="absolute bottom-2 right-2 bg-black/60 text-white">
                <Clock className="mr-1 h-3 w-3" />{video.duration}
              </Badge>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-primary line-clamp-1">{video.title}</h3>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{video.uploaderName}</span>
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{video.viewCount}</span>
              </div>
              <Badge variant="secondary" className="mt-2">{video.category}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
