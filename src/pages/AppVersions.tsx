import { useEffect, useState } from 'react';
import { createAppVersionApi, getAppVersionListApi } from '../api/appVersion';

function formatSize(bytes: number) {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function AppVersions() {
  const [data, setData] = useState<any>({ list: [], pagination: { page: 1, totalPages: 1, total: 0 } });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    getAppVersionListApi({ page, pageSize: 20 })
      .then((res: any) => setData(res.data || { list: [], pagination: { page: 1, totalPages: 1, total: 0 } }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, reloadKey]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>App 版本管理</h2>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          发布新版本
        </button>
      </div>

      {loading && <div style={{ color: '#6b7280' }}>加载中...</div>}
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>versionCode</th>
              <th>versionName</th>
              <th>APK 大小</th>
              <th>强制更新</th>
              <th>发布时间</th>
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
                  <td>{item.versionCode}</td>
                  <td>{item.versionName}</td>
                  <td>{formatSize(item.apkSize)}</td>
                  <td>
                    {item.forceUpdate ? (
                      <span style={{ color: '#dc2626', fontWeight: 600 }}>强制</span>
                    ) : (
                      <span style={{ color: '#6b7280' }}>否</span>
                    )}
                  </td>
                  <td>{new Date(item.createdAt).toLocaleString('zh-CN')}</td>
                </tr>
                {expanded === item.id && (
                  <tr>
                    <td colSpan={6} style={{ background: '#f9fafb', padding: 16 }}>
                      <div style={{ marginBottom: 8, fontSize: 13, color: '#6b7280' }}>APK 链接</div>
                      <div style={{ marginBottom: 12, fontSize: 13, wordBreak: 'break-all' }}>
                        <a href={item.apkUrl} target="_blank" rel="noreferrer">{item.apkUrl}</a>
                      </div>
                      <div style={{ marginBottom: 8, fontSize: 13, color: '#6b7280' }}>修复内容</div>
                      <div style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                        {item.releaseNotes}
                      </div>
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
        <span style={{ padding: '6px 12px' }}>{page} / {data.pagination?.totalPages || 1}</span>
        <button
          disabled={page >= (data.pagination?.totalPages || 1)}
          onClick={() => setPage(page + 1)}
          style={{ padding: '6px 14px', borderRadius: 6, background: '#fff', border: '1px solid #e5e7eb' }}
        >
          下一页
        </button>
      </div>

      {showModal && (
        <ReleaseModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            setPage(1);
            setReloadKey((k) => k + 1);
          }}
        />
      )}
    </div>
  );
}

function ReleaseModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [versionCode, setVersionCode] = useState('');
  const [versionName, setVersionName] = useState('');
  const [releaseNotes, setReleaseNotes] = useState('');
  const [forceUpdate, setForceUpdate] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!file) return setError('请选择 APK 文件');
    if (!versionCode || !/^\d+$/.test(versionCode)) return setError('versionCode 必须是正整数');
    if (!versionName.trim()) return setError('请填写 versionName');
    if (!releaseNotes.trim()) return setError('请填写修复内容');

    const form = new FormData();
    form.append('file', file);
    form.append('versionCode', versionCode);
    form.append('versionName', versionName.trim());
    form.append('releaseNotes', releaseNotes.trim());
    form.append('forceUpdate', forceUpdate ? 'true' : 'false');

    setSubmitting(true);
    try {
      await createAppVersionApi(form);
      onSuccess();
    } catch (err: any) {
      setError(err.message || '发布失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
        alignItems: 'center', zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 12, padding: 24, width: 480, maxWidth: '90%' }}
      >
        <h3 style={{ margin: '0 0 16px' }}>发布新版本</h3>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 13, color: '#6b7280', marginBottom: 4 }}>APK 文件 (≤100MB)</label>
          <input
            type="file"
            accept=".apk,application/vnd.android.package-archive"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ fontSize: 13 }}
          />
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#6b7280', marginBottom: 4 }}>versionCode</label>
            <input
              type="number"
              value={versionCode}
              onChange={(e) => setVersionCode(e.target.value)}
              placeholder="如 6"
              style={{ width: '100%', padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#6b7280', marginBottom: 4 }}>versionName</label>
            <input
              type="text"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              placeholder="如 1.2.3"
              style={{ width: '100%', padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 13, color: '#6b7280', marginBottom: 4 }}>修复内容</label>
          <textarea
            value={releaseNotes}
            onChange={(e) => setReleaseNotes(e.target.value)}
            rows={5}
            placeholder="支持多行"
            style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
            <input type="checkbox" checked={forceUpdate} onChange={(e) => setForceUpdate(e.target.checked)} />
            强制更新（用户必须更新才能继续使用）
          </label>
        </div>

        {error && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 12 }}>{error}</div>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button
            onClick={onClose}
            disabled={submitting}
            style={{ padding: '6px 14px', borderRadius: 6, background: '#fff', border: '1px solid #e5e7eb', cursor: 'pointer' }}
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: '6px 14px', borderRadius: 6, background: '#2563eb', color: '#fff',
              border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? '发布中...' : '发布'}
          </button>
        </div>
      </div>
    </div>
  );
}
