import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');

  const handleLogin = (role: UserRole) => {
    login(role);
    navigate('/');
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-secondary/30 px-4 py-12">
      <Card className="w-full max-w-md p-8">
        {/* Logo 区 */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">港大</div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">北大</div>
          </div>
          <h1 className="text-xl font-bold text-primary">港大北大联合 DBA5 班</h1>
          <p className="text-sm text-muted-foreground">时光相册官网</p>
        </div>

        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">登录</TabsTrigger>
            <TabsTrigger value="register">注册</TabsTrigger>
          </TabsList>

          {/* 登录 Tab */}
          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label>姓名 / 学号</Label>
              <Input placeholder="请输入姓名或学号" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>密码</Label>
              <Input type="password" placeholder="请输入密码" />
            </div>
            <Button className="w-full bg-accent text-primary hover:bg-accent/90" onClick={() => handleLogin('student')}>
              登录
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">快捷体验</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => handleLogin('admin')}>管理员登录</Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => handleLogin('student')}>同学登录</Button>
            </div>
          </TabsContent>

          {/* 注册 Tab */}
          <TabsContent value="register" className="space-y-4">
            <div className="space-y-2">
              <Label>姓名 <span className="text-destructive">*</span></Label>
              <Input placeholder="真实姓名" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>学号 <span className="text-destructive">*</span></Label>
              <Input placeholder="如 DBA2023-001" value={studentId} onChange={e => setStudentId(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>手机号 <span className="text-destructive">*</span></Label>
              <Input placeholder="请输入手机号" />
            </div>
            <div className="space-y-2">
              <Label>邮箱 <span className="text-destructive">*</span></Label>
              <Input type="email" placeholder="请输入邮箱" />
            </div>
            <Button className="w-full bg-accent text-primary hover:bg-accent/90" onClick={() => handleLogin('student')}>
              提交注册申请
            </Button>
            <p className="text-center text-xs text-muted-foreground">注册需经管理员审核通过后方可登录</p>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-accent">← 返回首页</Link>
        </div>
      </Card>
    </div>
  );
}
