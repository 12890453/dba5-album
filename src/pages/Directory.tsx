import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Users } from 'lucide-react';
import { mockUsers } from '@/data/mock';

const industries = ['全部', '金融', '科技', '制造', '医疗', '能源', '政府', '教育', '法律', '咨询', '其他'];
const batches = ['全部', '2023级'];

export function DirectoryPage() {
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('全部');
  const [batch, setBatch] = useState('全部');

  const filtered = useMemo(() => {
    return mockUsers.filter(u => {
      if (u.role === 'guest') return false;
      if (search && !u.name.includes(search) && !u.company.includes(search)) return false;
      if (industry !== '全部' && u.industry !== industry) return false;
      if (batch !== '全部' && u.enrollmentBatch !== batch) return false;
      return true;
    });
  }, [search, industry, batch]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary md:text-3xl">同学名录</h1>
        <p className="mt-2 text-sm text-muted-foreground">DBA5 班全部同学，共 {filtered.length} 人</p>
      </div>

      {/* 筛选栏 */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索姓名或企业..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="行业" /></SelectTrigger>
          <SelectContent>{industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={batch} onValueChange={setBatch}>
          <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="入学批次" /></SelectTrigger>
          <SelectContent>{batches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {/* 同学卡片网格 */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">未找到匹配的同学</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map(user => (
            <Link key={user.id} to={`/profile/${user.id}`}>
              <Card className="group flex flex-col items-center p-6 text-center transition-all hover:shadow-lg cursor-pointer">
                <div className="mb-4 h-24 w-24 overflow-hidden rounded-full ring-2 ring-accent/20 ring-offset-2 transition-all group-hover:ring-accent/60">
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="text-lg font-bold text-primary">{user.name}</div>
                <div className="mt-1 text-sm text-muted-foreground">{user.position}</div>
                <div className="text-sm text-muted-foreground">{user.company}</div>
                <Badge variant="secondary" className="mt-3">{user.industry}</Badge>
                <div className="mt-2 text-xs text-muted-foreground/60">{user.enrollmentBatch}</div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
