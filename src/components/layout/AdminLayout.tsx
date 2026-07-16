import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, FolderOpen, Users, Image, Megaphone, FileDown,
  LogOut, ChevronLeft, ChevronRight, Home,
} from 'lucide-react';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: '仪表盘', exact: true },
  { to: '/admin/albums', icon: FolderOpen, label: '相册管理' },
  { to: '/admin/users', icon: Users, label: '用户管理' },
  { to: '/admin/photos', icon: Image, label: '图片管理' },
  { to: '/admin/content', icon: Megaphone, label: '内容管理' },
  { to: '/admin/materials', icon: FileDown, label: '素材管理' },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/30">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">无访问权限</h1>
          <p className="text-muted-foreground mb-6">仅管理员可访问管理后台</p>
          <Link to="/login" className="text-accent hover:underline">前往登录</Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-secondary/20">
      {/* 侧边栏 */}
      <aside className={cn(
        "flex flex-col border-r border-border bg-white transition-all duration-200",
        collapsed ? "w-16" : "w-56"
      )}>
        {/* Logo */}
        <div className={cn("flex items-center gap-2 border-b border-border px-3 py-4", collapsed && "justify-center")}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">DBA</div>
          {!collapsed && <span className="text-sm font-bold text-primary">DBA5 管理台</span>}
        </div>

        {/* 导航 */}
        <nav className="flex-1 space-y-0.5 p-2">
          {navItems.map((item) => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-accent/15 text-accent font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-primary",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* 底部 */}
        <div className="border-t border-border p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mb-2 flex w-full items-center justify-center rounded p-1 text-muted-foreground hover:bg-secondary"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
          <Link
            to="/"
            className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary", collapsed && "justify-center px-2")}
          >
            <Home className="h-4 w-4" />
            {!collapsed && "返回前台"}
          </Link>
          <button
            onClick={handleLogout}
            className={cn("mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50", collapsed && "justify-center px-2")}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && "退出登录"}
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
