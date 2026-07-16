import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, FileArchive, FileImage } from 'lucide-react';
import { mockDownloads } from '@/data/mock';

const fileTypeConfig = {
  jpg: { icon: FileImage, color: 'text-blue-600', bg: 'bg-blue-50' },
  png: { icon: FileImage, color: 'text-purple-600', bg: 'bg-purple-50' },
  pdf: { icon: FileText, color: 'text-red-600', bg: 'bg-red-50' },
  zip: { icon: FileArchive, color: 'text-orange-600', bg: 'bg-orange-50' },
};

export function DownloadsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <Badge className="mb-3 bg-accent/10 text-accent">纪念素材</Badge>
        <h1 className="text-2xl font-bold text-primary md:text-3xl">纪念素材下载区</h1>
        <p className="mt-2 text-sm text-muted-foreground">班级高清集体照 · 纪念海报 · 电子纪念册</p>
      </div>

      <div className="space-y-4">
        {mockDownloads.map(item => {
          const config = fileTypeConfig[item.fileType];
          const Icon = config.icon;
          return (
            <Card key={item.id} className="flex items-center gap-4 p-5 transition-shadow hover:shadow-md">
              <div className={`flex h-14 w-14 items-center justify-center rounded-lg ${config.bg}`}>
                <Icon className={`h-7 w-7 ${config.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-primary">{item.title}</h3>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{item.fileType.toUpperCase()}</span>
                  <span>·</span>
                  <span>{item.fileSize}</span>
                  <span>·</span>
                  <span>上传：{item.uploaderName}</span>
                  <span>·</span>
                  <span>{item.createdAt}</span>
                  <span>·</span>
                  <span>下载 {item.downloadCount} 次</span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="shrink-0">
                <Download className="mr-1 h-4 w-4" />下载
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
