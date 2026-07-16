import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Search, Menu, User as UserIcon, LogOut } from 'lucide-react';

const navItems = [
  { label: '首页', path: '/' },
  { label: '全部相册', path: '/albums' },
  { label: '同学名录', path: '/directory' },
  { label: '班级大事记', path: '/timeline' },
  { label: '留言墙', path: '/messages' },
];

export function Header() {
  const { user, isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-primary shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo 区域 */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/70 ring-1 ring-white/20">港大</div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/70 ring-1 ring-white/20">北大</div>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-accent">港大北大联合 DBA5 班</div>
            <div className="text-[10px] text-white/50">时光相册官网</div>
          </div>
        </Link>

        {/* 桌面端导航 */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                location.pathname === item.path
                  ? 'text-accent bg-white/10'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 右侧操作 */}
        <div className="flex items-center gap-2">
          {/* 搜索按钮 */}
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10" asChild>
            <Link to="/directory"><Search className="h-4 w-4" /></Link>
          </Button>

          {/* 登录/用户 */}
          {isLoggedIn ? (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10" asChild>
                <Link to="/profile">
                  <UserIcon className="mr-1 h-4 w-4" />
                  {user?.name}
                </Link>
              </Button>
              {user?.role === 'admin' && (
                <Button variant="ghost" size="sm" className="text-accent hover:bg-white/10" asChild>
                  <Link to="/admin">管理后台</Link>
                </Button>
              )}
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="default" className="bg-accent text-primary hover:bg-accent/90" asChild>
              <Link to="/login">登录</Link>
            </Button>
          )}

          {/* 移动端菜单 */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-primary">
              <div className="flex flex-col gap-2 pt-8">
                <div className="mb-4 px-4">
                  <div className="text-sm font-bold text-accent">港大北大联合 DBA5 班</div>
                  <div className="text-[10px] text-white/50">时光相册官网</div>
                </div>
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 text-sm font-medium rounded-lg ${
                      location.pathname === item.path
                        ? 'text-accent bg-white/10'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-2 border-t border-white/10" />
                {isLoggedIn ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm text-white/70 hover:bg-white/5 rounded-lg">个人主页</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm text-accent hover:bg-white/5 rounded-lg">管理后台</Link>
                    )}
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="px-4 py-3 text-left text-sm text-white/70 hover:bg-white/5 rounded-lg">退出登录</button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-sm text-accent hover:bg-white/5 rounded-lg">登录 / 注册</Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
