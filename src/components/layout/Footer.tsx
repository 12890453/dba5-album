import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-primary text-white/60">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* 左栏：项目介绍 */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/70 ring-1 ring-white/20">港大</div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/70 ring-1 ring-white/20">北大</div>
              <div>
                <div className="text-sm font-bold text-accent">港大北大联合 DBA5 班</div>
                <div className="text-[10px] text-white/40">时光相册官网</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed">
              香港大学与北京大学联合管理学博士（DBA）项目，汇聚中国优秀企业家学者，
              以学术深度与实践智慧融合，培育具有全球视野的管理思想者。
            </p>
          </div>

          {/* 中栏：快速链接 */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white/80">快速导航</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-accent transition-colors">首页</Link></li>
              <li><Link to="/albums" className="hover:text-accent transition-colors">全部相册</Link></li>
              <li><Link to="/directory" className="hover:text-accent transition-colors">同学名录</Link></li>
              <li><Link to="/timeline" className="hover:text-accent transition-colors">班级大事记</Link></li>
              <li><Link to="/messages" className="hover:text-accent transition-colors">留言墙</Link></li>
              <li><Link to="/videos" className="hover:text-accent transition-colors">视频专区</Link></li>
              <li><Link to="/downloads" className="hover:text-accent transition-colors">纪念素材下载</Link></li>
            </ul>
          </div>

          {/* 右栏：联系方式 */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white/80">联系我们</h4>
            <ul className="space-y-2 text-xs">
              <li>班级联络邮箱：dba5@class.hku-pku.edu</li>
              <li>项目官网：www.hku-pku.edu/dba</li>
              <li>香港大学 · 北京大学联合管理学院</li>
            </ul>
          </div>
        </div>

        {/* 底栏 */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          <p>© 2026 港大北大联合 DBA5 班 版权所有 | 隐私说明 | 使用条款</p>
          <p className="mt-1">本网站为班级专属纪念相册，仅供班级成员及授权访客浏览</p>
        </div>
      </div>
    </footer>
  );
}
