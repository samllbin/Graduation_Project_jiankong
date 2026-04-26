import { useState } from 'react';
import { getLogByIdApi } from '../api/analytics';

export default function LogQuery() {
  const [logId, setLogId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSearch = async () => {
    if (!logId.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res: any = await getLogByIdApi(logId.trim());
      if (res.data) {
        setResult(res.data);
      } else {
        setError('未找到该 logId 对应的请求记录');
      }
    } catch (e: any) {
      setError(e?.message || '查询失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ margin: '0 0 20px' }}>日志查询</h2>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <input
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            fontSize: 15,
          }}
          placeholder="输入 logId"
          value={logId}
          onChange={(e) => setLogId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        <button
          onClick={onSearch}
          disabled={loading}
          style={{
            padding: '10px 24px',
            background: loading ? '#9ca3af' : '#2563eb',
            color: '#fff',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          {loading ? '查询中...' : '查询'}
        </button>
      </div>

      {error && (
        <div style={{ color: '#ef4444', marginBottom: 16 }}>{error}</div>
      )}

      {result && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>请求详情</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: 12, fontSize: 14 }}>
            <div style={{ color: '#6b7280' }}>LogId</div>
            <div><code>{result.logId}</code></div>

            <div style={{ color: '#6b7280' }}>时间</div>
            <div>{new Date(result.createdAt).toLocaleString('zh-CN')}</div>

            <div style={{ color: '#6b7280' }}>方法</div>
            <div>{result.method}</div>

            <div style={{ color: '#6b7280' }}>路径</div>
            <div>{result.path}</div>

            <div style={{ color: '#6b7280' }}>状态码</div>
            <div>
              <span style={{
                padding: '2px 10px',
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 600,
                background: result.statusCode < 400 ? '#dcfce7' : '#fee2e2',
                color: result.statusCode < 400 ? '#166534' : '#991b1b',
              }}>
                {result.statusCode}
              </span>
            </div>

            <div style={{ color: '#6b7280' }}>响应时长</div>
            <div>{result.durationMs} ms</div>

            <div style={{ color: '#6b7280' }}>IP</div>
            <div>{result.ip || '-'}</div>

            <div style={{ color: '#6b7280' }}>User-Agent</div>
            <div style={{ wordBreak: 'break-all' }}>{result.userAgent || '-'}</div>
          </div>
        </div>
      )}
    </div>
  );
}
