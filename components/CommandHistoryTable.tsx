'use client';

import { useEffect, useState } from 'react';

const SC: Record<string, { bg: string; color: string; dot: string; pulse?: boolean }> = {
  SUCCEEDED:           { bg: '#EAF3DE', color: '#27500A', dot: '#639922' },
  FAILED:              { bg: '#FCEBEB', color: '#791F1F', dot: '#E24B4A' },
  CANCELED:            { bg: '#EEEDFE', color: '#3C3489', dot: '#AFA9EC' },
  CANCELING:           { bg: '#FAEEDA', color: '#633806', dot: '#EF9F27' },
  EXECUTING:           { bg: '#EEEDFE', color: '#3C3489', dot: '#7F77DD', pulse: true },
  ACCEPTED:            { bg: '#E1F5EE', color: '#085041', dot: '#1D9E75' },
  PAUSED:              { bg: '#FAEEDA', color: '#854F0B', dot: '#BA7517' },
  QUEUED_WHILE_PAUSED: { bg: '#FAEEDA', color: '#633806', dot: '#EF9F27' },
  PREEMPTED:           { bg: '#FBEAF0', color: '#72243E', dot: '#D4537E' },
  PREEMPTED_BY_DOCK:   { bg: '#FBEAF0', color: '#72243E', dot: '#D4537E' },
  REJECTED:            { bg: '#FCEBEB', color: '#791F1F', dot: '#E24B4A' },
  NAV_UNAVAILABLE:     { bg: '#FCEBEB', color: '#501313', dot: '#F09595' },
};

const STATUS_FILTERS = [
  'SUCCEEDED', 'FAILED', 'CANCELED', 'EXECUTING',
  'ACCEPTED', 'PAUSED', 'REJECTED', 'NAV_UNAVAILABLE',
];

type StatusEvent = { status: string; timestamp: string; _id: string };
type CommandDoc = {
  _id: string;
  command_id: string;
  latestStatus: string;
  events: StatusEvent[];
  createdAt: string;
  updatedAt: string;
};

function sc(s: string) {
  return SC[s?.toUpperCase()] ?? { bg: '#EEEDFE', color: '#3C3489', dot: '#AFA9EC' };
}

function Badge({ status }: { status: string }) {
  const c = sc(status);
  return (
    <span
      className="text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: c.bg, color: c.color }}
    >
      {status?.toUpperCase()}
    </span>
  );
}

export function CommandHistoryTable() {
  const [data, setData]         = useState<CommandDoc[]>([]); // danh sách lệnh
  const [filter, setFilter]     = useState('');  // filter theo status
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchData = () => {
      const url = filter ? `/api/commands?status=${filter}` : `/api/commands`; // kiểm tra xem có cần lọc theo filter không 
      fetch(url)
        .then(r => r.json())
          .then(d => {
                  // Fix: kiểm tra trả về có phải array không
                  setData(Array.isArray(d) ? d : []);
                  setLoading(false);
                })
                .catch(() => {
                  setData([]); // tránh crash khi network lỗi
                  setLoading(false);
                });
            };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [filter]);

  const deleteCommand = async (id: string) => {
    if (!confirm('Xóa lệnh này?')) return;
    await fetch(`/api/commands/${id}`, { method: 'DELETE' });
    setData(prev => prev.filter(d => d._id !== id)); // xóa khỏi UI ngay
  };

  const rows = filter ? data.filter(d => d.latestStatus?.toUpperCase() === filter.toUpperCase()) : data;

  return (
    <div className="space-y-4">

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilter('')}
          className="text-xs px-3 py-1 rounded-full border transition-all"
          style={
            !filter
              ? { background: '#EEEDFE', color: '#3C3489', borderColor: '#AFA9EC' }
              : { background: 'transparent', borderColor: 'rgba(0,0,0,0.15)', color: '#888' }
          }
        >
          Tất cả ({data.length})
        </button>

        {STATUS_FILTERS.map(s => {
          const c = sc(s);
          const active = filter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(s === filter ? '' : s)}
              className="text-xs px-3 py-1 rounded-full border transition-all"
              style={
                active
                  ? { background: c.bg, color: c.color, borderColor: c.dot }
                  : { background: 'transparent', borderColor: 'rgba(0,0,0,0.15)', color: '#888' }
              }
            >
              {s}
            </button>
          );
        })}
      </div>

      {/* List */}
      {loading ? (
        <p className="text-sm text-center py-8" style={{ color: '#7F77DD' }}>Đang tải...</p>
      ) : rows.length === 0 ? (
        <div
          className="text-sm py-8 text-center rounded-xl border border-dashed"
          style={{ color: '#7F77DD', borderColor: '#AFA9EC' }}
        >
          Chưa có dữ liệu
        </div>
      ) : (
        <div className="space-y-1.5">
          {rows.map(doc => {
            const c = sc(doc.latestStatus);
            const isExp = expanded === doc._id;

            return (
              <div
                key={doc._id}
                className="rounded-xl overflow-hidden border"
                style={{ borderColor: 'rgba(175,169,236,0.3)', background: 'var(--background)' }}
              >
                {/* Row chính */}
                <div
                  className="flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer transition-colors"
                  style={{ ['--hover-bg' as string]: '#EEEDFE' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#EEEDFE')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => setExpanded(isExp ? null : doc._id)}
                >
                  {/* Dot */}
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${c.pulse ? 'animate-pulse' : ''}`}
                    style={{ background: c.dot }}
                  />

                  {/* command_id */}
                  <span className="font-mono text-xs flex-1 truncate" style={{ color: '#534AB7' }}>
                    {doc.command_id}
                  </span>

                  {/* Status badge */}
                  <Badge status={doc.latestStatus} />

                  {/* Thời gian */}
                  <span className="text-[11px] hidden sm:block" style={{ color: '#7F77DD' }}>
                    {new Date(doc.updatedAt).toLocaleString('vi-VN')}
                  </span>

                  {/* Event count */}
                  <span
                    className="text-[11px] px-2 py-0.5 rounded-full"
                    style={{ background: '#EEEDFE', color: '#534AB7' }}
                  >
                    {doc.events.length} ev
                  </span>

                  {/* Chevron */}
                  <span className="text-[11px]" style={{ color: '#7F77DD' }}>
                    {isExp ? '▲' : '▼'}
                  </span>
                </div>

                {/* Timeline */}
                {isExp && (
                  <div
                    className="px-3.5 pb-4 border-t"
                    style={{ background: '#EEEDFE', borderColor: '#CECBF6' }}
                  >
                    <div className="flex items-center justify-between mt-3 mb-2.5">
                      <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: '#534AB7' }}>
                        Lifecycle — {doc.events.length} bước
                      </p>
                      <button
                        onClick={e => { e.stopPropagation(); deleteCommand(doc._id); }}
                        className="text-[11px] px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                        style={{ color: '#791F1F', background: '#FCEBEB' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#F7C1C1')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#FCEBEB')}
                      >
                        🗑 Xóa
                      </button>
                    </div>

                    <div
                      className="pl-3.5 flex flex-col gap-2"
                      style={{ borderLeft: '2px solid #AFA9EC' }}
                    >
                      {doc.events.map((ev, i) => {
                        const ec = sc(ev.status);
                        return (
                          <div key={ev._id ?? i} className="flex items-center gap-2.5">
                            <div
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ background: ec.dot, marginLeft: '-19px' }}
                            />
                            <Badge status={ev.status} />
                            <span className="text-[11px]" style={{ color: '#534AB7' }}>
                              {new Date(ev.timestamp).toLocaleTimeString('vi-VN')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
