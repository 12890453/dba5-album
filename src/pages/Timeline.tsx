import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockTimelineEvents } from '@/data/mock';

export function TimelinePage() {
  const years = [...new Set(mockTimelineEvents.map(e => e.year))].sort();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <div className="mb-8 text-center">
        <Badge className="mb-3 bg-accent/10 text-accent">班级大事记</Badge>
        <h1 className="text-2xl font-bold text-primary md:text-3xl">DBA5 班时光轴</h1>
        <p className="mt-2 text-sm text-muted-foreground">记录三年研学旅程中的重要节点</p>
      </div>

      <div className="relative">
        {/* 竖线 */}
        <div className="absolute left-4 top-0 h-full w-0.5 bg-accent/30 md:left-1/2 md:-translate-x-1/2" />

        {years.map(year => (
          <div key={year} className="mb-12">
            {/* 年份节点 */}
            <div className="relative mb-6 flex items-center md:justify-center">
              <div className="absolute left-4 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-accent text-sm font-bold text-primary md:left-1/2 md:-translate-x-1/2">
                {year}
              </div>
            </div>

            {/* 事件卡片 */}
            <div className="ml-12 space-y-4 md:ml-0">
              {mockTimelineEvents.filter(e => e.year === year).map((event, i) => (
                <div key={event.id} className={`relative md:w-1/2 ${i % 2 === 0 ? 'md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                  {/* 连接线 */}
                  <div className={`absolute top-6 hidden h-0.5 w-4 bg-accent/30 md:block ${i % 2 === 0 ? 'right-0' : 'left-0'}`} />

                  <Card className="p-5 transition-shadow hover:shadow-lg">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-2xl">{event.icon}</span>
                      <span className="text-xs text-muted-foreground">{event.eventDate}</span>
                    </div>
                    <h3 className="font-bold text-primary">{event.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{event.description}</p>
                    {event.albumId && (
                      <Link to={`/albums/${event.albumId}`} className="mt-3 inline-block">
                        <Badge className="bg-accent/10 text-accent hover:bg-accent/20 cursor-pointer">
                          查看相册 →
                        </Badge>
                      </Link>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
