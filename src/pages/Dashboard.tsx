import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { getPvUvApi, getApiStatsApi } from '../api/analytics';

function useEChart(containerRef: React.RefObject<HTMLDivElement | null>, option: echarts.EChartsOption) {
  const chartRef = useRef<echarts.ECharts | null>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const chart = echarts.init(containerRef.current);
    chart.setOption(option);
    chartRef.current = chart;
    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      chart.dispose();
    };
  }, [containerRef, option]);
}

export default function Dashboard() {
  const [pvUvData, setPvUvData] = useState<any[]>([]);
  const [apiStats, setApiStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const pvUvRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<HTMLDivElement>(null);

  const end = new Date();
  const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getPvUvApi({ start: start.toISOString(), end: end.toISOString() }),
      getApiStatsApi({ start: start.toISOString(), end: end.toISOString() }),
    ])
      .then(([pvRes, apiRes]: any) => {
        setPvUvData(pvRes.data || []);
        setApiStats(apiRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pvUvOption: echarts.EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['PV', 'UV'] },
    xAxis: {
      type: 'category',
      data: pvUvData.map((d) => d.dateHour),
    },
    yAxis: { type: 'value' },
    series: [
      { name: 'PV', type: 'line', data: pvUvData.map((d) => d.pvCount), smooth: true },
      { name: 'UV', type: 'line', data: pvUvData.map((d) => d.uvCount), smooth: true },
    ],
  };

  const apiOption: echarts.EChartsOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'category',
      data: apiStats.slice(0, 10).map((d) => `${d.method} ${d.path}`),
      axisLabel: { rotate: 30, fontSize: 11 },
    },
    yAxis: { type: 'value', name: 'ms' },
    series: [
      {
        name: '平均响应时间',
        type: 'bar',
        data: apiStats.slice(0, 10).map((d) => d.avgDuration),
        itemStyle: { color: '#2563eb' },
      },
    ],
  };

  useEChart(pvUvRef, pvUvOption);
  useEChart(apiRef, apiOption);

  const totalPv = pvUvData.reduce((s, d) => s + (d.pvCount || 0), 0);
  const totalUv = pvUvData.reduce((s, d) => s + (d.uvCount || 0), 0);
  const avgDuration = apiStats.length
    ? (apiStats.reduce((s, d) => s + d.avgDuration, 0) / apiStats.length).toFixed(2)
    : 0;

  return (
    <div>
      <h2 style={{ margin: '0 0 20px' }}>数据概览</h2>

      {loading && <div style={{ color: '#6b7280' }}>加载中...</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard title="7日总 PV" value={String(totalPv)} />
        <StatCard title="7日总 UV" value={String(totalUv)} />
        <StatCard title="接口平均响应" value={`${avgDuration} ms`} />
        <StatCard title="监控接口数" value={String(apiStats.length)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>PV / UV 趋势（近7天）</h3>
          <div ref={pvUvRef} style={{ width: '100%', height: 300 }} />
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>接口平均响应时间 TOP10</h3>
          <div ref={apiRef} style={{ width: '100%', height: 300 }} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>{value}</div>
    </div>
  );
}
