import { useEffect, useState } from 'react';
import { getApiStatsApi, getSlowApisApi } from '../api/analytics';

export default function ApiMonitor() {
  const [apiStats, setApiStats] = useState<any[]>([]);
  const [slowApis, setSlowApis] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const end = new Date();
    const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
    Promise.all([
      getApiStatsApi({ start: start.toISOString(), end: end.toISOString() }),
      getSlowApisApi({ threshold: 500, limit: 10 }),
    ])
      .then(([statsRes, slowRes]: any) => {
        setApiStats(statsRes.data || []);
        setSlowApis(slowRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 style={{ margin: '0 0 20px' }}>API 监控</h2>
      {loading && <div style={{ color: '#6b7280' }}>加载中...</div>}

      <h3 style={{ fontSize: 16, margin: '24px 0 12px' }}>接口统计（近24小时）</h3>
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>接口</th>
              <th>方法</th>
              <th>请求次数</th>
              <th>平均响应</th>
              <th>最大响应</th>
            </tr>
          </thead>
          <tbody>
            {apiStats.map((item: any, idx: number) => (
              <tr key={idx}>
                <td>{item.path}</td>
                <td><span style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  background: item.method === 'GET' ? '#dbeafe' : item.method === 'POST' ? '#dcfce7' : '#f3f4f6',
                  color: item.method === 'GET' ? '#1e40af' : item.method === 'POST' ? '#166534' : '#374151',
                }}>{item.method}</span></td>
                <td>{item.qps}</td>
                <td>{item.avgDuration} ms</td>
                <td>{item.maxDuration} ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 style={{ fontSize: 16, margin: '24px 0 12px' }}>慢接口 TOP10（{'>='} 500ms）</h3>
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>接口</th>
              <th>方法</th>
              <th>平均响应</th>
              <th>最大响应</th>
              <th>次数</th>
            </tr>
          </thead>
          <tbody>
            {slowApis.map((item: any, idx: number) => (
              <tr key={idx}>
                <td>{item.path}</td>
                <td>{item.method}</td>
                <td style={{ color: '#dc2626', fontWeight: 600 }}>{Number(item.avgDuration).toFixed(2)} ms</td>
                <td>{item.maxDuration} ms</td>
                <td>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
