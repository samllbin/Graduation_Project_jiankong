import { Link, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/dashboard', label: '数据概览' },
  { path: '/js-errors', label: 'JS 错误' },
  { path: '/server-errors', label: '服务错误' },
  { path: '/api-monitor', label: 'API 监控' },
  { path: '/log-query', label: '日志查询' },
  { path: '/feedback', label: '用户反馈' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 200, background: '#1f2937', color: '#fff', flexShrink: 0 }}>
        <div style={{ padding: '20px 16px', fontSize: 18, fontWeight: 700, borderBottom: '1px solid #374151' }}>
          监控后台
        </div>
        <nav style={{ padding: '12px 0' }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'block',
                padding: '12px 20px',
                color: location.pathname === item.path ? '#fff' : '#9ca3af',
                background: location.pathname === item.path ? '#374151' : 'transparent',
                fontWeight: location.pathname === item.path ? 600 : 400,
                fontSize: 14,
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', padding: '20px 16px', borderTop: '1px solid #374151' }}>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              color: '#9ca3af',
              fontSize: 14,
              padding: 0,
            }}
          >
            退出登录
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: 24, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
