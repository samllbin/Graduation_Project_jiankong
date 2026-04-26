import { useEffect, useState } from 'react';
import { getJsErrorsApi } from '../api/analytics';

export default function JsErrors() {
  const [data, setData] = useState<any>({ list: [], total: 0, page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    getJsErrorsApi({ page, limit: 20 })
      .then((res: any) => setData(res.data || { list: [], total: 0, page: 1, totalPages: 1 }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div>
      <h2 style={{ margin: '0 0 20px' }}>JS 错误监控</h2>
      {loading && <div style={{ color: '#6b7280' }}>加载中...</div>}
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>时间</th>
              <th>错误信息</th>
              <th>设备</th>
              <th>App 版本</th>
            </tr>
          </thead>
          <tbody>
            {data.list.map((item: any) => (
              <>
                <tr
                  key={item.id}
                  onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{new Date(item.createdAt).toLocaleString('zh-CN')}</td>
                  <td style={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.message}
                  </td>
                  <td>{item.deviceInfo || '-'}</td>
                  <td>{item.appVersion || '-'}</td>
                </tr>
                {expanded === item.id && (
                  <tr>
                    <td colSpan={4} style={{ background: '#f9fafb', padding: 16 }}>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: 13 }}>
                        {item.stack || '无堆栈信息'}
                      </pre>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          style={{ padding: '6px 14px', borderRadius: 6, background: '#fff', border: '1px solid #e5e7eb' }}
        >
          上一页
        </button>
        <span style={{ padding: '6px 12px' }}>{page} / {data.totalPages}</span>
        <button
          disabled={page >= data.totalPages}
          onClick={() => setPage(page + 1)}
          style={{ padding: '6px 14px', borderRadius: 6, background: '#fff', border: '1px solid #e5e7eb' }}
        >
          下一页
        </button>
      </div>
    </div>
  );
}
