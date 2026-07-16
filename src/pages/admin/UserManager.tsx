import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, CheckCircle, XCircle, UserCog } from 'lucide-react';
import { usePersistedState } from '@/hooks/usePersistedState';
import { mockUsers as initialUsers } from '@/data/mock';
import type { User, UserRole } from '@/types';

const ROLE_LABELS: Record<UserRole, string> = { admin: '管理员', student: '同学', alumni: '校友', guest: '访客' };
const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: '正常', variant: 'default' },
  pending: { label: '待审核', variant: 'secondary' },
  disabled: { label: '已禁用', variant: 'destructive' },
};

export function UserManager() {
  const [users, setUsers] = usePersistedState('admin_users', initialUsers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [confirmAction, setConfirmAction] = useState<{ user: User; action: string } | null>(null);

  const filtered = users.filter(u => {
    if (search && !u.name.includes(search) && !u.studentId.includes(search) && !u.company.includes(search)) return false;
    if (filterRole !== 'all' && u.role !== filterRole) return false;
    if (filterStatus !== 'all' && u.status !== filterStatus) return false;
    return true;
  });

  const handleApprove = (user: User) => {
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: 'active' } : u));
    setConfirmAction(null);
  };

  const handleToggleStatus = () => {
    if (!confirmAction) return;
    const { user } = confirmAction;
    const newStatus = user.status === 'active' ? 'disabled' : 'active';
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    setConfirmAction(null);
  };

  const handleRoleChange = (user: User, role: UserRole) => {
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role } : u));
  };

  const handleResetPwd = (user: User) => {
    alert(`已重置 ${user.name} 的密码为：DBA2025#${user.studentId.slice(-3)}`);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">用户管理</h1>
        <p className="text-sm text-muted-foreground">审核注册、调整权限、管理账号状态</p>
      </div>

      {/* 搜索筛选 */}
      <Card className="mb-6 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="搜索姓名、学号或公司" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-32"><SelectValue placeholder="角色" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部角色</SelectItem>
              {Object.entries(ROLE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32"><SelectValue placeholder="状态" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              {Object.entries(STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* 用户列表 */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>学号</TableHead>
              <TableHead>企业 / 职位</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="w-56">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(user => {
              const st = STATUS_LABELS[user.status];
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.studentId}</TableCell>
                  <TableCell className="text-sm">{user.company} · {user.position}</TableCell>
                  <TableCell>
                    <Select value={user.role} onValueChange={(v) => handleRoleChange(user, v as UserRole)}>
                      <SelectTrigger className="h-8 w-28 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ROLE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant={st.variant}>{st.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {user.status === 'pending' ? (
                        <Button variant="outline" size="sm" className="text-green-600 border-green-300 hover:bg-green-50" onClick={() => handleApprove(user)}>
                          <CheckCircle className="mr-1 h-3 w-3" />通过
                        </Button>
                      ) : null}
                      <Button variant="ghost" size="icon" onClick={() => handleResetPwd(user)} title="重置密码">
                        <UserCog className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className={user.status === 'active' ? 'text-orange-500' : 'text-green-500'}
                        onClick={() => setConfirmAction({ user, action: user.status === 'active' ? 'disable' : 'enable' })}
                        title={user.status === 'active' ? '禁用' : '启用'}
                      >
                        {user.status === 'active' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认操作</AlertDialogTitle>
            <AlertDialogDescription>
              确定要{confirmAction?.action === 'disable' ? '禁用' : '启用'}用户「{confirmAction?.user.name}」吗？
              {confirmAction?.action === 'disable' ? ' 禁用后该用户将无法登录。' : ' 启用后该用户可正常登录。'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleStatus} className={confirmAction?.action === 'disable' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}>
              确认{confirmAction?.action === 'disable' ? '禁用' : '启用'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
