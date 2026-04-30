import { useEffect, useState } from 'react';
import { getFeedbackListApi } from '../api/feedback';

export default function FeedbackList() {
  const [data, setData] = useState<any>({ list: [], total: 0, page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getFeedbackListApi({ page, pageSize: 20 })
      .then((res: any) => setData(res.data || { list: [], total: 0, page: 1, totalPages: 1 }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div>
      <h2 style={{ margin: '0 0 20px' }}>用户反馈</h2>
      {loading && <div style={{ color: '#6b7280' }}>加载中...</div>}
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>用户ID</th>
              <th>内容</th>
              <th>图片</th>
              <th>联系方式</th>
              <th>时间</th>
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
                  <td>{item.id}</td>
                  <td>{item.userId}</td>
                  <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.content || '-'}
                  </td>
                  <td>{item.images?.length ? `${item.images.length}张` : '-'}</td>
                  <td>{item.contact || '-'}</td>
                  <td>{new Date(item.createdAt).toLocaleString('zh-CN')}</td>
                </tr>
                {expanded === item.id && (
                  <tr>
                    <td colSpan={6} style={{ background: '#f9fafb', padding: 16 }}>
                      <div style={{ marginBottom: 12, fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                        {item.content}
                      </div>
                      {item.images?.length > 0 && (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {item.images.map((url: string, idx: number) => (
                            <img
                              key={idx}
                              src={url}
                              alt={`feedback-${idx}`}
                              style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewImage(url);
                              }}
                            />
                          ))}
                        </div>
                      )}
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

      {previewImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="preview"
            style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 8 }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
