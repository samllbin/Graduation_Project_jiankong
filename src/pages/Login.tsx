import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../api/analytics';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async () => {
    if (!userName.trim() || !password) {
      setError('请输入账号和密码');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res: any = await loginApi({ userName: userName.trim(), password });
      const token = res.data?.access_token;
      if (token) {
        localStorage.setItem('admin_token', token);
        navigate('/dashboard');
      } else {
        setError(res.message || '登录失败');
      }
    } catch (e: any) {
      setError(e?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ width: 360, padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <h2 style={{ margin: '0 0 24px', textAlign: 'center' }}>监控后台登录</h2>
        <input
          style={{
            width: '100%',
            padding: '10px 14px',
            marginBottom: 12,
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            fontSize: 15,
          }}
          placeholder="账号"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          style={{
            width: '100%',
            padding: '10px 14px',
            marginBottom: 12,
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            fontSize: 15,
          }}
          placeholder="密码"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <div style={{ color: '#ef4444', fontSize: 14, marginBottom: 12 }}>{error}</div>
        )}
        <button
          onClick={onSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: loading ? '#9ca3af' : '#2563eb',
            color: '#fff',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </div>
    </div>
  );
}
